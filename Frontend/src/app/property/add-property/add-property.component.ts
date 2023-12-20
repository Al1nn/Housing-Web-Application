import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})

export class AddPropertyComponent implements OnInit {

  constructor(private route : Router) { }

  ngOnInit() {
  }

  onBack(){
      this.route.navigate(['/']);
  }

}
