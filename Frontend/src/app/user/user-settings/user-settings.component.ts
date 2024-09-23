/* eslint-disable @typescript-eslint/indent */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserCard } from '../../model/IUserCard.interface';
import { environment } from '../../../environments/environment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { StoreService } from '../../store_services/store.service';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

    userCard: IUserCard;
    propertiesListed: number;
    // userSubmitted: boolean;
    passwordForm: FormGroup;

    public originalFolder: string = environment.originalPictureFolder;
    public thumbnailFolder: string = environment.thumbnailFolder;

    constructor(
        private fb: FormBuilder
        , private route: ActivatedRoute
        , private store: StoreService
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
        });

        this.store.housingService.getPropertyCountByUser().subscribe((data) => {
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
            this.store.usersService.verifyOldPassword(control.value).subscribe(response => {
                if (response) {
                    resolve(null);
                } else {
                    resolve({ notmatched: true });
                }
            }, _error => {
                resolve({ notmatched: true });
            });
        });
    }



    samePasswordValidator(control: AbstractControl): ValidationErrors | null {
        const oldPassword = control.get('oldPassword')?.value;
        const newPassword = control.get('newPassword')?.value;


        if (oldPassword !== null && newPassword !== null && oldPassword === newPassword) {
            return { samePassword: true };
        }


        return null;
    }


    onSubmit() {
        if (this.passwordForm.valid) {
            this.store.usersService.updatePassword(this.newPassword.value).subscribe(
                () => {
                    this.onReset();
                    this.store.alertifyService.success('Your password has been updated !');
                },
                (error) => {
                    console.error('Error updating password:', error);
                    this.store.alertifyService.error('Failed to update password. Please try again later.');
                }
            );
        } else {
            this.store.alertifyService.error('Please review your fields');
        }
    }

    onReset() {
        // this.userSubmitted = false;
        this.passwordForm.reset();
    }

    onFileChange(event: any) {
        const selectedFile = event.target.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);
        this.store.usersService.updateAvatar(this.userCard.fileName, formData).subscribe(() => {
            formData.delete('file');

            this.store.usersService.getUserCard().subscribe((data) => {
                this.userCard = data;
                localStorage.setItem('image', data.fileName);
                this.store.alertifyService.success('Avatar Changed');
            });

        });


    }

    onAccountDelete() {
        console.log('Account Deleted');
    }

    resetInput() {
        const input = document.getElementById('avatar-input-file') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    }


}
