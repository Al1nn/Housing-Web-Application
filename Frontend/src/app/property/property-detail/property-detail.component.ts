import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Property } from '../../model/Property.interface';
import { error } from 'console';
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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housingService: HousingService
  ) {}

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
