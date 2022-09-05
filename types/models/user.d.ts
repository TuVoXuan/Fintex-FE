declare interface IUser {
    name: {
        firstName: string;
        lastName: string;
    };
    birthday: Date;
    gender: 'male' | 'female' | 'other';
}
