import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from '../../store_services/store.service';
import { IUserCard } from '../../models/IUserCard.interface';

@Injectable({
    providedIn: 'root'
})
export class UserProfileResolverService implements Resolve<IUserCard[]> {

    constructor(private store: StoreService) { }
    resolve(): Observable<IUserCard[]> | IUserCard[] {
        return this.store.usersService.getOtherUsers();
    }

}
