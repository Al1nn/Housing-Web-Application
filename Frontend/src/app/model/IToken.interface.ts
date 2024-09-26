export interface IToken {
    unique_name: string;
    nameid: string;
    email: string;
    phone: string;
    profile_picture?: string;
    role: string[] | string;
    nbf: number;
    exp: number;
    iat: number;
}
