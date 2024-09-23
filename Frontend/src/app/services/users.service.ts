import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCard } from '../model/IUserCard.interface';
import { IImage } from '../model/IImage.interface';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

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
        return this.http.get<IUserCard>(this.baseUrl + '/account/card', httpOptions);
    }

    getUserCards(): Observable<IUserCard[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<IUserCard[]>(this.baseUrl + '/account/cards', httpOptions);
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
