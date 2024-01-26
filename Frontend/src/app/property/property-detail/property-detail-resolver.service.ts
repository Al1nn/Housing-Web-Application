import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Property } from '../../model/Property.interface';
import { EMPTY, Observable, catchError, of } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailResolverService implements Resolve<Property> {
  constructor(private router: Router, private housingService: HousingService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Property> | Property {
    const propId = route.params['id'];

    return this.housingService.getPropertyById(+propId).pipe(
      catchError((error) => {
        this.router.navigate(['/']);
        return EMPTY;
      })
    );
  }
}
