import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, Subscription, switchMap } from 'rxjs';
import { IUserCard } from '../../models/IUserCard.interface';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';
import { IChat, IMessage } from '../../models/IChat.interface';
import { IToken } from '../../models/IToken.interface';

@Component({
    selector: 'app-user-messages',
    templateUrl: './user-messages.component.html',
    styleUrls: ['./user-messages.component.css']
})
export class UserMessagesComponent implements OnInit, OnDestroy {


    searchControl = new FormControl('');
    chatListControl = new FormControl();
    messageControl = new FormControl('');
    filteredUsers$: Observable<IUserCard[]>;
    thumbnailFolder: string = environment.thumbnailFolder;
    chatId: string | null = null;
    chats$: Observable<IChat[]>;
    token: IToken;
    messages: IMessage[] = [];
    @ViewChild('endOfChat') endOfChat!: ElementRef;
    //For frontend
    displayPicture: string;
    displayName: string;

    private chatSubscription: Subscription | null = null;


    constructor(public store: StoreService) { }
    ngOnDestroy(): void {
        if (this.chatSubscription) {
            this.chatSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.token = this.store.authService.decodeToken() as IToken;

        this.filteredUsers$ = this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => this.filterUsers(value as string))
        );

        if (this.token) {
            this.chats$ = this.store.chatService.getAllChatsByUser(this.token.nameid);
        }
    }




    sendMessage() {
        const input = this.messageControl.value;

        if (input && this.chatId) {
            const message: IMessage = {
                senderId: this.token.nameid,
                sentDate: new Date().toLocaleString(),
                text: input
            };

            this.store.chatService.sendMessage(this.chatId, message).subscribe(
                () => {

                    this.chatSubscription = this.store.chatService.getChatById(this.chatId as string).subscribe(chat => {
                        if (chat) {
                            this.messages = Object.values(chat.messages);
                            this.scrollToBottom();
                        }
                    });
                    this.messageControl.reset();

                },
                error => {
                    console.error('Error sending message:', error);
                }
            );
        }
    }

    onOptionSelected(chat: IChat) {
        if (!(this.token.nameid === chat.receiverID)) {
            this.displayPicture = chat.receiverPhoto;
            this.displayName = chat.receiverName;
        } else {
            this.displayPicture = chat.senderPhoto;
            this.displayName = chat.senderName;
        }



        this.chatId = chat.id as string;
        if (chat.id) {
            this.chatSubscription = this.store.chatService.getChatById(chat.id).subscribe((data: any) => {

                if (data.messages) {
                    this.messages = Object.values(data.messages);
                    this.scrollToBottom();
                } else {
                    this.messages = [];
                }


            });
        }

    }


    onSuggestionSelected(user: IUserCard) {
        console.log(user);
        console.log(this.token.nameid);
        console.log(this.token.unique_name);
        console.log(this.token.profile_picture);

        this.chatSubscription = this.store.chatService.findExistingChat(user.id.toString(), this.token.nameid).subscribe(chatId => {
            if (chatId) {
                console.log('Chat exists');
                this.store.chatService.getChatById(chatId).subscribe(data => {
                    if (data) {
                        this.displayName = data.senderName;
                        this.displayPicture = data.senderPhoto;
                        this.messages = Object.values(data.messages);
                        this.scrollToBottom();
                    }
                });
            } else {
                this.store.chatService.createChat(user.id.toString()
                    , user.photo || '', user.username, this.token.nameid
                    , this.token.profile_picture || '', this.token.unique_name).subscribe(() => {
                        this.displayName = user.username;
                        this.displayPicture = user.photo || '';
                    })
            }
        });
    }

    private filterUsers(value: string | IUserCard): Observable<IUserCard[]> {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
        return this.store.usersService.getOtherUsers().pipe(
            map(users => users.filter(user =>
                user.username.toLowerCase().includes(filterValue)
            ))
        );
    }


    scrollToBottom() {
        setTimeout(() => {
            if (this.endOfChat) {
                this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

}
