import { IContact } from "./IContacts.interface";
import { IPropertyBase } from "./IPropertyBase.interface";

export interface IProperty extends IPropertyBase {
    Description: string | null,
    Contacts : IContact[]
  }
