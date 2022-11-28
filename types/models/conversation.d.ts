declare interface IConversationStore {
    _id: string;
    participants: IParticipant[];
    removedMember: IParticipant[];
    messages: IMessage[];
    after: string;
    name: string;
    lastActive?: string;
    isOnline: boolean;
    admin?: IParticipant;
}

declare interface IGetMessFirstTime {
    messPagiante: IMessagePaginate;
    conversationId: string;
}

declare interface IOnlineConv {
    isOnline: boolean;
    conversationId: string;
}
