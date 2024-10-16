export interface IChat {
    id?: string | null;
    lastMessage: string;
    lastMessageDate: string;
    userID_first: string;
    userName_first: string;
    userPhoto_first: string;
    userID_other: string;
    userName_other: string;
    userPhoto_other: string;
    userOnline_first: boolean;
    userOnline_other: boolean;
    messagesCount: number;
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
