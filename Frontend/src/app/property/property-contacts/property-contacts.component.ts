import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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
    longitude: number;
    latitude: number;

    constructor(private route: ActivatedRoute, private http: HttpClient) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];
        this.route.data.subscribe((data) => {
            this.property = data['property'];
            this.getCoordinates();
        });


    }

    getCoordinates() {
        // const encodedAddress = encodeURIComponent(this.property.address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${this.property.address}`;

        this.http.get(url).subscribe((response: any) => {
            console.log(response);
            if (response && response.length > 0) {
                this.latitude = parseFloat(response[0].lat);
                this.longitude = parseFloat(response[0].lon);
                console.log(this.longitude);
                console.log(this.latitude);
            }
        });
    }

}
