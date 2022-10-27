declare interface INotify {
    _id: string;
    type: string;
    content: string;
    from: IUserSimple;
    postId?: string;
    isSeen: boolean;
    createdAt: string;
}

declare interface INofifyPaginationRes {
    after: string;
    ended: boolean;
    notify: INotify[];
}
