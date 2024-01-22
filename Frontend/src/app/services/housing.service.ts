import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IProperty } from '../model/IProperty.interface';
import { Observable } from 'rxjs';
import { Property } from '../model/Property.interface';
import { IPropertyBase } from '../model/IPropertyBase.interface';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  constructor(private http: HttpClient) {}

  getAllProperties(SellRent: number): Observable<IPropertyBase[]> {
    return this.http
      .get<{ [key: string]: IPropertyBase }>('data/properties.json')
      .pipe(
        map((data) => {
          const propertiesArray: IPropertyBase[] = [];

          for (const id in data) {
            if (data.hasOwnProperty(id) && data[id].SellRent === SellRent) {
              propertiesArray.push(data[id]);
            }
          }
          return propertiesArray;
        })
      );
  }

  getPropertyById(propertyId: number): Observable<IProperty> {
    return this.http
      .get<IProperty[]>('data/properties.json')
      .pipe(
        map(
          (properties) =>
            properties.find((p) => p.Id === propertyId) as IProperty
        )
      );
  }

  getNumberOfProperties(): Observable<number> {
    return this.http
      .get<IProperty[]>('data/properties.json')
      .pipe(map((properties) => properties.length as number));
  }

  addProperty(property: Property) {
    localStorage.setItem('newProp', JSON.stringify(property));
  }
}
