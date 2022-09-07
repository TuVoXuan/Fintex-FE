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
    _id: string;
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

declare interface IUserSignUp {
    name: {
        firstName: string;
        lastName: string;
    };
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: 'male' | 'female' | 'other';
}

declare interface IAuthResponse {
    token: string;
    user: IUser;
}

declare interface ICheckUserWithPhone {
    phone: string;
}

declare interface IUserLoginWithPhone {
    phone: string;
    password: string;
}
