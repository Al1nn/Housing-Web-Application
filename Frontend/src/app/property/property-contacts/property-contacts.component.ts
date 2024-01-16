import { HousingService } from './../../services/housing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IProperty } from '../../model/IProperty.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-property-contacts',
  templateUrl: './property-contacts.component.html',
  styleUrls: ['./property-contacts.component.css']
})
export class PropertyContactsComponent implements OnInit {

  @ViewChild('Form') contactsForm : NgForm;

  property : IProperty;
  propertyId: number;
  numberOfProperties : number;

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

    this.housingService.getNumberOfProperties().subscribe(
      length => {
        this.numberOfProperties = length;
      }
    );

  }

  onSelectNext() {
    this.propertyId += 1;
    
    this.housingService.getPropertyById(this.propertyId).subscribe(
      property => {
          this.property = property;
      }
    );
    this.router.navigate(['property-contacts', this.propertyId]);
  }

  onSelectPrevious() {
    this.propertyId -= 1;
    
    this.housingService.getPropertyById(this.propertyId).subscribe(
      property => {
          this.property = property;
      }
    );
    this.router.navigate(['property-contacts', this.propertyId]);
  }

  onSubmit() {
  throw new Error('Method not implemented.');
  }

}
