export interface IUserForRegister {
    username: string;
    email: string;
    password: string;
    phoneNumber: number;
    roles: string[];
}

export interface IUserForLogin {
    username: string;
    password: string;
    fileName: string;
    token: string;
}


