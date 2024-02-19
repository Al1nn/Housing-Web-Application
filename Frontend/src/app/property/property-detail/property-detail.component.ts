import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { GalleryItem } from '@daelmaak/ngx-gallery';

@Component({
    selector: 'app-property-detail',
    templateUrl: './property-detail.component.html',
    styleUrls: ['./property-detail.component.css'],
})
export class PropertyDetailComponent implements OnInit {
    public propertyId: number;
    property = new Property();
    images: GalleryItem[] = [
        {
            src: 'assets/gallery/internal-1.jpg',
            thumbSrc: 'assets/gallery/internal-1.jpg',
        },
        {
            src: 'assets/gallery/internal-2.jpg',
            thumbSrc: 'assets/gallery/internal-2.jpg',
        },
        {
            src: 'assets/gallery/internal-3.jpg',
            thumbSrc: 'assets/gallery/internal-3.jpg',
        },
        {
            src: 'assets/gallery/internal-4.jpg',
            thumbSrc: 'assets/gallery/internal-4.jpg',
        },
        {
            src: 'assets/gallery/internal-5.jpg',
            thumbSrc: 'assets/gallery/internal-5.jpg',
        },
    ];
    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.propertyId = +this.route.snapshot.params['id'];

        this.route.data.subscribe((data) => {
            this.property = data['property'];
        });

        // this.route.params.subscribe((params) => {
        //   this.propertyId = +params['id'];

    //   this.housingService.getPropertyById(this.propertyId).subscribe(
    //     (data: Property) => {
    //       this.property = data;
    //     },
    //     (error) => this.router.navigate(['/'])
    //   );
    // });
    }
}
