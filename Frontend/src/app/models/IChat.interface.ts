export interface IChat {
    id?: string | null;
    lastMessage: string;
    lastMessageDate: string;
    senderID: string;
    senderName: string;
    senderPhoto: string;
    receiverID: string;
    receiverName: string;
    receiverPhoto: string;
    messages: IMessage[];
}


export interface IMessage {
    senderId: string;
    sentDate: string;
    text: string;
}
