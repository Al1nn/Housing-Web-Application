import { Component, OnInit } from '@angular/core';
import { IPropertyBase } from '../../model/IPropertyBase.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-dashboard',
  templateUrl: './property-dashboard.component.html',
  styleUrls: ['./property-dashboard.component.css']
})
export class PropertyDashboardComponent implements OnInit {

  Properties: IPropertyBase[];

  constructor(
    private route: ActivatedRoute) { }

  ngOnInit() {


    this.route.data.subscribe((data) => {
      this.Properties = data['property'];
    }
    );

  }

}
