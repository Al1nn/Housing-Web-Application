import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/Property.interface';
import { environment } from '../../../environments/environment';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { StoreService } from '../../store_services/store.service';
import { MatDialog } from '@angular/material/dialog';
import { PropertyDetailPopupMessageComponent } from '../property-detail-popup-message/property-detail-popup-message.component';

@Component({
    selector: 'app-property-detail-owner',
    templateUrl: './property-detail-owner.component.html',
    styleUrls: ['../property-detail-admin/property-detail-admin.component.css']
})
export class PropertyDetailOwnerComponent implements OnInit {


    public propertyId: number;
    property = new Property();

    originalFolder: string = environment.originalPictureFolder;
    thumbnailFolder: string = environment.thumbnailFolder;
    galleryImages: GalleryItem[];
    age: string;
    nameId: string;
    isLiked: boolean = false;

    constructor(private dialogRef: MatDialog, private store: StoreService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];
        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });
        this.age = this.store.housingService.getPropertyAge(this.property.estPossessionOn);
        this.nameId = this.store.authService.decodeToken()?.nameid as string;
        this.galleryImages = this.getPropertyPhotos();

        this.store.housingService.isPropertyLiked(this.propertyId).subscribe(data => {
            this.isLiked = data;
        });
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

    onMainPhotoChanged($event: string) {
        this.galleryImages.length = this.getPropertyPhotos().length;
        this.galleryImages = this.getPropertyPhotos();
        this.property.photo = $event;
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
