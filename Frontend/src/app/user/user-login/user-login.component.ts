import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IUserForLogin } from '../../model/IUser.interface';

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
    constructor(
        private alertifyService: AlertifyService,
        private authService: AuthService,
        private router: Router
    ) { }

    onLogin(loginForm: NgForm) {
        console.log(loginForm.value);
        this.authService.authUser(loginForm.value).subscribe(
            (response: IUserForLogin) => {
                const user = response;
                localStorage.setItem('token', user.token);
                console.log(typeof (user.username));
                localStorage.setItem('username', user.username);
                this.alertifyService.success("Login successful");
                this.router.navigate(['/']);
            },
            (error) => {
                console.log(error);
                this.alertifyService.error(error.status + " : " + error.statusText + "Change User ID or Password");
            }
        );
    }

    ngOnInit() { }
}
