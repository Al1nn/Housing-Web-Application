import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Property } from '../../../models/Property.interface';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IKeyValuePair } from '../../../models/IKeyValuePair';
import { PropertyDetailMapsPopupComponent } from './property-detail-maps-popup/property-detail-maps-popup.component';
import { StoreService } from '../../../store_services/store.service';

@Component({
    selector: 'app-property-detail-edit-popup',
    templateUrl: './property-detail-edit-popup.component.html',
    styleUrls: ['./property-detail-edit-popup.component.css']
})
export class PropertyDetailEditPopupComponent implements OnInit {
    @ViewChild('editFormTabs', { static: false }) formTabs: TabsetComponent;
    unmodifiedProperty: Property = {} as Property;
    property: Property = {} as Property;
    public propertyId: number;
    editPropertyForm: FormGroup;
    propertyTypes: IKeyValuePair[];
    furnishTypes: IKeyValuePair[];
    cityList: any[];
    geocoder = new google.maps.Geocoder();
    constructor(
        private fb: FormBuilder
        , private dialogRef: MatDialogRef<PropertyDetailEditPopupComponent>
        , private dialogMaps: MatDialog
        , private store: StoreService
        , @Inject(MAT_DIALOG_DATA) public data: any) { }

    get BasicInfo() {
        return this.editPropertyForm.controls['BasicInfo'] as FormGroup;
    }
    get sellRent() {
        return this.BasicInfo.controls['sellRent'] as FormControl;
    }

    get bhk() {
        return this.BasicInfo.controls['bhk'] as FormControl;
    }

    get propertyType() {
        return this.BasicInfo.controls['propertyType'] as FormControl;
    }

    get furnishingType() {
        return this.BasicInfo.controls['furnishingType'] as FormControl;
    }

    get name() {
        return this.BasicInfo.controls['name'] as FormControl;
    }

    get city() {
        return this.BasicInfo.controls['city'] as FormControl;
    }

    get PriceInfo() {
        return this.editPropertyForm.controls['PriceInfo'] as FormGroup;
    }

    get price() {
        return this.PriceInfo.controls['price'] as FormControl;
    }

    get security() {
        return this.PriceInfo.controls['security'] as FormControl;
    }

    get maintenance() {
        return this.PriceInfo.controls['maintenance'] as FormControl;
    }

    get builtArea() {
        return this.PriceInfo.controls['builtArea'] as FormControl;
    }

    get carpetArea() {
        return this.PriceInfo.controls['carpetArea'] as FormControl;
    }

    get AddressInfo() {
        return this.editPropertyForm.controls['AddressInfo'] as FormGroup;
    }

    get floorNo() {
        return this.AddressInfo.controls['floorNo'] as FormControl;
    }

    get totalFloors() {
        return this.AddressInfo.controls['totalFloors'] as FormControl;
    }

    get address() {
        return this.AddressInfo.controls['address'] as FormControl;
    }

    get latitude() {
        return this.AddressInfo.controls['latitude'] as FormControl;
    }

    get longitude() {
        return this.AddressInfo.controls['longitude'] as FormControl;
    }

    get phoneNumber() {
        return this.AddressInfo.controls['phoneNumber'] as FormControl;
    }

    get OtherInfo() {
        return this.editPropertyForm.controls['OtherInfo'] as FormGroup;
    }

    get readyToMove() {
        return this.OtherInfo.controls['readyToMove'] as FormControl;
    }

    get estPossessionOn() {
        return this.OtherInfo.controls['estPossessionOn'] as FormControl;
    }

    get gated() {
        return this.OtherInfo.controls['gated'] as FormControl;
    }

    get mainEntrance() {
        return this.OtherInfo.controls['mainEntrance'] as FormControl;
    }

    get description() {
        return this.OtherInfo.controls['description'] as FormControl;
    }


