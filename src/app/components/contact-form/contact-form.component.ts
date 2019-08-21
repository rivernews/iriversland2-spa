import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LogMessageService } from '../../services/log-message.service';
import { ApiService } from '../../services/api.service';

import { Subscription, BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, AfterViewInit {
    public form = this.fb.group({
        email: ['', Validators.email],
        name: [''],
        message: [''],
        response: [null, Validators.required],
    });

    @Input() headlineText: string;
    @Input() descriptionText: string;

    public submitSuccess: boolean = false;
    public isSubmitting = new BehaviorSubject<any>(false);

    @ViewChild('contactForm') contactForm: ElementRef;
    public ifContactForm: boolean = true;
    @ViewChild('submitSuccessContainer') submitSuccessContainer: ElementRef;
    public ifSubmitSuccessContainer: boolean = true;

    private subscriptions = new Subscription();

    private DEBUG: boolean = false;

    constructor(
        private fb: FormBuilder,

        private logService: LogMessageService,
        private apiService: ApiService,
    ) { }

    ngOnInit() {
        this.subscriptions.add(
            this.isSubmitting.subscribe(
                isSubmitting => {
                    if (isSubmitting) this.form.disable();
                    else this.form.enable();
                }
            )
        );
    }

    ngAfterViewInit() {
        this.submitSuccessContainer.nativeElement.classList.add('gone');
        this.submitSuccessContainer.nativeElement.classList.add('disappear');
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    handleCorrectCaptcha(event) {
        if (this.DEBUG) console.log('handleCorrectCaptcha(e), event is:', event);
        this.form.patchValue({
            response: event
        });
    }

    handleCaptchaExpired() {
    }

    onSubmitContactForm() {
        this.isSubmitting.next(true);

        this.logService.print(this, `email, name, message & recapthca is:`);
        this.logService.print(this, this.form.value);

        this.subscriptions.add(this.apiService.apiGetEndPoint(undefined, this.form.value, undefined, undefined, `recaptcha`)
        .pipe(
            finalize(() => {
                this.isSubmitting.next(false);
            })
        )
        .subscribe(
            serverResponse => {
                if (this.DEBUG) console.log('submitted form && server verification result is', serverResponse);
                if (serverResponse['success']) {
                    this.submitSuccess = true;
                    this.animateToSubmitSuccess();         
                }
            }
        ));
    }

    private animateToSubmitSuccess() {
        this.contactForm.nativeElement.classList.add('disappear');
        setTimeout(() => {
            this.ifContactForm = false;
            this.submitSuccessContainer.nativeElement.classList.remove('gone');
            setTimeout(() => {
                this.submitSuccessContainer.nativeElement.classList.remove('disappear');
            }, 100);
        }, 500);
    }
}
