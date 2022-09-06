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
};

export default authApi;
