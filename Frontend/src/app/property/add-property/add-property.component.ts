import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IPropertyBase } from '../../model/IPropertyBase.interface';
import { Property } from '../../model/Property.interface';
import { HousingService } from '../../services/housing.service';
import { AlertifyService } from '../../services/alertify.service';
import { IKeyValuePair } from '../../model/IKeyValuePair';
import { DatePipe } from '@angular/common';
import { Contact } from '../../model/Contact.interface';



@Component({
    selector: 'app-add-property',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.css'],
})
export class AddPropertyComponent implements OnInit {

    @ViewChild('formTabs', { static: false }) formTabs: TabsetComponent;
    addPropertyForm: FormGroup;
    nextClicked: boolean;
    contactAdded = false;
    property = new Property();
    contact = new Contact();
    // This later will come from the database
    propertyTypes: IKeyValuePair[];
    furnishTypes: IKeyValuePair[];
    cityList: any[];
    //thumbnails: IPhoto[] | null;
    //originalSizes: IPhoto[] | null;
    originalSizesString: string | null;
    thumbnailsString: string | null;

    propertyView: IPropertyBase = {
        id: 0,
        name: null,
        price: null,
        sellRent: null,
        propertyType: null,
        furnishingType: null,
        bhk: null,
        city: null,
        builtArea: null,
        carpetArea: null,
        readyToMove: false,
        photo: '',
    };

    constructor(
        private datePipe: DatePipe,
        private alertifyService: AlertifyService,
        private housingService: HousingService,
        private fb: FormBuilder,
        private router: Router
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


    get landMark() {
        return this.AddressInfo.controls['landMark'] as FormControl;
    }

    get address() {
        return this.AddressInfo.controls['address'] as FormControl;
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


    async onPhotoSelected(event: any) {
        await this.housingService.photosSelected(event);



        this.thumbnailsString = this.housingService.getThumbnails();
        this.originalSizesString = this.housingService.getOriginalSizePhotos();

        console.log('THUMBNAILS : \n');
        console.log(this.thumbnailsString);
        console.log('\n');
        console.log('ORIGINAL SIZES : \n');
        console.log(this.originalSizesString);
    }

    deletePhoto(_photoIndex: number) {

    }

    setPrimaryPhoto(_photoIndex: number) {

    }


    ngOnInit() {
        if (localStorage !== undefined) {
            if (!localStorage.getItem('username')) {
                this.alertifyService.error("You must be logged in to add a property");
                this.router.navigate(['/user/login']);
            }
            this.CreateAddPropertyForm();
            this.housingService.getAllCities().subscribe((data) => {
                this.cityList = data;
                console.log(data);
            });

            this.housingService.getPropertyTypes().subscribe((data) => {
                this.propertyTypes = data;
            });

            this.housingService.getFurnishingTypes().subscribe((data) => {
                this.furnishTypes = data;
            });

            if (localStorage.getItem('AppConfig/originalSizes') || localStorage.getItem('AppConfig/thumbnails')) {
                this.housingService.clearPhotoStorage();
            }
        }

    }

    CreateAddPropertyForm() {
        this.addPropertyForm = this.fb.group({
            BasicInfo: this.fb.group({
                sellRent: ['1', Validators.required],
                bhk: [null, Validators.required],
                propertyType: [null, Validators.required],
                furnishingType: [null, Validators.required],
                name: [null, Validators.required],
                city: [null, Validators.required],
            }),
            PriceInfo: this.fb.group({
                price: [null, Validators.required],
                builtArea: [null, Validators.required],
                carpetArea: [null],
                security: [0],
                maintenance: [0],
            }),
            AddressInfo: this.fb.group({
                floorNo: [null],
                totalFloors: [null],
                landMark: [null],
                address: [null, Validators.required],
                phoneNumber: [null, Validators.required],
            }),

            OtherInfo: this.fb.group({
                readyToMove: [null, Validators.required],
                estPossessionOn: [null, Validators.required],
                age: [null],
                gated: [null],
                mainEntrance: [null],
                description: [null],
            }),

        });
    }

    onBack() {
        this.router.navigate(['/']);
    }

    onSubmit() {
        this.nextClicked = true;
        if (this.allTabsValid()) {
            this.mapProperty();
            this.housingService.addProperty(this.property).subscribe(
                () => {
                    this.alertifyService.success('Congrats, your property listed successfully on our website');
                    console.log(this.addPropertyForm);

                    if (this.sellRent.value === '2') {
                        this.router.navigate(['/rent-property']);
                    } else {
                        this.router.navigate(['/']);
                    }
                }
            );
            //Call API Endpoint for the added photos


        } else {
            this.alertifyService.error('Please review the form and provide all valid entries');
        }
    }

    mapProperty(): void {

        this.property.id = this.housingService.newPropID();
        this.property.sellRent = +this.sellRent.value;
        this.property.bhk = this.bhk.value;
        this.property.propertyTypeId = this.propertyType.value;
        this.property.name = this.name.value;
        this.property.cityId = this.city.value;
        this.property.furnishingTypeId = this.furnishingType.value;
        this.property.price = this.price.value;
        this.property.security = this.security.value;
        this.property.maintenance = this.maintenance.value;
        this.property.builtArea = this.builtArea.value;
        this.property.carpetArea = +this.carpetArea.value;
        this.property.floorNo = this.floorNo.value;
        this.property.totalFloors = this.totalFloors.value;
        this.property.landMark = this.landMark.value;
        this.contact.address = this.address.value;
        this.contact.phoneNumber = this.phoneNumber.value;

        this.property.contact = this.contact;

        this.property.readyToMove = this.readyToMove.value;
        this.property.gated = this.gated.value;
        this.property.mainEntrance = this.mainEntrance.value;
        this.property.estPossessionOn = this.datePipe.transform(this.estPossessionOn.value, 'MM/dd/yyyy') as string;
        this.property.description = this.description.value;
        this.property.photos = [];



        // Loop through the uploaded photos and add them to the property object

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
        return true;
    }

    selectTab(tabId: number, isCurrentTabValid: boolean) {
        this.nextClicked = true;
        if (isCurrentTabValid) {
            this.formTabs.tabs[tabId].active = true;
        }
    }





    // #region <Getter Methods>
    // #region <FormGroups>


    // #endregion

    // #region <Form Controls>





    // #endregion
    // #endregion
}
