export interface IUserForRegister {
    username: string;
    email: string;
    password: string;
    phoneNumber: number;
}

export interface IUserForLogin {
    username: string;
    password: string;
    role: number;
    token: string;
}

