import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { IProperty } from '../IProperty.interface';
import { error } from 'console';

@Component({
  selector: 'app-rent-property',
  templateUrl: './rent-property.component.html',
  styleUrls: ['./rent-property.component.css']
})
export class RentPropertyComponent implements OnInit {

  rentProperties : IProperty[];

  constructor(private housingService : HousingService) { 
      
  }

  ngOnInit() : void {
    this.housingService.getAllProperties().subscribe(
        data => {
          this.rentProperties = data.filter( (p) => p.hasOwnProperty("SellRent"));  
        }
        , error => {
          console.log('httperror : ')
          console.log(error);}
    )
  }

}
