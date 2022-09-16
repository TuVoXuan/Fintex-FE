import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'feeling';
const URL = `${API}/${ENDPOINT}`;

const feelingApi = {
    getFeelings: () => {
        return axiosService.get<IResponseSuccess<IFeeling[]>>(`${URL}`);
    },
};

export default feelingApi;
