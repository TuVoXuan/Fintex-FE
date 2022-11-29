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
    renameGroupConv: async (body: IRenameConversation) => {
        return await axiosService.put<IResponseSuccess<null>>(`${URL}/rename-conversation`, body);
    },
    switchAdmin: async (body: IEditMemberConv) => {
        return await axiosService.put<IResponseSuccess<ISwitchAdminRes>>(`${URL}/switch-admin`, body);
    },
    deleteMember: async (body: IEditMemberConv) => {
        return await axiosService.delete<IResponseSuccess<IEditMemberConvRes>>(
            `${URL}/${body.conversationId}/member/${body.member}`,
        );
    },
    leaveConv: async (conversationId: string) => {
        return await axiosService.put<IResponseSuccess<IEditMemberConvRes>>(
            `${URL}/leave-conversation/${conversationId}`,
        );
    },
};

export default conversationApi;
