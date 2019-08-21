import { Subscription } from "rxjs";
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { SnackBarServiceService } from "./snack-bar-service.service";
import { ObjectDataService } from "./object-data.service";

// TODO: consider moving this logic to ckeditor.js
export class UploadAdapter {
    loader: any;
    documemnt: any;
    private subscriptions = new Subscription();
    private userService: UserService;
    private apiService: ApiService;

    constructor(
        loader: any,
        private apiQueryEndPoint: string,
        private document: any,
        private barService: SnackBarServiceService,
        private objectDataService: ObjectDataService,
    ) {
        this.loader = loader;
        this.documemnt = this.documemnt;
        this.userService = objectDataService.userService;
        this.apiService = objectDataService.apiService;
    }

    upload() {
        // TODO: Update loader's progress.
        // this.server.onUploadProgress(data => {
        //     this.loader.uploadTotal = data.total;
        //     this.loader.uploaded = data.uploaded;
        // });
        if (this.document) {
            return this.getUploadedFileUrl();
        } else {
            this.barService.popUpMessage('Docoument is null when try to upload');
            console.error('Docoument is null when try to upload');
            return '';
        }
    }

    abort() {
        console.log('aborted');
        this.subscriptions.unsubscribe();
    }

    getUploadedFileUrl() {
        this.barService.popUpMessage("Uploading...", 0);
        return new Promise( (resolve, reject) => {
            
            /** Prepare form data for file upload */
            let uploadFileForm = new FormData();
            uploadFileForm.append('file', this.loader.file);
            let documentMeta = this.objectDataService.getMeta(this.apiQueryEndPoint, this.document);
            for (let key in documentMeta) {
                uploadFileForm.append(key, documentMeta[key]);
            }

            this.subscriptions.add(this.apiService.apiPostFileEndPoint('uploads',
                uploadFileForm,
                this.userService.token
            ).subscribe( response => {
                this.barService.popUpMessage('✅ Upload Success.');
                resolve({
                    default: response['fileUrl']
                });
            }, error => {
                this.barService.popUpMessage('Upload Failed. See console error message.');
                console.error('Failed when uploading file: ', error);
                reject("Failed in get upload file url: " + JSON.stringify(error));
            }));
        });
    }
}