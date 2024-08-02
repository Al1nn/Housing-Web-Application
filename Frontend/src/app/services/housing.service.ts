import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Property } from '../model/Property.interface';
import { environment } from '../../environments/environment';
import { IKeyValuePair } from '../model/IKeyValuePair';
import { IPhoto } from '../model/IPhoto';
import { ICity } from '../model/ICity.interface';
import { IFilters } from '../model/IFilters.interface';
import { PaginatedProperties } from '../model/PaginatedProperties.interface';
import { IPropertyStats } from '../model/IPropertyStats.interface';
import { ISugestion } from '../model/ISugestion.interface';








@Injectable({
    providedIn: 'root',
})
export class HousingService {

    baseUrl = environment.baseUrl;



    constructor(private http: HttpClient) { }


    //Get ALL fara filtrare
    getPropertyTypes(): Observable<IKeyValuePair[]> {
        return this.http.get<IKeyValuePair[]>(this.baseUrl + '/PropertyType/list');
    }

    getFurnishingTypes(): Observable<IKeyValuePair[]> {
        return this.http.get<IKeyValuePair[]>(this.baseUrl + '/FurnishingType/list');
    }

    getAllCities(): Observable<ICity[]> {
        return this.http.get<ICity[]>(`${this.baseUrl}/city/cities`);
    }

    getAllProperties(SellRent?: number): Observable<Property[]> {
        return this.http.get<Property[]>(this.baseUrl + '/property/list/' + SellRent?.toString());
    }

    getAllPropertyStats(): Observable<IPropertyStats[]> {
        return this.http.get<IPropertyStats[]>(`${this.baseUrl}/property/stats`);
    }

    getUserProperties(): Observable<Property[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<Property[]>(this.baseUrl + '/property/dashboard', httpOptions);
    }

    getUserPaginatedProperty(pageNumber: number, pageSize: number): Observable<PaginatedProperties> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };

        return this.http.get<PaginatedProperties>(this.baseUrl + '/property/dashboard/' + pageNumber + '/' + pageSize, httpOptions);
    }

    //Get By ID / User


    getPropertyById(id: number) {
        return this.http.get<Property>(this.baseUrl + '/property/' + id.toString());
    }

    getPropertyDetailById(id: number) {
        return this.http.get<Property>(this.baseUrl + '/property/detail/' + id.toString());
    }

    getPropertyCountByUser(): Observable<number> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.get<number>(this.baseUrl + '/property/count', httpOptions);
    }

    getPaginatedProperty(SellRent: number, PageNumber: number, PageSize: number): Observable<PaginatedProperties> {
        return this.http.get<PaginatedProperties>(this.baseUrl + '/property/list/' + SellRent?.toString() + '/' + PageNumber?.toString() + '/' + PageSize?.toString());
    }

    // Get ALL method cu filtrare

    getAllFilteredProperties(sellRent: number, filters: IFilters): Observable<PaginatedProperties> {
        return this.http.post<PaginatedProperties>(`${this.baseUrl}/property/filter/${sellRent}`, filters);
    }

    getAllCitiesFiltered(filterWord: string, amount: number, sellRent: number): Observable<ISugestion[]> {
        return this.http.get<ISugestion[]>(`${this.baseUrl}/city/cities/${filterWord}/${amount}/${sellRent}`);
    }

    getAllFilteredUserProperties(filters: IFilters): Observable<PaginatedProperties> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post<PaginatedProperties>(this.baseUrl + '/property/filter/dashboard/', filters, httpOptions);
    }

    getAllFilteredUserPropertiesLength(SellRent: number, filterWord: string): Observable<number> {
        return this.http.get<Property[]>(this.baseUrl + '/property/filter/' + SellRent?.toString() + '/' + filterWord).pipe(
            map(properties => properties.length)
        );
    }


    //////











    addProperty(property: Property): Observable<Property> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post<Property>(this.baseUrl + "/property/add", property, httpOptions);
    }

    updateProperty(id: number, property: Property): Observable<Property> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.put<Property>(this.baseUrl + "/property/update/" + id, property, httpOptions);
    }

    deleteProperty(id: number): Observable<Property> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.delete<Property>(this.baseUrl + "/property/delete/" + id, httpOptions);
    }


    addPropertyPhoto(propertyId: number, formData: FormData) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'ngsw-bypass': ''
            })
        };

        return this.http.post(this.baseUrl + '/property/add/photo/' + propertyId, formData, {
            ...httpOptions,
            reportProgress: true,
            observe: 'events'
        });
    }




    getPropertyPhotos(propertyId: number): Observable<HttpEvent<IPhoto[]>> {
        return this.http.get<IPhoto[]>(this.baseUrl + '/property/get/photos/' + propertyId, {
            reportProgress: true,
            observe: 'events'
        });
    }

    getFirstPropertyPhoto(propertyId: number): Observable<IPhoto> {
        return this.http.get<IPhoto>(this.baseUrl + '/property/get/first/photo/' + propertyId);
    }

    getLastIndex(): Observable<number> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')

            })
        };
        return this.http.get<number>(this.baseUrl + '/property/last', httpOptions);
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

    deletePhoto(propertyId: number, fileName: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.delete(this.baseUrl + '/property/delete/photo/' + propertyId
            + '/' + fileName, httpOptions);
    }
}
