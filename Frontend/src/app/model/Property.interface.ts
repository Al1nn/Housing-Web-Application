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
    Contacts: IContact[];
    city: string;
    FloorNo?: string;
    TotalFloor?: string;
    readyToMove: number;
    AOP?: number;
    MainEntrance?: number;
    Security?: number;
    Gated?: number;
    Maintenance?: number;
    Possession?: string;
    Image?: string;
    Description?: string;
    PostedOn: string;
    PostedBy: string;
}
