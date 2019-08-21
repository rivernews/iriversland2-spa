import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

// Step 1. import components
import { PostsComponent } from "../posts/posts.component";
import { HomeComponent } from "../home/home.component";
import { AboutMeComponent } from "../about-me/about-me.component";
import { PortfolioComponent } from "../portfolio/portfolio.component";
import { CaseStudyComponent } from "../case-study/case-study.component";
import { AccountComponent } from "../account/account.component";
import { DesignLangSystemComponent } from "../design-lang-system/design-lang-system.component";
import { BlogComponent } from "../blog/blog.component";
import { MajorRolesComponent } from "../major-roles/major-roles.component";

import { GlobalResolverService } from "../services/global-resolver.service";
import { DocumentIsDirtyCanDeactivateGuard } from './document-is-dirty-deactivate-guard';

// Step 2. add routing url like { path: '', component: undefined },
const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full', data: { name: 'root' } },
    { path: 'home', component: HomeComponent, resolve: { globalResolver: GlobalResolverService }, data: { name: 'home' } },
    { path: 'about', component: AboutMeComponent, resolve: { globalResolver: GlobalResolverService }, data: { name: 'about' } },
    { path: 'major-roles', component: MajorRolesComponent, resolve: { globalResolver: GlobalResolverService }, data: { name: 'major-roles' } },

    { path: 'portfolio', component: PortfolioComponent, resolve: { globalResolver: GlobalResolverService }, data: { name: 'portfolio' } },
    {
        path: 'portfolio/:id',
        component: CaseStudyComponent,
        resolve: { globalResolver: GlobalResolverService },
        canDeactivate: [DocumentIsDirtyCanDeactivateGuard],
        data: { name: 'case-study' }
    },
    { path: 'blog', component: BlogComponent, resolve: { globalResolver: GlobalResolverService }, data: { name: 'blog' } },
    {
        path: 'blog/:id',
        component: PostsComponent,
        resolve: { globalResolver: GlobalResolverService },
        canDeactivate: [DocumentIsDirtyCanDeactivateGuard],
        data: { name: 'post' }
    },

    { path: 'design-lang-system', component: DesignLangSystemComponent, resolve: { globalResolver: GlobalResolverService }, data: { name: 'design-lang-system' } },

    { path: 'login', component: AccountComponent, resolve: { globalResolver: GlobalResolverService }, data: { name: 'login' } },
    // { path: '**', component: NotFound },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule],
    providers: [
        GlobalResolverService,
        DocumentIsDirtyCanDeactivateGuard
    ],
})
export class AppRoutingModule { }
