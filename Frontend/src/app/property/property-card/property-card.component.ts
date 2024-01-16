import { Component, Input, OnInit } from '@angular/core';
import { IProperty } from '../../model/IProperty.interface';

@Component({
    selector: 'app-property-card',
    templateUrl: 'property-card.component.html',
    styleUrls: ['property-card.component.css']
})

export class PropertyCardElement implements OnInit {

  @Input() property_index : IProperty ; //Input, poate sa imprumute proprietatile obiectului Property

    constructor() { }

    ngOnInit() { }




}
