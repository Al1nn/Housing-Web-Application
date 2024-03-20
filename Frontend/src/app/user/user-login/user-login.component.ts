import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IUserForLogin } from '../../model/IUser.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';

//import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {

    modalRef: BsModalRef;
    cropImagePreview: any = '';
    cropURL: string;
    imageChangedEvent: any = '';

    constructor(
        private alertifyService: AlertifyService,
        private modalService: BsModalService,
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    onLogin(loginForm: NgForm) {
        console.log(loginForm.value);
        this.authService.authUser(loginForm.value).subscribe(
            (response: IUserForLogin) => {
                const user = response;
                localStorage.setItem('token', user.token);
                console.log(typeof (user.username));
                localStorage.setItem('username', user.username);
                this.alertifyService.success("Login successful");
                this.router.navigate(['/']);
            }
        );
    }

    onFileChange(event: any) {
        this.imageChangedEvent = event;
    }

    resetInput() {
        const input = document.getElementById('avatar-input-file') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
    }

    imageCropped(event: ImageCroppedEvent) {

        this.blobToBase64(event.base64 as string).then(base64String => {
            // Update cropImagePreview with the base64 string
            this.cropImagePreview = event.objectUrl;
            this.cropURL = base64String;

            console.log('\n\n\n' + this.cropImagePreview);
            this.cdr.detectChanges();
        });

    }

    blobToBase64(blobUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = function () {
                reject(new Error('Failed to convert Blob URL to base64'));
            };
            xhr.open('GET', blobUrl);
            xhr.responseType = 'blob';
            xhr.send();
        });
    }

    loadImageFailed() {
        // show message
    }
    cropperReady() {
        // cropper ready
    }
    imageLoaded() {
        // show cropper
    }




    ngOnInit() { }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
}
