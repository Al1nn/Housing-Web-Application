import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProperty } from '../../model/IProperty.interface';
import { HousingService } from '../../services/housing.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {

  @ViewChild('Form') detailsForm : NgForm;

  propertyId: number;
  property : IProperty;
  numberOfProperties : number;

  constructor(private route: ActivatedRoute, private router: Router, private housingService: HousingService) {}

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
      length =>{
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
    this.router.navigate(['property-detail', this.propertyId]);

  }

  onSelectPrevious() {
    this.propertyId -= 1;
    
    this.housingService.getPropertyById(this.propertyId).subscribe(
      property => {
          this.property = property;
      }
    );
    this.router.navigate(['property-detail', this.propertyId]);
  }

  onSubmit() {
    console.log(this.detailsForm);
  }
}
