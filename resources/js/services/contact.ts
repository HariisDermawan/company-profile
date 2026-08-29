import api from '@/lib/axios';

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

interface ListResponse {
    data: ContactMessage[];
}

export const getMessages = async (): Promise<ContactMessage[]> => {
    const response = await api.get<ListResponse>('/api/admin/contact');

    return response.data.data;
};

export const getMessage = async (id: number): Promise<ContactMessage> => {
    const response = await api.get<{ data: ContactMessage }>(
        `/api/admin/contact/${id}`,
    );

    return response.data.data;
};

export const markMessageAsRead = async (id: number, isRead: boolean) => {
    const response = await api.patch(`/api/admin/contact/${id}`, { is_read: isRead });

    return response.data;
};

export const deleteMessage = async (id: number) => {
    const response = await api.delete(`/api/admin/contact/${id}`);

    return response.data;
};