import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'conversation';
const URL = `${API}/${ENDPOINT}`;

const conversationApi = {
    getConversations: async () => {
        return await axiosService.get<IResponseSuccess<IConversation[]>>(URL);
    },
};

export default conversationApi;
