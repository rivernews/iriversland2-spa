import { Component, ViewChild } from '@angular/core';

import { DocumentComponent } from "../document/document.component";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  @ViewChild('documentComponent') documentComponent: DocumentComponent;

}
