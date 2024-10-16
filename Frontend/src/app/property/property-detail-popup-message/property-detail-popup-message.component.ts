import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUserCard } from '../../models/IUserCard.interface';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';
import { IMessage } from '../../models/IChat.interface';
import { IToken } from '../../models/IToken.interface';
import { firstValueFrom } from 'rxjs';


@Component({
    selector: 'app-property-detail-popup-message',
    templateUrl: './property-detail-popup-message.component.html',
    styleUrls: ['./property-detail-popup-message.component.css']
})
export class PropertyDetailPopupMessageComponent implements OnInit {

    messageControl = new FormControl('');
    thumbnailFolder: string = environment.thumbnailFolder;

    token: IToken = this.store.authService.decodeToken() as IToken;


    userCard: IUserCard = {} as IUserCard;



    messages: IMessage[];


    @ViewChild('endOfChat') endOfChat!: ElementRef;
    chatId: string | null;

    constructor(public store: StoreService, private dialogRef: MatDialogRef<PropertyDetailPopupMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.store.chatService.getPropertyOwner(this.data.postedBy).subscribe(data => {
            this.userCard = data;
            this.checkForExistingChat(this.userCard.id.toString())
        });
    }


    private async checkForExistingChat(other_id: string) {
        try {
            this.chatId = await firstValueFrom(
                this.store.chatService.findExistingChat(this.token.nameid, other_id)
            );
            console.log('Chat ID:', this.chatId);
            if (this.chatId === null) {
                await this.createNewChat(other_id);
            } else {
                await this.listenForMessages();
            }
        } catch (error) {
            console.error('Error fetching chat ID:', error);
        }
    }


    private async listenForMessages() {
        if (this.chatId) {
            this.store.chatService.getMessagesFromChat(this.chatId).subscribe(messages => {
                this.messages = messages;
                this.scrollToBottom();
            });
        }
    }

    private async createNewChat(other_id: string) {
        const messageCount = 0;
        const userNameOther = this.userCard.username;
        const userPhotoOther = this.userCard.photo || '';

        try {
            this.chatId = await firstValueFrom(
                this.store.chatService.createChat(
                    messageCount,
                    this.token.nameid,
                    this.token.unique_name,
                    this.token.profile_picture || '',
                    other_id,
                    userNameOther,
                    userPhotoOther
                )
            );
            console.log('New Chat Created with ID:', this.chatId);
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
            })
            await this.listenForMessages();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.endOfChat) {
                this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    closeEditModal() {

        this.dialogRef.close();
    }
}
