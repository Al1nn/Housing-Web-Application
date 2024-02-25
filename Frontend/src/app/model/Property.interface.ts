import { IContact } from './IContacts.interface';
import { IPropertyBase } from './IPropertyBase.interface';

export class Property implements IPropertyBase {
    id: number;
    sellRent: number;
    name: string;
    propertyType: string;
    bhk: number;
    furnishingType: string;
    price: number;
    builtArea: number;
    carpetArea: number;
    contact: IContact;
    city: string;
    floorNo?: string;
    totalFloors?: string;
    readyToMove: number;
    age?: string;
    mainEntrance?: number;
    security?: number;
    gated?: boolean;
    maintenance?: number;
    estPossessionOn: string;
    image?: string;
    description?: string;
}
