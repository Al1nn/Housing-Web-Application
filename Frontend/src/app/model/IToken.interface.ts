export interface IToken {
    unique_name: string;
    nameid: string;
    role: string[] | string;
    nbf: number;
    exp: number;
    iat: number;
}
