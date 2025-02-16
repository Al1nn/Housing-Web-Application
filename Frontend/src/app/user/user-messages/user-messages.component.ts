import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom, map, Observable, switchMap } from 'rxjs';
import { IUserCard } from '../../models/IUserCard.interface';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';
import { IChat, IMessage } from '../../models/IChat.interface';
import { IToken } from '../../models/IToken.interface';



@Component({
    selector: 'app-user-messages',
    templateUrl: './user-messages.component.html',
    styleUrls: ['./user-messages.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessagesComponent implements OnInit, OnDestroy {

    searchControl = new FormControl('');
    chatListControl = new FormControl();
    messageControl = new FormControl('');
    filteredUsers$: Observable<IUserCard[]>;
    thumbnailFolder: string = environment.thumbnailFolder;


    token: IToken;

    chats$: Observable<IChat[]>;

    @ViewChild('endOfChat') endOfChat!: ElementRef;

    displayPicture: string;
    displayName: string;



    chatId: string | null = null;
    messages$: Observable<IMessage[]>;


    constructor(public store: StoreService) { }
    ngOnDestroy(): void {
        this.setUserOffline();
    }

    ngOnInit(): void {

        this.token = this.store.authService.decodeToken() as IToken;
        this.filteredUsers$ = this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => this.filterUsers(value as string))
        );
        
        this.chats$ = this.store.chatService.getAllChatsByUser(this.token.nameid);
    }

    private async checkForExistingChat(userCard: IUserCard) {

        const userIdOther = userCard.id.toString();
        try {

            this.chatId = await firstValueFrom(
                this.store.chatService.findExistingChat(this.token.nameid, userIdOther)
            );
            // this.store.chatService.deleteNotification(this.token.nameid, userCard.id.toString()).subscribe(() => {
                
            // });

            await this.store.chatService.removeNotification(userCard.id.toString(), this.token.nameid);
            console.log("Our Own ID : " + this.token.nameid);
            console.log(" Other Conversation Account : " + userCard.id.toString());
            
            if (this.chatId === null) {
                await this.createNewChat(userCard);
            } else {
                await this.listenForMessages();
            }
        } catch (error) {
            console.error('Error fetching chat ID:', error);
        }
    }

    private async listenForMessages() {
        if (this.chatId) {
            this.messages$ = this.store.chatService.getMessagesFromChat(this.chatId);
        }
    }



    private async createNewChat(userCard: IUserCard) {
        const messageCount = 0;
        const userIdOther = userCard.id.toString();
        const userNameOther = userCard.username;
        const userPhotoOther = userCard.photo || '';

        try {
            this.chatId = await firstValueFrom(
                this.store.chatService.createChat(
                    messageCount,
                    this.token.nameid,
                    this.token.unique_name,
                    this.token.profile_picture || '',
                    userIdOther,
                    userNameOther,
                    userPhotoOther
                )
            );
            
        } catch (error) {
            console.error('Error creating new chat:', error);
        }

    }

    async sendMessage() {
        const input = this.messageControl.value;

        if (input && this.chatId) {
            const message: IMessage = {
                senderId: this.token.nameid,
                senderName: this.token.unique_name,
                senderPhoto: this.token.profile_picture || '',
                sentDate: new Date().toLocaleString(),
                seen: false,
                text: input
            };

            this.store.chatService.sendMessage(this.chatId, message).subscribe(() => {
                this.messageControl.reset();
            });

            await this.listenForMessages();
            
        }
    }



    private async setFlags() {
        if (this.chatId) {
            this.store.chatService.setFlag(this.chatId, this.token.nameid).subscribe(() => {
                
            });
        }
    }

    private async setUserOffline() {
        if (this.chatId) {
            this.store.chatService.setUserOffline(this.chatId, this.token.nameid).subscribe(() => {
                
            })
        }
    }

    private async setUserOnline() {
        if (this.chatId) {
            this.store.chatService.setUserOnline(this.chatId, this.token.nameid).subscribe(() => {
                
            })
        }
    }

    async onOptionSelected(chat: IChat) {
        

        if (this.chatId !== null) {
            this.setUserOffline();
        }


        if (!(this.token.nameid === chat.userID_first)) {
            // this.store.chatService.deleteNotification(chat.userID_other, chat.userID_first).subscribe(() => {
        
            // });
            //this.store.chatService.removeNotification(chat.userID_other, this.token.nameid);
            await this.store.chatService.removeNotification( chat.userID_first, this.token.nameid);
            console.log("Our own id : " + this.token.nameid);
            console.log("CHAT user FIRST ID : " + chat.userID_first);
            console.log("CHAT user OTHER ID : " + chat.userID_other);

            this.displayPicture = chat.userPhoto_first;
            this.displayName = chat.userName_first;
        } else {
            // this.store.chatService.deleteNotification(chat.userID_first, chat.userID_other).subscribe(() => {
        
            // });
            await this.store.chatService.removeNotification( chat.userID_other, this.token.nameid);

            console.log("Our own id : " + this.token.nameid);
            console.log("CHAT user FIRST ID : " + chat.userID_first);
            console.log("CHAT user OTHER ID : " + chat.userID_other);

            this.displayPicture = chat.userPhoto_other;
            this.displayName = chat.userName_other;
        }

        this.chatId = chat.id as string;

        await this.setUserOnline();
        await this.setFlags();
        await this.listenForMessages();
        


    }

    async onSuggestionSelected(user: IUserCard) {
        
        await this.setUserOffline();
        await this.checkForExistingChat(user);
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
        }, 300);
    }
}
