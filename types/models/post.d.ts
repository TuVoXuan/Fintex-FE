declare interface IImage {
    url: string;
    orientation: 'horizontal' | 'vertical';
}

declare interface IDimension {
    height: number;
    width: number;
}

declare interface IPost {
    _id: string;
    userId: string;
    avatar: string;
    name: {
        firstName: string;
        lastName: string;
    };
    content?: string;
    feeling?: IFeeling;
    visibleFor: 'public' | 'friends' | 'only me';
    images?: IImage[];
    comments: number;
    createdAt: string;
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
    userId: string;
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
    createdAt: string;
}
