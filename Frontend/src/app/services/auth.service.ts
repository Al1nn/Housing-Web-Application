import { Injectable } from '@angular/core';
import { IUserForLogin } from '../model/IUser.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IImage } from '../model/IImage.interface';
import { IUserCard } from '../model/IUserCard.interface';
import { IToken } from '../model/IToken.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) { }
    baseUrl = environment.baseUrl;

    authUser(user: FormData): Observable<IUserForLogin> {
        return this.http.post<IUserForLogin>(this.baseUrl + '/account/login', user);
    }

    registerUser(user: FormData) {
        return this.http.post(this.baseUrl + '/account/register', user);
    }

    verifyOldPassword(password: string): Observable<boolean> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<boolean>(this.baseUrl + '/account/verifyPassword/' + password, httpOptions);
    }

    decodeToken(): IToken | null {
        if (typeof localStorage !== 'undefined') {
            let jwt = localStorage.getItem('token') as string;
            if (jwt) {
                let jwtData = jwt.split('.')[1]; //Payload
                let decodedJwtJsonData = window.atob(jwtData);
                let decodedJwtData = JSON.parse(decodedJwtJsonData);
                return decodedJwtData as IToken;
            } else {
                return null;
            }
        } else {
            return null;
        }


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
