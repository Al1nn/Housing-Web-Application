import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {

  Properties: Array<any> = [
    {
    "Id" : 1,
    "Type" : "House",
    "Name" : "Birla House",
    "Price" : 15000
    },
    {
      "Id" : 2,
      "Type" : "House",
      "Name" : "Erose Villa",
      "Price" : 20000
    },
    {
      "Id" : 3,
      "Type" : "House",
      "Name" : "Aston Villa",
      "Price" : 5000
    },
    {
      "Id" : 4,
      "Type" : "House",
      "Name" : "Vice City Estate",
      "Price" : 10000
    },
    {
      "Id" : 5,
      "Type" : "House",
      "Name" : "Addams Property",
      "Price" : 8000
    },
    {
      "Id" : 6,
      "Type" : "House",
      "Name" : "Miami Estate",
      "Price" : 15000
    },
]
  constructor() { }

  ngOnInit() {
  }

}
