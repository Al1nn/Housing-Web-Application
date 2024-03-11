import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Property } from '../../model/Property.interface';
import { EMPTY, Observable, catchError } from 'rxjs';
import { HousingService } from '../../services/housing.service';

@Injectable({
    providedIn: 'root',
})
export class PropertyDetailResolverService implements Resolve<Property> {
    constructor(private router: Router, private housingService: HousingService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<Property> | Property {
        const propId = route.params['id'];

        return this.housingService.getPropertyDetailById(+propId).pipe(
            catchError((error) => {
                console.log(error);
                this.router.navigate(['/']);
                return EMPTY;
            })
        );
    }
}
