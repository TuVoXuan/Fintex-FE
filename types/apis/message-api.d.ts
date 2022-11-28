declare interface IMessageContent {
    _id: string;
    text?: string;
    images?: string[];
    seen: string[];
    messType: 'text' | 'image' | 'notify';
}

declare interface IMessage {
    _id: string;
    sender: string;
    message: IMessageContent[];
    updatedAt: string;
}

declare interface IMessagePaginate {
    after: string;
    conversationId?: string;
    messages: MessageResDto[];
}

declare interface IParamMessPaginate {
    conversationId: string;
    limit: number;
    after?: string;
}

declare interface IMessageCreateRes {
    _id: string;
    sender: string;
    message: IMessageContent[];
    createdAt: string;
    seen: string[];
    conversationId: string;
}

declare interface IMessageCreate {
    conversationId: string;
    text?: string;
    type: 'text' | 'image';
    images?: File[];
}

declare interface ITestMqtt {
    userId: string;
}

declare interface ISeenMessage {
    messageId: string;
    subMessageId: string;
    conversationId: string;
    userId?: string;
}
