import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserCard } from '../models/IUserCard.interface';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { IChat } from '../models/IChat.interface';
@Injectable({
    providedIn: 'root'
})
export class ChatService {

    baseUrl: string = environment.baseUrl;
    private chatPath: string = '/chats';
    chatsRef: AngularFireList<IChat>;



    constructor(private http: HttpClient, private db: AngularFireDatabase) {
        this.chatsRef = this.db.list<IChat>(this.chatPath);
    }


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


    createChat(senderId: string, receiverID: string): Observable<string> {
        const newChat: IChat = {
            lastMessage: '',
            lastMessageDate: new Date(),
            senderID: senderId,
            receiverID: receiverID,
            messages: []
        };

        return new Observable(observer => {
            this.chatsRef.push(newChat).then(ref => {
                observer.next(ref.key as string);
                observer.complete();
            })
        })
    }
}
