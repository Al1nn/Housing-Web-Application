import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, catchError } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { PaginatedProperties } from '../../model/PaginatedProperties.interface';

@Injectable({
    providedIn: 'root'
})
export class PropertyDashboardResolverService implements Resolve<PaginatedProperties> {

    constructor(private router: Router, private housingService: HousingService) { }
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<PaginatedProperties> | PaginatedProperties {
        return this.housingService.getUserPaginatedProperty(1, 2).pipe(
            catchError((error) => {
                console.log(error);

                this.router.navigate(['/']);
                return EMPTY;
            })
        );
    }

}
