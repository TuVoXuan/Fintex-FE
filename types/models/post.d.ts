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

declare interface IComment {
    _id: string;
    avatar: string;
    name: {
        firstName: string;
        lastName: string;
    };
    content: string;
    image: string;
    commentChildren: number;
    reaction: IReaction[];
}
