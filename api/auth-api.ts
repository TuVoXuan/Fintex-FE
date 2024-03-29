import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'auth';
const URL = `${API}/${ENDPOINT}`;

const authApi = {
    verifyUser: (body: IVerifyUser) => {
        return axiosService.post<IResponseSuccess<IVerifyUserResponse>>(`${URL}/verify-user`, body);
    },
    signUp: (body: IUserSignUp) => {
        return axiosService.post<IResponseSuccess<IAuthResponse>>(`${URL}/sign-up`, body);
    },
    checkUserWithPhone: (body: ICheckUserWithPhone) => {
        return axiosService.post<IResponseSuccess<IVerifyUserResponse>>(`${URL}/check-user-with-phone`, body);
    },
    signInWithGoogle: (body: ICheckUserWithPhone) => {
        return axiosService.post<IResponseSuccess<IAuthResponse>>(`${URL}/sign-in-with-google`, body);
    },
    signInWithPhone: (body: IUserLoginWithPhone) => {
        return axiosService.post<IResponseSuccess<IAuthResponse>>(`${URL}/sign-in-with-phone`, body);
    },
    getCurrentUser: () => {
        return axiosService.get<IResponseSuccess<IAuthResponse>>(`${URL}/current-user`);
    },
};

export default authApi;
