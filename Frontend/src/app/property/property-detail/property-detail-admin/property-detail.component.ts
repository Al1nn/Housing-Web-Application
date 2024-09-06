import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../../model/Property.interface';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { HousingService } from '../../../services/housing.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormGroup } from '@angular/forms';
import { IKeyValuePair } from '../../../model/IKeyValuePair';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PropertyDetailDeletePopupComponent } from './property-detail-delete-popup/property-detail-delete-popup.component';
import { PropertyDetailEditPopupComponent } from './property-detail-edit-popup/property-detail-edit-popup.component';


@Component({
    selector: 'app-property-detail-admin',
    templateUrl: './property-detail.component.html',
    styleUrls: ['./property-detail.component.css'],
})
export class PropertyDetailAdminComponent implements OnInit {
    @ViewChild('editFormTabs', { static: false }) formTabs: TabsetComponent;
    editPropertyForm: FormGroup;

    public propertyId: number;

    public mainPhotoUrl: string;
    property = new Property();
    propertyDetail = new Property();

    propertyTypes: IKeyValuePair[];
    furnishTypes: IKeyValuePair[];
    cityList: any[];

    estPossessionOnDate: Date;
    propertyTypeId = 0;
    furnishTypeId = 0;
    estPossessionOnFormatted: string;

    galleryImages: GalleryItem[];
    modalRefMap: BsModalRef;
    modalRefDelete: BsModalRef;
    modalRefEdit?: BsModalRef;
    originalFolder: string = environment.originalPictureFolder;
    thumbnailFolder: string = environment.thumbnailFolder;

    constructor(private housingService: HousingService
        , private route: ActivatedRoute
        , private dialogRef: MatDialog
    ) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];

        this.route.data.subscribe((data) => {
            this.property = data['property'];

        });

        this.housingService.getPropertyById(this.propertyId).subscribe(
            (data) => {
                this.propertyDetail = data;

            }
        );

        this.property.age = this.housingService.getPropertyAge(this.property.estPossessionOn);
        this.galleryImages = this.getPropertyPhotos();
    }

    onMainPhotoChanged(_$event: string) {
        this.galleryImages.length = this.getPropertyPhotos().length;
        this.galleryImages = this.getPropertyPhotos();
    }
    getPropertyPhotos(): GalleryItem[] {
        const photoUrls: GalleryItem[] = [];
        if (this.property.photos !== undefined) {
            for (let i = 0; i < this.property.photos.length; i++) {
                if (i === 0) {
                    continue;
                }
                const photo = this.property.photos[i];
                photoUrls.push({
                    src: this.thumbnailFolder + photo.fileName,
                    thumbSrc: this.thumbnailFolder + photo.fileName
                });
            }
        }
        return photoUrls;
    }

    openEditModal() {
        this.dialogRef.open(PropertyDetailEditPopupComponent, {
            width: '650px',
            height: '800px',
            data: {
                propertyId: this.propertyId,
                property: this.property,
                propertyTypes: this.propertyTypes
            }
        });
    }

    openDeleteModal() {
        this.dialogRef.open(PropertyDetailDeletePopupComponent, {
            width: '300px',
            height: '300px',
            data: {
                propertyId: this.propertyId,
                sellRent: this.property.sellRent
            }
        });
    }
}
