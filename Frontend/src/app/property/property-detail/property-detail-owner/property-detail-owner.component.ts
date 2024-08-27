import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../../model/Property.interface';
import { environment } from '../../../../environments/environment';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { HousingService } from '../../../services/housing.service';

@Component({
    selector: 'app-property-detail-owner',
    templateUrl: './property-detail-owner.component.html',
    styleUrls: ['../property-detail-admin/property-detail.component.css']
})
export class PropertyDetailOwnerComponent implements OnInit {

    public propertyId: number;
    property = new Property();

    originalFolder: string = environment.originalPictureFolder;
    thumbnailFolder: string = environment.thumbnailFolder;
    galleryImages: GalleryItem[];

    constructor(private route: ActivatedRoute
        , private housingService: HousingService
    ) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];

        this.route.data.subscribe((data) => {
            this.property = data['property'];
            console.log(data);
        });
        this.property.age = this.housingService.getPropertyAge(this.property.estPossessionOn);
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

}
