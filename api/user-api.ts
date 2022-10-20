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
    getMyAlbum: async (param: IPaginate) => {
        let newUrl = `${URL}/album?limit=${param.limit}`;
        if (param.after) {
            newUrl += `&after=${param.after}`;
        }

        return (await axiosService.get<IResponseSuccess<IAlbumPaginate>>(newUrl)).data.data;
    },
};

export default userApi;
