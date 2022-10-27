import axiosService from './axios-service';

const API = process.env.API_URL;
const ENDPOINT = 'notification';
const URL = `${API}/${ENDPOINT}`;

const notifyApi = {
    getNotifyPagination: (pagination: IPagination) => {
        if (pagination.after) {
            return axiosService.get<IResponseSuccess<INofifyPaginationRes>>(
                `${URL}/pagination?limit=${pagination.limit}&after=${pagination.after}`,
            );
        }
        return axiosService.get<IResponseSuccess<INofifyPaginationRes>>(`${URL}/pagination?limit=${pagination.limit}`);
    },
    handleSeeNotify: (arrId: { id: string }[]) => {
        return axiosService.put<IResponseSuccess<null>>(`${URL}/see-notify`, { arrId });
    },
};

export default notifyApi;
