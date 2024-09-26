import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-property-detail-popup-message',
    templateUrl: './property-detail-popup-message.component.html',
    styleUrls: ['./property-detail-popup-message.component.css']
})
export class PropertyDetailPopupMessageComponent implements OnInit {

    messageControl = new FormControl('');

    constructor(private dialogRef: MatDialogRef<PropertyDetailPopupMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        console.log(this.data.postedBy);

    }

    closeEditModal() {
        this.dialogRef.close();
    }

    sendMessage() {
        throw new Error('Method not implemented.');
    }
}
