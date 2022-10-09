declare interface IGetComments {
    postId: string;
    limit: number;
    after?: string;
    parentId?: string;
}

declare interface ICommentResponse {
    _id: string;
    postId: string;
    avatar: string;
    level: number;
    name: {
        firstName: string;
        lastName: string;
    };
    content: string;
    image: string;
    parentId: string | null | undefined;
    commentsChildren: number;
    reaction: IReaction[];
    createAt: string;
}

declare interface ICommentPagination {
    comments: IComment[];
    after: string;
    ended: boolean;
}

declare interface ICreateCommentResponse {
    comment: IComment;
    after: string;
}

declare interface IDeleteComment {
    id: string;
    postId: string;
}
