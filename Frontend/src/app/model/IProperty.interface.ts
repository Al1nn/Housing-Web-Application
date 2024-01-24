import { IContact } from "./IContacts.interface";
import { IPropertyBase } from "./IPropertyBase.interface";

export interface IProperty extends IPropertyBase {
    Description: string | null,
    Security : number | null,
    Maintenance : number | null,
    FloorNo : number | null,
    TotalFloor : number | null,
    Possession : string | null,
    Gated: number | null,
    MainEntrance : string | null,
    Contacts : IContact[]
  }
