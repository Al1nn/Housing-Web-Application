import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ICity } from '../../model/ICity.interface';
import { IFilters } from '../../model/IFilters.interface';





@Component({
    selector: 'app-property-list',
    templateUrl: './property-list.component.html',
    styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {

    SellRent = 1;
    PageNumber = 1;

    @ViewChild('paginator') paginator: MatPaginator;

    @ViewChild('autocompleteInput') autoCompleteInput: ElementRef;

    @Input() Properties: Property[];
    @Input() isDashboard: boolean;


    private filterTimeoutId: number;
    private propertyTimeoutId: number;



    //Example
    FilteredCityListOptions: ICity[] = [];
    //

    filters: IFilters = {
        pageNumber: 1,
        pageSize: 6
    };


    PropertiesLength: number;
    debounceTimer: any;
    isLoading: boolean = false;
    isFiltering: boolean = false;


    Today = new Date();
    urlSegments = this.route.snapshot.url;

    SortbyParam: string;
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
        this.filters.filterWord = option.name;
        this.FilteredCityListOptions = [];



        this.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {

            this.Properties = data;
            this.isFiltering = true;
        });
    }



    keyPress($event: any) {
        const inputValue = $event.target.value;

        if (this.filterTimeoutId) {
            clearTimeout(this.filterTimeoutId);
        }
        if (this.propertyTimeoutId) {
            clearTimeout(this.propertyTimeoutId);
        }


        if (inputValue.length <= 2) {
            this.FilteredCityListOptions = [];

            this.propertyTimeoutId = window.setTimeout(() => {

                this.housingService.getPropertiesLength(this.SellRent).subscribe((data) => {
                    this.paginator.length = data;
                });

                this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 6).subscribe(data => {
                    this.Properties = data;

                });
            }, 400);




            return;
        }

        if (inputValue.length >= 3) {
            this.filterTimeoutId = window.setTimeout(() => {
                this.housingService.getAllCitiesFiltered(inputValue, 10).subscribe(data => {
                    this.FilteredCityListOptions = data;
                });


            }, 400);
        }
    }


    @HostListener('document:click', ['$event'])
    clickout(_event: Event) {
        //daca apas inafara dropdown-ului de sugestii
        this.FilteredCityListOptions = [];

    }

    onPageChange($event: PageEvent) {


        //logica page navigatorului trebuie actualizata de fiecare data cand trebuie filtrata 
        this.paginator.pageIndex = $event.pageIndex;
        this.PageNumber = $event.pageIndex + 1;
        this.filters.pageNumber = this.PageNumber;

        if (this.isFiltering) {

            this.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
                this.Properties = data;
            });

            return;
        }

        this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 6).subscribe(data => {
            this.Properties = data;
        });

        // de pus metoda de apelare a filtrarii paginate
    }

    onMinMaxChange() {
        this.filters.minBuiltArea = this.min;
        this.filters.maxBuiltArea = this.max;


        this.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
            this.paginator.length = data.length;
            this.Properties = data;
            this.isFiltering = true;
        });
    }

    onSortChange() {
        console.log('Sort by:', this.SortbyParam);
        this.filters.sortByParam = this.SortbyParam;

        this.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
            this.Properties = data;
            this.isFiltering = true;
        });
    }

    clearFilters() {
        this.min = 0;
        this.max = 0;
        this.autoCompleteInput.nativeElement.value = '';
        this.SortbyParam = '';
        this.SortDirection = 'asc';
        this.filters = {
            pageNumber: 1,
            pageSize: 6
        };
        console.log(this.filters);

        this.housingService.getPropertiesLength(this.SellRent).subscribe((data) => {
            this.PropertiesLength = data;
        });
        this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 6).subscribe(data => {
            this.Properties = data;
        });
    }


    onSortDirection() {
        if (this.SortDirection === 'desc') {
            this.SortDirection = 'asc';
        } else {
            this.SortDirection = 'desc';
        }

        this.filters.sortDirection = this.SortDirection;

        this.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
            this.Properties = data;
            this.isFiltering = true;
        });
    }


}
