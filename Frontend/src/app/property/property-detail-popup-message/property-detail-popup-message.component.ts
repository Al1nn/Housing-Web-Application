import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class PropertyDetailPopupMessageComponent implements OnInit, OnDestroy {

    messageControl = new FormControl('');
    thumbnailFolder: string = environment.thumbnailFolder;

    token: IToken = this.store.authService.decodeToken() as IToken;


    userCard: IUserCard = {} as IUserCard;



    messages: IMessage[];


    @ViewChild('endOfChat') endOfChat!: ElementRef;
    chatId: string | null;

    constructor(public store: StoreService, private dialogRef: MatDialogRef<PropertyDetailPopupMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnDestroy(): void {
        this.setUserOffline();
    }

    ngOnInit(): void {
        this.store.chatService.getPropertyOwner(this.data.postedBy).subscribe(data => {
            this.userCard = data;
            this.checkForExistingChat(this.userCard.id.toString())
        });

        this.dialogRef.backdropClick().subscribe(async () => {
            await this.setUserOffline();
            this.dialogRef.close();
        });
    }


    private async checkForExistingChat(other_id: string) {
        try {
            this.chatId = await firstValueFrom(
                this.store.chatService.findExistingChat(this.token.nameid, other_id)
            );
           
            if (this.chatId === null) {
                await this.createNewChat(other_id);
            } else {
                await this.setFlags();
                await this.deleteNotifications();
                await this.listenForMessages();
            }
            await this.setUserOnline();
        } catch (error) {
            console.error('Error fetching chat ID:', error);
        }
    }

    private deleteNotifications() {
        if (this.token) {
            // this.store.chatService.deleteNotification(this.token.nameid, this.data.postedBy.toString()).subscribe(() => {
               
            // });

            this.store.chatService.removeNotification(this.data.postedBy.toString(), this.token.nameid);
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



    scrollToBottom() {
        setTimeout(() => {
            if (this.endOfChat) {
                this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    async closeEditModal() {
        await this.setUserOffline();
        this.dialogRef.close();
    }



    //Also If I click outside the modal I want to await this.setUserOffline()
}
