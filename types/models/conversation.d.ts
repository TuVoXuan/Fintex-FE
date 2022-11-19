declare interface IConversationStore {
    _id: string;
    participants: IParticipant[];
    messages: IMessage[];
    after: string;
    name: string;
    lastActive?: string;
    isOnline: boolean;
}

declare interface IGetMessFirstTime {
    messPagiante: IMessagePaginate;
    conversationId: string;
}

declare interface IOnlineConv {
    isOnline: boolean;
    conversationId: string;
}
