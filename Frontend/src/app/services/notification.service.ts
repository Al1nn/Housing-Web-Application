import { Injectable } from '@angular/core';
import { INotification } from '../models/INotification.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { catchError, mergeMapTo, of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    baseUrl: string = environment.baseUrl;


    constructor(private http: HttpClient, private afMessaging: AngularFireMessaging) { }

    requestPermissionAndGetToken() {
        return this.afMessaging.requestPermission.pipe(
            mergeMapTo(this.afMessaging.getToken),
            catchError((error) => {
                console.error('Error getting token', error);
                return of(null);
            })
        );
    }

    sendNotification(notification: INotification) {
        let token = '';
        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token') || '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };

        return this.http.post(this.baseUrl + '/Notification/sendNotification', notification, httpOptions);
    }

}