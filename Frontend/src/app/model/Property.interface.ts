import { Contact } from './Contact.interface';
import { IPropertyBase } from './IPropertyBase.interface';
import { IPhoto } from './IPhoto';

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
    contactId: number;
    contact: Contact;
    cityId: number;
    city: string;
    floorNo?: string;
    totalFloors?: string;
    readyToMove: boolean;
    age?: string;
    mainEntrance?: number;
    security?: number;
    gated?: boolean;
    maintenance?: number;
    estPossessionOn: string;
    image?: string;
    description?: string;
    photos: IPhoto[];
}
