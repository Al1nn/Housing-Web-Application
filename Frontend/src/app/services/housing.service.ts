import { IProperty } from './../model/IProperty.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Property } from '../model/Property.interface';
import { environment } from '../../environments/environment';
import { IKeyValuePair } from '../model/IKeyValuePair';
import { IPropertyBase } from '../model/IPropertyBase.interface';
import { IPhoto } from '../model/IPhoto';
import { AlertifyService } from './alertify.service';







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
        return this.http.get<Property>(this.baseUrl + '/property/' + id.toString());
    }

    getPropertyDetailById(id: number) {
        return this.http.get<Property>(this.baseUrl + '/property/detail/' + id.toString());
    }

    getNumberOfProperties(): Observable<number> {
        return this.http
            .get<IProperty[]>('data/properties.json')
            .pipe(map((properties) => properties.length as number));
    }

    addProperty(property: Property): Observable<Property> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + localStorage.getItem('token')
            })
        };
        return this.http.post<Property>(this.baseUrl + "/property/add", property, httpOptions);
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
                Authorization: 'Bearer ' + localStorage.getItem('token')

            })
        };
        return this.http.post(this.baseUrl + '/property/add/photo/' + propertyId, formData, httpOptions);
    }

    async photosSelected(event: any): Promise<FileList> {

        const files: FileList = event.target.files;
        var originalSizes: IPhoto[] = [];
        var thumbnails: IPhoto[] = [];
        var alertifyService = new AlertifyService();

        for (let i = 0; i < files.length; i++) {
            const file: File = files[i];

            if (file.size > 2000000) {
                alertifyService.error(`Image ${file.name} exceeds the size limit of 2.0 mb`);
                continue;
            }

            const imageURL = await this.getDataURL(file); // imageURL is null

            const image: IPhoto = {
                imageUrl: imageURL,
                publicId: file.name,
                isPrimary: i === 0
            }
            originalSizes.push(image);
            //localStorage.setItem('AppConfig/originalSizes/' + image.publicId, JSON.stringify(image));

            const thumbnail = await this.resizeImage(imageURL, image.publicId, i);
            thumbnails.push(thumbnail);
            //localStorage.setItem('AppConfig/thumbnails/' + thumbnail.publicId, JSON.stringify(thumbnail))
        }

        localStorage.setItem('AppConfig/originalSizes', JSON.stringify(originalSizes));
        localStorage.setItem('AppConfig/thumbnails', JSON.stringify(thumbnails));
        return files;
    }

    resizeImage(imageUrl: string, fileName: string, imageProcessed: number): Promise<IPhoto> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext('2d');
                const newWidth = 250;
                const newHeight = 250;
                canvas.width = newWidth;
                canvas.height = newHeight;
                if (ctx !== null) {
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);
                }
                let quality = 0.6;
                let dataURL = canvas.toDataURL('image/jpeg', quality);
                const thumbnail: IPhoto = {
                    imageUrl: dataURL,
                    publicId: fileName,
                    isPrimary: imageProcessed === 0
                };
                console.log(thumbnail + '\n');
                resolve(thumbnail);
            };
            img.onerror = function (error) {
                reject(error);
            };
            img.src = imageUrl;
        });
    }

    getDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target?.result as string);
            };
            reader.onerror = (event) => {
                reject(event.target?.error);
            };
            reader.readAsDataURL(file);
        });
    }

    clearPhotoStorage() {
        localStorage.removeItem('AppConfig/originalSizes');
        localStorage.removeItem('AppConfig/thumbnails');
    }

    getOriginalSizePhotos(): string | null {
        return localStorage.getItem('AppConfig/originalSizes');
    }

    getThumbnails(): string | null {
        return localStorage.getItem('AppConfig/thumbnails');
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
