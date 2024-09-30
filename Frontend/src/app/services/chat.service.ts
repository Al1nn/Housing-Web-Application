import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable, switchMap } from 'rxjs';
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

    getOrCreateChat(senderId: string, receiverId: string): Observable<string> {
        return this.findExistingChat(senderId, receiverId).pipe(
            switchMap(chatId => {
                if (chatId) {
                    return from(Promise.resolve(chatId));
                } else {
                    return this.createNewChat(senderId, receiverId);
                }
            })
        );
    }


    private createNewChat(senderId: string, receiverId: string): Observable<string> {
        const newChat: IChat = {
            lastMessage: '',
            lastMessageDate: new Date(),
            senderID: senderId,
            receiverID: receiverId,
            messages: []
        };
        return from(this.db.list(this.chatPath).push(newChat)).pipe(
            map(ref => ref.key as string)
        );
    }

    private findExistingChat(senderId: string, receiverId: string): Observable<string | null> {
        return this.db.list<IChat>(this.chatPath, ref =>
            ref.orderByChild('senderID').equalTo(senderId)
        ).snapshotChanges().pipe(
            map(changes => {
                const chat = changes.find(c => c.payload.val()?.receiverID === receiverId);
                return chat ? chat.key : null;
            })
        );
    }

    getChat(chatId: string): Observable<IChat | null> {
        return this.db.object<IChat>(`${this.chatPath}/${chatId}`).valueChanges().pipe(
            map(chat => {
                if (chat === null) {
                    console.log(`Chat with ID ${chatId} not found`);
                    return null;
                }
                return chat;
            })
        );
    }
}
