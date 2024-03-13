import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { HousingService } from '../../services/housing.service';
import { AuthService } from '../../services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertifyService } from '../../services/alertify.service';




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
    modalRef: BsModalRef;

    isAdmin: boolean = false;

    constructor(private authService: AuthService
        , private housingService: HousingService
        , private route: ActivatedRoute
        , private modalService: BsModalService
        , private alertifyService: AlertifyService
        , private router: Router) { }

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];

        this.route.data.subscribe((data) => {
            this.property = data['property'];
            console.log(this.property.photos);
        });



        this.property.age = this.housingService.getPropertyAge(this.property.estPossessionOn);


        this.galleryImages = this.getPropertyPhotos();

        var username = localStorage.getItem('username') as string;
        var roleString = localStorage.getItem('role') as string;
        var role = +roleString;

        if (username !== null || roleString !== null) {
            this.authService.isAdmin(username, role).subscribe((data) => {
                this.isAdmin = data;
            });
        }

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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    deleteProperty(propId: number) {
        console.log(propId);

        this.router.navigate(['/']);
        this.modalRef.hide();
        this.alertifyService.success('Property Deleted !');
    }
}
