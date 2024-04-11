import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserCard } from '../../model/IUserCard.interface';
import { HousingService } from '../../services/housing.service';

import { environment } from '../../../environments/environment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertifyService } from '../../services/alertify.service';



@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  userCard: IUserCard;
  propertiesListed: number;
  imageChangedEvent: Event;
  // userSubmitted: boolean;
  passwordForm: FormGroup;

  public originalFolder: string = environment.originalPictureFolder;
  public thumbnailFolder: string = environment.thumbnailFolder;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
    , private housingService: HousingService
    , private authService: AuthService
    , private alertifyService: AlertifyService
  ) { }

  get oldPassword() {
    return this.passwordForm.get('oldPassword') as FormControl;
  }

  get newPassword() {
    return this.passwordForm.get('newPassword') as FormControl;
  }

  ngOnInit() {
    this.CreateChangePasswordForm();

    this.route.data.subscribe((data) => {
      this.userCard = data['usercard'];
      console.log(this.userCard);
    });

    this.housingService.getPropertyCountByUser().subscribe((data) => {
      this.propertiesListed = data;
    });


  }

  CreateChangePasswordForm() {
    this.passwordForm = this.fb.group({
      oldPassword: [null, Validators.required, this.oldPasswordValidator.bind(this)],
      newPassword: [null, Validators.required],
    },
      {
        validators: this.samePasswordValidator
      }

    );
  }

  oldPasswordValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      this.authService.verifyOldPassword(control.value).subscribe(response => {
        if (response) {
          resolve(null); // Password matches
        } else {
          resolve({ notmatched: true }); // Password does not match
        }
      }, _error => {
        resolve({ notmatched: true }); // Handle error
      });
    });
  }

  // samePasswordValidator(control: AbstractControl): Promise<ValidationErrors | null> {
  //Create me a password matching VALIDATOR AND PUT samePassword to TRUE, IF IT IS TRUE, MAKE IT SHOW THE ERROR-BLOCK
  // }

  samePasswordValidator(control: AbstractControl): ValidationErrors | null {
    const oldPassword = control.get('oldPassword')?.value;
    const newPassword = control.get('newPassword')?.value;

    // Check if both old and new passwords are defined and equal
    if (oldPassword !== null && newPassword !== null && oldPassword === newPassword) {
      return { samePassword: true }; // Return error if passwords match
    }

    return null; // Return null if passwords are different or one of them is undefined
  }


  onSubmit() {
    if (this.passwordForm.valid) {
      this.authService.updatePassword(this.newPassword.value).subscribe(
        () => {
          this.onReset();
          this.alertifyService.success("Your password has been updated !");
        },
        (error) => {
          console.error('Error updating password:', error);
          this.alertifyService.error("Failed to update password. Please try again later.");
        }
      );
    } else {
      this.alertifyService.error("Please review your fields");
    }
  }

  onReset() {
    // this.userSubmitted = false;
    this.passwordForm.reset();
  }

  onFileChange(event: Event) {
    this.imageChangedEvent = event;
  }

  onAccountDelete() {
    console.log("Account Deleted");
  }

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }


}
