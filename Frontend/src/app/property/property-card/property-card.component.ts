/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input, OnInit } from '@angular/core';
import { IPropertyBase } from '../../model/IPropertyBase.interface';
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



    constructor() { }

    ngOnInit() { }






}
