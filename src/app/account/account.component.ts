import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { UserService } from "../services/user.service";
import { SnackBarServiceService } from "../services/snack-bar-service.service";

import { Subscription, pipe } from "rxjs";

import { Router } from '@angular/router';

import { Location } from "@angular/common";

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
        private barService: SnackBarServiceService,
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
        .then(resultMessage => {
            this.router.navigateByUrl('/home');
            if (window.history.length > 1) {
                this.location.back();
            } else {
                this.router.navigateByUrl('/home');
            }
        })
        .catch(error => {
            this.loginForm.password = '';
            this.loginIsLoading = false;
        });
    }
}
