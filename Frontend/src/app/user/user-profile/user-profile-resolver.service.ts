import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreService } from '../../store_services/store.service';
import { IOtherUsers } from '../../model/IUserCard.interface';

@Injectable({
    providedIn: 'root'
})
export class UserProfileResolverService implements Resolve<IOtherUsers[]> {

    constructor(private store: StoreService) { }
    resolve(): Observable<IOtherUsers[]> | IOtherUsers[] {
        return this.store.usersService.getOtherUsers();
    }

}
