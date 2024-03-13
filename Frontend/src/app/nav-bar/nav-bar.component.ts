import { AlertifyService } from './../services/alertify.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
    loggedInUser: string;
    constructor(private alertifyService: AlertifyService) { }

    loggedIn() {
        this.loggedInUser =
            typeof localStorage !== 'undefined'
                ? (localStorage.getItem('username') as string)
                : '';
        return this.loggedInUser;
    }

    onLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.alertifyService.success('You are logged out !');
    }

    ngOnInit() { }
}
