declare interface IVerifyUser {
    user: IAuthUser;
    idToken: string;
}

declare interface IVerifyUserResponse {
    isExisted: boolean;
    user?: IAuthUser;
}
