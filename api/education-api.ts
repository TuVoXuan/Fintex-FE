import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'education';
const URL = `${API}/${ENDPOINT}`;

const educationApi = {
    getEducations: async () => {
        return (await axiosService.get<IResponseSuccess<IEducation[]>>(URL)).data.data;
    },
};

export default educationApi;
