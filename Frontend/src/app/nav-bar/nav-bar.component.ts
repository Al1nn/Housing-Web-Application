import { AlertifyService } from './../services/alertify.service';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  loggedInUser : string;
  constructor(private router : Router, private alertifyService : AlertifyService) {

  }

  loggedIn(){
    this.loggedInUser = typeof localStorage !== 'undefined' ? localStorage.getItem('token') as string  : '';
    return this.loggedInUser;
  }

  onLogout() {
    localStorage.removeItem('token');
    this.alertifyService.success("You are logged out !");
  }

  ngOnInit() {

  }

}
