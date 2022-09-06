declare interface IUser {
    name: {
        firstName: string;
        lastName: string;
    };
    birthday: Date;
    gender: 'male' | 'female' | 'other';
    phone: string;
    avatar: string;
    email: string;
}

declare interface IAuthUser {
    name: string;
    phone: string;
    avatar: string;
    email: string;
}
