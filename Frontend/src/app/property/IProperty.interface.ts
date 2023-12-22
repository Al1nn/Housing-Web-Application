import { IContact } from "./property-contacts/IContacts.interface";

export interface IProperty{
  Id: number,
  SellRent: number,
  Type: string,
  Name: string,
  Price: number,
  Image?: string,
  Contacts : IContact[]
}
