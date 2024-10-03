export interface IChat {
    id?: string;
    lastMessage: string;
    lastMessageDate: string;
    senderID: string;
    senderName: string;
    senderPhoto: string;
    receiverID: string;
    messages: IMessage[];
}


export interface IMessage {
    senderId: string;
    sentDate: string;
    text: string;
}
