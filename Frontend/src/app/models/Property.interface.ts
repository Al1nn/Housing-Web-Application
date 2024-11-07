import { IPropertyBase } from './IPropertyBase.interface';
import { IPhoto } from './IPhoto.interface';

export class Property implements IPropertyBase {
    id: number;
    sellRent: number;
    name: string;
    propertyTypeId: number;
    propertyType: string;
    bhk: number;
    furnishingTypeId: number;
    furnishingType: string;
    price: number;
    builtArea: number;
    carpetArea: number;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    cityId: number;
    city: string;
    country: string;
    floorNo?: string;
    totalFloors?: string;
    readyToMove: boolean;
    mainEntrance?: number;
    security?: number;
    gated?: boolean;
    maintenance?: number;
    estPossessionOn: string;
    photo?: string | null;
    description?: string;
    likes: number;
    postedBy: number;
    photos?: IPhoto[];
}
