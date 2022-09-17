import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'post';
const URL = `${API}/${ENDPOINT}`;

const postApi = {
    createPost: (body: FormData) => {
        return axiosService.post<IResponseSuccess<IPost>>(`${URL}`, body);
    },
    loadMorePost: (body: ILoadMorePost) => {
        if (body.after) {
            return axiosService.get<IResponseSuccess<ILoadMorePostResponse>>(
                `${URL}/pagination?limit=${body.limit}&after=${body.after}`,
            );
        }
        return axiosService.get<IResponseSuccess<ILoadMorePostResponse>>(`${URL}/pagination?limit=${body.limit}`);
    },
};

export default postApi;
