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
import { IPhoto } from '../../model/IPhoto';






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
    // This later will come from the database
    propertyTypes: IKeyValuePair[];
    furnishTypes: IKeyValuePair[];
    cityList: any[];
    thumbnails: IPhoto[];
    originalSizes: IPhoto[];
    originalSizesString: string | null;
    thumbnailsString: string | null;
    imagesData = new FormData();

    firstImageView: string | ArrayBuffer;

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

    get PhotosInfo() {
        return this.addPropertyForm.controls['PhotosInfo'] as FormControl;
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


    ngOnInit() {
        if (localStorage !== undefined) {
            if (!localStorage.getItem('username')) {
                this.alertifyService.error("You must be logged in to add a property");
                this.router.navigate(['/user/login']);
            }
            this.CreateAddPropertyForm();
            this.housingService.getAllCities().subscribe((data) => {
                this.cityList = data;
            });

            this.housingService.getPropertyTypes().subscribe((data) => {
                this.propertyTypes = data;
            });

            this.housingService.getFurnishingTypes().subscribe((data) => {
                this.furnishTypes = data;
            });

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
                carpetArea: [null, Validators.required],
                security: [0],
                maintenance: [0],
            }),
            AddressInfo: this.fb.group({
                floorNo: [null, Validators.required],
                totalFloors: [null, Validators.required],
                landMark: [null, Validators.required],
                address: [null, Validators.required],
                phoneNumber: [null, Validators.required],
            }),

            OtherInfo: this.fb.group({
                readyToMove: [null, Validators.required],
                estPossessionOn: [null, Validators.required],
                age: [null],
                gated: [null, Validators.required],
                mainEntrance: [null, Validators.required],
                description: [null],
            }),
            PhotosInfo: ['', [Validators.required]]
        });
    }

    onBack() {
        this.router.navigate(['/']);
    }

    onSubmit() { //Aici se apeleaza dupa ce apas pe save 
        this.nextClicked = true;
        if (this.allTabsValid()) {
            this.mapProperty();
            this.housingService.addProperty(this.property).subscribe(
                () => {
                    this.uploadPropertyPhotos(this.property.id, this.imagesData);


                }
            );




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

        this.property.address = this.address.value;
        this.property.phoneNumber = this.phoneNumber.value;

        this.property.readyToMove = this.readyToMove.value;
        this.property.gated = this.gated.value;
        this.property.mainEntrance = this.mainEntrance.value;
        this.property.estPossessionOn = this.datePipe.transform(this.estPossessionOn.value, 'MM/dd/yyyy') as string;
        this.property.description = this.description.value;



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

    async onPhotoSelected(event: any) { //Se apeleaza de la input type file 

        const files: FileList = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const originalUrl = await this.getDataURL(file);
            if (i == 0) {
                this.propertyView.photo = originalUrl;
            }
            const thumbnail = await this.rescaleImage(originalUrl, file.name);
            this.imagesData.append("originalFiles", file);
            this.imagesData.append("thumbnailFiles", thumbnail);
        }

    }

    uploadPropertyPhotos(propertyId: number, formData: FormData) { // Transmite datele
        this.housingService.addPropertyPhotos(propertyId, formData).subscribe(
            response => {
                console.log(`Photos added successfully:`, response);

                console.log(this.addPropertyForm);

                if (this.sellRent.value === '2') {
                    this.router.navigate(['/rent-property']);
                } else {
                    this.router.navigate(['/']);
                }

                this.alertifyService.success('Congrats, your property listed successfully on our website');
            }, error => {
                console.log("Error adding photo", error);
            }
        );
    }


    rescaleImage(imageUrl: string, fileName: string): Promise<File> { //Rescalare de imagine, vine in thumbnail
        return new Promise((resolve, reject) => {
            const maxSizeInMB = 4;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageUrl;
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext('2d');
                const width = img.width;
                const height = img.height;
                const aspectRatio = width >= height ? width / height : height / width;
                const newWidth = Math.sqrt(maxSizeInBytes * aspectRatio);
                const newHeight = Math.sqrt(maxSizeInBytes / aspectRatio);
                canvas.width = newWidth;
                canvas.height = newHeight;
                if (ctx !== null) {
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);
                }
                canvas.toBlob(
                    (blob) => {
                        if (blob !== null) {
                            const thumbnailFileName = fileName.replace(/\.[^/.]+$/, '') + '_thumbnail.jpg';
                            const file = new File([blob], thumbnailFileName, { type: blob.type });
                            resolve(file);
                        } else {
                            reject("Failed to create blob from canvas");
                        }
                    }
                    , 'image/jpeg'
                    , 0.8
                );

            };
            img.onerror = function (error) {
                reject(error);
            };
        });
    }

    getDataURL(file: File): Promise<string> { // Am luat URL-ul de la originalSize
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


}
