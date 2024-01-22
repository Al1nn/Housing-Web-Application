import { IContact } from './IContacts.interface';

export interface IPropertyBase {
  Id: number | null;
  SellRent: number | null;
  Name: string | null;
  PType: string | null;
  FType: string | null;
  Price: number | null;
  BHK: number | null;
  BuiltArea: number | null;
  CarpetArea: number | null;
  City: string | null;
  RTM: number | null;
  Image?: string | null;
}
