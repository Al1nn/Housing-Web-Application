import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})

export class AddPropertyComponent implements OnInit {
  @ViewChild('Form') addPropertyForm : NgForm;

  constructor(private route : Router) { }

  ngOnInit() {
  }

  onBack(){
      this.route.navigate(['/']);
  }
  onSubmit() {
    console.log(this.addPropertyForm);
    
  }
}
