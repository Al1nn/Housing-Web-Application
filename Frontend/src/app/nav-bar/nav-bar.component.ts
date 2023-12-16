import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  //binding : string = ""; //Initializeaza inputul ngModel

  constructor() { 
    
  }

  // myFirstMethod() : string{
    
  //   // this.binding = "Button Clicked";
  //   // return this.binding;
  // }

  ngOnInit() {
    //this.binding = "wowww"; // Se respecta methoda OnInit() chiar daca am initializat binding

  }

}
