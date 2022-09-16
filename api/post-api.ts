import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'post';
const URL = `${API}/${ENDPOINT}`;

const postApi = {
    createPost: (body: FormData) => {
        return axiosService.post<IResponseSuccess<IPost>>(`${URL}`, body);
    },
};

export default postApi;
