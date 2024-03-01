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
    filterInput = '';

    SortbyParam = '';
    SortDirection = 'asc';

    min = 0;
    max = 0;
    filterPriceAndAreaRange = [0, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
        , 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 100000, 150000, 200000, 500000];

    filteredCities: string[];

    constructor(
        private route: ActivatedRoute,
        private housingService: HousingService
    ) { }

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

    onFilterCityAPI(filterInput: string) {
        if (filterInput !== '') {
            this.housingService.getAllFilteredProperties(this.SellRent, filterInput).subscribe(
                (data) => {
                    console.log('Data = ' + data);
                    this.Properties = data;

                }, (error) => {
                    console.log('httperror:');
                    console.log(error);
                }
            );
        } else {
            console.log('Filter Input empty');
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
