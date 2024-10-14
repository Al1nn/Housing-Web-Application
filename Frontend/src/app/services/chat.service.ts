import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, from, map, Observable, of, take } from 'rxjs';
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
        return this.db.list<IChat>(this.chatPath).snapshotChanges().pipe(
            take(1),
            map(chats => {
                const chat = chats.find(c => {
                    const chatData = c.payload.val();
                    return (
                        (chatData?.senderID === userId1 && chatData?.receiverID === userId2) ||
                        (chatData?.senderID === userId2 && chatData?.receiverID === userId1)
                    );
                });
                return chat ? chat.key : null;
            })
        );
    }


    createChat(seenCount: number, senderID: string, senderPhoto: string, senderName: string, receiverId: string, receiverPhoto: string, receiverName: string): Observable<string> {
        const newChat: IChat = {
            lastMessage: '',
            lastMessageDate: new Date().toLocaleString(),
            senderID: senderID,
            senderPhoto: senderPhoto,
            senderName: senderName,
            receiverID: receiverId,
            receiverName: receiverName,
            receiverPhoto: receiverPhoto,
            seenCount: seenCount,
            messages: [],
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

    getAllChatsByUser(nameId: string): Observable<IChat[]> {

        const receiverChats$ = this.db.list<IChat>(this.chatPath, ref =>
            ref.orderByChild('receiverID').equalTo(nameId)
        ).snapshotChanges().pipe(
            map(changes => changes.map(c => ({
                id: c.payload.key,
                ...c.payload.val() as IChat
            })))
        );

        const senderChats$ = this.db.list<IChat>(this.chatPath, ref =>
            ref.orderByChild('senderID').equalTo(nameId)
        ).snapshotChanges().pipe(
            map(changes => changes.map(c => ({
                id: c.payload.key,
                ...c.payload.val() as IChat
            })))
        );


        return combineLatest([receiverChats$, senderChats$]).pipe(
            map(([receiverChats, senderChats]) => {
                const allChats = [...receiverChats, ...senderChats];
                const uniqueChats = Array.from(new Set(allChats.map(chat => chat.id)))
                    .map(id => allChats.find(chat => chat.id === id)!);
                return uniqueChats;
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
            map(() => {
                return void 0;
            })
        );
    }

    //Update every message from the chat (seen = true), also update the seenCount.
    // seenAllMessages(chatId: string) {

    // }

    seenAllMessages(chatId: string, receiverId: string): Observable<void> {
        return this.getChatById(chatId).pipe(
            take(1),
            map(chat => {
                if (chat && chat.messages) {
                    let seenCount = chat.seenCount;
                    const updatedMessages = Object.entries(chat.messages).reduce((acc, [key, message]) => {
                        if (message.senderId !== receiverId) {
                            acc[key] = { ...message, seen: true };
                            seenCount += 1;
                        } else {
                            seenCount = chat.seenCount;
                            acc[key] = message;
                        }
                        return acc;
                    }, {} as Record<string, IMessage>);

                    return from(Promise.all([
                        this.db.object(`${this.chatPath}/${chatId}/messages`).set(updatedMessages),
                        this.db.object(`${this.chatPath}/${chatId}`).update({ seenCount: seenCount })
                    ]));
                }
                return of(null);
            }),
            map(() => void 0)
        );
    }

    //For notifications I need a getter THAT GETS ALL THE MESSAGES FROM CHATS WITH RECEIVER ID = CURRENT USER ID FROM TOKEN SENT TO THE CURRENT USER (TOKEN) WHERE SEEN = FALSE.
    //  GetSentMessages(receiverId: string ){
    //  }
}
