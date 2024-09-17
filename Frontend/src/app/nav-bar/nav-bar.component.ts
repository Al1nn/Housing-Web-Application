
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
            return '';
        }
    }

    isAdmin() {
        const decodedToken = this.authService.decodeToken();
        if (decodedToken && decodedToken.role) {
            if (Array.isArray(decodedToken.role)) {
                return decodedToken.role.includes('Admin');
            } else {
                return decodedToken.role === 'Admin';
            }
        } else {
            return false;
        }
    }

    isOnlyReader(): boolean {
        const decodedToken = this.authService.decodeToken();
        if (decodedToken && decodedToken.role) {
            if (Array.isArray(decodedToken.role)) {
                return decodedToken.role.includes('Reader') && decodedToken.role.length === 1;
            } else {
                return decodedToken.role === 'Reader';
            }
        } else {
            return false;
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
