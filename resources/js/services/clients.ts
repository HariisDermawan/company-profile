import api from '@/lib/axios';

export interface Client {
    id: number;
    name: string;
    logo: string | null;
    website_url: string | null;
    order: number;
    is_active: boolean;
}

export interface ClientPayload {
    name: string;
    logo?: File | null;
    website_url?: string;
    order?: number;
    is_active?: boolean;
}

interface ListResponse {
    data: Client[];
}

export const getClients = async (): Promise<Client[]> => {
    const response = await api.get<ListResponse>('/api/admin/clients');

    return response.data.data;
};

export const getClient = async (id: number): Promise<Client> => {
    const response = await api.get<{ data: Client }>(
        `/api/admin/clients/${id}`,
    );

    return response.data.data;
};

export const createClient = async (payload: ClientPayload) => {
    const formData = new FormData();

    formData.append('name', payload.name);

    if (payload.logo) {
        formData.append('logo', payload.logo);
    }

    if (payload.website_url) {
        formData.append('website_url', payload.website_url);
    }

    formData.append('order', String(payload.order ?? 0));
    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post('/api/admin/clients', formData);

    return response.data;
};

export const updateClient = async (id: number, payload: ClientPayload) => {
    const formData = new FormData();

    formData.append('name', payload.name);

    if (payload.logo) {
        formData.append('logo', payload.logo);
    }

    if (payload.website_url) {
        formData.append('website_url', payload.website_url);
    }

    formData.append('order', String(payload.order ?? 0));
    formData.append('is_active', payload.is_active ? '1' : '0');
    formData.append('_method', 'PUT');

    const response = await api.post(`/api/admin/clients/${id}`, formData);

    return response.data;
};

export const deleteClient = async (id: number) => {
    const response = await api.delete(`/api/admin/clients/${id}`);

    return response.data;
};
