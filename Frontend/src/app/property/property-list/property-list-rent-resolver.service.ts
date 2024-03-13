import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { Property } from '../../model/Property.interface';


@Injectable({
    providedIn: 'root'
})
export class PropertyListRentResolverService implements Resolve<Property[]> {
    constructor(private housingService: HousingService) { }

    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Property[]> {
        return this.housingService.getAllProperties(2);
    }


}
