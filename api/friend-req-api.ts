import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'friend-request';
const URL = `${API}/${ENDPOINT}`;

const friendReqApi = {
    getRelationship: (toId: string) => {
        return axiosService.get<IResponseSuccess<Relationship>>(`${URL}/check-relationship/${toId}`);
    },
    createFriendReq: (toId: string) => {
        return axiosService.post<IResponseSuccess<IFriendReq>>(`${URL}`, { toId });
    },
    getFriendReqPagination: (pagination: IPagination) => {
        if (pagination.after) {
            return axiosService.get<IResponseSuccess<IFriendReqPaginationRes>>(
                `${URL}/receive-friend-req-pagination?limit=${pagination.limit}&after=${pagination.after}`,
            );
        }
        return axiosService.get<IResponseSuccess<IFriendReqPaginationRes>>(
            `${URL}/receive-friend-req-pagination?limit=${pagination.limit}`,
        );
    },
    acceptFriendReq: (friendReqId: string) => {
        return axiosService.delete<IResponseSuccess<string>>(`${URL}/accept/${friendReqId}`);
    },
    deleteFriendReq: (friendReqId: string) => {
        return axiosService.delete<IResponseSuccess<string>>(`${URL}/${friendReqId}`);
    },
    getStranger: (param: IGetStragers) => {
        let newUrl = `${URL}/strangers/${param.name}?limit=${param.limit}`;
        if (param.after) {
            newUrl += `&after=${param.after}`;
        }

        return axiosService.get<IResponseSuccess<StrangerPagination>>(newUrl);
    },
};

export default friendReqApi;
