import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';

@Component({
    selector: 'app-property-contacts',
    templateUrl: './property-contacts.component.html',
    styleUrls: ['./property-contacts.component.css'],
})
export class PropertyContactsComponent implements OnInit {
    public propertyId: number;
    property = new Property();
    public mainPhotoUrl: string;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];
        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });

        this.property.photos.forEach((photo) => {
            if (photo.isPrimary === true)
                this.mainPhotoUrl = photo.imageUrl;
        })
    }
}
