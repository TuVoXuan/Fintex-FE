declare interface IParticipant {
    _id: string;
    name: {
        firstName: string;
        lastName: string;
        fullName: string;
    };
    avatar: string;
}

declare interface IConversation {
    _id: string;
    participants: IParticipant[];
    messages: {
        _id: string;
        message: {
            _id: string;
            text?: string;
            images?: string[];
            messType: 'text' | 'image';
        }[];
        updatedAt: string;
    }[];
}
