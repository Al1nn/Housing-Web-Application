
import { AlertifyService } from './../services/alertify.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
    loggedInUser: string;
    profilePicture: string;


    constructor(
        private alertifyService: AlertifyService
    ) {

    }




    loggedIn() {
        this.loggedInUser =
            typeof localStorage !== 'undefined'
                ? (localStorage.getItem('username') as string)
                : '';

        return this.loggedInUser;
    }

    hasImage() {
        this.profilePicture =
            typeof localStorage !== 'undefined'
                ? (localStorage.getItem('image') as string)
                : '';
        return this.profilePicture;
    }

    onLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('image');
        this.alertifyService.success('You are logged out !');
    }


}
