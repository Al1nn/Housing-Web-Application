import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { NgForm } from '@angular/forms';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { IProperty } from '../../model/IProperty.interface';


@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  providers:[
    {provide: CarouselConfig, useValue: {interval: 0, noPause: true, showIndicators: true }}
  ],
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {

  slides = [
    {image: 'assets/images/prop-1.jpg', text: 'Kitchen'},
    {image: 'assets/images/prop-2.jpg',text: 'Living Room'},
    {image: 'assets/images/prop-3.jpg',text: 'Hall'},
    {image: 'assets/images/prop-4.jpg',text: 'Bathroom'},
    {image: 'assets/images/prop-5.jpg',text: 'Room'},
 ];



  propertyId: number;
  property : IProperty;
  numberOfProperties : number;
  propertyTypes : string[] = ["House","Apartment","Duplex"];
  furnishTypes: string[] = ['Fully', 'Semi', 'Unfurnished'];
  Sell: number;
  Rent: number;




  constructor(private route: ActivatedRoute, private router: Router, private housingService: HousingService) {}

  ngOnInit() {

    const id = 'id';
    this.propertyId = +this.route.snapshot.params[id];
    this.route.params.subscribe(
      (params) => {
        this.propertyId = +params['id'];
      }
    );

    this.housingService.getPropertyById(this.propertyId).subscribe(
      property => {
          this.property = property;

      }
    );




    this.housingService.getNumberOfProperties().subscribe(
      length =>{
        this.numberOfProperties = length;
      }
    );



  }




}
