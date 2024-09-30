import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUserCard } from '../../models/IUserCard.interface';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-property-detail-popup-message',
    templateUrl: './property-detail-popup-message.component.html',
    styleUrls: ['./property-detail-popup-message.component.css']
})
export class PropertyDetailPopupMessageComponent implements OnInit {

    messageControl = new FormControl('');
    thumbnailFolder: string = environment.thumbnailFolder;
    userCard: IUserCard = {} as IUserCard;
    chatId: string | null = null;
    constructor(private store: StoreService, private dialogRef: MatDialogRef<PropertyDetailPopupMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.store.chatService.getPropertyOwner(this.data.postedBy).subscribe(data => {
            this.userCard = data;
            this.initializeChat();
        });
    }

    closeEditModal() {
        this.dialogRef.close();
    }

    initializeChat() {
        const nameId = this.store.authService.decodeToken()?.nameid as string;
        if (nameId) {
            this.store.chatService.getOrCreateChat(nameId, this.data.postedBy).subscribe(chatId => {
                this.chatId = chatId;

            })
        }
    }

    sendMessage() {
        const input = this.messageControl.value;

        console.log(input);

        this.messageControl.patchValue('');
    }
}
