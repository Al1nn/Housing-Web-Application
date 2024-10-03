import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUserCard } from '../../models/IUserCard.interface';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';
import { IMessage } from '../../models/IChat.interface';
import { IToken } from '../../models/IToken.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-property-detail-popup-message',
    templateUrl: './property-detail-popup-message.component.html',
    styleUrls: ['./property-detail-popup-message.component.css']
})
export class PropertyDetailPopupMessageComponent implements OnInit, OnDestroy {

    messageControl = new FormControl('');
    thumbnailFolder: string = environment.thumbnailFolder;
    userCard: IUserCard = {} as IUserCard;
    chatId: string | null = null;
    token: IToken = {} as IToken;
    messages: IMessage[];
    @ViewChild('endOfChat') endOfChat!: ElementRef;
    private chatSubscription: Subscription | null = null;

    constructor(public store: StoreService, private dialogRef: MatDialogRef<PropertyDetailPopupMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


    ngOnDestroy(): void {
        if (this.chatSubscription) {
            this.chatSubscription.unsubscribe();
        }
    }


    ngOnInit(): void {
        this.token = this.store.authService.decodeToken() as IToken;
        this.store.chatService.getPropertyOwner(this.data.postedBy).subscribe(data => {
            this.userCard = data;
            this.initializeChat();
        });


    }

    initializeChat() {
        this.store.chatService.findExistingChat(this.token.nameid, this.data.postedBy.toString()).subscribe(existingChatId => {
            if (existingChatId) {
                this.chatId = existingChatId;
                this.loadChat();
            } else {
                this.createChat();
            }
        });
    }

    createChat() {
        this.store.chatService.createChat(this.token.nameid, this.token.profile_picture as string, this.token.unique_name, this.data.postedBy.toString(), this.userCard.photo || '', this.userCard.username).subscribe(data => {
            this.chatId = data;
        });
    }

    loadChat() {
        if (this.chatId) {
            this.chatSubscription = this.store.chatService.getChatById(this.chatId).subscribe(chat => {
                if (chat) {
                    this.messages = Object.values(chat.messages);
                    this.scrollToBottom();
                }
            });
        }
    }

    closeEditModal() {
        this.dialogRef.close();
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

    scrollToBottom() {
        setTimeout(() => {
            if (this.endOfChat) {
                this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
}
