import { Injectable } from '@angular/core';

import {
    MAJOR_ROLE_TOOL_LIST, MAJOR_ROLE_EDUCATIONS,
    THEMED_ACTIONS
} from "./media.mock-data";

import { s3MediaResource } from "../data-model/s3-media-resource";

@Injectable({
    providedIn: 'root'
})
export class MediaContentService {

    constructor(
    ) { }

    get majorRolesToolList(): s3MediaResource[] {
        return MAJOR_ROLE_TOOL_LIST;
    }

    get majorRolesEducations(): any[] {
        return MAJOR_ROLE_EDUCATIONS;
    }

    /* * *

        Actions and Navigations

    * * */

    get navActions() {
        return this.getContentListByKeys(['portfolio', 'blog', 'profile']);
    }

    get homeHeadlineActions() {
        return this.getContentListByKeys(['portfolio', 'profile']);
    }

    get homeBottomThemedActions(): any {
        return this.getContentListByKeys(['blog', 'portfolio', 'design']);
    }

    public getContentListByKeys(keys) {
        let contentList = [];
        for (let k of keys) {
            contentList.push(THEMED_ACTIONS[k]);
        }
        return contentList;
    }
}
