import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOtherUsers } from '../model/IUserCard.interface';


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }


    getOtherUsers(): Observable<IOtherUsers[]> {
        let token = '';
        if (typeof window !== 'undefined' && window.localStorage) {
            token = localStorage.getItem('token') || '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token
            })
        };

        return this.http.get<IOtherUsers[]>(this.baseUrl + '/account/others', httpOptions);
    }

    verifyOldPassword(password: string): Observable<boolean> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<boolean>(this.baseUrl + '/account/verifyPassword/' + password, httpOptions);
    }

    updatePassword(newPassword: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.put(this.baseUrl + '/account/updatePassword/' + newPassword, {}, httpOptions);
    }

    updateAvatar(oldPictureName: string, file: FormData) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.put(this.baseUrl + '/account/updateAvatar/' + oldPictureName, file, httpOptions);
    }
}
