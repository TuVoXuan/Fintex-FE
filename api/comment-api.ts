import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'comment';
const URL = `${API}/${ENDPOINT}`;

const commentApi = {
    getComments: (body: IGetComments) => {
        let path = `${URL}/${body.postId}`;

        if (body.parentId) {
            path += `/${body.parentId}`;
        }

        path += `?limit=${body.limit}`;

        if (body.after) {
            path += `&after=${body.after}`;
        }
        return axiosService.get<IResponseSuccess<ICommentPagination>>(path);
    },
    editComment: (body: FormData) => {
        return axiosService.put<IResponseSuccess<ICommentResponse>>(URL, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    createComment: (body: FormData) => {
        return axiosService.post<IResponseSuccess<ICreateCommentResponse>>(URL, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteComment: (param: IDeleteComment) => {
        return axiosService.delete<IResponseSuccess<string[]>>(`${URL}/${param.id}/${param.postId}`);
    },
    reactionComment: (body: IReactionComment) => {
        return axiosService.post<IResponseSuccess<IReactionCommentResponse>>(`${URL}/reaction`, body);
    },
    deleteAllCommentsPost: (postId: string) => {
        return axiosService.delete<IResponseSuccess<string[]>>(`${URL}/all-comments-of-post/${postId}`);
    },
};

export default commentApi;
