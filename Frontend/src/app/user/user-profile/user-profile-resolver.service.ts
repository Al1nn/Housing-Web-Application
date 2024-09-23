import { Injectable } from '@angular/core';
import { IUserCard } from '../../model/IUserCard.interface';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from '../../store_services/store.service';

@Injectable({
    providedIn: 'root'
})
export class UserProfileResolverService implements Resolve<IUserCard> {

    constructor(private store: StoreService) { }
    resolve(): Observable<IUserCard> | IUserCard {
        return this.store.usersService.getUserCard();
    }

}
