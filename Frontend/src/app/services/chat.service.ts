import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, combineLatest, from, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { IUserCard } from '../models/IUserCard.interface';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { IChat, IMessage } from '../models/IChat.interface';
import { INotification } from '../models/INotification.interface';


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
            lastMessageBy: '',
            userID_first: userID_first,
            userName_first: userName_first,
            userPhoto_first: userPhoto_first,
            userID_other: userID_other,
            userName_other: userName_other,
            userPhoto_other: userPhoto_other,
            userOnline_first: false,
            userOnline_other: false,
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


    getChatById(chatId: string, userId: string): Observable<IChat | null> {
        return this.db.object<IChat>(`${this.chatPath}/${chatId}`).valueChanges().pipe(
            take(1),
            switchMap(chat => {
                if (chat) {
                    const updateObj = chat.userID_first === userId
                        ? { userOnline_first: true }
                        : { userOnline_other: true };

                    return this.db.object(`${this.chatPath}/${chatId}`).update(updateObj).then(() => chat);
                }
                return Promise.resolve(null);
            }),
            map(chat => chat ? { ...chat, id: chatId } : null)
        );
    }


    getMessagesFromChat(chatId: string): Observable<IMessage[]> {
        return this.db.object<IChat>(`${this.chatPath}/${chatId}`).valueChanges().pipe(
            map((chat: IChat | null) => {
                if (!chat || !chat.messages) {
                    return [];
                }

                return Object.values(chat.messages);
            })
        );
    }

    getAllChatsByUser(nameId: string): Observable<IChat[]> {

        const receiverChats$ = this.db.list<IChat>(this.chatPath, ref =>
            ref.orderByChild('userID_first').equalTo(nameId)
        ).snapshotChanges().pipe(
            map(changes => changes.map(c => ({
                id: c.payload.key,
                ...c.payload.val() as IChat
            })))
        );

        const senderChats$ = this.db.list<IChat>(this.chatPath, ref =>
            ref.orderByChild('userID_other').equalTo(nameId)
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
                const messageKey = this.db.createPushId();

                const updates = {
                    [`${this.chatPath}/${chatId}/messages/${messageKey}`]: message,
                    [`${this.chatPath}/${chatId}/lastMessage`]: message.text,
                    [`${this.chatPath}/${chatId}/lastMessageDate`]: message.sentDate,
                    [`${this.chatPath}/${chatId}/lastMessageBy`]: message.senderName,
                    [`${this.chatPath}/${chatId}/messagesCount`]: currentCount + 1
                };


                return from(this.db.object('/').update(updates)).pipe(
                    switchMap(() => {

                        if (chat.userOnline_first && chat.userOnline_other) {
                            const seenUpdate = {
                                [`${this.chatPath}/${chatId}/messages/${messageKey}/seen`]: true,
                                [`${this.chatPath}/${chatId}/messagesCount`]: 0
                            };
                            return from(this.db.object('/').update(seenUpdate));
                        }else{

                           

                            var destinationID = chat.userOnline_first === true ? chat.userID_other : chat.userID_first;
                            destinationID = chat.userOnline_other === true ? chat.userID_first : chat.userID_other;


       
                            this.sendNotification(message.senderId, message.senderName, message.senderPhoto, destinationID);
                            return of(void 0);
                        } 
                    
                        
                         
                        
                    })
                );
            })
        )).pipe(
            map(() => void 0)
        );
    }

    private async checkForDuplicateNotification(
        notification: INotification,
        destinationId: string,
      ): Promise<boolean> {
        try {
          const notificationPath = `notifications/${destinationId}`;
          
          // Get recent notifications
          const snapshot = await this.db.list(notificationPath, ref =>
            ref.orderByChild('senderId')
            // Limit the query to recent notifications for better performance
            .limitToLast(10)
          ).query.once('value');
    
          if (!snapshot.exists()) {
            return false;
          }
    
          const notifications = snapshot.val();
          
          
    
          // Check for duplicates within the time window
          return Object.values(notifications).some((existingNotification: any) => {
            
            
    
            return (
              existingNotification.senderId === notification.senderId 
            );
          });
        } catch (error) {
          console.error('Error checking for duplicate notifications:', error);
          return false;
        }
      }


      async sendNotification(senderId: string, senderName: string, senderPhoto: string, destinationId: string) {
        const notification: INotification = {
          senderId: senderId,
          senderName: senderName,
          senderPhoto: senderPhoto,
          notification: "New message from " + senderName,
          dateTime: new Date().toLocaleString()
        };
    
        try {
         
          const isDuplicate = await this.checkForDuplicateNotification(notification, destinationId);
          
          if (isDuplicate) {
            console.log('Duplicate notification detected, skipping:', notification);
            return of(null);
          }
    
          console.log('Sending notification:', notification);
          const notificationPath = `notifications/${destinationId}`;
          
          return from(this.db.list(notificationPath).push(notification)).pipe(
            catchError(error => {
              console.error('Error sending notification:', error);
              return throwError(() => error);
            })
          );

        } catch (error) {
          console.error('Error in sendNotification:', error);
          return throwError(() => error);
        }
      }

      listenNotifications(destinationId: string): Observable<INotification[]> {
        const notificationPath = `notifications/${destinationId}`;
        
        return this.db.list<INotification>(notificationPath).snapshotChanges().pipe(
          map(changes =>
            changes.map(c => ({ key: c.payload.key, ...c.payload.val() as INotification }))
          )
        );
      }
    
    
      async removeNotification(senderId: string, destinationId: string): Promise<void> {
        try {
            const notificationPath = `notifications/${destinationId}`;
    
            // Get all notifications for the destinationId
            const snapshot = await this.db.list(notificationPath).query.once('value');
    
            if (!snapshot.exists()) {
                console.log('No notifications found for destination:', destinationId);
                return;
            }
    
            const updates: any = {};
            snapshot.forEach(childSnapshot => {
                const notification = childSnapshot.val();
                if (notification.senderId === senderId) {
                    updates[childSnapshot.key!] = null; // Mark for deletion
                }
            });
    
            if (Object.keys(updates).length > 0) {
                await this.db.object(notificationPath).update(updates);
                console.log(`Notifications from senderId ${senderId} removed successfully.`);
            } else {
                console.log(`No matching notifications found for senderId: ${senderId}`);
            }
    
        } catch (error) {
            console.error('Error removing notification:', error);
        }
    }
    




        setFlag(chatId: string, userId: string): Observable<void> { // Setez flagul seen = true, de la mesaj, si recalculez messagesCount
            return this.db.object(`${this.chatPath}/${chatId}`).valueChanges().pipe(
                take(1),
                switchMap((chat: any) => {
                    const updates: { [key: string]: any } = {};
                    let unseenCount = 0;
                    if (chat.messages) {
                        Object.keys(chat.messages).forEach(messageKey => {
                            if (chat.messages[messageKey].seen === false && chat.messages[messageKey].senderId !== userId) {
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





    setUserOffline(chatId: string, userId: string): Observable<void> {
        return this.db.object(`chats/${chatId}`).valueChanges().pipe(
            take(1),
            switchMap((chat: any) => {
                if (!chat) {
                    throw new Error('Chat not found');
                }

                if (chat.userID_first === userId) {
                    return from(this.db.object(`chats/${chatId}`).update({ userOnline_first: false }));
                } else if (chat.userID_other === userId) {
                    return from(this.db.object(`chats/${chatId}`).update({ userOnline_other: false }));
                } else {
                    throw new Error('User not found in this chat');
                }
            })
        );
    }



    setUserOnline(chatId: string, userId: string): Observable<void> {
        return this.db.object(`chats/${chatId}`).valueChanges().pipe(
            take(1),
            switchMap((chat: any) => {
                if (!chat) {
                    throw new Error('Chat not found');
                }

                if (chat.userID_first === userId) {
                    return from(this.db.object(`chats/${chatId}`).update({ userOnline_first: true }));
                } else if (chat.userID_other === userId) {
                    return from(this.db.object(`chats/${chatId}`).update({ userOnline_other: true }));
                } else {
                    throw new Error('User not found in this chat');
                }
            })
        );
    }

   

}