import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { IPropertyBase } from '../../model/IPropertyBase.interface';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {
  SellRent = 1;
  Properties: IPropertyBase[];

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    if (urlSegments.length > 0 && urlSegments[0].path === 'rent-property') {
      this.SellRent = 2; // Means we are on rent-property URL
    }

    this.housingService.getAllProperties(this.SellRent).subscribe(
      (data) => {
        this.Properties = data;

        if (isPlatformBrowser(this.platformId)) {
          const newProperty = JSON.parse(
            localStorage.getItem('newProp') as string
          );

          if (newProperty && newProperty.SellRent === this.SellRent) {
            this.Properties = [newProperty, ...this.Properties];
          }
        }

        console.log(data);
      },
      (error) => {
        console.log('httperror:');
        console.log(error);
      }
    );
  }
}
