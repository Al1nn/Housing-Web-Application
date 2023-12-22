import { HousingService } from './../../services/housing.service';
import { Component, OnInit } from '@angular/core';
import { IProperty } from '../IProperty.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-property-contacts',
  templateUrl: './property-contacts.component.html',
  styleUrls: ['./property-contacts.component.css']
})
export class PropertyContactsComponent implements OnInit {

  property : IProperty
  propertyId: number;

  constructor(private route: ActivatedRoute, private router: Router, private housingService : HousingService) { }

  ngOnInit() {
    const id = 'id';
    this.propertyId = +this.route.snapshot.params[id];
    this.route.params.subscribe(
      (params) => {
        this.propertyId = +params['id'];
      }
    );

    this.housingService.getPropertyById(this.propertyId).subscribe(
      property => {

          this.property = property;

      }
    );
  }

}
