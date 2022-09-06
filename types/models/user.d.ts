declare interface IUser {
    _id: string;
    name: {
        firstName: string;
        lastName: string;
    };
    birthday: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    avatar: string;
    email: string;
    address?: string;
}
