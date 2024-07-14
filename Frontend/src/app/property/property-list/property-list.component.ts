import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ICity } from '../../model/ICity.interface';





@Component({
    selector: 'app-property-list',
    templateUrl: './property-list.component.html',
    styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {







    SellRent = 1;
    PageNumber = 1;

    @ViewChild('paginator1') paginator1: MatPaginator;

    @ViewChild('autocompleteInput') autoCompleteInput: ElementRef;

    @Input() Properties: Property[];
    @Input() isDashboard: boolean;




    //Example
    FilteredCityListOptions: ICity[] = [];
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





    }

    selectCity(option: ICity) {
        this.autoCompleteInput.nativeElement.value = `${option.name}, ${option.country}`;
        this.FilteredCityListOptions = [];
        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) { //daca suntem in property-dashboard

            this.housingService.getAllFilteredUserProperties(option.name).subscribe(data => {
                this.Properties = data;
            });

            return;
        }

        this.housingService.getAllFilteredProperties(this.SellRent, option.name).subscribe(data => {
            this.Properties = data;
        });
    }

    keyPress($event: any) {
        const inputValue = $event.target.value;
        console.log(inputValue);


        if (inputValue.length === 2) {
            this.FilteredCityListOptions = [];
            setTimeout(() => {
                this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 6).subscribe(data => {
                    this.Properties = data;
                });
            }, 400);

            return;
        }

        setTimeout(() => {
            if (inputValue.length >= 3) {
                this.housingService.getAllCitiesFiltered(inputValue, 10).subscribe(data => {
                    this.FilteredCityListOptions = data;
                });

                if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
                    this.housingService.getAllFilteredUserProperties(inputValue).subscribe(data => {
                        this.Properties = data;
                    });
                    return;
                }

                this.housingService.getAllFilteredProperties(this.SellRent, inputValue).subscribe(data => {
                    this.Properties = data;
                });
            }
        }, 400);
    }


    @HostListener('document:click', ['$event'])
    clickout(_event: Event) {
        //daca apas inafara dropdown-ului de sugestii
        this.FilteredCityListOptions = [];

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
