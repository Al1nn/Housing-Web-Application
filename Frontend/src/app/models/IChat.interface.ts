export interface IChat {
    id?: string | null;
    lastMessage: string;
    lastMessageDate: string;
    receiverID: string;
    receiverName: string;
    receiverPhoto: string;
    senderID: string;
    senderName: string;
    senderPhoto: string;
    seenCount: number;
    messages: IMessage[];
}


export interface IMessage {
    senderId: string;
    senderName: string;
    senderPhoto: string;
    sentDate: string;
    seen: boolean;
    text: string;
}
