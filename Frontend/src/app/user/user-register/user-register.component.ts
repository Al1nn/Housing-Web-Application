import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormBuilder,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { StoreService } from '../../store_services/store.service';
import { Router } from '@angular/router';






@Component({
    selector: 'app-user-register',
    templateUrl: './user-register.component.html',
    styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {

    registerationForm: FormGroup;
    formData: FormData = new FormData();
    userSubmitted: boolean;

    image: string;

    rolesItems = ['Admin', 'Reader', 'Owner'];



    constructor(
        private fb: FormBuilder,
        private store: StoreService,
        private router: Router
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
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            this.formData.append('file', file);
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result as string;
                this.image = imageUrl;
            }
            reader.readAsDataURL(file);
        }
    }



    resetInput() {
        const input = document.getElementById('avatar-input-file') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
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

    userData(): FormData {
        this.formData.append('username', this.username.value);
        this.formData.append('email', this.email.value);
        this.formData.append('password', this.password.value);
        this.formData.append('phoneNumber', this.mobile.value);



        if (this.admin.value) {
            this.formData.append('roles', 'Admin');
        }
        if (this.owner.value) {
            this.formData.append('roles', 'Owner');
        }
        if (this.reader.value) {
            this.formData.append('roles', 'Reader');
        }



        const fcmToken = localStorage.getItem('fcmToken') as string;
        this.formData.append('fcmToken', fcmToken);
        return this.formData;
    }
    onSubmit() {
        



        this.userSubmitted = true;

        if (this.registerationForm.valid) {
            this.store.authService.registerUser(this.userData()).subscribe(() => {
                this.onReset();
                this.store.alertifyService.success('Congrats, you are now registered');
                this.router.navigate(['user/login']);
            });
        }
    }

    onReset() {
        this.userSubmitted = false;
        this.formData.delete('username');
        this.formData.delete('email');
        this.formData.delete('password');
        this.formData.delete('phoneNumber');
        this.formData.delete('roles');
        this.formData.delete('fcmToken');
        this.image = '';
        this.registerationForm.reset();
    }
}
