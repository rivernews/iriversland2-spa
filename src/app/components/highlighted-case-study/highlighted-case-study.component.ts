import { Component, OnInit, OnDestroy, Input, ElementRef, HostListener, ViewChild } from '@angular/core';

import { Subscription } from "rxjs";

import { ObjectDataService } from "../../services/object-data.service";
import { SnackBarServiceService } from "../../services/snack-bar-service.service";
import { ResponsiveService } from '../../services/responsive.service';

import { Angulartics2 } from 'angulartics2';

@Component({
    selector: 'app-highlighted-case-study',
    templateUrl: './highlighted-case-study.component.html',
    styleUrls: ['./highlighted-case-study.component.scss'],
})
export class HighlightedCaseStudyComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    public isSubmitting: boolean = false;

    /** animations */
    @ViewChild('highlightedCaseStudyTextContainer') highlightedCaseStudyTextContainer: ElementRef;
    @ViewChild('highlightedCaseStudyContainer') highlightedCaseStudyContainer: ElementRef;

    @Input()
    public highlightedCaseStudy: any;
    @Input()
    public isLogin: boolean = true;
    @Input()
    public highlightedCaseStudyIndex: number;

    constructor(
        private objectDataService: ObjectDataService,
        private barService: SnackBarServiceService,
        public responsiveService: ResponsiveService,

        public el: ElementRef,
        private angulartics2: Angulartics2,
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    onSubmitClick(highlightedCaseStudyData?) {
        this.isSubmitting = true;
        if (highlightedCaseStudyData) {
            this.updateHighlightedCaseStudy(highlightedCaseStudyData);
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

    /**
     * 
     * Scrolling Animation
     * 
     */

    @HostListener('window:scroll', ['$event'])
    private scrollController(e) {
        const component = this.el.nativeElement;
        const highlightContainer = this.highlightedCaseStudyContainer.nativeElement;
        const textContainer = this.highlightedCaseStudyTextContainer.nativeElement;
        let rect = component.getBoundingClientRect();
        
        let topStartBound = 800.0;
        let topEndBound = -200.0;
        let translateXValueStart = -100;
        let translateXValueRange = 100;
        let opacityValue = 0;
        let translateXValue = translateXValueStart;
        let effectiveRange = topStartBound - topEndBound;

        let { top } = rect;
        highlightContainer.classList.remove('shaded');
        if (top <= topStartBound && top >= topEndBound) {
            translateXValue += ((topStartBound - top) / effectiveRange) * translateXValueRange;
            opacityValue += ((topStartBound - top) / effectiveRange) * 1.0;
        }
        else {
            translateXValue = 0;
            opacityValue = 1;
        }

        if (top < topEndBound + 100) {
            highlightContainer.classList.add('shaded');
            this.angulartics2.eventTrack.next({
                action: `${this.highlightedCaseStudy.case_study_title}`,
                properties: {
                    category: `Scroll`,
                    label: `Applied shading to highlighted case study "${this.highlightedCaseStudy.case_study_title}"`
                }
            });
        }

        textContainer.style.transform = `translateX(${
            translateXValue
            }vw)`;
        textContainer.style.opacity = opacityValue;
    }
}
