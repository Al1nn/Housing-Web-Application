/* eslint-disable @angular-eslint/component-class-suffix */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Property } from '../../model/Property.interface';





@Component({
    selector: 'app-property-card',
    templateUrl: 'property-card.component.html',
    styleUrls: ['property-card.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PropertyCardComponent {

    @Input() property_index: Property; // Input, poate sa imprumute proprietatile obiectului Property

    @Input() hideIcons: boolean;
    loggedInUser: string;
    thumbnailFolder: string = environment.thumbnailFolder;



    constructor() { }

}
