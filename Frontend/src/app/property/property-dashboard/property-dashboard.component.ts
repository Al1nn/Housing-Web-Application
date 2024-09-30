import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/Property.interface';

@Component({
    selector: 'app-property-dashboard',
    templateUrl: './property-dashboard.component.html',
    styleUrls: ['./property-dashboard.component.css']
})
export class PropertyDashboardComponent implements OnInit, OnDestroy {

    Properties: Property[];
    PropertiesLength: number;

    constructor(
        private route: ActivatedRoute) { }
    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnDestroy(): void {

    }

    ngOnInit() {


        this.route.data.subscribe((data) => {
            this.PropertiesLength = data['property'].totalRecords;
            this.Properties = data['property'].properties;
        }
        );

    }

}
