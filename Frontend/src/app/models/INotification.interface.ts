export interface IUser {
    userId: string;
    userName: string;
    notifications: INotification[];
}



export interface INotification {
    userId: string;
    userPicture: string;
    userName: string;
    notification: string;
    dateTime: string;
}
