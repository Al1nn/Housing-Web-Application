import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCard } from '../models/IUserCard.interface';


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }


    getOtherUsers(): Observable<IUserCard[]> {
        let token = '';
        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token') || '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };

        return this.http.get<IUserCard[]>(this.baseUrl + '/account/others', httpOptions);
    }

    verifyOldPassword(password: string): Observable<boolean> {
        let token = '';
        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token') || '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };
        return this.http.get<boolean>(this.baseUrl + '/account/verifyPassword/' + password, httpOptions);
    }

    updatePassword(newPassword: string) {
        let token = '';
        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token') || '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };
        return this.http.put(this.baseUrl + '/account/updatePassword/' + newPassword, {}, httpOptions);
    }

    updateAvatar(file: FormData) {
        let token = '';
        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token') || '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };
        return this.http.put(this.baseUrl + '/account/updateAvatar', file, httpOptions);
    }


    deleteAccount() {
        let token = '';
        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token') || '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };
        return this.http.delete(this.baseUrl + '/account/delete', httpOptions);
    }
}
