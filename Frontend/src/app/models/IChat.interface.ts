

export interface IChat {
    lastMessage: string;
    lastMessageDate: Date;
    senderID: string;
    receiverID: string;
    messages: IMessage[];
}


export interface IMessage {
    senderId: string;
    sentDate: Date;
    text: string;
}
