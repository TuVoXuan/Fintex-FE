declare type Relationship = 'requesting' | 'isFriend' | 'notFriend';

declare type IFriendReq = {
    _id: string;
    user: IUserSimple;
};
