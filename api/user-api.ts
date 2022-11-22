import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'user';
const URL = `${API}/${ENDPOINT}`;

const userApi = {
    getStranger: (param: IGetStragers) => {
        let newUrl = `${URL}/strangers/${param.name}?limit=${param.limit}`;
        if (param.after) {
            newUrl += `&after=${param.after}`;
        }

        return axiosService.get<IResponseSuccess<StrangerPagination>>(newUrl);
    },
    edituser: (body: IEditUser) => {
        return axiosService.put<IResponseSuccess<IUser>>(`${URL}/edit-info`, body);
    },
    uploadAvatarCover: (body: FormData) => {
        return axiosService.post<IResponseSuccess<string>>(`${URL}/avatar-cover`, body);
    },
    getProfile: (userId: string) => {
        return axiosService.get<IResponseSuccess<IUserProfileRes>>(`${URL}/profile/${userId}`);
    },
    getMyAlbum: async (param: IPaginate) => {
        let newUrl = `${URL}/album?limit=${param.limit}`;
        if (param.after) {
            newUrl += `&after=${param.after}`;
        }

        return (await axiosService.get<IResponseSuccess<IAlbumPaginate>>(newUrl)).data.data;
    },
    getAlbum: async (param: IPaginate) => {
        let newUrl = `${URL}/album/${param.id}?limit=${param.limit}`;
        if (param.after) {
            newUrl += `&after=${param.after}`;
        }

        return (await axiosService.get<IResponseSuccess<IAlbumPaginate>>(newUrl)).data.data;
    },
    getFriends: async (param: IPaginate) => {
        let newUrl = `${URL}/friends?limit=${param.limit}`;
        if (param.after) {
            newUrl += `&after=${param.after}`;
        }

        return (await axiosService.get<IResponseSuccess<IFriendPaginate>>(newUrl)).data.data;
    },
    getFriendsOfFriend: async (param: IPaginate) => {
        let newUrl = `${URL}/friends/${param.id}?limit=${param.limit}`;
        if (param.after) {
            newUrl += `&after=${param.after}`;
        }

        return (await axiosService.get<IResponseSuccess<IFriendPaginate>>(newUrl)).data.data;
    },

    deleteFriend: async (friendId: string) => {
        let newUrl = `${API}/friend/${friendId}`;
        return (await axiosService.delete<IResponseSuccess<null>>(newUrl)).data;
    },
};

export default userApi;
