import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Property } from '../models/Property.interface';
import { EMPTY, Observable, catchError } from 'rxjs';
import { StoreService } from '../store_services/store.service';

@Injectable({
    providedIn: 'root',
})
export class PropertyDetailResolverService implements Resolve<Property> {
    constructor(private router: Router, private store: StoreService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<Property> | Property {
        const propId = route.params['id'];

        return this.store.housingService.getPropertyDetailById(+propId).pipe(
            catchError((error) => {
                console.log(error);

                this.router.navigate(['/']);
                return EMPTY;
            })
        );
    }
}
