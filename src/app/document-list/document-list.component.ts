import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';

import { SnackBarServiceService } from "../services/snack-bar-service.service";
import { UserService } from "../services/user.service";

import { Subscription } from "rxjs";
import { ObjectDataService } from '../services/object-data.service';
import { MediaContentService } from '../services/media-content.service';
import { ObservableMedia } from '@angular/flex-layout';
import { ActivatedRoute } from "@angular/router";
import { LogMessageService } from '../services/log-message.service';

import { Angulartics2 } from 'angulartics2';

import {
    trigger, transition, style, animate,
    query, stagger, animateChild
} from '@angular/animations';

@Component({
    selector: 'app-document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
    animations: [
        trigger('docCardAnRef', [ // see https://medium.com/google-developer-experts/angular-applying-motion-principles-to-a-list-d5cdd35c899e
            transition(':enter', [
                style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
                animate('0.6s cubic-bezier(.8, -0.6, 0.2, 1.5)',
                    style({ transform: 'scale(1)', opacity: 1 }))  // final
            ]),
            transition(':leave', [
                style({ transform: 'scale(1)', opacity: 1, height: '*' }),
                animate('0.6s cubic-bezier(.8, -0.6, 0.2, 1.5)',
                    style({
                        transform: 'scale(0.5)', opacity: 0,
                        height: '0px', margin: '0px', padding: '0px'
                    }))
            ])
        ]),
        trigger('docListAnRef', [
            transition(':enter', [
                query('@docCardAnRef', stagger(100, animateChild()))
            ]),
        ])
    ]
})
export class DocumentListComponent implements OnInit, OnDestroy, AfterViewInit {
    private subscriptions = new Subscription();

    screenHeight: number = window.innerHeight;
    public documents: any[];
    public filteredDocuments: any[];

    public isLogin: boolean;
    public showCoverImage: boolean = false;

    @Input() pageHeadlineText: string;
    @Input() headImage: any;
    @Input() apiQueryEndPoint: string;

    @Input() showTimeStamp: string = '';

    @Input() showChips: boolean;
    @Input() documentAttributeNameForTagChips?: string;

    public collectiveTagList: Array<any> = new Array();

    private DEBUG: boolean = false;

    constructor(
        private route: ActivatedRoute,

        private barService: SnackBarServiceService,
        private userService: UserService,
        private objDataService: ObjectDataService,
        private mediaService: MediaContentService,

        public responsiveChange: ObservableMedia,
        private logService: LogMessageService,
        private angulartics2: Angulartics2,
    ) { }

    ngOnInit() {
        // register isLogin state for conditional DOM
        this.subscriptions.add(this.userService.isLoginStatusAndChange.subscribe(isLogin => {
            this.isLogin = isLogin;
        }));

        // only show cover image if it's portfolio; don't show for blog
        if (this.route.snapshot.data['name'] == 'portfolio') {
            this.showCoverImage = true;
        }

        // register for subscribing document list
        this.getDocuments();
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public getResponsiveCardHeight(target) {
        let heightValue = target.offsetWidth * 3 / 4.5;
        return `${heightValue}px`;
    }

    private getDocuments(): void {
        this.subscriptions.add(this.objDataService.read(this.apiQueryEndPoint).subscribe(
            (documents: any[]) => {
                this.logService.print(this, `getDocuments() received doc list`);
                this.logService.print(this, `api endpoint=${this.apiQueryEndPoint}`);
                this.logService.print(this, `doc list:`)
                this.logService.print(this, documents);

                if (documents) {
                    /** don't show private doc if not login */
                    if (!this.isLogin) {
                        this.filteredDocuments = this.documents = documents.filter(doc => doc.is_public);
                    }
                    else {
                        this.filteredDocuments = this.documents = documents;
                    }

                    /** generate tag set */
                    this.setupCollectiveTagList();

                }
            }
            // object service (CRUD layer) handles error
        ));
    }

    private async setupCollectiveTagList(): Promise<void> {
        this.collectiveTagList = await this.objDataService.getCollectiveTagList(this.apiQueryEndPoint);
        if (this.collectiveTagList.length === 0) {
            this.getTagSetFromDocumentList(this.documents).forEach((tagString: string, i) => {
                this.collectiveTagList.push({
                    text: tagString,
                    selected: false
                });
            });
            await this.objDataService.setCollectiveTagList(this.apiQueryEndPoint, this.collectiveTagList);
        } else {
            this.tagSetListChanges(null);
        }
    }

    private getTagTextListFromDocument(document: any) {
        let multipleTagString: string = document[this.documentAttributeNameForTagChips];
        return multipleTagString.split(`,`);
    }

    private getTagSetFromDocumentList(documentList: any[]) {
        let collectiveTagTextSet: Set<string> = new Set();
        for (let doc of documentList) {
            for (let tagText of this.getTagTextListFromDocument(doc)) {
                collectiveTagTextSet.add(tagText);
            }
        }
        return Array.from(collectiveTagTextSet);
    }

    public tagSetListChanges(event): void {
        let selectedTagTextList = new Array();
        for (let tag of this.collectiveTagList.filter(tag => tag.selected)) {
            selectedTagTextList.push(tag.text);
        }

        if (selectedTagTextList.length > 0) {
            this.filteredDocuments = this.documents.filter((doc) => {
                for (let tagText of this.getTagTextListFromDocument(doc)) {
                    for (let selectedTagText of selectedTagTextList) {
                        if (tagText == selectedTagText) {
                            return true;
                        }
                    }
                }
                return false;
            });

            this.angulartics2.eventTrack.next({
                action: `[${selectedTagTextList}]`,
                properties: {
                    category: `SelectTagChanged`,
                    label: `[${selectedTagTextList}]`
                }
            });
        }
        else {
            this.filteredDocuments = this.documents;
        }

        this.objDataService.setCollectiveTagList(this.apiQueryEndPoint, this.collectiveTagList);
    }

}
