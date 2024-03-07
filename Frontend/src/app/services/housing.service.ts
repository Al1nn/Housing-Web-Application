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

    //De implementat
    // addPropertyPhoto(id: number) {

    // }

    photosSelected(event: any) {
        if (event !== null) {
            const files: FileList = event.target.files;
            var originalSizes: IPhoto[] = [];
            var thumbnails: IPhoto[] = [];
            let fileProccessed = 0;


            const fileReaderLoad = (file: File) => (e: any) => {
                const image: IPhoto = {
                    imageUrl: e.target.result.toString(),
                    publicId: file.name,
                    isPrimary: files.length === 1 || fileProccessed === 0
                };
                originalSizes.push(image);

                this.resizeImage(e.target.result.toString(), file.name, fileProccessed)
                    .then((thumbnail) => {
                        thumbnails.push(thumbnail as IPhoto);
                        if (thumbnails.length === files.length) {
                            localStorage.setItem('AppConfig/originalSizes', JSON.stringify(originalSizes));
                            localStorage.setItem('AppConfig/thumbnails', JSON.stringify(thumbnails));
                        }
                    })
                    .catch((error) => {
                        console.error("Fail to resize image : ", error);
                    });

                fileProccessed++;


            };

            for (let i = 0; i < files.length; i++) {
                const file: File = files[i];
                const reader = new FileReader();

                reader.onload = fileReaderLoad(file);
                reader.readAsDataURL(file);
            }
            return thumbnails;
        }
        return [];



    }
    resizeImage(imageUrl: string, fileName: string, imageProcessed: number) {

        return new Promise((resolve, reject) => {
            //const maxSizeInMB = 4;
            //const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            const img = new Image();
            img.src = imageUrl;
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext('2d');
                // const width = img.width;
                // const height = img.height;
                //const aspectRatio = width / height;
                const newWidth = 250;
                const newHeight = 250;
                canvas.width = newWidth;
                canvas.height = newHeight;
                if (ctx !== null) {
                    ctx.drawImage(img, 0, 0, 250, 250);
                }
                let quality = 0.4;
                let dataURL = canvas.toDataURL('image/jpeg', quality);
                const thumbnail: IPhoto = {
                    imageUrl: dataURL,
                    publicId: fileName,
                    isPrimary: imageProcessed === 0
                };

                console.log(thumbnail + '\n');
                imageProcessed++;
                resolve(thumbnail);
            };
            img.onerror = function (error) {
                reject(error);
            };
        });
    }

    clearPhotoStorage() {
        localStorage.removeItem('AppConfig/originalSizes');
        localStorage.removeItem('AppConfig/thumbnails');
    }

    getOriginalSizePhotos(): IPhoto[] {
        var originalPhotos = JSON.parse(localStorage.getItem('AppConfig/originalSizes') as string);
        return originalPhotos;
    }

    getThumbnails(): IPhoto[] {
        var thumbnails = JSON.parse(localStorage.getItem('AppConfig/thumbnails') as string);
        return thumbnails;
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
