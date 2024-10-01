import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { IUserCard } from '../../models/IUserCard.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';
import { IChat } from '../../models/IChat.interface';

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

    constructor(private store: StoreService) { }

    ngOnInit(): void {

        this.filteredUsers$ = this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => this.filterUsers(value as string))
        );

    }

    sendMessage() {
        throw new Error('Method not implemented.');
    }


    onUserSelected(event: MatAutocompleteSelectedEvent): void {
        const selectedUser: IUserCard = event.option.value;
        console.log('Selected user: ', selectedUser);

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
