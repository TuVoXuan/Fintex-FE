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
