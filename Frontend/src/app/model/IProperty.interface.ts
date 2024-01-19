import { IContact } from "./IContacts.interface";

export interface IProperty{
  Id: number | null,
  SellRent: number | null,
  Type: string | null,
  Name: string | null,
  Price: number | null,
  Image?: string,
  Contacts : IContact[]
}
