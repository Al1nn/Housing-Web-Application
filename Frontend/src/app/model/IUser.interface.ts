export interface IUserForRegister {
    username: string;
    email: string;
    password: string;
    phoneNumber: number;
    imageUrl?: string;
}

export interface IUserForLogin {
    username: string;
    password: string;
    role: number;
    token: string;
}


