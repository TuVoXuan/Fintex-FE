declare interface IConversationStore {
    _id: string;
    participants: IParticipant[];
    messages: IMessage[];
    after: string;
}

declare interface IGetMessFirstTime {
    messPagiante: IMessagePaginate;
    conversationId: string;
}
