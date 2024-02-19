import { Injectable } from '@angular/core';
import { IUser } from '../model/IUser.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    authUser(user: IUser) {
        let userArray = [];
        if (localStorage.getItem('Users')) {
            userArray = JSON.parse(localStorage.getItem('Users') as string);
        }
        return userArray.find(
            (p: any) => p.userName === user.userName && p.password === user.password
        );
    }
}
