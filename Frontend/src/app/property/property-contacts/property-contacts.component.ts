import { HousingService } from './../../services/housing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IProperty } from '../../model/IProperty.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-property-contacts',
  templateUrl: './property-contacts.component.html',
  styleUrls: ['./property-contacts.component.css'],
})
export class PropertyContactsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
