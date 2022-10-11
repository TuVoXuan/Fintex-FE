declare interface IGetStragers {
    name: string;
    limit: number;
    after: string;
}

declare interface Stranger {
    _id: string;
    fullName: string;
    isFriend: boolean;
    avatar: string;
    address: string;
}

declare interface StrangerPagination {
    data: Stranger[];
    after: string;
}
