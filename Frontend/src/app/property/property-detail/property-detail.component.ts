import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { HousingService } from '../../services/housing.service';



@Component({
    selector: 'app-property-detail',
    templateUrl: './property-detail.component.html',
    styleUrls: ['./property-detail.component.css'],
})
export class PropertyDetailComponent implements OnInit {
    public propertyId: number;
    public mainPhotoUrl: string;
    property = new Property();
    galleryImages: GalleryItem[];
    constructor(private housingService: HousingService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];

        this.route.data.subscribe((data) => {
            this.property = data['property'];
            console.log(this.property.photos);
        });



        this.property.age = this.housingService.getPropertyAge(this.property.estPossessionOn);

        // this.route.params.subscribe((params) => {
        //   this.propertyId = +params['id'];

        //   this.housingService.getPropertyById(this.propertyId).subscribe(
        //     (data: Property) => {
        //       this.property = data;
        //     },
        //     (error) => this.router.navigate(['/'])
        //   );
        // });
        this.galleryImages = this.getPropertyPhotos();
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
}
