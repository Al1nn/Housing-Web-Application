
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
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
    thumbnailFolder: string = environment.thumbnailFolder;
    originalFolder: string = environment.originalPictureFolder;
    constructor(
        private alertifyService: AlertifyService,
        private authService: AuthService
    ) {

    }




    loggedIn() {
        const decodedToken = this.authService.decodeToken();
        if (decodedToken) {
            this.loggedInUser = decodedToken.unique_name;
            return this.loggedInUser;
        } else {
            return "";
        }
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
        localStorage.removeItem('image');
        this.alertifyService.success('You are logged out !');
    }


}
