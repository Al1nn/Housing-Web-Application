import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { IUserCard } from '../../models/IUserCard.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';
import { IChat, IMessage } from '../../models/IChat.interface';
import { IToken } from '../../models/IToken.interface';

@Component({
    selector: 'app-user-messages',
    templateUrl: './user-messages.component.html',
    styleUrls: ['./user-messages.component.css']
})
export class UserMessagesComponent implements OnInit {

    searchControl = new FormControl('');
    chatListControl = new FormControl();
    messageControl = new FormControl('');
    filteredUsers$: Observable<IUserCard[]>;
    thumbnailFolder: string = environment.thumbnailFolder;
    chats$: Observable<IChat[]>;
    token: IToken;
    messages: IMessage[] = [];

    //For frontend
    displayPicture: string;
    displayName: string;


    constructor(public store: StoreService) { }

    ngOnInit(): void {
        this.token = this.store.authService.decodeToken() as IToken;

        this.filteredUsers$ = this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => this.filterUsers(value as string))
        );
    }




    sendMessage() {
        const input = this.messageControl.value;
        if (input) {
            this.messageControl.reset();
        }
        console.log(input);
    }


    onUserSelected(event: MatAutocompleteSelectedEvent): void {
        const selectedUser: IUserCard = event.option.value;
        console.log('Selected user: ', selectedUser);

    }

    onOptionSelected(chat: IChat) {
        this.displayPicture = chat.senderPhoto;
        this.displayName = chat.senderName;
        console.log(this.messages);
    }

    private filterUsers(value: string | IUserCard): Observable<IUserCard[]> {
        const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
        return this.store.usersService.getOtherUsers().pipe(
            map(users => users.filter(user =>
                user.username.toLowerCase().includes(filterValue)
            ))
        );
    }

}
