/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IFilters } from '../../model/IFilters.interface';
import { PaginatedProperties } from '../../model/PaginatedProperties.interface';
import { ISugestion } from '../../model/ISugestion.interface';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { StoreService } from '../../store_services/store.service';




@Component({
    selector: 'app-property-list',
    templateUrl: './property-list.component.html',
    styleUrls: ['./property-list.component.css'],
})
@AutoUnsubscribe()
export class PropertyListComponent implements OnInit, OnDestroy {
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('autocompleteInput') autoCompleteInput: ElementRef;
    @Input() Properties: Property[];
    @Input() PropertiesLength: number;
    SellRent = 1;
    PageNumber = 1;
    PaginatedProperties: PaginatedProperties;
    FilteredCityListOptions: ISugestion[] = [];
    filters: IFilters = {
        pageNumber: 1,
        pageSize: 2
    };
    isLoading = false;
    isFiltering = false;
    Today = new Date();
    urlSegments = this.route.snapshot.url;
    SortbyParam: string;
    SortDirection = 'asc';
    min = 0;
    max = 0;
    filterPriceAndAreaRange = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125
        , 140, 150, 175, 180, 190, 200, 225, 235, 250, 275, 285, 300];
    filteredCities: string[];
    private filterTimeoutId: number;
    private propertyTimeoutId: number;
    private debounceTimer: number;

    constructor(
        private route: ActivatedRoute,
        private store: StoreService
    ) { }

    @HostListener('document:click', ['$event'])
    clickout(_event: Event) {
        this.FilteredCityListOptions = [];
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(_event: Event) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = window.setTimeout(() => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;


            if ((windowHeight + scrollTop) >= (documentHeight - 10) && !this.isLoading) {
                this.isLoading = true;
                this.PageNumber++;


                if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {

                    if (this.isFiltering) {
                        this.filters.pageNumber = this.PageNumber;


                        this.store.housingService.getAllFilteredUserProperties(this.filters).subscribe(
                            (data: PaginatedProperties) => {

                                if (this.PageNumber <= Math.ceil(data.totalRecords / this.filters.pageSize)) {
                                    this.Properties.push(...data.properties);
                                    this.isLoading = false;
                                } else {
                                    this.isLoading = false;
                                }
                            },
                            error => {
                                this.isLoading = false;
                                console.error('Error loading filtered properties:', error);
                            }
                        );

                        return;
                    }


                    this.store.housingService.getUserPaginatedProperty(this.PageNumber, 2).subscribe(data => {
                        this.Properties.push(...data.properties);
                        this.isLoading = false;
                    }, error => {
                        this.isLoading = false;
                        console.error('Error loading data:', error);
                    });
                    setTimeout(() => {
                        window.scrollTo({
                            top: window.scrollY - 50,
                            behavior: 'smooth'
                        });
                    }, 100);
                    return;
                }


                if (this.isFiltering) {
                    this.filters.pageNumber = this.PageNumber;



                    this.store.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(
                        (data: PaginatedProperties) => {
                            if (this.PageNumber <= Math.ceil(data.totalRecords / this.filters.pageSize)) {
                                this.Properties.push(...data.properties);
                                this.isLoading = false;
                            } else {
                                this.isLoading = false;
                            }
                        },
                        error => {
                            this.isLoading = false;
                            console.error('Error loading filtered properties:', error);
                        }
                    );

                    return;
                }

                this.store.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 2).subscribe(data => {
                    this.Properties.push(...data.properties);
                    this.isLoading = false;
                }, error => {
                    this.isLoading = false;
                    console.error('Error loading data:', error);
                });


                setTimeout(() => {
                    window.scrollTo({
                        top: window.scrollY - 50,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }, 200);
    }

    isPropertyRent(): boolean {
        return this.urlSegments.length > 0 && this.urlSegments[0].path.includes('rent-property');
    }

    ngOnInit(): void {

        if (this.isPropertyDashboard()) {
            return;
        }

        if (this.isPropertyRent()) {
            this.SellRent = 2;
        }


        this.store.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 2).subscribe(data => {
            this.PropertiesLength = data.totalRecords;
            this.Properties = data.properties;
        });

    }

    ngOnDestroy(): void {
    }


    selectCity(option: ISugestion) {
        this.autoCompleteInput.nativeElement.value = `${option.city}, ${option.country}`;
        this.filters.filterWord = option.city;
        this.FilteredCityListOptions = [];


        this.PageNumber = 1;
        this.filters.pageNumber = 1;
        this.paginator.pageIndex = 0;

        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
            this.store.housingService.getAllFilteredUserProperties(this.filters).subscribe(data => {
                this.paginator.length = data.totalRecords;
                this.Properties = data.properties;
                this.isFiltering = true;
            });
            return;
        }

        this.store.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
            this.paginator.length = data.totalRecords;
            this.Properties = data.properties;
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
                this.PageNumber = 1;
                this.filters.pageNumber = 1;
                this.paginator.pageIndex = 0;

                if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
                    this.store.housingService.getUserPaginatedProperty(1, 2).subscribe(data => {
                        this.paginator.length = data.totalRecords;
                        this.Properties = data.properties;
                    })
                    return;
                }

                this.store.housingService.getPaginatedProperty(this.SellRent, 1, 2).subscribe(data => {
                    this.paginator.length = data.totalRecords;
                    this.Properties = data.properties;
                });
            }, 400);




            return;
        }

        if (inputValue.length >= 3) {
            this.filterTimeoutId = window.setTimeout(() => {
                this.store.housingService.getAllCitiesFiltered(inputValue, 10, this.SellRent).subscribe(data => {
                    this.FilteredCityListOptions = data;
                });


            }, 400);
        }
    }

    onPageChange($event: PageEvent) {
        this.paginator.pageIndex = $event.pageIndex;
        this.PageNumber = $event.pageIndex + 1;
        this.filters.pageNumber = this.PageNumber;
        if (this.isFiltering) {

            if (this.isPropertyDashboard()) {
                this.store.housingService.getAllFilteredUserProperties(this.filters).subscribe(data => {
                    this.paginator.length = data.totalRecords;
                    this.Properties = data.properties;
                });
                return;
            }

            this.store.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
                this.paginator.length = data.totalRecords;
                this.Properties = data.properties;
            });

            return;
        }

        if (this.isPropertyDashboard()) {
            this.store.housingService.getUserPaginatedProperty(this.PageNumber, 2).subscribe(data => {
                this.paginator.length = data.totalRecords;
                this.Properties = data.properties;
            });
            return;
        }

        this.store.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 2).subscribe(data => {
            this.paginator.length = data.totalRecords;
            this.Properties = data.properties;
        });
    }

    onMinMaxChange() {
        this.filters.minBuiltArea = this.min;
        this.filters.maxBuiltArea = this.max;
        this.PageNumber = 1;
        this.filters.pageNumber = 1;
        this.paginator.pageIndex = 0;
        if (this.isPropertyDashboard()) {
            this.store.housingService.getAllFilteredUserProperties(this.filters).subscribe(data => {
                this.paginator.length = data.totalRecords;
                this.Properties = data.properties;
                this.isFiltering = true;
            });
            return;
        }
        this.store.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
            this.paginator.length = data.totalRecords;
            this.Properties = data.properties;
            this.isFiltering = true;
        });
    }

    onSortChange() {
        console.log('Sort by:', this.SortbyParam);
        this.filters.sortByParam = this.SortbyParam;
        this.PageNumber = 1;
        this.filters.pageNumber = this.PageNumber;
        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
            this.store.housingService.getAllFilteredUserProperties(this.filters).subscribe(data => {
                this.paginator.length = data.totalRecords;
                this.Properties = data.properties;
                this.isFiltering = true;
            });
            return;
        }
        this.store.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
            this.paginator.length = data.totalRecords;
            this.Properties = data.properties;
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
            pageSize: 2
        };
        this.PageNumber = 1;
        this.filters.pageNumber = this.PageNumber;
        this.paginator.pageIndex = 0;
        this.isFiltering = false;
        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
            this.store.housingService.getUserPaginatedProperty(this.PageNumber, 2).subscribe(data => {
                this.paginator.length = data.totalRecords;
                this.Properties = data.properties;
            });
            return;
        }
        this.store.housingService.getPaginatedProperty(this.SellRent, this.PageNumber, 2).subscribe(data => {
            this.paginator.length = data.totalRecords;
            this.Properties = data.properties;
        });
    }


    onSortDirection() {
        if (this.SortDirection === 'desc') {
            this.filters.sortDirection = this.SortDirection;
            this.SortDirection = 'asc';
        } else {
            this.filters.sortDirection = 'asc';
            this.SortDirection = 'desc';
        }
        this.PageNumber = 1;
        this.filters.pageNumber = this.PageNumber;
        this.paginator.pageIndex = 0;
        if (this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard')) {
            this.store.housingService.getAllFilteredUserProperties(this.filters).subscribe(data => {
                this.paginator.length = data.totalRecords;
                this.Properties = data.properties;
                this.isFiltering = true;
            });
            return;
        }
        this.store.housingService.getAllFilteredProperties(this.SellRent, this.filters).subscribe(data => {
            this.paginator.length = data.totalRecords;
            this.Properties = data.properties;
            this.isFiltering = true;
        });
    }

    private isPropertyDashboard(): boolean {
        return this.urlSegments.length > 0 && this.urlSegments[0].path.includes('property-dashboard');
    }

}
