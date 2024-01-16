import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProperty } from '../../model/IProperty.interface';
import { HousingService } from '../../services/housing.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {


  propertyId: number;
  property : IProperty;
  editForm: FormGroup;

  constructor(private fb : FormBuilder, private route: ActivatedRoute, private router: Router, private housingService: HousingService) {}

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
          if(this.property){
            this.createEditForm();
            this.editForm.patchValue({
            propertyName: this.property.Name,
            propertySellRent: this.property.SellRent,
            propertyPrice: this.property.Price,
            propertyType: this.property.Type
          });
        }

      }
    );

  }

  onSelectNext() {
    this.propertyId += 1;
    this.router.navigate(['property-detail', this.propertyId]);

  }

  createEditForm(){
    this.editForm = this.fb.group({
      propertyName: ['', Validators.required],
      propertySellRent : ['', Validators.required],
      propertyPrice : ['', Validators.required],
      propertyType : ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.editForm);
  }
}
