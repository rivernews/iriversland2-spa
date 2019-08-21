import { Component, OnInit } from '@angular/core';
import { MediaContentService } from '../services/media-content.service';

@Component({
    selector: 'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
    headImage;

    constructor(
        private mediaService: MediaContentService,
    ) {}

    ngOnInit() {
        this.headImage = this.mediaService.getContentListByKeys(['portfolio'])[0];
    }
}
