import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUserCard } from '../../models/IUserCard.interface';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';
import { IMessage } from '../../models/IChat.interface';
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
    messages: IMessage[] = [];
    @ViewChild('endOfChat') endOfChat!: ElementRef;
    private messagesSubscription: Subscription | null = null;

    constructor(public store: StoreService, private dialogRef: MatDialogRef<PropertyDetailPopupMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


    ngOnInit(): void {
        this.store.chatService.getPropertyOwner(this.data.postedBy).subscribe(data => {
            this.userCard = data;
            this.initializeChat();
        });
    }

    ngOnDestroy(): void {
        if (this.messagesSubscription) {
            this.messagesSubscription.unsubscribe();
        }
    }

    closeEditModal() {
        this.dialogRef.close();
    }

    initializeChat() {
        const nameId = this.store.authService.decodeToken()?.nameid as string;
        if (nameId) {
            this.store.chatService.getOrCreateChat(nameId, this.data.postedBy).subscribe(chatId => {
                this.chatId = chatId;
                this.loadMessages();
            })
        }
    }

    loadMessages() {
        if (this.chatId) {
            this.messagesSubscription = this.store.chatService.getChatMessages(this.chatId)
                .subscribe(messages => {
                    this.messages = messages;

                });
        }
        this.scrollToBottom();
    }


    sendMessage() {
        const input = this.messageControl.value;
        if (input && this.chatId) {
            const nameId = this.store.authService.decodeToken()?.nameid as string;
            if (nameId) {
                const newMessage: IMessage = {
                    senderId: nameId,
                    sentDate: new Date().toLocaleString(), //sentDate must be the present time
                    text: input
                };

                this.store.chatService.sendMessage(this.chatId, newMessage)
                    .then(() => {
                        this.messageControl.setValue('');
                        this.scrollToBottom();
                    })
                    .catch(error => console.error('Error sending message:', error));
            }
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
