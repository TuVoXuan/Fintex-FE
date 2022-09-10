declare interface IImage {
    url: string;
    orientation: 'horizontal' | 'vertical';
}

declare interface IDimension {
    height: number;
    width: number;
}

declare interface IFeeling {
    name: string;
    emoji: string;
}

declare interface IPost {
    images: IImage[];
    avatarUrl: string;
    displayName: string;
    timeAgo: string;
    content: string;
    visibleFor: 'public' | 'friends' | 'only me';
    feeling?: IFeeling;
}
