import { Injectable } from '@angular/core';
import { IUserForLogin, IUserForRegister } from '../model/IUser.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IImage } from '../model/IImage.interface';
import { IUserCard } from '../model/IUserCard.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) { }
    baseUrl = environment.baseUrl;

    authUser(user: IUserForLogin): Observable<IUserForLogin> {
        return this.http.post<IUserForLogin>(this.baseUrl + '/account/login', user);
    }

    registerUser(user: IUserForRegister) {
        return this.http.post(this.baseUrl + '/account/register', user);
    }

    isAdmin(username: string): Observable<boolean> {
        return this.http.get<boolean>(this.baseUrl + '/account/user/' + username);
    }

    getProfileImage(): Observable<IImage> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<IImage>(this.baseUrl + '/account/image', httpOptions);
    }

    getUserCard(): Observable<IUserCard> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<IUserCard>(this.baseUrl + "/account/card", httpOptions);
    }

    getUserCards(): Observable<IUserCard[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<IUserCard[]>(this.baseUrl + "/account/cards", httpOptions);
    }
}
