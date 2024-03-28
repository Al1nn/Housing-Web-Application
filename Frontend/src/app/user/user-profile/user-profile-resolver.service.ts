import { Injectable } from '@angular/core';
import { IUserCard } from '../../model/IUserCard.interface';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileResolverService implements Resolve<IUserCard>{

  constructor(private authService: AuthService) { }
  resolve(): Observable<IUserCard> | IUserCard {
    return this.authService.getUserCard();
  }

}
