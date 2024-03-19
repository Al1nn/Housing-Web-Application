import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { IPropertyBase } from '../../model/IPropertyBase.interface';

@Component({
  selector: 'app-property-dashboard',
  templateUrl: './property-dashboard.component.html',
  styleUrls: ['./property-dashboard.component.css']
})
export class PropertyDashboardComponent implements OnInit {

  Properties: IPropertyBase[];

  constructor(private housingService: HousingService) { }

  ngOnInit() {
    this.housingService.getUserProperties().subscribe((data) => {
      this.Properties = data;
    });

  }

}
