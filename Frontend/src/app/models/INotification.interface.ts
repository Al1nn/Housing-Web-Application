export interface IUserNotificationList{
    destinationId: string; 
    notifications: INotification[];
}

export interface INotification {
    senderId: string;
    senderPhoto: string;
    senderName: string;
    notification: string;
    dateTime: string;
}
