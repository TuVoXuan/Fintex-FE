declare interface IVerifyUser {
    user: IAuthUser;
    idToken: string;
}

declare interface IVerifyUserResponse {
    isExisted: boolean;
    phone?: string;
}

declare interface IAuthUser {
    name: string;
    phone: string;
    avatar: string;
    email: string;
}

declare interface IAuthUserResponse {
    name: {
        firstName: string;
        lastName: string;
    };
    email: string;
    phone: string;
    birthday: Date;
    avatar: string;
    address: string;
    gender: 'male' | 'female' | 'other';
}

declare interface IRegisterUser {
    name: {
        firstName: string;
        lastName: string;
    };
    email: string;
    phone: string;
    birthday: Date;
    gender: 'male' | 'female' | 'other';
}
