import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/Property.interface';

@Component({
    selector: 'app-property-dashboard',
    templateUrl: './property-dashboard.component.html',
    styleUrls: ['./property-dashboard.component.css']
})
export class PropertyDashboardComponent implements OnInit {

    Properties: Property[];
    PropertiesLength: number;

    constructor(
        private route: ActivatedRoute) { }

    ngOnInit() {


        this.route.data.subscribe((data) => {
            this.PropertiesLength = data['property'].totalRecords;
            this.Properties = data['property'].properties;
        }
        );

    }

}
