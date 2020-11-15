import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, RoutesRecognized } from "@angular/router";
import { Observable, timer } from "rxjs";

import { HttpClient } from '@angular/common/http';

import { ApiService } from "./api.service";

import { Angulartics2 } from 'angulartics2';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GlobalResolverService implements Resolve<any> {
    private credentials: any;

    public prevUrl;

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private angulartics2: Angulartics2,
        private router: Router
    ) {
        // get & store previous route url
        // https://stackoverflow.com/a/47880387/9814131
        this.router.events.pipe(
            filter(e => e instanceof RoutesRecognized),
            pairwise()
        )
        .subscribe((events: [RoutesRecognized, RoutesRecognized]) => {
            this.prevUrl = events[0].urlAfterRedirects;
        })
    }

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<any> {
        // if there's a `nr` (no-reporting) querystring, then do not report visitor
        if (!(route.queryParams.nr || route.queryParams.nr === '' || route.queryParams.nr === 0)) {
            this.reportVisit(routerState);
        }
        
        /** google analytics */
        let categorySuffix = (this.apiService.isLocalDev()) ? ` (localhost)`: "";
        this.angulartics2.eventTrack.next({ action: `Visiting ${routerState.url}`, properties: { category: `routeChange${categorySuffix}`, label: `Route changed to ${routerState.url}` }});

        return timer(160);
    }

    reportVisit(routerState) {
        if (!this.apiService.isLocalDev()){
            // TODO: not safe to grant api key to client side
            let param: any = {
                'query': 'get_api_key',
            };
            // console.log('getting api key');
            this.http.get<any>(`${this.apiService.getBaseUrl()}report`, { params: param }).subscribe(
                response => {
                    // console.log('getting api key successful, server responded with', response);
                    this.credentials = response.data;
                    param = {
                        'token': this.credentials
                    };
                    // console.log('reporting to server');
                    this.http.get<any>(`//ipinfo.io/json`, { params: param }).subscribe(
                        response => {
                            // console.log('got api key from server!', response);
                            let param = response;
                            param['visitingPath'] = routerState.url;
                            param.query = "report_visit";
                            this.http.get<any>(`${this.apiService.getBaseUrl()}report`, { params: { ...param, 'serialized-params': JSON.stringify(param) } }).subscribe(
                                response => {
                                    // console.log("successfully reported. server responded with", response);
                                }
                            );
                        },
                        error => {

                        }
                    );
                },
                error => {
                    // console.error("fail to get api key from server");
                }
            );
        } 
        else {
            // console.log("local dev detected: will not report visitor.");
        }
    }
}