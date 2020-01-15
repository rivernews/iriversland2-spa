import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    static BACKEND_BASE_ENDPOINT_HOSTNAME = "api.shaungc.com"

    private DEBUG: boolean = false;

    static TIMEOUT_GET: number = 20000;

    // http options used for making API calls
    // private httpOptions: any;

    constructor(
        private http: HttpClient,
    ) {
        // this.httpOptions = {
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json',
        //     })
        // };
    }

    public getApiBaseUrl() {
        if (window.location.hostname === 'localhost') {
            return `//localhost:8000/api/`;
        } else {
            // production
            return `https://${ApiService.BACKEND_BASE_ENDPOINT_HOSTNAME}/api/`;
        }
    }

    public getBaseUrl() {
        if (window.location.hostname === 'localhost') {
            return `//localhost:8001/`;
        } else {
            // production
            return `https://${ApiService.BACKEND_BASE_ENDPOINT_HOSTNAME}/`;
        }
    }

    public isLocalDev() {
        if (this.getBaseUrl() == `https://${ApiService.BACKEND_BASE_ENDPOINT_HOSTNAME}/`) {
            return false;
        } else {
            return true;
        }
    }
    

    /** 
     * 
     * RESTful API 
     * 
     */

    public apiGetEndPoint(path, params?, token?, absolutePath?, relativePath?) {
        let queryUrl = (absolutePath) ? absolutePath : `${this.getApiBaseUrl()}${path}/`;
        if (relativePath) queryUrl = `${this.getBaseUrl()}${relativePath}/`;

        if (this.DEBUG && this.isLocalDev()) console.log('GET:', queryUrl, token, params);
        return this.http.get(queryUrl, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': (token) ? 'JWT ' + token : '',
            }),
            params: (params) ? params : {},
            withCredentials: true
        })
        .pipe(
            timeout(ApiService.TIMEOUT_GET),
        );
        // object service (CRUD layer) handles error
    }

    public apiPostEndPoint(path, data?, token?, absolutePath?) {
        let queryUrl = (absolutePath) ? absolutePath : `${this.getApiBaseUrl()}${path}/`;
        let formData = (data) ? JSON.stringify(data) : {};
        let httpOptions = Object.assign({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': (token) ? 'JWT ' + token : '',
            }),
            withCredentials: true
        });
        if (this.DEBUG) console.log('POST:', queryUrl, token, formData, httpOptions);
        return this.http.post(queryUrl,
            formData,
            httpOptions,
        );
    }

    public apiPutEndPoint(path, data?, token?, absolutePath?) {
        let queryUrl = (absolutePath) ? absolutePath : `${this.getApiBaseUrl()}${path}/`;
        let formData = (data) ? JSON.stringify(data) : {};
        let httpOptions = Object.assign({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': (token) ? 'JWT ' + token : '',
            }),
            withCredentials: true
        });
        if (this.DEBUG) console.log('PUT:', queryUrl, token, formData, httpOptions);
        return this.http.put(queryUrl,
            formData,
            httpOptions,
        );
    }

    public apiPatchEndPoint(path, data?, token?, absolutePath?) {
        let queryUrl = (absolutePath) ? absolutePath : `${this.getApiBaseUrl()}${path}/`;
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': (token) ? 'JWT ' + token : '',
            }),
            withCredentials: true
        };
        if (this.DEBUG) console.log('PATCH:', queryUrl, token, data, httpOptions);
        return this.http.patch(queryUrl,
            (data) ? JSON.stringify(data) : {},
            httpOptions,
        );
    }

    public apiDeleteEndPoint(path, token?, absolutePath?) {
        let queryUrl = (absolutePath) ? absolutePath : `${this.getApiBaseUrl()}${path}/`;
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': (token) ? 'JWT ' + token : '',
            }),
            withCredentials: true
        };
        if (this.DEBUG) console.log('DELETE:', queryUrl, token, httpOptions);
        return this.http.delete(queryUrl,
            httpOptions,
        );
    }

    public apiPostFileEndPoint(path, formData, token) {
        let queryUrl = `${this.getApiBaseUrl()}${path}/`;
        let httpOptions = {
            headers: new HttpHeaders({
                'Authorization': (token) ? 'JWT ' + token : '',
            }),
            withCredentials: true
        };
        if (this.DEBUG) console.log('POST FILE:', queryUrl, token, httpOptions);        
        return this.http.post(queryUrl,
            formData,
            httpOptions,
        );
    }

    /** 
     * 
     * Helpers 
     * 
     */
}
