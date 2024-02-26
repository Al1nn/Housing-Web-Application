import { IContact } from "./IContacts.interface";

export class Contact implements IContact {
    id: number;
    address: string;
    phoneNumber: string;
}