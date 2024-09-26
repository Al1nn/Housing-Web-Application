import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PropertyDetailPopupMessageComponent } from '../property-detail-popup-message/property-detail-popup-message.component';


@Component({
    selector: 'app-property-contacts',
    templateUrl: './property-contacts.component.html',
    styleUrls: ['./property-contacts.component.css'],
})
export class PropertyContactsComponent implements OnInit {

    public propertyId: number;
    property = new Property();
    public mainPhotoUrl: string;
    originalFolder: string = environment.originalPictureFolder;

    mapCenter: google.maps.LatLngLiteral;
    mapOptions: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        draggable: true
    }

    constructor(private route: ActivatedRoute, private dialogRef: MatDialog) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];
        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });
        this.setMapCenter();
    }

    setMapCenter() {
        if (this.property && this.property.latitude && this.property.longitude) {
            this.mapCenter = {
                lat: this.property.latitude,
                lng: this.property.longitude
            };
        }
    }

    openMessagesModal() {
        this.dialogRef.open(PropertyDetailPopupMessageComponent, {
            width: '600px',
            height: '800px'
        });
    }

}
