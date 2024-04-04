/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnInit } from '@angular/core';
import { IPropertyBase } from '../../model/IPropertyBase.interface';
import { AlertifyService } from '../../services/alertify.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-property-card',
    templateUrl: 'property-card.component.html',
    styleUrls: ['property-card.component.css']
})

export class PropertyCardElement implements OnInit {

    @Input() property_index: IPropertyBase; // Input, poate sa imprumute proprietatile obiectului Property
    @Input() hideIcons: boolean;
    loggedInUser: string;
    thumbnailFolder: string = environment.thumbnailFolder;


    loggedIn() {
        const decodedToken = this.authService.decodeToken();
        if (decodedToken) {
            this.loggedInUser = decodedToken.unique_name;
            return this.loggedInUser;
        } else {
            return "";
        }
    }
    constructor(private alertifyService: AlertifyService,
        private authService: AuthService) { }

    ngOnInit(


    ) { }

    contactsClicked() {
        if (!this.loggedIn()) {
            this.alertifyService.error("You must be logged in to access contacts");
        }
    }




}
