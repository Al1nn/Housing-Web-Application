import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCard } from '../models/IUserCard.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  getPropertyOwner(postedBy: number): Observable<IUserCard> {
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token') || '';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get<IUserCard>(`${this.baseUrl}/property/owner/${postedBy}`, httpOptions);
  }
}
