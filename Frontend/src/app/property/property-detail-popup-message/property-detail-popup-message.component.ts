import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-property-detail-popup-message',
    templateUrl: './property-detail-popup-message.component.html',
    styleUrls: ['./property-detail-popup-message.component.css']
})
export class PropertyDetailPopupMessageComponent {

    messageControl = new FormControl('');

    constructor(private dialogRef: MatDialogRef<PropertyDetailPopupMessageComponent>) { }

    closeEditModal() {
        this.dialogRef.close();
    }

    sendMessage() {
        throw new Error('Method not implemented.');
    }
}
