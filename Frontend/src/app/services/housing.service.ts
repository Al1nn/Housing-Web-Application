import { IProperty } from './../model/IProperty.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Property } from '../model/Property.interface';
import { environment } from '../../environments/environment';
import { IKeyValuePair } from '../model/IKeyValuePair';
import { IPropertyBase } from '../model/IPropertyBase.interface';


@Injectable({
    providedIn: 'root',
})
export class HousingService {

    baseUrl = environment.baseUrl;



    constructor(private http: HttpClient) { }

    getPropertyTypes(): Observable<IKeyValuePair[]> {
        return this.http.get<IKeyValuePair[]>(this.baseUrl + '/PropertyType/list');
    }

    getFurnishingTypes(): Observable<IKeyValuePair[]> {
        return this.http.get<IKeyValuePair[]>(this.baseUrl + '/FurnishingType/list');
    }

    getAllCities(): Observable<string[]> {
        return this.http.get<string[]>(this.baseUrl + '/city/cities');
    }

    // Get method cu filtrare

    getAllFilteredProperties(sellRent: number, filterWord: string) {
        return this.http.get<IPropertyBase[]>(this.baseUrl + '/property/filter/' + sellRent + '/' + filterWord);
    }

    getAllProperties(SellRent?: number): Observable<Property[]> {
        return this.http.get<Property[]>(this.baseUrl + '/property/list/' + SellRent?.toString());
    }

    getPropertyById(id: number) {
        return this.http.get<Property>(this.baseUrl + '/property/detail/' + id.toString());
    }

    getNumberOfProperties(): Observable<number> {
        return this.http
            .get<IProperty[]>('data/properties.json')
            .pipe(map((properties) => properties.length as number));
    }

    addProperty(property: Property) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post(this.baseUrl + "/property/add", property, httpOptions);
    }

    addPropertyPhoto(id: number) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post(this.baseUrl + "/add/photo/" + id, {}, httpOptions);
    }

    newPropID() {
        if (typeof localStorage !== 'undefined') {
            const currentPID = localStorage.getItem('PID');

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

    getPropID() {
        const currentPID = localStorage.getItem('PID');
        if (currentPID !== null) return +currentPID;
        else return -1;
    }

    getPropertyAge(dateofEstablishment: string): string {
        const today = new Date();
        const estDate = new Date(dateofEstablishment);
        let age = today.getFullYear() - estDate.getFullYear();
        const m = today.getMonth() - estDate.getMonth();

        // Current month smaller than establishment month or
        // Same month but current date smaller than establishment date
        if (m < 0 || (m === 0 && today.getDate() < estDate.getDate())) {
            age--;
        }

        // Establshment date is future date
        if (today < estDate) {
            return '0';
        }

        // Age is less than a year
        if (age === 0) {
            return 'Less than a year';
        }

        return age.toString();
    }

    setPrimaryPhoto(propertyId: number, propertyPhotoId: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post(this.baseUrl + '/property/set-primary-photo/' + propertyId
            + '/' + propertyPhotoId, {}, httpOptions);
    }

    deletePhoto(propertyId: number, propertyPhotoId: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.delete(this.baseUrl + '/property/delete-photo/' + propertyId
            + '/' + propertyPhotoId, httpOptions);
    }
}
