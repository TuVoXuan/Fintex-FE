import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'conversation';
const URL = `${API}/${ENDPOINT}`;

const conversationApi = {
    getConversations: async () => {
        return await axiosService.get<IResponseSuccess<IConversation[]>>(URL);
    },
    createConversation: async (friendId: string) => {
        return await axiosService.post<IResponseSuccess<IConversation>>(URL, { users: [{ id: friendId }] });
    },
};

export default conversationApi;
