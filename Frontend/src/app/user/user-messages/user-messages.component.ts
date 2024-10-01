import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { IUserCard } from '../../models/IUserCard.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { StoreService } from '../../store_services/store.service';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-user-messages',
    templateUrl: './user-messages.component.html',
    styleUrls: ['./user-messages.component.css']
})
export class UserMessagesComponent implements OnInit {

    searchControl = new FormControl('');
    chatListControl = new FormControl();
    messageControl = new FormControl('');
    filteredUsers$: Observable<IUserCard[]>; // Declare as observable of IUserCard[]
    thumbnailFolder: string = environment.thumbnailFolder;
    allUsers: IUserCard[] = []; // Store all users

    constructor(private store: StoreService) { }

    ngOnInit(): void {
        // Load all users initially
        this.loadAllUsers();
    }

    loadAllUsers(): void {
        // Load users and set up filtering
        this.store.usersService.getOtherUsers().subscribe(users => {
            this.allUsers = users; // Store all users for filtering
            // Initialize filteredUsers$ observable
            this.filteredUsers$ = this.searchControl.valueChanges.pipe(
                startWith(''), // Start with empty string to show all users
                debounceTime(300),
                distinctUntilChanged(),
                map(value => this.filterUsers(value as string)) // Directly map to filtered users
            );
        });
    }

    sendMessage() {
        throw new Error('Method not implemented.');
    }

    onUserSelected(event: MatAutocompleteSelectedEvent): void {
        const selectedUser: IUserCard = event.option.value;
        console.log('Selected user: ', selectedUser);
        // Handle selected user (e.g., start a chat)
    }

    private filterUsers(value: string): IUserCard[] {
        const filterValue = value.toLowerCase();
        // Return the filtered users based on input value
        return this.allUsers.filter(user => user.username.toLowerCase().includes(filterValue));
    }
}
