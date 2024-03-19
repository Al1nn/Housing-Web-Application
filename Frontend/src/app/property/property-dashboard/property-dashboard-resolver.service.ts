import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, catchError } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { IPropertyBase } from '../../model/IPropertyBase.interface';

@Injectable({
  providedIn: 'root'
})
export class PropertyDashboardResolverService implements Resolve<IPropertyBase[]>{

  constructor(private router: Router, private housingService: HousingService) { }
  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<IPropertyBase[]> | IPropertyBase[] {
    return this.housingService.getUserProperties().pipe(
      catchError((error) => {
        console.log(error);

        this.router.navigate(['/']);
        return EMPTY;
      })
    );
  }

}
