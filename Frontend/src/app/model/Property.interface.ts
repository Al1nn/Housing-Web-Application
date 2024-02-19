import { IContact } from './IContacts.interface';
import { IPropertyBase } from './IPropertyBase.interface';

export class Property implements IPropertyBase {
    Id: number;
    SellRent: number;
    Name: string;
    PType: string;
    BHK: number;
    FType: string;
    Price: number;
    BuiltArea: number;
    CarpetArea: number;
    Contacts: IContact[];
    City: string;
    FloorNo?: string;
    TotalFloor?: string;
    RTM: number;
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
