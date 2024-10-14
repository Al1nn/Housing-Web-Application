import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, from, map, Observable, switchMap, take } from 'rxjs';
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
                        (chatData?.userID_other === userId1 && chatData?.userID_first === userId2) ||
                        (chatData?.userID_other === userId2 && chatData?.userID_first === userId1)
                    );
                });
                return chat ? chat.key : null;
            })
        );
    }


    createChat(messagesCount: number
        , userID_first: string, userName_first: string, userPhoto_first: string
        , userID_other: string, userName_other: string, userPhoto_other: string): Observable<string> {
        const newChat: IChat = {
            lastMessage: '',
            lastMessageDate: new Date().toLocaleString(),
            userID_first: userID_first,
            userName_first: userName_first,
            userPhoto_first: userPhoto_first,
            userID_other: userID_other,
            userName_other: userName_other,
            userPhoto_other: userPhoto_other,
            messagesCount: messagesCount,
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
        return from(this.db.object(`${this.chatPath}/${chatId}`).valueChanges().pipe(
            take(1),
            switchMap((chat: any) => {
                const currentCount = chat.messagesCount || 0;
                const updates = {
                    [`${this.chatPath}/${chatId}/messages/${this.db.createPushId()}`]: message,
                    [`${this.chatPath}/${chatId}/lastMessage`]: message.text,
                    [`${this.chatPath}/${chatId}/lastMessageDate`]: message.sentDate,
                    [`${this.chatPath}/${chatId}/messagesCount`]: currentCount + 1
                };
                return from(this.db.object('/').update(updates));
            })
        )).pipe(
            map(() => void 0)
        );
    }


    setFlag(chatId: string): Observable<void> { // Setez flagul seen = true, de la mesaj, si recalculez messagesCount
        return this.db.object(`${this.chatPath}/${chatId}`).valueChanges().pipe(
            take(1),
            switchMap((chat: any) => {
                const updates: { [key: string]: any } = {};
                let unseenCount = 0;
                if (chat.messages) {
                    Object.keys(chat.messages).forEach(messageKey => {
                        if (chat.messages[messageKey].seen === false) {
                            updates[`${this.chatPath}/${chatId}/messages/${messageKey}/seen`] = true;
                            unseenCount++;
                        }
                    });
                }

                const newMessagesCount = Math.max(0, (chat.messagesCount || 0) - unseenCount);
                updates[`${this.chatPath}/${chatId}/messagesCount`] = newMessagesCount;

                return from(this.db.object('/').update(updates));
            }),
            map(() => void 0)
        );
    }





}
