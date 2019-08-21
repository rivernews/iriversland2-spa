import { Component, OnInit } from '@angular/core';

import BalloonEditor from '@shaungc/ckeditor5-custom-balloon';
// import * as BalloonEditor from '../../assets/ckeditor';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent implements OnInit {
  public documentCkeditor = BalloonEditor;
  public documentCkeditorConfig = {};

  constructor() { }

  ngOnInit() {
  }

}
