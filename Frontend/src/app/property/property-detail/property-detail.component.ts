import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProperty } from '../IProperty.interface';
import { HousingService } from '../../services/housing.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {

  propertyId: number;
  // property : IProperty;

  constructor(private route: ActivatedRoute, private router: Router, private housingService: HousingService) {}

  ngOnInit() {
    const id = 'id';
    this.propertyId = +this.route.snapshot.params[id];
    this.route.params.subscribe(
      (params) => {
        this.propertyId = +params['id'];
      }
    );

    // this.housingService.getPropertyById(this.propertyId).subscribe(
    //   property => {

    //       this.property = property;

    //   }
    // );
  }

  onSelectNext() {
    this.propertyId += 1;
    this.router.navigate(['property-detail', this.propertyId]);

  }
}
