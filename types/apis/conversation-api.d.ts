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
            seen: string[];
        }[];
        sender: string;
        updatedAt: string;
    }[];
    name?: string;
    admin?: IParticipant;
}

declare interface ICreateConv {
    friendIds: string[];
    name: string;
}

declare interface IRenameConversation {
    conversationId: string;
    name: string;
}

declare interface IEditMemberConv {
    conversationId: string;
    memberId: string;
}

declare interface ISwitchAdminRes {
    newAdmin: IParticipant;
    conversationId: string;
}
