import { Component, OnInit } from '@angular/core';
import { MediaContentService } from '../services/media-content.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
    headImage;

    constructor(
        private mediaService: MediaContentService
    ) { }

    ngOnInit() {
        this.headImage = this.mediaService.getContentListByKeys(['blog'])[0];
    }

}
