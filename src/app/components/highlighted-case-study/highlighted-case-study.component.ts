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

    private screenHeight = window.innerHeight;

    private translateYValue = 0;

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

    @HostListener('window:resize', ['$event'])
    onScreenResize(e) {
        this.screenHeight = e.target.innerHeight;
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
        
        const rect = component.getBoundingClientRect();
        const { top, bottom } = rect;
        // for what top is returned by `getBoundingClientRect`,
        // see https://www.digitalocean.com/community/tutorials/js-getboundingclientrect
        //
        // `top` is the component (the highlight container in this case) top position RELATIVE TO screen viewport's top
        // `bottom` is the component (the highlight container in this case) bottom position RELATIVE TO screen viewport's top
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

        const componentRelativePosition = top;

        // when should transition effect starts. Used for `componentRelativePosition` value.
        const transitionStartBound = this.screenHeight * 0;
        // position where the animation needs to reach destination state. Used for `componentRelativePosition` value
        const transitionEndBound = this.screenHeight * -0.5;

        // adjust `translateXValueStart` to specify the initial 'hidden' position of the text
        // eventually, the text will slide rightward to its static position
        // note that the larger the absolute value of `translateXValueStart` is, the faster it'll feel when test slides in
        const translateXValueStart = -10;
        const translateXValueRange = -translateXValueStart;
        const effectiveRange = transitionStartBound - transitionEndBound;

        let translateXValue;
        let opacityValue;
        if (componentRelativePosition > transitionStartBound) {
            // approximately 'case 1' above

            translateXValue = translateXValueStart;
            opacityValue = 0;
        }
        else if (componentRelativePosition <= transitionStartBound && componentRelativePosition >= transitionEndBound) {
            // approximately 'case 2' above
            // we're using center (top & bottom average), but if using top, need to slightly adjusted since it meaasures component's top (not center position)

            translateXValue = translateXValueStart + ((transitionStartBound - componentRelativePosition) / effectiveRange) * translateXValueRange;
            opacityValue = ((transitionStartBound - componentRelativePosition) / effectiveRange) * 1.0;
        }
        else {
            translateXValue = 0;
            opacityValue = 1;
        }

        // increase `offsetDownwardRefactor` to push down the position of the text when it sticks to the viewport (i.e. looks 'fixed' on screen)
        const offsetDownwardFactor = 1.5;
        // decrease 'absolute value' of `bottomSpaceReservedWhenStickyEndFactor` to disable sticky effect sooner,
        // which gives a larger bottom space effect under the text when user keeps scrolling
        const bottomSpaceReservedWhenStickyEndFactor = -.9;
        const stickyTranslateYValue = top * -1 - (this.screenHeight / offsetDownwardFactor);
        if (componentRelativePosition > transitionStartBound) {
            this.translateYValue = stickyTranslateYValue;
        } else if (componentRelativePosition <= transitionStartBound && componentRelativePosition >= this.screenHeight * bottomSpaceReservedWhenStickyEndFactor) {
            this.translateYValue = stickyTranslateYValue;
        } else {
            this.translateYValue = this.translateYValue;
        }

        // assign computed value to css transform
        textContainer.style.transform = `translate(${translateXValue}vw,${this.translateYValue}px)`;
        textContainer.style.opacity = opacityValue;

        // determine css class
        highlightContainer.classList.remove('shaded');
        if (componentRelativePosition < transitionEndBound + 100) {
            highlightContainer.classList.add('shaded');
            this.angulartics2.eventTrack.next({
                action: `${this.highlightedCaseStudy.case_study_title}`,
                properties: {
                    category: `Scroll`,
                    label: `Applied shading to highlighted case study "${this.highlightedCaseStudy.case_study_title}"`
                }
            });
        }
    }
}
