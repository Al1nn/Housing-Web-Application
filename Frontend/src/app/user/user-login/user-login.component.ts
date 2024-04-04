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
    @ViewChild("loginForm") loginForm: NgForm;

    loginRequest: IUserForRegister = {
        username: "",
        password: "",
        email: "",
        imageUrl: "",
        phoneNumber: 0,
        roles: []
    };

    rolesData: any = [
        { name: "Admin", id: 1, selected: false },
        { name: "Owner", id: 2, selected: false },
        { name: "Reader", id: 3, selected: false },
    ]

    constructor(
        private alertifyService: AlertifyService,
        private authService: AuthService,
        private router: Router,
    ) { }

    getSelectedRoles(): string[] {
        let selectedRoles: string[] = [];
        for (let e of this.rolesData) {
            if (this.loginForm.value[e.id]) {
                selectedRoles.push(e.name);
            }
        }
        return selectedRoles;
    }

    onLogin() {
        this.loginRequest.roles = this.getSelectedRoles();
        console.log(this.loginRequest);

        this.authService.authUser(this.loginRequest).subscribe(
            (response: IUserForLogin) => {
                const user = response;
                localStorage.setItem('token', user.token);


                this.authService.getProfileImage().subscribe((data: IImage) => {
                    if (data !== null) {
                        localStorage.setItem('image', data.url as string);
                    }
                })

                this.alertifyService.success("Login successful");
                this.router.navigate(['/']);
            }
        );
    }

    onCancel() {
        this.loginRequest = {
            username: "",
            password: "",
            email: "",
            imageUrl: "",
            phoneNumber: 0,
            roles: []
        };
        this.rolesData.forEach((role: { selected: boolean; }) => {
            role.selected = false;
        });
        this.loginForm.resetForm();
    }



    ngOnInit() { }


}
