import { Component, Input, OnInit } from '@angular/core';
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
    @Input() Properties: IPropertyBase[];
    Today = new Date();
    filterInput = '';
    urlSegments = this.route.snapshot.url;
    SortbyParam = '';
    SortDirection = 'asc';

    min = 0;
    max = 0;
    filterPriceAndAreaRange = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125
        , 140, 150, 175, 180, 190, 200, 225, 235, 250, 275, 285, 300];

    filteredCities: string[];

    constructor(
        private route: ActivatedRoute,
        private housingService: HousingService
    ) { }

    ngOnInit(): void {


        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
            // this.housingService.getUserProperties().subscribe((data) => {
            //     this.Properties = data;
            // });
            return;
        }

        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('rent-property')) {
            this.SellRent = 2; // Means we are on rent-property URL
        }

        this.route.data.subscribe((data) => {
            this.Properties = this.SellRent === 2 ? data['propertyRent'] : data['propertySell'];
        }
        );
        //this.housingService.clearPhotoStorage();

    }

    onFilterCityAPI(filterInput: string) {


        if (filterInput !== '') {
            if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
                this.housingService.getAllFilteredUserProperties(filterInput).subscribe((data) => {
                    this.Properties = data;
                });
                return;
            }

            this.housingService.getAllFilteredProperties(this.SellRent, filterInput).subscribe(
                (data) => {
                    this.Properties = data;

                }, (error) => {
                    console.log('httperror:');
                    console.log(error);
                }
            );
        } else {
            console.log('Filter Input empty');
            if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
                this.housingService.getUserProperties().subscribe((data) => {
                    this.Properties = data;
                });
                return;
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

    }

    clearFilters() {
        this.min = 0;
        this.max = 0;
        this.filterInput = '';
    }


    onSortDirection() {
        if (this.SortDirection === 'desc') {
            this.SortDirection = 'asc';
        } else {
            this.SortDirection = 'desc';
        }
    }

}
