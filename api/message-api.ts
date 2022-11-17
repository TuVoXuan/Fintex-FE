import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'message';
const URL = `${API}/${ENDPOINT}`;

const messageApi = {
    getMessages: async (param: IParamMessPaginate) => {
        let newURL = `${URL}/${param.conversationId}?limitTime=${param.limit}`;
        if (param.after) {
            newURL += `&after=${param.after}`;
        }
        return (await axiosService.get<IResponseSuccess<IMessagePaginate>>(newURL)).data.data;
    },
    getMessagesFirstTime: async (conversationId: string) => {
        const newURL = `${URL}/first-time/${conversationId}`;
        return await axiosService.get<IResponseSuccess<IMessagePaginate>>(newURL);
    },
    createMessage: async (body: IMessageCreate) => {
        const formData = new FormData();
        formData.append('conversationId', body.conversationId);
        formData.append('type', body.type);
        if (body.text) {
            formData.append('text', body.text);
        }
        if (body.images) {
            for (const image of body.images) {
                formData.append('images', image);
            }
        }
        return await axiosService.post<IResponseSuccess<IMessageCreateRes>>(URL, formData);
    },
    testMqtt: async (body: ITestMqtt) => {
        const url = `${URL}/notifications`;
        return (await axiosService.post(url, body)).data;
    },
    seenMessage: async (body: ISeenMessage) => {
        const url = `${URL}/seen/${body.messageId}`;
        return (await axiosService.put<IResponseSuccess<ISeenMessage>>(url, { conversationId: body.conversationId }))
            .data.data;
    },
};

export default messageApi;
