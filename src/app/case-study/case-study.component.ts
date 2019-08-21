import { Component, ViewChild } from '@angular/core';

import { DocumentComponent } from "../document/document.component";

@Component({
    selector: 'app-case-study',
    templateUrl: './case-study.component.html',
    styleUrls: ['./case-study.component.scss']
})
export class CaseStudyComponent {
    @ViewChild('documentComponent') documentComponent: DocumentComponent;
}