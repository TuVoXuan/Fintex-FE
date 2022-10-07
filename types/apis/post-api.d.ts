declare interface ILoadMorePost {
    after?: string;
    limit: number;
}

declare interface ILoadMorePostResponse {
    after: string;
    ended: boolean;
    posts: IPost[];
}

declare interface IReactionPost {
    postId: string;
    type: string;
}

declare interface IReactionPostRes {
    postId: string;
    reaction: {
        type: string;
        user: {
            _id: string;
            name: INameUser;
        };
    };
}

declare interface IDeleteReactionPostRes {
    postId: string;
    userId: string;
}
