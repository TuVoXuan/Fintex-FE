declare type Relationship = 'requesting' | 'isFriend' | 'notFriend';

declare type IFriendReq = {
    _id: string;
    user: IUserSimple;
};

declare interface IPagination {
    limit: number;
    after?: string;
}

declare interface IFriendReqPaginationRes {
    after: string;
    ended: boolean;
    friendReqs: IFriendReq[];
}
