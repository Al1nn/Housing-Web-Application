import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { IUser } from '../../model/IUser.interface';
import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  registerationForm: FormGroup;
  user: IUser;
  userSubmitted: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.createRegistrationForm();
  }

  createRegistrationForm() {
    this.registerationForm = this.fb.group(
      {
        userName: [null, Validators.required],
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

  userData(): IUser {
    return (this.user = {
      userName: this.userName.value,
      email: this.email.value,
      password: this.password.value,
      mobile: this.mobile.value,
    });
  }

  //Getter methods from all controls
  get userName() {
    return this.registerationForm.get('userName') as FormControl;
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

  onSubmit() {
    console.log(this.registerationForm);
    this.userSubmitted = true;
    if (this.registerationForm.valid) {
      // this.user = Object.assign(this.user, this.registerationForm.value);

      this.userService.addUser(this.userData());
      this.registerationForm.reset();
      this.userSubmitted = false;
      this.alertifyService.success('Congrats, you are now registered');
    } else {
      this.alertifyService.error('Kindly provide the required fields');
    }
  }
}
