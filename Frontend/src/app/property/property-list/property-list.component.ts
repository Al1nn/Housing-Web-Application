
import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { IProperty } from '../IProperty.interface';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
}) //End of tutorial 10
export class PropertyListComponent implements OnInit {

  Properties: IProperty[];

  constructor(private housingService : HousingService) { }

  ngOnInit()  : void{
    this.housingService.getAllProperties().subscribe(
      data =>{
        console.log(data);
        this.Properties = data.filter( (p) => !p.hasOwnProperty("SellRent"));
      }
      , error => {
        console.log('httperror : ')
        console.log(error);}
    );

  }

}
