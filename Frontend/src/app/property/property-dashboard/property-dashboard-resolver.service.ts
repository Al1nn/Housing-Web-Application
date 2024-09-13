import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, catchError } from 'rxjs';
import { PaginatedProperties } from '../../model/PaginatedProperties.interface';
import { StoreService } from '../../store_services/store.service';

@Injectable({
    providedIn: 'root'
})
export class PropertyDashboardResolverService implements Resolve<PaginatedProperties> {

    constructor(private router: Router, private store: StoreService) { }
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<PaginatedProperties> | PaginatedProperties {
        return this.store.housingService.getUserPaginatedProperty(1, 2).pipe(
            catchError((error) => {
                console.log(error);

                this.router.navigate(['/']);
                return EMPTY;
            })
        );
    }

}
