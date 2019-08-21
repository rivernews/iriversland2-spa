// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PWA (TODO)
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMaterialDesignModule } from "./google-material-design/google-material-design.module";
import { DragDropModule } from '@angular/cdk/drag-drop';

// Custom
import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CaseStudyComponent } from './case-study/case-study.component';
import { FooterComponent } from './footer/footer.component';
import { AccountComponent } from './account/account.component';
import { DesignLangSystemComponent } from './design-lang-system/design-lang-system.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { BlogComponent } from './blog/blog.component';
import { DocumentComponent } from './document/document.component';
import { MajorRolesComponent } from './major-roles/major-roles.component';
import { LabeledSwitchComponent } from './components/labeled-switch/labeled-switch.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

// 3rd Party
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { RichTextEditorComponent } from './components/rich-text-editor/rich-text-editor.component';
import { HighlightedCaseStudyComponent } from './components/highlighted-case-study/highlighted-case-study.component';
import { Angulartics2Module } from "angulartics2";

@NgModule({
declarations: [
    AppComponent,
    PostsComponent,
    HomeComponent,
    AboutMeComponent,
    PortfolioComponent,
    CaseStudyComponent,
    FooterComponent,
    AccountComponent,
    DesignLangSystemComponent,
    DocumentListComponent,
    BlogComponent,
    DocumentComponent,
    MajorRolesComponent,
    LabeledSwitchComponent,
    ContactFormComponent,
    RichTextEditorComponent,
    HighlightedCaseStudyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule, ReactiveFormsModule,

    BrowserAnimationsModule,
    DragDropModule,
    GoogleMaterialDesignModule,
    AppRoutingModule,

    // 3rd Party
    LazyLoadImageModule, ReCaptchaModule, CKEditorModule,
    Angulartics2Module.forRoot(),

    // pwa
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
