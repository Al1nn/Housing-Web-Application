

export interface IChat {
    lastMessage: string;
    lastMessageDate: string;
    senderID: string;
    receiverID: string;
    messages: IMessage[];
}


export interface IMessage {
    senderId: string;
    sentDate: string;
    text: string;
}
