declare interface IImage {
    url: string;
    orientation: 'horizontal' | 'vertical';
}

declare interface IDimension {
    height: number;
    width: number;
}

declare interface IReaction {
    title: string;
    userId: string;
}

interface IImageStore {
    id: string;
    url: string;
    file?: File;
}

declare interface IComment {
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
    parentComment: string | null | undefined;
    commentsChildren: number;
    reaction: IReaction[];
    createAt: string;
}
