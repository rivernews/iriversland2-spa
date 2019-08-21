import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about-me',
    templateUrl: './about-me.component.html',
    styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
    photos: any;

    constructor() { }

    ngOnInit() {
        this.photos = [
            { src: '', label: 'kayaking' },
            { src: '', label: 'frisbee' },
            { src: '', label: 'violin' },
            { src: '', label: 'squirrel' },
            { src: '', label: 'cat' },
            { src: '', label: 'books' },
        ];
    }
}
