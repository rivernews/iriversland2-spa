import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { UserService } from "../services/user.service";

import { Subscription } from "rxjs";

import { Router } from '@angular/router';

import { Location } from "@angular/common";
import { GlobalResolverService } from '../services/global-resolver.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    public screenHeight: number = window.innerHeight;
    public loginForm: any;

    public loginIsLoading: boolean;

    @ViewChild('usernameInput') usernameInput: ElementRef;

    constructor(
        private userService: UserService,
        private router: Router,
        private location: Location,
        private globalResolver: GlobalResolverService,
    ) {
        this.loginForm = {
            'username': '',
            'password': '',
            'showLoginErrorMessage': false,
        };
        this.loginIsLoading = false;
    }

    ngOnInit() {
        this.usernameInput.nativeElement.focus();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    onLoginClick() {
        this.loginIsLoading = true;
        this.userService.login({
            'username': this.loginForm.username,
            'password': this.loginForm.password,
        })
        .then(() => {
            this.router.navigate(['/home'], { queryParamsHandling: 'merge' });
            if (this.globalResolver.prevUrl) {
                this.location.back();
            } else {
                this.router.navigate(['/home'], { queryParamsHandling: 'merge' });
            }
        })
        .catch(error => {
            this.loginForm.password = '';
            this.loginIsLoading = false;
            console.error(error);
        });
    }
}
