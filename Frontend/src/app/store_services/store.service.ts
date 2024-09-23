import { BreadcrumbService } from 'xng-breadcrumb';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { HousingService } from '../services/housing.service';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    constructor(public housingService: HousingService,
        public alertifyService: AlertifyService,
        public authService: AuthService,
        public usersService: UsersService,
        public breadcrumbService: BreadcrumbService
    ) {

    }
}
