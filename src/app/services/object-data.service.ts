import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { ApiService } from "./api.service";
import { UserService } from './user.service';

import { Observable, BehaviorSubject } from "rxjs";
import { tap, map, distinctUntilChanged } from 'rxjs/operators';
import { SnackBarServiceService } from './snack-bar-service.service';
import { LogMessageService } from './log-message.service';

@Injectable({
    providedIn: 'root'
})
export class ObjectDataService {

    private cachedObjectData: any = {};
    private documentListFilteringTags: any = {};

    private DEBUG: boolean = false;


    constructor(
        public apiService: ApiService,
        public userService: UserService,

        private barService: SnackBarServiceService,
        private logService: LogMessageService,
    ) {
        this.userService.isLoginStatusAndChange
        .pipe(
            distinctUntilChanged()
        )
        .subscribe(isLogin => {
            logService.print(this, `login status changed`);
            this.refreshCacheData();
        })
    }

    private refreshCacheData() {
        this.logService.print(this, `refreshCacheData(): cache is:`);
        this.logService.print(this, this.cachedObjectData, 0);

        this.setCollectiveTagList();
        
        for (let ObjectApiEndPoint in this.cachedObjectData) {
            /** get cache of that doc list */
            let ObjectDataListBehaviorSubject: BehaviorSubject<any[]> = this.cachedObjectData[ObjectApiEndPoint];

            this.logService.print(this, `endpoint=${ObjectApiEndPoint}`);
            this.logService.print(this, `behsubobj=${ObjectDataListBehaviorSubject}`);

            // clear cache and broadcast publish
            this.logService.print(this, `flusing out cache (endpoint=${ObjectApiEndPoint}) for reloading data. Previous subject obj is:`);
            this.logService.print(this, ObjectDataListBehaviorSubject.getValue());
            ObjectDataListBehaviorSubject.next(null);

            // http GET again and publish
            this.apiService.apiGetEndPoint(ObjectApiEndPoint, undefined, this.userService.token).subscribe(
                (ObjectDataList: any[]) => {
                    this.logService.print(this, `got refreshed data for endpoint=${ObjectApiEndPoint}. Data list is:`);
                    this.logService.print(this, ObjectDataList);
                    ObjectDataListBehaviorSubject.next(ObjectDataList);
                }
            );
        }
    }

    isCacheSetupReady(ObjectApiEndPoint): boolean {
        return this.cachedObjectData &&
            this.cachedObjectData[ObjectApiEndPoint] &&
            this.cachedObjectData[ObjectApiEndPoint].getValue() &&
            this.cachedObjectData[ObjectApiEndPoint].getValue().length > 0;
    }


    /** 
       * 
       * CRUD Operation (Async) 
       * 
       */

    public read(ObjectApiEndPoint, id?): Observable<any> {
        this.logService.print(this, `read(${ObjectApiEndPoint}, ${id})`);

        let queryUrl = (id) ? `${ObjectApiEndPoint}/${id}` : ObjectApiEndPoint;
        if (!id) {
            if (!this.cachedObjectData) {
                alert("Exception. See log.");
                if (this.DEBUG) console.log("cache obj is", this.cachedObjectData, 'end point is ', ObjectApiEndPoint);
                return;
            }
            else if (!this.cachedObjectData[ObjectApiEndPoint] || !this.cachedObjectData[ObjectApiEndPoint].getValue()) {
                this.logService.print(this, `Doesn't have cache yet or cache is empty, will now initaite cache and request data from API.`);

                this.cachedObjectData[ObjectApiEndPoint] = new BehaviorSubject<any[]>(null);
                this.apiService.apiGetEndPoint(queryUrl, undefined, this.userService.token).subscribe(
                    (ObjectDataList: any[]) => {
                        this.logService.print(this, `API GET ${queryUrl} and got data of length: ${ObjectDataList.length}, data is:`);
                        this.logService.print(this, ObjectDataList);
                        this.cachedObjectData[ObjectApiEndPoint].next(ObjectDataList);
                    },
                    error => {
                        this.barService.popUpMessage(`Cannot read() for GET: ${queryUrl}, you might check your network and refresh this page again.`, 0, 'Close', error);
                        this.logService.print(this, `Deleting cache due to error fetch.`);
                        delete this.cachedObjectData[ObjectApiEndPoint];
                    }
                );
                this.logService.print(this, `Will return a null initially, but once it gets data you'll got updated!`);
                return this.cachedObjectData[ObjectApiEndPoint];
            }
            else {
                this.logService.print(this, `already have behavior subject cache for endpoint=${ObjectApiEndPoint}. Its cache content is:`);
                this.logService.print(this, this.cachedObjectData[ObjectApiEndPoint].getValue());
                return this.cachedObjectData[ObjectApiEndPoint]; // give whatever value immediately, if undefine then undefine; later on will update (by .next()) and caller's subscription will trigger again.
            }
        }
        else {
            // reuse if already cache
            if (this.isCacheSetupReady(ObjectApiEndPoint)) {
                this.logService.print(this, `endpoint=${ObjectApiEndPoint} w/ id=${id}. Already have cache so will fetch from cache.`);
                // return behaviorSubject observable but find the only one that is the id object
                return this.cachedObjectData[ObjectApiEndPoint].pipe(
                    map((ObjectDataList: any[]) => {
                        return ObjectDataList.find(objectData => {
                            if (objectData.id === id) {
                                this.logService.print(this, objectData);                
                                return objectData;
                            }
                        });
                    })
                );
            }
            // if haven't cache yet but requesting single object, just request single object
            else {
                this.logService.print(this, `Have no cache for endpoint=${ObjectApiEndPoint} yet, will api request for that single id=${id}.`)
                return this.apiService.apiGetEndPoint(queryUrl, undefined, this.userService.token);
            }
        }
    }

