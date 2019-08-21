import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import CustomBalloonEditor from '@shaungc/ckeditor5-custom-balloon';

import { ObjectDataService } from "../services/object-data.service";
import { MediaContentService } from "../services/media-content.service";

@Component({
    selector: 'app-design-lang-system',
    templateUrl: './design-lang-system.component.html',
    styleUrls: ['./design-lang-system.component.scss']
})
export class DesignLangSystemComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    public colorPaletteDemo: any[] = [
        {
            type: 'primary',
            value: '#00796b'
        },
        {
            type: 'accent',
            value: '#ffe0b2'
        },
        {
            type: 'warn',
            value: '#ff5722'
        },
    ];

    public sampleHighlightedCaseStudy: any;
    public isLogin: boolean;

    public documentCustomCkeditor = CustomBalloonEditor;
    public documentCkeditorConfig = {};
    public documentCustomCkeditorPlaceholderText: string = `<p>Hi there, select some text here and see what kind of cool stuff you can do...!</p><p>Guess what, I'm a custom balloon editor inherited from Ckeditor 5!</p>`;

    constructor(
        private ods: ObjectDataService,
        private mcs: MediaContentService
    ) { }

    ngOnInit() {
        this.getSampleHighlightedCaseStudy();
    }

    private getSampleHighlightedCaseStudy(): void {
        this.subscription.add(this.ods.read('highlighted-case-studies')
            .subscribe((hcs) => {
                if (Array.isArray(hcs)) {
                    try {
                        this.sampleHighlightedCaseStudy = hcs.filter((h) => h.is_public)[0];
                    }
                    catch{
                    }
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
