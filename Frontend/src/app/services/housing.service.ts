import { IProperty } from './../model/IProperty.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Property } from '../model/Property.interface';
import { IPropertyBase } from '../model/IPropertyBase.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class HousingService {

  baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) {}

  getAllCities(): Observable<string[]> {
    return this.http.get<string[]>( this.baseUrl + '/city/cities');
  }
  
  // Get method cu filtrare

  getAllFilteredCities(filterWord : string){
    return this.http.get<string[]>(`http://localhost:5207/api/city/filter/` + filterWord).pipe(
      map( response => {
        const jsonString = JSON.stringify(response);
        const stringArray = jsonString.split(',');
        return stringArray;
      })
    );
  }

  getAllProperties(SellRent?: number): Observable<Property[]> {
    return this.http
      .get<{ [key: string]: IPropertyBase }>('data/properties.json')
      .pipe(
        map((data) => {
          const propertiesArray: Property[] = [];

          if (typeof localStorage !== 'undefined') {
            const localProperties = JSON.parse(
              localStorage.getItem('newProp') as string
            );
            if (localProperties) {
              for (const id in localProperties) {
                if (SellRent) {
                  if (
                    localProperties.hasOwnProperty(id) &&
                    localProperties[id] &&
                    localProperties[id].SellRent === SellRent
                  ) {
                    propertiesArray.push(localProperties[id]);
                  }
                } else {
                  propertiesArray.push(localProperties[id]);
                }
              }
            }
          }

          for (const id in data) {
            if (SellRent) {
              if (data.hasOwnProperty(id) && data[id].SellRent === SellRent) {
                propertiesArray.push(data[id] as Property);
              }
            } else {
              propertiesArray.push(data[id] as Property);
            }
          }

          return propertiesArray;
        })
      );

    return this.http.get<Property[]>('data/properties.json');
  }

  getPropertyById(id: number) {
    return this.getAllProperties().pipe(
      map((propertiesArray) => {
        // throw new Error('Some error here');
        return propertiesArray.find((p) => p.Id === id) as Property;
      })
    );
  }

  getNumberOfProperties(): Observable<number> {
    return this.http
      .get<IProperty[]>('data/properties.json')
      .pipe(map((properties) => properties.length as number));
  }

  addProperty(property: Property) {
    let newProp = [property];

    //Add new prop in array if newProp already exists in local storage
    if (
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('newProp')
    ) {
      newProp = [
        property,
        ...JSON.parse(localStorage.getItem('newProp') as string),
      ];
    }

    localStorage.setItem('newProp', JSON.stringify(newProp));
  }

  newPropID() {
    if (typeof localStorage !== 'undefined') {
      let currentPID = localStorage.getItem('PID');

      if (currentPID !== null) {
        localStorage.setItem('PID', String(+currentPID + 1));
        return +currentPID;
      } else {
        localStorage.setItem('PID', '1');
        return 101;
      }
    } else {
      console.error('localStorage is not available in this environment.');
      return -1; // or any other appropriate value
    }
  }
}
