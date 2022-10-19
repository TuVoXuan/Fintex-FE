import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'user';
const URL = `${API}/${ENDPOINT}`;

const userApi = {
    uploadAvatarCover: (body: FormData) => {
        return axiosService.post<IResponseSuccess<string>>(`${URL}/avatar-cover`, body);
    },
};

export default userApi;
