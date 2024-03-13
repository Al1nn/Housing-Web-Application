import { IPropertyBase } from './IPropertyBase.interface';

export interface IProperty extends IPropertyBase {
    description: string | null,
    security: number | null,
    maintenance: number | null,
    floorNo: number | null,
    totalFloors: number | null,
    Gated: number | null,
    MainEntrance: string | null,
    landMark: string | null;
    address: string | null;
    phoneNumber: string | null;
}
