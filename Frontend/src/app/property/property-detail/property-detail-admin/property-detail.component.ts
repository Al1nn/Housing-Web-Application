import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../../model/Property.interface';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PropertyDetailDeletePopupComponent } from './property-detail-delete-popup/property-detail-delete-popup.component';
import { PropertyDetailEditPopupComponent } from './property-detail-edit-popup/property-detail-edit-popup.component';
import { HousingService } from '../../../services/housing.service';


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


    galleryImages: GalleryItem[];
    originalFolder: string = environment.originalPictureFolder;
    thumbnailFolder: string = environment.thumbnailFolder;
    age: string;
    constructor(
        private housingService: HousingService
        , private route: ActivatedRoute
        , private dialogRef: MatDialog
    ) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];

        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });
        this.age = this.housingService.getPropertyAge(this.property.estPossessionOn);
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
        const dialogRef = this.dialogRef.open(PropertyDetailEditPopupComponent, {
            width: '650px',
            height: '800px',
            data: {
                propertyId: this.propertyId,
                property: this.property,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.property = result;
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
