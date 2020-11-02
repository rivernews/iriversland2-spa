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
        
        // any value larger than screen height will do
        let topStartBound = 1000.0;
        // position where the animation needs to reach destination state
        let topEndBound = 400;

        let translateXValueStart = -100;
        let translateXValueRange = 100;
        let opacityValue = 0;
        let translateXValue = translateXValueStart;
        let effectiveRange = topStartBound - topEndBound;

        // for what top is returned by `getBoundingClientRect`,
        // see https://www.digitalocean.com/community/tutorials/js-getboundingclientrect
        //
        // `top` is the component (the highlight container in this case) top position RELATIVE TO screen viewport's top
        //
        // case 1: user is initially at top of the page, component is deep down somewhere out of viewport:
        //         `top` is from viewport's top, down to the component's top. 
        //          Y value is positive downward, so `top` now is some positive, large value.
        //
        // case 2: user scrolls down such that component falls in viewport. Component "flows up" as user scrolls down:
        //          when component is just about to fall in viewport, `top=100vh`.
        //          as user keep scrolling down, `top` continues to decrease
        //          until component is just about to fall out at top of the viewport, `top=0`
        // case 3: user keeps scrolling down and the component 'gone away':
        //          when component just has fallen out at top of viewport, `top` changes from zero to negative value
        //          as user keeps scrolling down, `top` value keeps decreasing in its negative value
        const { top, bottom } = rect;
        const componentCenterRelativePosition = (top + bottom) / 2;

        highlightContainer.classList.remove('shaded');
        if (componentCenterRelativePosition <= topStartBound && componentCenterRelativePosition >= topEndBound) {
            // approximately 'case 2' above, but slightly adjusted since it meaasures component's top (not center position)

            translateXValue += ((topStartBound - componentCenterRelativePosition) / effectiveRange) * translateXValueRange;
            opacityValue += ((topStartBound - componentCenterRelativePosition) / effectiveRange) * 1.0;
        }
        else {
            translateXValue = 0;
            opacityValue = 1;
        }

        if (componentCenterRelativePosition < topEndBound + 100) {
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
