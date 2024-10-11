
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
    profilePicture: string | undefined;
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
            this.profilePicture = decodedToken.profile_picture;
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



    onLogout() {
        localStorage.removeItem('token');
        this.store.alertifyService.success('You are logged out !');
    }

    onNotificationClick() {
        throw new Error('Method not implemented.');
    }


}
