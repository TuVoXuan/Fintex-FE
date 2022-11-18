declare interface IConversationStore {
    _id: string;
    participants: IParticipant[];
    messages: IMessage[];
    after: string;
    name: string;
}

declare interface IGetMessFirstTime {
    messPagiante: IMessagePaginate;
    conversationId: string;
}
