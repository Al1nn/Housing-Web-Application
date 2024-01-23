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

          if(typeof localStorage !== 'undefined'){
            const localProperties = JSON.parse(localStorage.getItem('newProp') as string);
            if(localProperties){
              for (const id in localProperties) {
                if (localProperties.hasOwnProperty(id) && localProperties[id].SellRent === SellRent) {
                  propertiesArray.push(localProperties[id]);
                }
              }
            }
          }



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
    let newProp = [property];


    //Add new prop in array if newProp already exists in local storage
    if(typeof localStorage !== 'undefined' && localStorage.getItem('newProp')){
      newProp = [property,
                ...JSON.parse(localStorage.getItem('newProp') as string)]
    }

    localStorage.setItem('newProp', JSON.stringify(newProp));
  }

  newPropID(){
    if(typeof localStorage !== 'undefined'){
      let currentPID = localStorage.getItem('PID');

      if (currentPID !== null) {
          localStorage.setItem('PID', String(+currentPID + 1));
          return +currentPID;
      } else {

          localStorage.setItem('PID', '1');
          return 101;
      }
    }else{
      console.error('localStorage is not available in this environment.');
      return -1; // or any other appropriate value
    }

  }
}
