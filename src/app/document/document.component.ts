import { Component, OnInit, Input, OnDestroy,
    HostListener } from '@angular/core';

// Get Service
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';
import { ObjectDataService } from "../services/object-data.service";
import { Subscription } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

// Routing
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

// 3rd party library  
import CustomBalloonEditor from '@shaungc/ckeditor5-custom-balloon';

import { UploadAdapter } from "../services/upload-adapter";

import { SnackBarServiceService } from "../services/snack-bar-service.service";

import { Router } from '@angular/router';

import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize, timeout } from 'rxjs/operators';
import { LogMessageService } from '../services/log-message.service';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss'],

    host: {
        '(window:keydown)': 'onWindowKeyDown($event)'
    }
})
export class DocumentComponent implements OnInit, OnDestroy {
    private subscriptions = new Subscription();

    /** models */
    public document: any = { content: ''}; // doc obj to receive API data / be submitted to API
    public isDirty: boolean = false;

    /** editor objects */
    public editorFactory = CustomBalloonEditor;
    public documentCKeditor: any = null;
    public documentCKeditorConfig: any = {};

    public isLogin: boolean = null;
    public isSubmitting: boolean;
    public isCreateMode: boolean;

    static TIMEOUT_SUBMIT: number = 20000;
    static TIMEOUT_CREATE: number = 20000;

    public chipSeparatorKeysCodes = [ENTER, COMMA];

    @Input() apiQueryEndPoint?: string;

    @Input() showTimeStamp: string = null;

    @Input() showChips: boolean = false;
    @Input() documentAttributeNameForTagChips?: string;

    private DEBUG: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private location: Location,

        private userService: UserService,
        private apiService: ApiService,
        private objectDataService: ObjectDataService,
        private logService: LogMessageService,

