import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IUserForRegister } from '../../model/IUser.interface';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IUserForLogin } from '../../model/IUser.interface';
import { IImage } from '../../model/IImage.interface';





@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
    @ViewChild('loginForm') loginForm: NgForm;

    loginRequest: IUserForRegister = {
        username: '',
        password: '',
        email: '',
        phoneNumber: 0,
        roles: []
    };

    formData: FormData = new FormData();

    rolesData: any = [
        { name: 'Admin', id: 1, selected: false },
        { name: 'Owner', id: 2, selected: false },
        { name: 'Reader', id: 3, selected: false },
    ]

    constructor(
        private alertifyService: AlertifyService,
        private authService: AuthService,
        private router: Router,
    ) { }

    getSelectedRoles(): string[] {
        const selectedRoles: string[] = [];
        for (const e of this.rolesData) {
            if (this.loginForm.value[e.id]) {
                selectedRoles.push(e.name);
            }
        }
        return selectedRoles;
    }

    onLogin() {
        this.formData.append('username', this.loginRequest.username);
        this.formData.append('password', this.loginRequest.password);


        this.loginRequest.roles = this.getSelectedRoles();

        for (const e of this.loginRequest.roles) {
            this.formData.append('roles', e);
        }

        this.authService.authUser(this.formData).subscribe(
            (response: IUserForLogin) => {
                const user = response;
                localStorage.setItem('token', user.token);


                this.authService.getProfileImage().subscribe((data: IImage) => {
                    if (data !== null) {
                        localStorage.setItem('image', data.fileName as string);
                    }
                })

                this.alertifyService.success('Login successful');
                this.router.navigate(['/']);
            },
            (error) => {
                this.onCancel();
                this.alertifyService.error(error.error.errorMessage);
                console.log(error);
            }
        );
    }

    onCancel() {
        this.loginRequest = {
            username: '',
            password: '',
            email: '',
            phoneNumber: 0,
            roles: []
        };
        this.rolesData.forEach((role: { selected: boolean; }) => {
            role.selected = false;
        });
        this.formData.delete('username');
        this.formData.delete('password');
        this.formData.delete('roles');
        this.loginForm.resetForm();
    }



    ngOnInit() {

        this.formData.delete('username');
        this.formData.delete('password');
        this.formData.delete('roles');
    }


}
