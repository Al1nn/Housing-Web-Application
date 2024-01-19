import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { IProperty } from '../../model/IProperty.interface';


@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})

export class AddPropertyComponent implements OnInit {
  @ViewChild('Form') addPropertyForm : NgForm;
  @ViewChild('formTabs', {static: false}) formTabs : TabsetComponent;
  
  //This later will come from the database
  propertyTypes : Array<string>  = ['House','Apartment','Duplex'];
  furnishTypes : Array<string> = ['Fully', 'Semi', 'Unfurnished'];
  propertyView : IProperty= { 
    Id: null,
    Name: '',
    Price: null,
    SellRent: null,
    PType: null,
    FType: null,
    BHK: null,
    City: '',
    Description: '',
    BuiltArea: null,
    CarpetArea: null,
    RTM: null,
    Image : 'house_default',
    Contacts : []
  };

  constructor(private route : Router) { }

  ngOnInit() {


      // setTimeout( () => {
      //   this.addPropertyForm.controls['Name'].setValue('wowowow');
      // }) Template driven form is unpredictable. setTimeout not always work
  }

  onBack(){
      this.route.navigate(['/']);
  }
  onSubmit() {
    console.log("Congrats, form Submitted");
    console.log("SellRent = " + this.addPropertyForm.value.BasicInfo.SellRent);
    console.log(this.addPropertyForm);
  }

  selectTab(tabId : number){
    this.formTabs.tabs[tabId].active = true;
  }
}
