import { Injectable } from '@angular/core';
import { IUser } from '../model/IUser.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  authUser(user: IUser) {
    let UserArray = [];
    if (localStorage.getItem('Users')) {
      UserArray = JSON.parse(localStorage.getItem('Users') as string);
    }
    return UserArray.find(
      (p: any) => p.userName === user.userName && p.password === user.password
    );
  }
}
