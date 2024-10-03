import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, map, Observable, take } from 'rxjs';
import { IUserCard } from '../models/IUserCard.interface';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { IChat, IMessage } from '../models/IChat.interface';
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

    findExistingChat(userId1: string, userId2: string): Observable<string | null> {
        return this.db.list<IChat>(this.chatPath, ref =>
            ref.orderByChild('senderID').equalTo(userId1)
        ).snapshotChanges().pipe(
            take(1),
            map(chats => {
                const chat = chats.find(c =>
                    c.payload.val()?.receiverID === userId2 ||
                    (c.payload.val()?.senderID === userId2 && c.payload.val()?.receiverID === userId1)
                );
                return chat ? chat.key : null;
            })
        );
    }


    createChat(senderID: string, senderPhoto: string, senderName: string, receiverId: string): Observable<string> {
        const newChat: IChat = {
            lastMessage: '',
            lastMessageDate: new Date().toLocaleString(),
            senderID: senderID,
            senderPhoto: senderPhoto,
            senderName: senderName,
            receiverID: receiverId,
            messages: []
        };
        return new Observable(observer => {
            this.chatsRef.push(newChat).then(ref => {
                observer.next(ref.key as string);
                observer.complete();
            });
        });
    }


    getChatById(chatId: string): Observable<IChat | null> {
        return this.db.object<IChat>(`${this.chatPath}/${chatId}`).valueChanges().pipe(
            map(chat => {
                if (chat) {
                    return { ...chat, id: chatId };
                } else {
                    return null;
                }
            })
        );
    }

    sendMessage(chatId: string, message: IMessage): Observable<void> {
        return from(Promise.all([
            this.db.list(`${this.chatPath}/${chatId}/messages`).push(message),
            this.db.object(`${this.chatPath}/${chatId}`).update({
                lastMessage: message.text,
                lastMessageDate: message.sentDate
            })
        ])).pipe(
            map(() => void 0)
        );
    }

}
