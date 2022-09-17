declare interface ILoadMorePost {
    after?: string;
    limit: number;
}

declare interface ILoadMorePostResponse {
    after: string;
    ended: boolean;
    posts: IPost[];
}
