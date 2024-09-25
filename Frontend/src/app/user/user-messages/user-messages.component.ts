import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-user-messages',
    templateUrl: './user-messages.component.html',
    styleUrls: ['./user-messages.component.css']
})
export class UserMessagesComponent {

    searchControl = new FormControl('');
    chatListControl = new FormControl();
    messageControl = new FormControl('');

    constructor() { }

    sendMessage() {
        throw new Error('Method not implemented.');
    }

}
