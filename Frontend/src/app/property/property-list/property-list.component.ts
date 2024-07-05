import { Component, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';



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

        this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 5).subscribe(data => {
            console.log(data);
            this.Properties = data;
        })

    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(_event: Event) {

        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
            // Evitam dashboard-ul
            return;
        }

        const scrolled = window.scrollY;
        const threshold = 400;


        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            if (scrolled >= threshold && !this.isLoading) {
                this.isLoading = true;
                this.PageNumber++;
                this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 5).subscribe(data => {
                    this.Properties.push(...data);
                    this.isLoading = false;
                }, error => {
                    this.isLoading = false;
                    console.error('Error loading data:', error);
                });
            }
        }, 200);

    }

    onPageChange($event: PageEvent) {



        if (this.paginator1) {
            this.paginator1.pageIndex = $event.pageIndex;
        }


        this.PageNumber = $event.pageIndex + 1;

        this.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 5).subscribe(data => {
            this.Properties = data;
        })


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
