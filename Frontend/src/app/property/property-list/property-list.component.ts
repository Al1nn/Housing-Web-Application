import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ICity } from '../../model/ICity.interface';
import { FormControl } from '@angular/forms';




@Component({
    selector: 'app-property-list',
    templateUrl: './property-list.component.html',
    styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {






    SellRent = 1;
    PageNumber = 1;

    @ViewChild('paginator1') paginator1: MatPaginator;


    @Input() Properties: Property[];
    @Input() isDashboard: boolean;




    //Example
    autoCompleteControl = new FormControl('');
    CityListOptions: ICity[] = [];
    FilteredCityListOptions: ICity[];
    //

    PropertiesLength: number;
    debounceTimer: any;
    isLoading: boolean = false;

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
    ) {


    }

    ngOnInit(): void {


        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {

            this.initializeCityOptions();

            return;
        }

        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('rent-property')) {
            this.SellRent = 2;
        }



        this.housingService.getPropertiesLength(this.SellRent).subscribe((data) => {
            this.PropertiesLength = data;
        });

        this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 6).subscribe(data => {
            this.Properties = data;
        });


        this.initializeCityOptions();


    }

    initializeCityOptions() {
        this.housingService.getAllCities().subscribe(data => {
            this.CityListOptions = data;
        });
    }
    /*
        Eliminam acel autoCompleteControl.

        Adaugam metoda (keypress) pe input text.

        
        la metoda (keypress) pentru input text 
        , voi pune, ceea ce tastez >= 3  fac sugestiile si apelez  GetFilteredProperties (API), la fiecare caracter introdus.
        , daca e mai mic decat 3, nu mai intoarce sugestiile si nu mai fac nici call in API. 
    */

    keyPress($event: any) {
        const inputValue = $event.target.value;

        if (inputValue.length >= 3) {
            //If I initially type 3 CHARS, IT GIVES ME EMPTY this.FilteredCityListOptions, after backspacing and remaining with 3 chars, it filters correct



            this.FilteredCityListOptions = this.CityListOptions.filter(option =>
                option.name.toLowerCase().includes(inputValue.toLowerCase())
                || option.country.toLowerCase().includes(inputValue.toLowerCase())
            );

            console.log(this.FilteredCityListOptions);

        }
    }


    onPageChange($event: PageEvent) {



        if (this.paginator1) {
            this.paginator1.pageIndex = $event.pageIndex;
        }


        this.PageNumber = $event.pageIndex + 1;

        this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 6).subscribe(data => {
            this.Properties = data;
        })


    }

    filterCityAPI(filterValue: string) {


        if (filterValue !== '') {
            if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
                this.housingService.getAllFilteredUserProperties(filterValue).subscribe((data) => {
                    this.Properties = data;
                });
                return;
            }

            this.housingService.getAllFilteredProperties(this.SellRent, filterValue).subscribe(
                (data) => {
                    this.Properties = data;

                }, (error) => {
                    console.log('httperror:');
                    console.log(error);
                }
            );
        } else {

            if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
                this.housingService.getUserProperties().subscribe((data) => {
                    this.Properties = data;
                });
                return;
            }

            this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 6).subscribe(data => {
                this.Properties = data;
            });
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
