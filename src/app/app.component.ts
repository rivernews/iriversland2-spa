import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    ElementRef,
    OnDestroy,
} from '@angular/core';

import { Router, ResolveStart, ResolveEnd, NavigationEnd } from '@angular/router';
import { UserService } from './services/user.service';
import { ApiService } from "./services/api.service";
import { ObjectDataService } from "./services/object-data.service";
import { Subscription } from "rxjs";

import { Location } from "@angular/common";
import { MediaContentService } from './services/media-content.service';
// import { SwUpdate } from '@angular/service-worker';

import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2/gst';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    public title = 'Shaung Cheng';

    private subscriptions = new Subscription();

    public navLinks = [];

    public appBackgroundColor = 'lightgray';

    public isLogin: boolean;
    public isLocalDev: boolean = false;
    public currentRoutePathList: Array<string>;

    /*
    * Access Child DOM Elements
    * https://alligator.io/angular/viewchild-access-component/
    * 
    */

    @ViewChild('routerFooterWrapper') routerFooterWrapper: ElementRef;
    routerFooterWrapperClassListHandler;
    routerFooterWrapperElement;

    constructor(
        private router: Router,

        private userService: UserService,
        private apiSevice: ApiService,
        private objectService: ObjectDataService,
        public location: Location,
        private mediaService: MediaContentService,

        // private swUpdate: SwUpdate,
        angulartics: Angulartics2GoogleGlobalSiteTag,
    ) {
        angulartics.startTracking();
    }

    ngOnInit(): void {
        // pwa
        // if (this.swUpdate.isEnabled) {
        //     this.subscriptions.add(this.swUpdate.available.subscribe(() => {
        //         if (confirm(`New version of this PWA web app available!! Load new version?`)) {
        //             window.location.reload();
        //         }
        //     }));
        // }

        this.objectService.read('highlighted-case-studies');
        this.objectService.read('case-studies');

        this.navLinks = this.mediaService.navActions;

        this.subscriptions.add(this.router.events.subscribe(
            (e) => {
                // console.log(e);
                if (e instanceof ResolveStart) {
                    if (e.id !== 1) { // if initial load, don't fade out (just fade in).
                        this.pageFadeOut();
                    }
                }
                else if (e instanceof ResolveEnd) {
                    this.routerFooterWrapperElement.scrollIntoView({ block: 'start', behavior: 'instant' });
                    this.pageFadeIn();
                    
                }
                else if (e instanceof NavigationEnd) {
                    this.currentRoutePathList = this.router.routerState.snapshot.url.split('/');
                }
            }
        ));

        this.subscriptions.add(this.userService.isLoginStatusAndChange.subscribe(isLogin => {
            this.isLogin = isLogin;
        }));

        this.isLocalDev = this.apiSevice.isLocalDev();

        this.setupGlobalKeyboardShortcut();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    ngAfterViewInit(): void {
        // console.log("after view init");
        this.routerFooterWrapperClassListHandler = this.routerFooterWrapper.nativeElement.classList;
        this.routerFooterWrapperElement = this.routerFooterWrapper.nativeElement;
        this.routerFooterWrapperElement.style.opacity = 0; // initially hide all including footer
    }

    onRouterDeactivate(e): void {
        // console.log("onRouterDeactivate");
    }

    onRouterActivate(e): void {
        // console.log("onRouterActivate");
    }


    /*
    * Helper Functions
    * 
    */

    private setupGlobalKeyboardShortcut() {
        window.onkeydown = (event) => {
            let crossPlatformCtrl = event.metaKey || event.ctrlKey;
            if (crossPlatformCtrl && event.shiftKey && event.code === 'KeyL') {
                if (this.isLogin) {
                    this.userService.logout();
                } else {
                    this.router.navigateByUrl('/login');
                }
                event.preventDefault();
                /** preventDefault() might already do the job, just in case  */
                event.stopPropagation(); 
            }
        }
    }

    showAppBar(routerOutlet: any) {
        if (!routerOutlet) return false;
        else if (!routerOutlet.activatedRouteData.name) return false;

        if (routerOutlet.activatedRouteData.name === 'home' ) {
            return false;
        }
        else if (routerOutlet.activatedRouteData.name === 'root') {
            return false;
        }
        else {
            return true;
        }
    }

    pageFadeOut(): void {
        this.routerFooterWrapperClassListHandler.remove('fade-in');
        this.routerFooterWrapperClassListHandler.add('fade-out');
    }

    pageFadeIn(): void {
        this.routerFooterWrapperClassListHandler.remove('fade-out');
        this.routerFooterWrapperClassListHandler.add('fade-in');
    }

    logout(): void {
        this.userService.logout();
    }
}

