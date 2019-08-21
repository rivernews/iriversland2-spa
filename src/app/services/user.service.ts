import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from "@angular/common";

import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { timeout } from "rxjs/operators";

import { ApiService } from "./api.service";
import { SnackBarServiceService } from "./snack-bar-service.service";

import { Router } from "@angular/router";
import { LogMessageService } from './log-message.service';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    public isLoginStatusAndChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private subscriptions = new Subscription();

    // the user object of the logged in user containing username, id and email
    public user: any;

    // the actual JWT token
    public token: string;

    // the token expiration date
    public token_expires: Date;

    static TIMEOUT_login: number = 15000;

    private DEBUG: boolean = false;

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private router: Router,
        private barService: SnackBarServiceService,
        private logService: LogMessageService,
    ) {
    }

    public isLoginAndCheckExpiry(): boolean {
        if (this.token) {
            let expirationDateTime = this.token_expires;
            let currentDateTime = new Date();
            let alertExpirationDateTime = new Date(expirationDateTime.getTime() - 30 * 60 * 1000); // refresh token before 30 minutes of expiration

            // login is still fresh
            if (alertExpirationDateTime > currentDateTime) {
                this.isLoginStatusAndChange.next(true);
                return true;
            }

            // is not fresh, but not yet expired
            else if (alertExpirationDateTime < currentDateTime && currentDateTime < expirationDateTime) {
                alert(`Login state is going to expire soon in ${this.getDisplayDeltaTimeInMinSec(currentDateTime, expirationDateTime)}. Will now try to refresh login state for you.`);
                this.refreshToken().then(resultMessage => {
                    alert(`✅ Login state refreshed successfully! Your login is valid for the next ${this.getDisplayDeltaTimeInMinSec(new Date(), this.token_expires)}.`);
                    this.isLoginStatusAndChange.next(true);
                })
                    .catch(errorMessage => {
                        // refresh not successful, warn the user but nothing further
                        alert('⚠️ Refresh login state failed, save all your changes and check your network. Will retry upon your next server request.');
                    });
                return true;
            }

            // expired
            else {
                // TODO: notify the user and let user choose to go to login page or not, don't force it.
                alert('Login status expired, save all your changes and login again.');
                // this.kickOut();
                // this.logout();
                return false;
            }
        } else {
            this.kickOut();
            return false;
        }
    }

    // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
    public login(user) {
        return new Promise((resolve, reject) => {
            this.subscriptions.add(this.apiService.apiPostEndPoint('token-auth', user)
                .pipe(
                    timeout(UserService.TIMEOUT_login)
                )
                .subscribe(
                    data => {
                        this.logService.print(this, `login success & got token!`);
                        this.updateData(data['token']);
                        this.barService.popUpMessage("✅ Login successfully!", 1000);
                        resolve("logged in. (Detail message is given in user service)");
                    },
                    error => {
                        this.logout();
                        this.barService.popUpMessage('Cannot login, perhpas wrong username, password or bad network.', 0, 'Close', error);
                        reject('login error. (Detail error message is given in user service)');
                    }
                ));
        });
    }

    // Refreshes the JWT token, to extend the time the user is logged in
    public refreshToken() {
        return new Promise((resolve, reject) => {
            this.subscriptions.add(this.apiService.apiPostEndPoint('token-refresh', { token: this.token })
                .pipe(
                    timeout(UserService.TIMEOUT_login)
                )
                .subscribe(
                    data => {
                        if (data['token']) {
                            this.updateData(data['token']);
                            this.logService.print(this, `got new token and refreshed it`);

                            resolve('refreshed');
                        } else {
                            reject('error: returned empty token when requesting refresh');
                        }
                    },
                    err => {
                        if (this.DEBUG) console.log('Error: cannot refresh: ', err);
                        reject('error refreshing');
                    }
                ))
        });
    }

    public logout() {
        this.token = null;
        this.token_expires = null;
        this.user = null;
        this.isLoginStatusAndChange.next(false);
        this.barService.popUpMessage("Logout", 2000);
    }

    public kickOut() {
        this.logout();
        this.router.navigate(['/login']);
        this.barService.popUpMessage("Oops...just want to make sure again you're the right person!");
    }

    public getUserList() {
        return this.apiService.apiGetEndPoint('users', {}, this.token);
    }

    private updateData(token) {
        this.token = token;

        // decode the token to read the username and expiration timestamp
        const token_parts = this.token.split(/\./);
        const token_decoded = JSON.parse(window.atob(token_parts[1]));
        this.token_expires = new Date(token_decoded.exp * 1000);
        this.user = {
            'name': token_decoded.username,
            'email': token_decoded.email,
            'id': token_decoded.user_id,
        };

        this.logService.print(this, `change login state to true`);
        this.isLoginStatusAndChange.next(true);
    }


    /**
     * 
     * Time Calculation
     * 
     */

    private getDisplayDeltaTimeInMinSec(startDateObject: Date, endDateObject: Date) {
        let minutesFloat = this.getDeltaTimeInMinutesFloat(startDateObject, endDateObject, 2);
        let minutesInt = Math.floor(minutesFloat);
        let minutesFactionPart = this.getFloatFractionPart(minutesFloat);
        let seconds = 60.0 * minutesFactionPart;
        seconds = this.roundUp(seconds, 0);
        return `${minutesInt} minutes ${seconds} seconds`;
    }

    private roundUp(floatNumber: number, floatDigits: number) {
        if (floatDigits <= 0) {
            return Math.floor(floatNumber);
        }

        let escalator = Math.pow(10, floatDigits);
        return Math.round(floatNumber * escalator) / escalator;
    }

    private getFloatFractionPart(floatNumber: number) {
        return floatNumber - Math.floor(floatNumber);
    }

    private getDeltaTimeInMinutesFloat(startDateObject: Date, endDateObject: Date, floatDigits: number): number {
        let minutes = (endDateObject.getTime() - startDateObject.getTime()) / 1000 / 60.0;
        return this.roundUp(minutes, floatDigits);
    }
}
