import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-property-detail-maps-popup',
    templateUrl: './property-detail-maps-popup.component.html',
    styleUrls: ['./property-detail-maps-popup.component.css']
})
export class PropertyDetailMapsPopupComponent implements OnInit {

    mapCenter: google.maps.LatLngLiteral = { lat: +this.data.latitude.value, lng: +this.data.longitude.value };
    mapZoom = 10;
    markerPosition: google.maps.LatLngLiteral = this.mapCenter;
    advancedMarker: google.maps.marker.AdvancedMarkerElementOptions;
    geocoder = new google.maps.Geocoder();
    constructor(
        private matDialogRef: MatDialogRef<PropertyDetailMapsPopupComponent>
        , @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
        console.log('nana');
    }

    closeMapsModal() {
        this.matDialogRef.close();
    }
    onMapClick(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
        if (event.latLng) {
            this.markerPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            this.data.latitude.setValue(this.markerPosition.lat);
            this.data.longitude.setValue(this.markerPosition.lng);
            this.mapCenter = this.markerPosition;
            this.reverseGeocode(event.latLng.lat(), event.latLng.lng());
        }
    }

    reverseGeocode(lat: number, lng: number) {
        const latlng = new google.maps.LatLng(lat, lng);
        this.geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                this.data.address.setValue(address);
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }
}
