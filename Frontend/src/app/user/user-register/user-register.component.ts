import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { IUserForRegister } from '../../model/IUser.interface';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';





@Component({
    selector: 'app-user-register',
    templateUrl: './user-register.component.html',
    styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {

    registerationForm: FormGroup;
    user: IUserForRegister;

    userSubmitted: boolean;


    modalRef: BsModalRef;

    croppedImage: any = '';
    imageChangedEvent: any = '';

    rolesItems = ["Admin", "Reader", "Owner"];

    checkedRoles: string[] = [];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private modalService: BsModalService,
        private alertifyService: AlertifyService,
        private cdr: ChangeDetectorRef,

    ) { }

    get username() {
        return this.registerationForm.get('username') as FormControl;
    }

    get email() {
        return this.registerationForm.get('email') as FormControl;
    }

    get password() {
        return this.registerationForm.get('password') as FormControl;
    }

    get confirmPassword() {
        return this.registerationForm.get('confirmPassword') as FormControl;
    }

    get mobile() {
        return this.registerationForm.get('mobile') as FormControl;
    }

    get admin() {
        return this.registerationForm.get('admin') as FormControl;
    }

    get reader() {
        return this.registerationForm.get('reader') as FormControl;
    }

    get owner() {
        return this.registerationForm.get('owner') as FormControl;
    }

    onFileChange(event: any) {
        this.imageChangedEvent = event;
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    resetInput() {
        const input = document.getElementById('avatar-input-file') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;

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


    submitProfilePicture() {
        this.modalRef.hide();
        this.cdr.detectChanges();
    }


    ngOnInit() {
        this.createRegistrationForm();
    }

    createRegistrationForm() {
        this.registerationForm = this.fb.group(
            {
                username: [null, Validators.required],
                email: [null, [Validators.required, Validators.email]],
                password: [null, [Validators.required, Validators.minLength(8)]],
                confirmPassword: [null, Validators.required],
                mobile: [null, [Validators.required, Validators.maxLength(10)]],
                admin: [false],
                reader: [false],
                owner: [false],
            },
            {
                validators: this.passwordMatchingValidator
            }
        );

    }


    passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
        return fc.get('password')?.value === fc.get('confirmPassword')?.value
            ? null
            : { notmatched: true };
    }



    userData(): IUserForRegister {
        if (this.admin.value) {
            this.checkedRoles.push("Admin");
        }
        if (this.owner.value) {
            this.checkedRoles.push("Owner")
        }
        if (this.reader.value) {
            this.checkedRoles.push("Reader");
        }


        return (this.user = {
            username: this.username.value,
            email: this.email.value,
            password: this.password.value,
            phoneNumber: this.mobile.value,
            roles: this.checkedRoles,
            imageUrl: !this.croppedImage ? "" : this.croppedImage
        });

    }

    // Getter methods from all controls


    onSubmit() {
        console.log(this.registerationForm);

        this.userSubmitted = true;
        if (this.registerationForm.valid) {



            this.authService.registerUser(this.userData()).subscribe(() => {
                this.onReset();
                this.alertifyService.success('Congrats, you are now registered');

            });


        }
    }

    onReset() {
        this.userSubmitted = false;
        this.croppedImage = "";
        this.checkedRoles = [];
        this.registerationForm.reset();
    }
}
