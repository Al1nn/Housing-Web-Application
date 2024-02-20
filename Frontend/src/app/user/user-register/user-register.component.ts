import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-user-register',
    templateUrl: './user-register.component.html',
    styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
    registerationForm: FormGroup;
    user: IUserForRegister;
    userSubmitted: boolean;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private alertifyService: AlertifyService
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
            },
            { validators: this.passwordMatchingValidator }
        );
    }

    passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
        return fc.get('password')?.value === fc.get('confirmPassword')?.value
            ? null
            : { notmatched: true };
    }

    userData(): IUserForRegister {
        return (this.user = {
            username: this.username.value,
            email: this.email.value,
            password: this.password.value,
            mobile: this.mobile.value,
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
            }
            );

        }
    }

    onReset() {
        this.userSubmitted = false;
        this.registerationForm.reset();
    }
}
