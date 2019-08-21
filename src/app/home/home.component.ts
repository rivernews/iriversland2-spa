import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';

import { HighlightedCaseStudy } from '../posts/post';
import { UserService } from '../services/user.service';
import { SnackBarServiceService } from '../services/snack-bar-service.service';
import { ObjectDataService } from '../services/object-data.service';
import { Router } from '@angular/router';
import { MediaContentService } from '../services/media-content.service';
import { LogMessageService } from '../services/log-message.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();
    screenHeight: number = window.innerHeight;

    @ViewChild("selectedWork") selectedWorkRef: ElementRef;
    public HEADLINE_IMAGES = [];

    highlightedCaseStudies: any[];

    public HOME_BOTTOM_THEMED_ACTIONS: any[] = [];

    public isSubmitting: boolean = false;
    public isLogin: boolean;

    private DEBUG: boolean = false;


    constructor(
        private userService: UserService,
        private objectDataService: ObjectDataService,
        private mediaService: MediaContentService,

        private barService: SnackBarServiceService,
        public domSanitizer: DomSanitizer,
        private logService: LogMessageService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.subscriptions.add(this.userService.isLoginStatusAndChange.subscribe(isLogin => {
            this.isLogin = isLogin;
        }));

        this.getHighlightedCaseStudies();
        
        // media content using mock data
        this.HEADLINE_IMAGES = this.mediaService.homeHeadlineActions;
        this.HOME_BOTTOM_THEMED_ACTIONS = this.mediaService.homeBottomThemedActions;
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public actionSurfaceOnClick(actionObject, event) {
        setTimeout(() => {
            if (actionObject.routerLink) {
                this.router.navigateByUrl(actionObject.routerLink);
            }
        }, 80);
    }

    private getHighlightedCaseStudies(): void {
        this.subscriptions.add(this.objectDataService.read('highlighted-case-studies')
            .subscribe(highlightedCaseStudies => {
                if (!Array.isArray(highlightedCaseStudies)) {
                    this.logService.print(this, 'Highlight data is not an array. If is null, it might be the initial subscription and will load in soon. The returned content is:');
                    this.logService.print(this, highlightedCaseStudies);
                    this.highlightedCaseStudies = null;
                }
                else {
                    this.logService.print(this, `Got hightlight data, with length of ${highlightedCaseStudies.length}`);

                    /** don't show private highlighted case studies if not login */
                    if (!this.isLogin) {
                        this.highlightedCaseStudies = highlightedCaseStudies.filter(
                            (hcs) => hcs.is_public
                        )
                    }
                    else {
                        this.highlightedCaseStudies = highlightedCaseStudies;
                    }
                }
            })
        );
    }

    onSubmitClick(highlightedCaseStudyData?) {
        this.isSubmitting = true;
        if (highlightedCaseStudyData) {
            this.updateHighlightedCaseStudy(highlightedCaseStudyData);
        } else {
            this.highlightedCaseStudies.forEach(hcs => {
                this.updateHighlightedCaseStudy(hcs);
            });
        }
    }

    updateHighlightedCaseStudy(highlightedCaseStudyData) {

        this.subscriptions.add(this.objectDataService.update('highlighted-case-studies', highlightedCaseStudyData).subscribe(
            success => {
                this.barService.popUpMessage("✅ Submitted highlight study successfully");
            },
            error => {
                this.barService.popUpMessage("Failed to submit highlight study");
            },
            () => {
                this.isSubmitting = false;
            }
        ));
    }

}
