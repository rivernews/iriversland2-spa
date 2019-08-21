import { Injectable } from '@angular/core';

import { 
    BreakpointObserver,
    Breakpoints,
    BreakpointState } from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class ResponsiveService {
    public isMobilePhone: boolean;

    constructor(
        public breakpointObserver: BreakpointObserver
    ) {
        this.breakpointObserver
            .observe([Breakpoints.Web])
            .subscribe((state: BreakpointState) => {
                this.isMobilePhone = !state.matches; 
            });
    }


}
