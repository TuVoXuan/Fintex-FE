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

declare interface IEditUser {
    name: {
        firstName: string;
        lastName: string;
    };
    birthday: string;
    gender: 'male' | 'female' | 'other';
    email: string;
    address: string;
    phone: string;
    education: string;
}

declare interface IPaginate {
    limit: number;
    after?: string;
}

declare interface IAlbum {
    publicId: string;
    url: string;
}

declare interface IAlbumPaginate {
    album: IAlbum[];
    after: string;
}
