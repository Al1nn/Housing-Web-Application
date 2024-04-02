export interface IUserForRegister {
    username: string;
    email: string;
    password: string;
    phoneNumber: number;
    roles: string[];
    imageUrl: string;
}

export interface IUserForLogin {
    username: string;
    password: string;
    token: string;
}


