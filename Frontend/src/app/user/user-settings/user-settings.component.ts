import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserCard } from '../../model/IUserCard.interface';
import { HousingService } from '../../services/housing.service';

import { environment } from '../../../environments/environment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';



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
    this.passwordForm = this.fb.group(
      {
        oldPassword: [null, Validators.required, this.oldPasswordValidator.bind(this)],
        newPassword: [null, Validators.required],
      },

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


  onSubmit() {
    // this.userSubmitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    console.log(this.passwordForm);




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
