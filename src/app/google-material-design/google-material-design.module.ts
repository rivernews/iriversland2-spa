import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatSidenavModule, MatToolbarModule, MatTabsModule,
  MatButtonModule, MatCardModule, 
  MatGridListModule,
  MatIconModule, MatIconRegistry,
  MatChipsModule,
  MatRippleModule,

  MatFormFieldModule, MatInputModule, MatSnackBarModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,

  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    
    MatSidenavModule, MatToolbarModule, MatTabsModule,
    MatButtonModule, MatCardModule, 
    MatGridListModule,
    MatIconModule,
    MatChipsModule,
    MatRippleModule,

    MatFormFieldModule, MatInputModule, MatSnackBarModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,

    MatTooltipModule,
  ],
  exports: [
    MatSidenavModule, MatToolbarModule, MatTabsModule,
    MatButtonModule, MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatChipsModule,
    MatRippleModule,

    MatFormFieldModule, MatInputModule, MatSnackBarModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,

    MatTooltipModule
  ],
  providers: [
    MatIconRegistry,
  ],
  declarations: [
  ]
})
export class GoogleMaterialDesignModule {
  public constructor(
    public matIconRegistry: MatIconRegistry,
  ){
    // matIconRegistry.registerFontClassAlias('fontawesome', 'fa');

    // learn more about Fontawesome's font set name: https://fontawesome.com/how-to-use/web-fonts-with-css
    matIconRegistry.setDefaultFontSetClass('fas');
  }

}