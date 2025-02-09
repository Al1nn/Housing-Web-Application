import { BreadcrumbService } from '../services/breadcrumb.service';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { HousingService } from '../services/housing.service';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ChatService } from '../services/chat.service';
import { BehaviorSubject } from 'rxjs';





@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private loggedInSubject = new BehaviorSubject<boolean>(false);
    private notificationListenerSubject = new BehaviorSubject<boolean>(false);


    loggedIn$ = this.loggedInSubject.asObservable();
    notificationListener$ = this.notificationListenerSubject.asObservable();



    setLoggedIn(state: boolean): void {
        this.loggedInSubject.next(state);
    }

    setListening(state: boolean): void {
        this.notificationListenerSubject.next(state);
    }

    constructor(public housingService: HousingService,
        public alertifyService: AlertifyService,
        public authService: AuthService,
        public usersService: UsersService,
        public breadcrumbService: BreadcrumbService,
        public chatService: ChatService,
    ) {

    }
}
