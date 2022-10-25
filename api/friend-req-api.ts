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
};

export default friendReqApi;
