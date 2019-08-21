import { Injectable } from "@angular/core";
import { CanDeactivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Location } from "@angular/common";

import { PostsComponent } from "../posts/posts.component";
import { CaseStudyComponent } from "../case-study/case-study.component";
import { DocumentComponent } from "../document/document.component";



@Injectable()
export class DocumentIsDirtyCanDeactivateGuard implements CanDeactivate<PostsComponent | CaseStudyComponent> {

    constructor(
        private readonly location: Location,
        private readonly router: Router
    ) {

    }

    canDeactivate(
        component: PostsComponent | CaseStudyComponent,
        currentRoute: ActivatedRouteSnapshot
    ): boolean {
        let documentComponent: DocumentComponent = component.documentComponent;

        if (!documentComponent) {
            console.error(component + `does not have a view child for Document Component, please add one first.`);
        }

        if (component.documentComponent.isDirty) {
            if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
                return true;
            } else {
                /** workaround: prevent deactivate guard from breaking browser back/forward history 
                 * see https://github.com/angular/angular/issues/13586
                */
                const currentUrlTree = this.router.createUrlTree([], currentRoute);
                const currentUrl = currentUrlTree.toString();
                this.location.go(currentUrl);
                return false;
            }
        } else {
            return true;
        }
    }
}