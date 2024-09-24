import { Injectable } from '@angular/core';
import { IUserForLogin } from '../model/IUser.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IToken } from '../model/IToken.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }


    authUser(user: FormData): Observable<IUserForLogin> {
        return this.http.post<IUserForLogin>(this.baseUrl + '/account/login', user);
    }

    registerUser(user: FormData) {
        return this.http.post(this.baseUrl + '/account/register', user);
    }

    isAdmin() {
        const decodedToken = this.decodeToken();
        if (decodedToken && decodedToken.role) {
            if (Array.isArray(decodedToken.role)) {
                return decodedToken.role.includes('Admin');
            } else {
                return decodedToken.role === 'Admin';
            }
        } else {
            return false;
        }
    }

    isOnlyReader(): boolean {
        const decodedToken = this.decodeToken();

        if (decodedToken && decodedToken.role) {
            if (Array.isArray(decodedToken.role)) {
                return decodedToken.role.includes('Reader') && decodedToken.role.length === 1;
            } else {
                return decodedToken.role === 'Reader';
            }
        } else {
            return false;
        }


    }


    decodeToken(): IToken | null {
        if (typeof localStorage !== 'undefined') {
            const jwt = localStorage.getItem('token') as string;
            if (jwt) {
                const jwtData = jwt.split('.')[1]; // Payload
                const decodedJwtJsonData = window.atob(jwtData);
                const decodedJwtData = JSON.parse(decodedJwtJsonData);
                return decodedJwtData as IToken;
            } else {
                return null;
            }
        } else {
            return null;
        }


    }

    isAuthenticated(): boolean {
        return !!this.decodeToken();
    }

}
