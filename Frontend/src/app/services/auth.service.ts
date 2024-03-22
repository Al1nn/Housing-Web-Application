import { Injectable } from '@angular/core';
import { IUserForLogin } from '../model/IUser.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) { }
    baseUrl = environment.baseUrl;

    authUser(user: IUserForLogin): Observable<IUserForLogin> {
        return this.http.post<IUserForLogin>(this.baseUrl + '/account/login', user);
    }

    registerUser(formData: FormData) {
        return this.http.post(this.baseUrl + '/account/register', formData);
    }

    isAdmin(username: string): Observable<boolean> {
        return this.http.get<boolean>(this.baseUrl + '/account/user/' + username);
    }

    getProfileImage() {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get(this.baseUrl + '/account/userProfileImage', httpOptions);
    }
}
