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
    loadMoreMinePost: (body: ILoadMorePost) => {
        if (body.after) {
            return axiosService.get<IResponseSuccess<ILoadMorePostResponse>>(
                `${URL}/mine/pagination?limit=${body.limit}&after=${body.after}`,
            );
        }
        return axiosService.get<IResponseSuccess<ILoadMorePostResponse>>(`${URL}/mine/pagination?limit=${body.limit}`);
    },
    reactionPost: (body: IReactionPost) => {
        return axiosService.post<IResponseSuccess<IReactionPostRes>>(`${URL}/reaction`, body);
    },
    deleteReactionPost: (postId: string) => {
        return axiosService.delete<IResponseSuccess<IDeleteReactionPostRes>>(`${URL}/reaction/${postId}`);
    },
    updatePost: (postId: string, body: FormData) => {
        return axiosService.put<IResponseSuccess<IUpdatePostRes>>(`${URL}/${postId}`, body);
    },
    deletePost: (postId: string) => {
        return axiosService.delete<IResponseSuccess<string>>(`${URL}/${postId}`);
    },
    createAvatarCoverPost: (body: IUpdateAvatarCover) => {
        return axiosService.post<IResponseSuccess<IPost>>(`${URL}/avatar-cover`, body);
    },
    loadMorePersonPost: (personId: string, body: ILoadMorePost) => {
        if (body.after) {
            return axiosService.get<IResponseSuccess<ILoadMorePostResponse>>(
                `${URL}/${personId}/pagination?limit=${body.limit}&after=${body.after}`,
            );
        }
        return axiosService.get<IResponseSuccess<ILoadMorePostResponse>>(
            `${URL}/${personId}/pagination?limit=${body.limit}`,
        );
    },
    getDetailPost: (body: IGetDetailPost) => {
        return axiosService.get<IResponseSuccess<IPost>>(
            `${URL}/detail-post?postId=${body.postId}&postPersonId=${body.postPersonId}`,
        );
    },
};

export default postApi;
