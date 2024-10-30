import { Component, OnInit } from '@angular/core';
import { Property } from '../../models/Property.interface';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { StoreService } from '../../store_services/store.service';
import { MatDialog } from '@angular/material/dialog';
import { PropertyDetailPopupMessageComponent } from '../property-detail-popup-message/property-detail-popup-message.component';

@Component({
    selector: 'app-property-detail-reader',
    templateUrl: './property-detail-reader.component.html',
    styleUrls: ['../property-detail-admin/property-detail-admin.component.css']
})
export class PropertyDetailReaderComponent implements OnInit {


    public propertyId: number;
    property = new Property();

    originalFolder: string = environment.originalPictureFolder;
    thumbnailFolder: string = environment.thumbnailFolder;
    galleryImages: GalleryItem[];
    age: string;
    nameId: string;
    constructor(private dialogRef: MatDialog, private store: StoreService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];
        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });
        this.age = this.store.housingService.getPropertyAge(this.property.estPossessionOn);
        this.galleryImages = this.getPropertyPhotos();
        this.nameId = this.store.authService.decodeToken()?.nameid as string;

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

    openMessagesModal() {
        if (localStorage && !localStorage.getItem('token')) {
            this.router.navigate(['user/login']);
            this.store.alertifyService.error("You must log in before sending messages");
            return;
        }

        this.dialogRef.open(PropertyDetailPopupMessageComponent, {
            width: '600px',
            height: '800px',
            data: {
                'postedBy': this.property.postedBy
            }
        });


    }


    likeProperty() {
        console.log("Property Liked From Reader");
    }
}
