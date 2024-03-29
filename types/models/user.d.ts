declare interface IUser {
    _id: string;
    name: {
        firstName: string;
        lastName: string;
        fullName: string;
    };
    birthday: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    avatar: string;
    coverPhoto: string;
    email: string;
    address?: string;
    education?: string;
}

declare interface IUserSimple {
    _id: string;
    name: {
        firstName: string;
        lastName: string;
        fullName: string;
    };
    avatar: string;
}

declare interface RefSwiper {
    swiper: HTMLDivElement;
    slideTo: (num: number) => void;
}