        private snackBar: SnackBarServiceService,
        private router: Router,
        private sanitizer: DomSanitizer,
    ) {

    }

    ngOnInit() {
        this.logService.print(this, `doc component initialized. content is ${this.document.content}`);

        this.subscriptions.add(this.userService.isLoginStatusAndChange
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(isLogin => {
                if (isLogin === true || isLogin === false) {
                    if (this.isLogin === null) {
                        /** first time loading doc component */
                        /** don't try to get doc if it's the first time. Wait for the editor instead */
                        this.logService.print(this, `Login the first time so bypass getDoc().`);
                    } else {
                        this.logService.print(this, `Login status changed will re-do getDoc().`);  
                        
                        this.getDocument()
                            .then()
                            .catch();
                    }
                }
                else {
                    /** isLogin from userService is not yet ready. */
                    console.error('isLogin is not yet ready');
                }
                this.isLogin = isLogin;
            }));
    }

    ngOnDestroy() {
        if (this.documentCKeditor) {
            this.documentCKeditor.destroy()
                .catch(error => {
                    console.error("Error when destroying ckeditor:", error);
                });
        }
        this.subscriptions.unsubscribe();
    }

    /**
     * 
     * Interact with DOM
     * 
     */

    @HostListener('window:beforeunload', ['$event'])
    onPageLeaveAlert(e) {
        e = e || window.event;

        /** warn user if changes not saved but attempting to close the tab */        
        if (this.isDirty) {
            // in most of the browsers you can’t change the message shown, the browser strict on its on message
    
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Sure?';
            }
        
            // For Safari
            return 'Sure?';
        }
    }

    /** 
     * 
     * Editor & Data
     * 
     */

    public onEditorReady(editor) {
        this.logService.print(this, `onready balloon editor! content is ${this.document.content}`);

        this.documentCKeditor = editor;
        this.getDocument()
        .then((success)=> {
            // set editability
        
            if (this.documentCKeditor) {
                this.documentCKeditor.isReadOnly = !this.isLogin;
            }

            // setup image upload handle for editor;
            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                return new UploadAdapter(loader, this.apiQueryEndPoint, this.document, this.snackBar, this.objectDataService);
            };

            // setup keyboard shortcuts
            this.setupKeyShortcuts(editor);
        })
        .catch((error)=> {
            this.snackBar.popUpMessage(`editorOnReady(): Cannot get document`, 0, 'Close', error);
        });
    }
    
    public onDocumentEditorContentChange(event){
        this.isDirty = true;
    }

    private getDocument() {
        this.logService.print(this, `get document(): content is ${this.document.content}`);
        
        return new Promise((resolve, reject) => {
            const docId = +this.route.snapshot.paramMap.get('id');

            if (!this.documentCKeditor) {
                this.logService.print(this, `getDocument(): editor not yet created, please wait for that first.`);
                reject("Editor not yet initiated");
            }
            else if (docId != 0) {
                this.subscriptions.add(this.objectDataService.read(this.apiQueryEndPoint, docId).subscribe(
                    doc => {
                        this.logService.print(this, `Got doc:`);
                        this.logService.print(this, doc);
                        
                        /** this will only do a swallow copy - only copy the reference. 
                         * So the unsaved changes will effect the cache data. 
                         * However, if user wants to revert and discard changes,
                         * the user can just refresh the browser.
                         */
                        this.document = doc;

                        // if already initialized (so document also set once)
                        if (this.documentCKeditor) {
                            this.documentCKeditor.isReadOnly = !this.isLogin;
                        }

                        setTimeout(() => {
                            this.isDirty = false;
                        }, 0);

                        resolve("OK");
                    },
                    error => {
                        if (this.DEBUG) console.warn('warning: in doc cannot get data, maybe becasue of logout (cache is refreshed)? will redirect to list view', error);
                        this.router.navigate(['../'], { relativeTo: this.route });
                        reject(error);
                    }
                ));
            }
            else if (this.isLogin) {
                /** create mode */
                this.isCreateMode = true;
                this.document = this.generateDocument();
                resolve(this.document);
            }
            else {
                this.snackBar.popUpMessage("Not login but trying to create.");
                reject("Not login but trying to create.");
            }
        });
    }

    /* 
    *
    * Deal with editables
    * 
    * */

    private generateDocument() {
        let documentObject = {
            title: 'No Title',
            content: 'Say something here...',
            order: 0
        };
        if (this.documentAttributeNameForTagChips) {
            documentObject[this.documentAttributeNameForTagChips] = 'Tag1, Tag2';
        }

        return documentObject;
    }

    /*
    * 
    * CRUD operations
    * 
    *  */

    public onSubmitClick() {
        if (this.documentCKeditor) {
            if (!this.isCreateMode) {
                this.isSubmitting = true;
                this.snackBar.popUpMessage("Submitting...", 0);
                this.subscriptions.add(this.objectDataService.update(this.apiQueryEndPoint, this.document)
                    .pipe(
                        timeout(DocumentComponent.TIMEOUT_SUBMIT),
                        finalize(() => {
                            this.isSubmitting = false;
                        })
                    )
                    .subscribe(
                        success => {
                            this.snackBar.popUpMessage("✅ Submitted Successfully!");
                            this.isDirty = false;
                        },
                        error => {
                            this.snackBar.popUpMessage(`Failed to submit.`, 0, 'Close', error);
                            if (this.DEBUG) console.error('Submitting document failed:', error);
                        },

                        // "Complete means that the observable steam was finished successfully.": https://stackoverflow.com/questions/33783967/rxjs-observable-doesnt-complete-when-an-error-occurs
                        () => {

                        }
                    ));
            } else {
                this.isSubmitting = true;
                this.snackBar.popUpMessage("Creating...", 0);
                this.subscriptions.add(this.objectDataService.create(this.apiQueryEndPoint, this.document)
                    .pipe(
                        timeout(DocumentComponent.TIMEOUT_CREATE),
                        finalize(() => {
                            this.isSubmitting = false;
                        })
                    )
                    .subscribe(
                        success => {
                            this.isDirty = false;
                            this.snackBar.popUpMessage("✅ Created Successfully!");
                            if (this.DEBUG) console.log('created and', success);
                            // TODO: id in url is still "0", which is not good when doing page refreshing
                            // ideal will be update the id in url
                            this.location.back();
                        },
                        error => {
                            this.snackBar.popUpMessage("Failed to create. See console error message.");
                            console.error('Creating document failed:', error);
                        }
                    ))
                ;
            }
        }
    }

    public onDeleteClick() {
        if (this.isCreateMode) {
            this.location.back();
        }
        else if (this.documentCKeditor && window.confirm(`Are you sure you want to delete this document?`)) {
            this.snackBar.popUpMessage("Deleting...", 0);
            this.isSubmitting = true;
            this.subscriptions.add(this.objectDataService.delete(this.apiQueryEndPoint, this.document).subscribe(
                response => {
                    this.isDirty = false; 
                    this.snackBar.popUpMessage("✅ Document deleted.");
                    this.location.back();
                },
                error => {
                    this.snackBar.popUpMessage("Failed to delete. See console error message.");
                    console.error('Deleting document failed.', error);
                },
                () => {
                    this.isSubmitting = false;
                }
            ));
        }
    }

    public goBack(): void {
        this.location.back();
    }


    /**
     * TODO: move to ckeditor.js
     * Keyboard shortcuts for CKeditor5
     * For possible keys in ckeditor, see https://docs.ckeditor.com/ckeditor5/latest/api/module_utils_keyboard.html#static-constant-keyCodes
     */
    private setupKeyShortcuts(editor: any): void {
        let headingNumbers = [1, 2, 3, 4];

        /** Headings & Paragraph */
        for (let number of headingNumbers) {
            editor.keystrokes.set(`ctrl+alt+${number}`, (data, stop) => {
                editor.execute('heading', { value: `heading${number}` });
                stop(); /* stop browser's keyboard shortcut */
            });
        }
        editor.keystrokes.set(`ctrl+alt+0`, (data, stop) => {
            editor.execute('paragraph');
            stop();
        });

        /** Bullit List */
        editor.keystrokes.set(`ctrl+shift+8`, (data, stop) => {
            editor.execute('bulletedList');
            stop();
        });
    }

    /** Global Keyboard Shortcut */
    onWindowKeyDown(event) {
        let crossPlatformCtrl = event.metaKey || event.ctrlKey;

        /** Save Doc */
        if (crossPlatformCtrl && event.code === 'KeyS') {
            this.onSubmitClick();
            event.preventDefault();
        }

        /** Delete Doc */
        if (crossPlatformCtrl && event.shiftKey && event.code === 'Backspace') {
            this.onDeleteClick();
            event.preventDefault();
        }
    }
}
