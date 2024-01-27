import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { IPropertyBase } from '../../model/IPropertyBase.interface';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {
  SellRent = 1;
  Properties: IPropertyBase[];
  Today = new Date();
  City = '';
  SearchCity = '';
  SortbyParam: '';
  SortDirection = 'asc';

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService
  ) {}

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    if (urlSegments.length > 0 && urlSegments[0].path === 'rent-property') {
      this.SellRent = 2; // Means we are on rent-property URL
    }

    this.housingService.getAllProperties(this.SellRent).subscribe(
      (data) => {
        this.Properties = data;

        console.log(data);
      },
      (error) => {
        console.log('httperror:');
        console.log(error);
      }
    );
  }

  onCityFilter() {
    this.SearchCity = this.City;
  }

  onCityFilterClear() {
    this.SearchCity = '';
    this.City = '';
  }
  onSortDirection() {
    if (this.SortDirection === 'desc') {
      this.SortDirection = 'asc';
    } else {
      this.SortDirection = 'desc';
    }
  }
}
