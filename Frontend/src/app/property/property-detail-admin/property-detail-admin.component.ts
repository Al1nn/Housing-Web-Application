import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/Property.interface';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PropertyDetailDeletePopupComponent } from './property-detail-delete-popup/property-detail-delete-popup.component';
import { PropertyDetailEditPopupComponent } from './property-detail-edit-popup/property-detail-edit-popup.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { StoreService } from '../../store_services/store.service';
import { PropertyDetailPopupMessageComponent } from '../property-detail-popup-message/property-detail-popup-message.component';

@Component({
    selector: 'app-property-detail-admin',
    templateUrl: './property-detail-admin.component.html',
    styleUrls: ['./property-detail-admin.component.css'],
})
@AutoUnsubscribe()
export class PropertyDetailAdminComponent implements OnInit, OnDestroy {


    @ViewChild('editFormTabs', { static: false }) formTabs: TabsetComponent;
    editPropertyForm: FormGroup;

    public propertyId: number;

    public mainPhotoUrl: string;
    property = new Property();


    galleryImages: GalleryItem[];
    originalFolder: string = environment.originalPictureFolder;
    thumbnailFolder: string = environment.thumbnailFolder;
    age: string;
    nameId: string;
    isLiked: boolean = false;

    constructor(
        private store: StoreService
        , private route: ActivatedRoute
        , private dialogRef: MatDialog
    ) { }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnDestroy(): void {

    }


    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];
        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });
        this.age = this.store.housingService.getPropertyAge(this.property.estPossessionOn);
        this.galleryImages = this.getPropertyPhotos();
        this.nameId = this.store.authService.decodeToken()?.nameid as string;

        this.store.housingService.isPropertyLiked(this.propertyId).subscribe(data => {
            this.isLiked = data;
        });

    }

    onMainPhotoChanged($event: string) {
        this.galleryImages.length = this.getPropertyPhotos().length;
        this.galleryImages = this.getPropertyPhotos();
        this.property.photo = $event;
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

    openMessagesModal() {
        this.dialogRef.open(PropertyDetailPopupMessageComponent, {
            width: '600px',
            height: '800px',
            data: {
                'postedBy': this.property.postedBy
            }
        });
    }

    likeProperty() {
        this.isLiked = !this.isLiked;

        if (this.isLiked) {
            this.store.housingService.likeProperty(this.propertyId).subscribe(() => {
                this.property.likes += 1;
            });

        } else {
            this.store.housingService.unlikeProperty(this.propertyId).subscribe(() => {
                this.property.likes -= 1;
            });
        }

       
    }

}
