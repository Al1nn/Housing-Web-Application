import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { HousingService } from '../../services/housing.service';
import { AuthService } from '../../services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertifyService } from '../../services/alertify.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IKeyValuePair } from '../../model/IKeyValuePair';
import { DatePipe } from '@angular/common';





@Component({
    selector: 'app-property-detail',
    templateUrl: './property-detail.component.html',
    styleUrls: ['./property-detail.component.css'],
})
export class PropertyDetailComponent implements OnInit {
    [x: string]: any;
    @ViewChild('editFormTabs', { static: false }) formTabs: TabsetComponent;
    editPropertyForm: FormGroup;

    public propertyId: number;
    public mainPhotoUrl: string;
    property = new Property();

    propertyTypes: IKeyValuePair[];
    furnishTypes: IKeyValuePair[];
    cityList: any[];

    estPossessionOnDate: Date;
    propertyTypeId: number = 0;
    furnishTypeId: number = 0;
    estPossessionOnFormatted: string;

    galleryImages: GalleryItem[];
    modalRef: BsModalRef;

    isAdmin: boolean = false;


    constructor(private authService: AuthService
        , private housingService: HousingService
        , private route: ActivatedRoute
        , private modalService: BsModalService
        , private alertifyService: AlertifyService
        , private datePipe: DatePipe
        , private fb: FormBuilder
        , private router: Router) { }

    get BasicInfo() {
        return this.editPropertyForm.controls['BasicInfo'] as FormGroup;
    }

    get PriceInfo() {
        return this.editPropertyForm.controls['PriceInfo'] as FormGroup;
    }

    get AddressInfo() {
        return this.editPropertyForm.controls['AddressInfo'] as FormGroup;
    }

    get OtherInfo() {
        return this.editPropertyForm.controls['OtherInfo'] as FormGroup;
    }

    get name() {
        return this.BasicInfo.controls['name'] as FormControl;
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

    get gated() {
        return this.OtherInfo.controls['gated'] as FormControl;
    }

    get mainEntrance() {
        return this.OtherInfo.controls['mainEntrance'] as FormControl;
    }

    get description() {
        return this.OtherInfo.controls['description'] as FormControl;
    }

    priceIsNaN() {
        return isNaN(this.property.price);
    }

    securityIsNaN() {
        return isNaN(this.property.security as number);
    }

    maintenanceIsNaN() {
        return isNaN(this.property.maintenance as number);
    }

    builtAreaIsNaN() {
        return isNaN(this.property.builtArea);
    }

    carpetAreaIsNaN() {
        return isNaN(this.property.carpetArea);
    }


    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];

        this.route.data.subscribe((data) => {
            this.property = data['property'];
            console.log(this.property.photos);
        });

        this.housingService.getPropertyTypes().subscribe((data) => {
            this.propertyTypes = data;
        });

        this.housingService.getFurnishingTypes().subscribe((data) => {
            this.furnishTypes = data;
        });

        this.housingService.getAllCities().subscribe((data) => {
            this.cityList = data;
        });

        this.property.age = this.housingService.getPropertyAge(this.property.estPossessionOn);


        this.galleryImages = this.getPropertyPhotos();

        var username = localStorage.getItem('username') as string;


        if (username !== null) {
            this.authService.isAdmin(username).subscribe((data) => {
                this.isAdmin = data;
            });
        }



    }



    handleLogic() {
        switch (this.property.propertyType) {
            case 'House':
                this.propertyTypeId = 1;
                break;
            case 'Apartment':
                this.propertyTypeId = 2;
                break;
            case 'Duplex':
                this.propertyTypeId = 3;
                break;
            default:
                this.propertyTypeId = -1;
                break;
        }

        switch (this.property.furnishingType) {
            case 'Fully':
                this.furnishTypeId = 1;
                break;
            case 'Semi':
                this.furnishTypeId = 2;
                break;
            case 'Unfurnished':
                this.furnishTypeId = 3;
                break;
            default:
                this.furnishTypeId = -1;
                break;
        }



        this.estPossessionOnDate = new Date(this.property.estPossessionOn);

    }
    CreateEditForm() {
        //Handle the different components data.
        this.handleLogic();


        this.editPropertyForm = this.fb.group({
            BasicInfo: this.fb.group({
                sellRent: [this.property.sellRent.toString()],
                bhk: [this.property.bhk],
                propertyType: [this.propertyTypeId],
                furnishingType: [this.furnishTypeId],
                name: [this.property.name, Validators.required],
                city: [this.property.cityId]
            }),
            PriceInfo: this.fb.group({
                price: [this.property.price, Validators.required],
                security: [this.property.security, Validators.required],
                maintenance: [this.property.maintenance, Validators.required],
                builtArea: [this.property.builtArea, Validators.required],
                carpetArea: [this.property.carpetArea, Validators.required]
            }),
            AddressInfo: this.fb.group({
                floorNo: [this.property.floorNo, Validators.required],
                totalFloors: [this.property.totalFloors, Validators.required],
                landMark: [this.property.landMark, Validators.required],
                address: [this.property.address, Validators.required],
                phoneNumber: [this.property.phoneNumber, Validators.required]
            }),
            OtherInfo: this.fb.group({
                readyToMove: [this.property.readyToMove ? "true" : "false"],
                estPossessionOn: [this.estPossessionOnDate],
                gated: [this.property.gated ? "true" : "false"],
                mainEntrance: [this.property.mainEntrance],
                description: [this.property.description, Validators.required]
            })
        });


    }



    changePrimaryPhoto(mainPhotoUrl: string) {
        this.mainPhotoUrl = mainPhotoUrl;
    }

    updateGalleryImages() {
        this.galleryImages = this.getPropertyPhotos();
    }

    getPhotosCount(): number {
        return this.property.photos.filter(photo => !photo.isPrimary).length;
    }


    getPropertyPhotos(): GalleryItem[] {
        const photoUrls: GalleryItem[] = [];
        for (const photo of this.property.photos) {
            if (photo.isPrimary) this.mainPhotoUrl = photo.imageUrl;
            else {
                photoUrls.push({
                    src: photo.imageUrl,
                    thumbSrc: photo.imageUrl
                })
            }
        }

        return photoUrls;
    }

    openModal(modalName: string, template: TemplateRef<any>) {
        if (modalName === 'editModal') {
            console.log("In edit modal");

            this.CreateEditForm();
            this.modalRef = this.modalService.show(template);
            return;
        }

        console.log('In delete modal');
        this.modalRef = this.modalService.show(template);
    }



    deleteProperty(propId: number) {
        console.log(propId);

        //Call the API Endpoint
        this.housingService.deleteProperty(this.propertyId).subscribe(
            () => {
                console.log("Deleted successfully");

                if (this.property.sellRent === 2) {
                    this.router.navigate(['/rent-property']);
                    this.modalRef.hide();
                } else if (this.property.sellRent === 1) {
                    this.router.navigate(['/']);
                    this.modalRef.hide();
                }
                this.alertifyService.success('Property Deleted !');
            },
            (error) => {
                console.error(error);
            }
        );

    }

    mapProperty(): void {
        this.property.estPossessionOn = this.datePipe.transform(this.estPossessionOn.value, 'MM/dd/yyyy') as string;
    }


    onSubmit() {
        if (this.editPropertyForm.valid) {
            this.mapProperty();
            console.log(this.property);
            this.modalRef.hide();
        }

    }
}
