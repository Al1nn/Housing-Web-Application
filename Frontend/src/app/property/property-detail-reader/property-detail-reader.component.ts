import { Component, OnInit } from '@angular/core';
import { Property } from '../../model/Property.interface';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { StoreService } from '../../store_services/store.service';

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
    constructor(private store: StoreService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];
        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });
        this.age = this.store.housingService.getPropertyAge(this.property.estPossessionOn);
        this.galleryImages = this.getPropertyPhotos();
        console.log(this.store.authService.isAuthenticated());

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
        throw new Error('Method not implemented.');
    }

}
