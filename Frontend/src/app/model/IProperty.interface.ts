import { IContact } from "./IContacts.interface";

export interface IProperty{
  Id: number,
  SellRent: number,
  Type: string,
  Name: string,
  Price: number,
  Image: string,
  Contacts : IContact[]
}
