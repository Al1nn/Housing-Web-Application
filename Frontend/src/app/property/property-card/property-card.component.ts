/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnInit } from '@angular/core';
import { IPropertyBase } from '../../model/IPropertyBase.interface';
import { AlertifyService } from '../../services/alertify.service';
import { environment } from '../../../environments/environment';

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
        this.loggedInUser =
            typeof localStorage !== 'undefined'
                ? (localStorage.getItem('username') as string)
                : '';
        return this.loggedInUser;
    }
    constructor(private alertifyService: AlertifyService) { }

    ngOnInit(


    ) { }

    contactsClicked() {
        if (!this.loggedIn()) {
            this.alertifyService.error("You must be logged in to access contacts");
        }
    }




}
