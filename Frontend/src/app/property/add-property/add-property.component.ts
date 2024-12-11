/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit, ViewChild } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IPropertyBase } from '../../models/IPropertyBase.interface';
import { IKeyValuePair } from '../../models/IKeyValuePair';
import { ICity } from '../../models/ICity.interface';
import { StoreService } from '../../store_services/store.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-add-property',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.css'],
})
export class AddPropertyComponent implements OnInit {

    @ViewChild('formTabs', { static: false }) formTabs: TabsetComponent;
    addPropertyForm: FormGroup;
    property: FormData = new FormData();

    nextClicked: boolean;


    propertyTypes: IKeyValuePair[];
    furnishTypes: IKeyValuePair[];
    cityList: ICity[];

    FilteredPlaces: string[] = [];


    mapCenter: google.maps.LatLngLiteral = { lat: 44.85454389856495, lng: 24.871015675879697 };
    mapZoom = 10;
    markerPosition: google.maps.LatLngLiteral = this.mapCenter;
    advancedMarker: google.maps.marker.AdvancedMarkerElementOptions;
    geocoder = new google.maps.Geocoder();

    propertyView: IPropertyBase = {
        id: 0,
        name: null,
        price: null,
        sellRent: null,
        propertyType: null,
        furnishingType: null,
        bhk: null,
        city: null,
        country: null,
        builtArea: null,
        carpetArea: null,
        readyToMove: false,
        photo: '',
    };

    constructor(
        //private datePipe: DatePipe,
        private store: StoreService,
        private fb: FormBuilder,
        private router: Router,
        private datePipe: DatePipe,
        private http: HttpClient
    ) { }

    get BasicInfo() {
        return this.addPropertyForm.controls['BasicInfo'] as FormGroup;
    }

    get PriceInfo() {
        return this.addPropertyForm.controls['PriceInfo'] as FormGroup;
    }

    get AddressInfo() {
        return this.addPropertyForm.controls['AddressInfo'] as FormGroup;
    }

    get OtherInfo() {
        return this.addPropertyForm.controls['OtherInfo'] as FormGroup;
    }

