import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-property-card',
    templateUrl: 'property-card.component.html',
    styleUrls: ['property-card.component.css']
})

export class PropertyCardElement implements OnInit {
  @Input() property_index : any //Input, poate sa imprumute proprietatile obiectului Property
    Property : any = {
        "Id" : 1,
        "Type" : "House",
        "Name" : "Birla House",
        "Price" : 12000,
        "Image" : "assets/images/house_default.png"
    }

    constructor() { }

    ngOnInit() { }
}
