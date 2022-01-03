import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

import { BehaviorSubject, Subscription, of, Observable } from 'rxjs';
import { catchError, map, timeout } from "rxjs/operators";

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

    public PERSISTENT_TOKEN_KEY = (environment.production ? '' : 'Dev') + '_userService__login_user_token';
    public PERSISTENT_REFRESH_KEY = (environment.production ? '' : 'Dev') + '_userService__login_user_refresh';

    // the actual JWT token
    public token: string;
    // the refresher to refresh `token`
    public refresh: string;

    // the token expiration date
    public token_expires: Date;

    static TIMEOUT_login: number = 15000;

    private DEBUG: boolean = false;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private barService: SnackBarServiceService,
        private logService: LogMessageService,
    ) {
        // try to resume login state from localStage
        this.token = localStorage.getItem(this.PERSISTENT_TOKEN_KEY);
        this.refresh = localStorage.getItem(this.PERSISTENT_REFRESH_KEY);
        if (this.token) {
            this.updateData(this.token, this.refresh);
            // check token in localStorage is valid
            this.isLoginAndCheckExpiry().subscribe(
                isLoginSuccess => {
                    if (!isLoginSuccess) {
                        localStorage.removeItem(this.PERSISTENT_TOKEN_KEY);
                        localStorage.removeItem(this.PERSISTENT_REFRESH_KEY);
                    }
                },
                () => {
                    localStorage.removeItem(this.PERSISTENT_TOKEN_KEY);
                    localStorage.removeItem(this.PERSISTENT_REFRESH_KEY);
                }
            );
        }
    }

    public isLoginAndCheckExpiry(): Observable<boolean> {
        if (this.token) {
            let expirationDateTime = this.token_expires;
            let currentDateTime = new Date();
            let alertExpirationDateTime = new Date(expirationDateTime.getTime() - 30 * 60 * 1000); // refresh token before 30 minutes of expiration

            // login is still fresh
            if (currentDateTime < alertExpirationDateTime) {
                this.barService.popUpMessage('✅ Restored previous login session', 3000)
                this.isLoginStatusAndChange.next(true);
                return of(true);
            }

            // is not fresh, but not yet expired
            else if (alertExpirationDateTime < currentDateTime && currentDateTime < expirationDateTime) {
                this.barService.popUpMessage(`Login will expire soon in ${this.getDisplayDeltaTimeInMinSec(currentDateTime, expirationDateTime)}, refreshing token...`);
                return this.refreshToken().pipe(
                    map(isRefreshSuccess => {
                        if (isRefreshSuccess) {
                            this.barService.popUpMessage(`✅ Login state refreshed for the next ${this.getDisplayDeltaTimeInMinSec(new Date(), this.token_expires)} successfully!`);
                            this.isLoginStatusAndChange.next(true);
                        } else {
                            // refresh not successful, warn the user but nothing further
                            alert('🟠 Refresh login state failed, save all your changes and check your network. Will retry upon your next server request.');
                        }

                        // token still valid even if refresh not successful
                        // so we want to return `true` even if `isRefreshSuccess` is false
                        return true;
                    })

                    // `refreshToken()` will silent all error so no need to catch error here
                )
            }

            // expired
            else {
                alert('🔴 Login status expired. Please make a copy of all your changes, then login again.');
                return of(false);
            }
        } else {
            this.kickOut();
            return of(false);
        }
    }

    public login(user) {
        return new Promise((resolve, reject) => {
            this.subscriptions.add(this.apiService.apiPostEndPoint('token-auth', user)
                .pipe(
                    timeout(UserService.TIMEOUT_login)
                )
                .subscribe(
                    data => {
                        if (!data.hasOwnProperty('access')) {
                            throw new Error('Login response contains no token');
                        }
                        this.logService.print(this, `login success & got token!`);
                        this.updateData(data['access'], data['refresh']);
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
        return this.apiService.apiPostEndPoint('token-refresh', { refresh: this.refresh })
            .pipe(
                timeout(UserService.TIMEOUT_login),
                map((data => {
                    if (data.hasOwnProperty('access')) {
                        this.updateData(data['access']);
                        this.logService.print(this, `got new token and refreshed it`);

                        // refreshed ok
                        return true;
                    } else {
                        throw new Error('error: returned empty token when requesting refresh');
                    }
                })),
                catchError(err => {
                    if (this.DEBUG) console.error('Error: cannot refresh login token: ', err);

                    // silent error and just return bool instead for subscribing
                    // return throwError(err);
                    return of(false);
                })
            )
    }

    public logout() {
        this.refresh = this.token = null;
        this.token_expires = null;
        this.user = null;
        localStorage.removeItem(this.PERSISTENT_TOKEN_KEY);
        localStorage.removeItem(this.PERSISTENT_REFRESH_KEY);
        this.isLoginStatusAndChange.next(false);
        this.barService.popUpMessage("Logout", 2000);
    }

    public kickOut() {
        this.logout();
        this.barService.popUpMessage("Oops...just want to make sure again you're the right person!");
        this.router.navigate(['/login'], { queryParamsHandling: 'merge' });
    }

    public getUserList() {
        return this.apiService.apiGetEndPoint('users', {}, this.token);
    }

    private updateData(token, refresh=null) {
        this.token = token;
        localStorage.setItem(this.PERSISTENT_TOKEN_KEY, token);
        if (refresh) {
            this.refresh = refresh;
            localStorage.setItem(this.PERSISTENT_REFRESH_KEY, refresh);
        }

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
