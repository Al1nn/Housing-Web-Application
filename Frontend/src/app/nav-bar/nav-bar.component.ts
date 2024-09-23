
import { environment } from '../../environments/environment';
import { StoreService } from '../store_services/store.service';
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
        private store: StoreService
    ) {

    }




    loggedIn() {
        const decodedToken = this.store.authService.decodeToken();
        if (decodedToken) {
            this.loggedInUser = decodedToken.unique_name;
            return this.loggedInUser;
        } else {
            return '';
        }
    }

    isOnlyReader() {
        return this.store.authService.isOnlyReader();
    }

    isAdmin() {
        return this.store.authService.isAdmin();
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
        this.store.alertifyService.success('You are logged out !');
    }


}
