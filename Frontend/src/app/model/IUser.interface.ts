
export interface IUserForRegister {
    username: string;
    email?: string;
    password: string;
    mobile?: number;
}

export interface IUserForLogin {
    username: string;
    password: string;
    token: string;
}