    public update(ObjectApiEndPoint, ObjectData) {
        // refresh token if necessary
        this.userService.isLoginAndCheckExpiry();

        this.applyEditedValuesInPlace(ObjectData);

        let queryUrl = `${ObjectApiEndPoint}/${ObjectData.id}`;
        return this.apiService.apiPatchEndPoint(queryUrl, ObjectData, this.userService.token)
            .pipe(
                tap(
                    success => {
                        // update the cache if api success
                        if (this.isCacheSetupReady(ObjectApiEndPoint)) {
                            let objectDataList = this.cachedObjectData[ObjectApiEndPoint].getValue();

                            /** update cache for the modified object, so changes can be reflected in all pages */
                            for (let i = 0; i < objectDataList.length; i++) {
                                if (objectDataList[i].id === ObjectData.id) {
                                    // update object with that id in object list
                                    objectDataList[i] = ObjectData;
                                    break;
                                }
                            }

                            // update might change ordering, so sort again
                            this.logService.print(this, `update() before sort:`) ;
                            this.logService.print(this, objectDataList);
                            this.sortObjectByNumericCriterias(objectDataList, ['order', 'id'], 'decr');
                            this.logService.print(this, `update() after sort:`) ;
                            this.logService.print(this, objectDataList);

                            this.cachedObjectData[ObjectApiEndPoint].next(objectDataList);
                        }
                    }
                ),
            );
    }

    public delete(ObjectApiEndPoint, ObjectDataToDelete) {
        // refresh token if necessary
        this.userService.isLoginAndCheckExpiry();

        return this.apiService.apiDeleteEndPoint(`${ObjectApiEndPoint}/${ObjectDataToDelete.id}`, this.userService.token)
            .pipe(
                tap(
                    success => {
                        // remove from cache if delete success
                        if (this.isCacheSetupReady(ObjectApiEndPoint)) {
                            let objectDataList = this.cachedObjectData[ObjectApiEndPoint].getValue();
                            objectDataList = objectDataList.filter(
                                ObjectDataInstance => {
                                    if (ObjectDataInstance.id !== ObjectDataToDelete.id) {
                                        return ObjectDataInstance;
                                    }
                                }
                            );
                            this.cachedObjectData[ObjectApiEndPoint].next(objectDataList);
                        }
                    }
                )
            );
    }

    public create(ObjectApiEndPoint, ObjectData) {
        // refresh token if necessary
        this.userService.isLoginAndCheckExpiry();

        this.applyEditedValuesInPlace(ObjectData);        

        return this.apiService.apiPostEndPoint(ObjectApiEndPoint, ObjectData, this.userService.token)
            .pipe(
                tap(
                    (successObjectData: any) => {
                        if (this.isCacheSetupReady(ObjectApiEndPoint)) {
                            let objectDataList = this.cachedObjectData[ObjectApiEndPoint].getValue();
                            objectDataList = [successObjectData].concat(objectDataList);
                            this.sortObjectByNumericCriterias(objectDataList, ['order', 'id'], 'decr');                            
                            this.logService.print(this, `created and sorted. Will broadcast this data update. Data is:`);
                            this.logService.print(this, objectDataList);
                            this.cachedObjectData[ObjectApiEndPoint].next(objectDataList);
                        }
                    }
                )
            );
    }

    /**
     * Tag Functions
     * 
     */

    public async getCollectiveTagList(apiQueryEndPoint: string): Promise<Array<any>> {
        if (!(apiQueryEndPoint in this.documentListFilteringTags)) {
            this.documentListFilteringTags[apiQueryEndPoint] = [];
        }

        return this.documentListFilteringTags[apiQueryEndPoint];
    }

    public async setCollectiveTagList(apiQueryEndPoint: string = '', tagList: Array<any> = []): Promise<void> {
        if (apiQueryEndPoint === '' || tagList === []) {
            /** flush out tag state data for all apiQueryEndPoint */
            this.documentListFilteringTags = {};
        } else {
            this.documentListFilteringTags[apiQueryEndPoint] = tagList;
        }
    }


    /**
     * Helper Functions
     * 
     */

    private applyEditedValuesInPlace(ObjectData = {}) {
        if (!ObjectData) return;

        // load in editor temparary data / upate cache data if there's key with edited__<property name>
        for (let key in ObjectData) {
            const keyPieces = key.split('__');
            if (keyPieces[0] === "edited") {
                if (keyPieces.length == 1) return;
                const keyToUpdate = keyPieces[1];
                ObjectData[keyToUpdate] = ObjectData[key];
                // remove the `editied` property
                delete ObjectData[key];
            }
        }
    }

    public getMeta(ObjectApiEndPoint, objectData) {
        return {
            'workType': ObjectApiEndPoint,
            'createdTime': objectData.created_at,
            'id': objectData.id,
        }
    }

    private sortObjectByNumericCriterias(ObjectList, numericCriteriaList, mode?){
        ObjectList.sort( (a, b) => {
            for (let i = 0; i < numericCriteriaList.length; i++) {
                let criteria = numericCriteriaList[i];
                if (a[criteria] == b[criteria]) {
                    continue;
                }
                else {
                    if (mode == 'incr' || !mode) return parseFloat(a[criteria]) - parseFloat(b[criteria]);
                    else if (mode == 'decr') return parseFloat(b[criteria]) - parseFloat(a[criteria]);
                }
            }
            return -1; /** if all criteria fail to differentiate, use insreasing order as default */
        } );
    }
}