    ngOnInit(): void {
        this.propertyId = this.data.propertyId;
        this.property = this.data.property;

        this.store.housingService.getPropertyTypes().subscribe(data => {
            this.propertyTypes = data;
        });

        this.store.housingService.getFurnishingTypes().subscribe(data => {
            this.furnishTypes = data;
        });

        this.store.housingService.getAllCities().subscribe((data) => {
            this.cityList = data;
        });

        this.store.housingService.getPropertyDetailById(this.propertyId).subscribe(data => {
            this.unmodifiedProperty = data;
        });

        this.CreateEditForm();
    }

    closeEditModal() {
        if (this.editPropertyForm.valid) {
            this.dialogRef.close(this.unmodifiedProperty);
        }
    }

    CreateEditForm() {
        this.editPropertyForm = this.fb.group({
            BasicInfo: this.fb.group({
                sellRent: [this.property.sellRent.toString()],
                bhk: [this.property.bhk],
                propertyType: [+this.property.propertyTypeId],
                furnishingType: [+this.property.furnishingTypeId],
                name: [this.property.name, [Validators.required, this.noDigitsOrNumbersValidator()]],
                city: [this.property.cityId]
            }),
            PriceInfo: this.fb.group({
                price: [this.property.price, [Validators.required, this.numericValidator()]],
                security: [this.property.security, [Validators.required, this.numericValidator()]],
                maintenance: [this.property.maintenance, [Validators.required, this.numericValidator()]],
                builtArea: [this.property.builtArea, [Validators.required, this.numericValidator()]],
                carpetArea: [this.property.carpetArea, [Validators.required, this.numericValidator()]]
            }),
            AddressInfo: this.fb.group({
                floorNo: [this.property.floorNo, [Validators.required, this.numericValidator()]],
                totalFloors: [this.property.totalFloors, [Validators.required, this.numericValidator()]],
                address: [this.property.address, Validators.required],
                latitude: [this.property.latitude],
                longitude: [this.property.longitude],
                phoneNumber: [this.property.phoneNumber, [Validators.required, this.numericValidator()]]
            }),
            OtherInfo: this.fb.group({
                readyToMove: [this.property.readyToMove ? 'true' : 'false'],
                estPossessionOn: [new Date(this.property.estPossessionOn), Validators.required],
                gated: [this.property.gated ? 'true' : 'false'],
                mainEntrance: [this.property.mainEntrance],
                description: [this.property.description, Validators.required]
            })
        });
        this.initializeAutocomplete();
    }

    noDigitsOrNumbersValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const hasDigitsOrNumbers = /[0-9]/.test(control.value);
            return hasDigitsOrNumbers ? { 'noDigitsOrNumbers': true } : null;
        };
    }
    numericValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const valid = /^\d*\.?\d*$/.test(control.value);
            return valid ? null : { 'numeric': true };
        };
    }

    onSubmit() {
        if (this.editPropertyForm.valid) {
            this.store.alertifyService.success('Property Updated');
            this.store.housingService.updateProperty(this.propertyId, this.property).subscribe(() => {
                this.dialogRef.close(this.property);
            });
        }
    }

    onCityChange(cityName: string, cityId: number) {
        const cityArray: string[] = cityName.split(',');
        this.property.city = cityArray[0];
        this.property.country = cityArray[1];
        this.property.cityId = cityId;
        console.log('Property : ');
        console.log(this.property);
        console.log('Unmodified Property : ');
        console.log(this.unmodifiedProperty);
    }

    openMapsModal() {
        this.dialogMaps.open(PropertyDetailMapsPopupComponent, {
            width: '600px',
            height: '600px',
            data: {
                latitude: this.latitude,
                longitude: this.longitude,
                address: this.address,
                mapZoom: 15
            },
        });
    }

    initializeAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('placesAutocomplete') as HTMLInputElement,
            {
                types: ['geocode'],
                componentRestrictions: { 'country': ['AU', 'RO', 'IN', 'US', 'DE'] },
                fields: ['place_id', 'geometry', 'name'],
            }
        );
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                this.latitude.setValue(lat);
                this.longitude.setValue(lng);
                this.reverseGeocode(lat, lng);
            }
        });
    }

    reverseGeocode(lat: number, lng: number) {
        const latlng = new google.maps.LatLng(lat, lng);
        this.geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                this.address.setValue(address);
                this.property.address = this.address.value;
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }
}
