/* eslint-disable @typescript-eslint/indent */
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { StoreService } from '../../store_services/store.service';
import { IToken } from '../../model/IToken.interface';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsDeleteModalComponent } from './user-settings-delete-modal/user-settings-delete-modal.component';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

    userCard: IToken;
    // userSubmitted: boolean;
    passwordForm: FormGroup;

    public originalFolder: string = environment.originalPictureFolder;
    public thumbnailFolder: string = environment.thumbnailFolder;

    constructor(
        private fb: FormBuilder
        , private store: StoreService
        , private dialogRef: MatDialog
    ) { }

    get oldPassword() {
        return this.passwordForm.get('oldPassword') as FormControl;
    }

    get newPassword() {
        return this.passwordForm.get('newPassword') as FormControl;
    }

    ngOnInit() {
        this.CreateChangePasswordForm();
        this.userCard = this.store.authService.decodeToken() as IToken;
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

        this.store.usersService.updateAvatar(formData).subscribe((data: any) => {
            if (localStorage) {
                localStorage.setItem('token', data.token);
                this.userCard = this.store.authService.decodeToken() as IToken;
            }
            this.store.alertifyService.success("Profile Picture Successfully Updated");
        });
    }

    onAccountDelete() {
        this.dialogRef.open(UserSettingsDeleteModalComponent, {
            width: '300px',
            height: '350px',
        });
    }

    resetInput() {
        const input = document.getElementById('avatar-input-file') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    }


}
