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
    createGroupConv: async (body: ICreateConv) => {
        const users = body.friendIds.map((item) => ({ id: item }));
        return await axiosService.post<IResponseSuccess<IConversation>>(URL, { users, name: body.name });
    },
};

export default conversationApi;
