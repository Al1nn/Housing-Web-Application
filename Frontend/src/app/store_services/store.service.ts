import { BreadcrumbService } from '../services/breadcrumb.service';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { HousingService } from '../services/housing.service';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ChatService } from '../services/chat.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { INotification } from '../models/INotification.interface';



@Injectable({
    providedIn: 'root'
})
export class StoreService {

    private notificationsSubject = new Subject<INotification[]>();
    private loggedInSubject = new BehaviorSubject<boolean>(false);
    private matBadgerSubject = new BehaviorSubject<number>(0);


    loggedIn$ = this.loggedInSubject.asObservable();
    notifications$ = this.notificationsSubject.asObservable();
    matBadger$ = this.matBadgerSubject.asObservable();

    // Your existing code...

    setMatBadger(state: number): void {
        this.matBadgerSubject.next(state);
    }

    setLoggedIn(state: boolean): void {
        this.loggedInSubject.next(state);
    }

    updateNotifications(notifications: INotification[]) {
        this.notificationsSubject.next(notifications);
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
