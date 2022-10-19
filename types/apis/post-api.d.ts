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

declare interface IUpdatePostRes {
    _id: string;
    content?: string;
    feeling?: IFeeling;
    visibleFor: 'public' | 'friends' | 'only me';
    images?: IImage[];
    reactions: IReaction[];
    comments: number;
}

declare interface IDeleteReactionPostRes {
    postId: string;
    userId: string;
}

declare interface IUpdateAvatarCover {
    content: string;
    typeUpdate: string;
}
