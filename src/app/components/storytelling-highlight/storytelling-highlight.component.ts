import { Component, OnInit, HostListener, ElementRef } from "@angular/core";

@Component({
    selector: "app-storytelling-highlight",
    templateUrl: "./storytelling-highlight.component.html",
    styleUrls: ["./storytelling-highlight.component.scss"]
})
export class StorytellingHighlightComponent implements OnInit {
    public blockHorizontalOffset: number = 50

    public blockTransform: string;

    constructor(private el: ElementRef) {
        this.blockTransform = this.setBlockRelativePosition(this.blockHorizontalOffset);
    }

    @HostListener("window:scroll", ["$event"])
    private onScroll(e) {
        const thisComponent = this.el.nativeElement;
        const boundingClientRect = thisComponent.getBoundingClientRect();
        const { top } = boundingClientRect;

        if (top < 200) {
            this.blockTransform = this.setBlockRelativePosition(this.blockHorizontalOffset - (top - 200));
        }
        console.log('\n\n hey we are scrolling!', boundingClientRect);
    }

    private setBlockRelativePosition(value: number) {
        return `matrix(1, 0, 0, 1, 0, ${value})`;
    }

    ngOnInit() { }
}