    get PhotosInfo() {
        return this.addPropertyForm.controls['PhotosInfo'] as FormGroup;
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

    get price() {
        return this.PriceInfo.controls['price'] as FormControl;
    }

    get builtArea() {
        return this.PriceInfo.controls['builtArea'] as FormControl;
    }

    get carpetArea() {
        return this.PriceInfo.controls['carpetArea'] as FormControl;
    }

    get security() {
        return this.PriceInfo.controls['security'] as FormControl;
    }

    get maintenance() {
        return this.PriceInfo.controls['maintenance'] as FormControl;
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

    get readyToMove() {
        return this.OtherInfo.controls['readyToMove'] as FormControl;
    }

    get estPossessionOn() {
        return this.OtherInfo.controls['estPossessionOn'] as FormControl;
    }

    get age() {
        return this.OtherInfo.controls['age'] as FormControl;
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

    get photos() {
        return this.PhotosInfo.controls['photos'] as FormControl;
    }

    ngOnInit() {
        this.CreateAddPropertyForm();
        this.store.housingService.getAllCities().subscribe((data) => {
            this.cityList = data;
        });

        this.store.housingService.getPropertyTypes().subscribe((data) => {
            this.propertyTypes = data;
        });

        this.store.housingService.getFurnishingTypes().subscribe((data) => {
            this.furnishTypes = data;
        });

        this.sellRent.valueChanges.subscribe((value) => {
            if (value === '2') {
                this.updateRentValidators();
            } else {
                this.updateSellValidators();
            }


        });

        this.initializeAutocomplete();
    }

    CreateAddPropertyForm() {
        this.addPropertyForm = this.fb.group({
            BasicInfo: this.fb.group({
                sellRent: ['1', Validators.required],
                bhk: [null, Validators.required],
                propertyType: [null, Validators.required],
                furnishingType: [null, Validators.required],
                name: [null, [Validators.required, this.noDigitsOrNumbersValidator()]],
                city: [null, Validators.required],
            }),
            PriceInfo: this.fb.group({
                price: [null, [Validators.required, this.numericValidator()]],
                builtArea: [null, [Validators.required, Validators.min(1), Validators.max(500), this.numericValidator()]],
                carpetArea: [null, [Validators.required, Validators.min(1), Validators.max(500), this.numericValidator()]],
                security: [null],
                maintenance: [null],
            }),
            AddressInfo: this.fb.group({
                floorNo: [null, [Validators.required, this.numericValidator()]],
                totalFloors: [null, [Validators.required, this.numericValidator()]],
                address: [null, Validators.required],
                latitude: [null],
                longitude: [null],
                phoneNumber: [null, [Validators.required, this.numericValidator(), Validators.maxLength(15)]],
            }),

            OtherInfo: this.fb.group({
                readyToMove: [null, Validators.required],
                estPossessionOn: [null, Validators.required],
                age: [null],
                gated: [null, Validators.required],
                mainEntrance: [null, Validators.required],
                description: [null],
            }),
            PhotosInfo: this.fb.group({
                photos: [null, Validators.required]
            })
        });


    }

    updateRentValidators() {
        console.log("Rent Validators set");
        this.security.setValidators([
            Validators.required,
            this.numericValidator(),
            Validators.min(0)
        ]);
        this.maintenance.setValidators([
            Validators.required,
            this.numericValidator(),
            Validators.min(0)
        ]);

        this.security.updateValueAndValidity();
        this.maintenance.updateValueAndValidity();
    }

    updateSellValidators() {
        console.log("Sell Validators Set");
        this.security.clearValidators();
        this.maintenance.clearValidators();

        this.security.setValue(0);
        this.maintenance.setValue(0);

        this.security.updateValueAndValidity();
        this.maintenance.updateValueAndValidity();
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

    initializeAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete') as HTMLInputElement,
            {
                types: ['geocode'],
                componentRestrictions: { 'country': ['AU', 'RO', 'IN', 'US', 'DE'] },
                fields: ['place_id', 'geometry', 'name']
            }
        );
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                this.latitude.setValue(lat);
                this.longitude.setValue(lng);
                this.mapCenter = { lat, lng };
                this.markerPosition = { lat, lng };
                this.mapZoom = 17;
                this.reverseGeocode(lat, lng);
            }
        });
    }

    onMapClick(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
        if (event.latLng) {
            this.markerPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            this.latitude.setValue(this.markerPosition.lat);
            this.longitude.setValue(this.markerPosition.lng);
            this.mapCenter = this.markerPosition;
            this.reverseGeocode(event.latLng.lat(), event.latLng.lng());
        }
    }

    reverseGeocode(lat: number, lng: number) {
        const latlng = new google.maps.LatLng(lat, lng);
        this.geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                this.address.setValue(address);
            } else {
                console.error('Geocoder failed due to: ' + status);
            }
        });
    }

    onBack() {
        this.router.navigate(['/']);
    }

    onSubmit() {
        this.nextClicked = true;
        if (this.allTabsValid()) {
            this.mapProperty();
            this.store.housingService.addProperty(this.property).subscribe(() => {
                this.store.alertifyService.success("Your Property Listed Successfully");
                if (this.sellRent.value === '2') {
                    this.router.navigate(['/rent-property']);
                } else {
                    this.router.navigate(['/']);
                }
            })

        } else {
            this.store.alertifyService.error('Please review the form and provide all valid entries');
        }
    }

    mapProperty(): void {

        const { sellRent, bhk, propertyType, furnishingType, name, city } = this.BasicInfo.value;
        this.property.set("sellRent", sellRent);
        this.property.set("bhk", bhk);
        this.property.set("propertyTypeId", propertyType);
        this.property.set("furnishingTypeId", furnishingType);
        this.property.set("name", name);
        this.property.set("cityId", city);
        const { price, builtArea, carpetArea } = this.PriceInfo.value;
        this.property.set("price", price);

        if (sellRent === '2') {
            const { security, maintenance } = this.PriceInfo.value;
            this.property.set("security", security);
            this.property.set("maintenance", maintenance);
        }



        this.property.set("builtArea", builtArea);
        this.property.set("carpetArea", carpetArea);
        const { floorNo, totalFloors, phoneNumber, latitude, longitude, address } = this.AddressInfo.value;
        this.property.set("floorNo", floorNo);
        this.property.set("totalFloors", totalFloors);
        this.property.set("phoneNumber", phoneNumber);



        this.property.set("latitude", latitude); 
        this.property.set("longitude", longitude);

        console.log("Latitude AFTER :", this.property.get("latitude"));
        console.log("Longitude AFTER :", this.property.get("longitude"));
        this.property.set("address", address);
        const { readyToMove, estPossessionOn, gated, mainEntrance, description } = this.OtherInfo.value;
        this.property.set("readyToMove", readyToMove);
        this.property.set("estPossessionOn", this.datePipe.transform(estPossessionOn, 'yyyy-MM-dd') as string);
        this.property.set("gated", gated);
        this.property.set("mainEntrance", mainEntrance);
        this.property.set("description", description);


    }


    allTabsValid(): boolean {
        if (this.BasicInfo.invalid) {
            this.formTabs.tabs[0].active = true;
            return false;
        }

        if (this.PriceInfo.invalid) {
            this.formTabs.tabs[1].active = true;
            return false;
        }

        if (this.AddressInfo.invalid) {
            this.formTabs.tabs[2].active = true;
            return false;
        }

        if (this.OtherInfo.invalid) {
            this.formTabs.tabs[3].active = true;
            return false;
        }
        if (this.PhotosInfo.invalid) {
            this.formTabs.tabs[4].active = true;
            return false;
        }


        return true;
    }

    selectTab(tabId: number, isCurrentTabValid: boolean) {
        this.nextClicked = true;
        if (isCurrentTabValid) {
            this.formTabs.tabs[tabId].active = true;
        }
    }

    onPhotoSelected(event: any) {
        const files: FileList = event.target.files;
        this.property.delete("files");

        for (let i = files.length - 1; i >= 0; i--) {
            const file = files[i];
            this.property.append("files", file);

            if (i === files.length - 1) {
                this.getDataURL(file).then((result) => {
                    this.propertyView.photo = result;
                });
            }

        }



    }


    getDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {

                resolve(event.target?.result as string);
            };
            reader.onerror = (event) => {
                reject(event.target?.error);
            };
            reader.readAsDataURL(file);
        });
    }

    updateCityAndCountry(selectedText: string) {
        // Check if the input is valid
        if (!selectedText || !selectedText.includes(',')) {
          console.error('Invalid city and country format.');
          alert('Please select a valid city and country from the list.');
          return;
        }
      
        // Split the input into city and country
        const [city, country] = selectedText.split(',').map(item => item.trim());
        this.propertyView.city = city;
        this.propertyView.country = country;
      
        // Validate that the city and country exist in the predefined list
        if (!this.cityList.some(c => c.name === city && c.country === country)) {
          console.error('Selected city and country not found in the list.');
          alert('The selected city and country are not valid.');
          return;
        }
      
        // Create the API request URL
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          city + ', ' + country
        )}&key=${environment.googleKey}`;
      
        // Call the Google Maps Geocoding API
        this.http.get(url).subscribe(
          (response: any) => {
            if (response.status === 'OK' && response.results.length > 0) {
              // Extract the latitude and longitude
              const location = response.results[0].geometry.location;
              this.mapCenter = { lat: location.lat, lng: location.lng };
              this.markerPosition = this.mapCenter;
              console.log(`Coordinates: Latitude ${location.lat}, Longitude ${location.lng}`);
            } else {
              console.error('Geocoding API error:', response.status);
              alert('Could not find location. Please check the city and country.');
            }
          },
          (error) => {
            console.error('API request error:', error);
            alert('Error connecting to the geocoding service. Please try again later.');
          }
        );
      }
      
      




}
