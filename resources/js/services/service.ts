import api from '@/lib/axios';

export interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon: string | null;
    is_active: boolean;
}

export interface ServicePayload {
    title: string;
    slug: string;
    description: string;
    icon?: string;
    is_active?: boolean;
}

interface ServiceResponse {
    data: Service[];
}

export const getServices = async (): Promise<Service[]> => {
    const response = await api.get<ServiceResponse>(
        '/api/services',
    );

    return response.data.data;
};

// TAMBAHKAN INI
export const getService = async (
    id: number,
): Promise<Service> => {
    const response = await api.get<{ data: Service }>(
        `/api/services/${id}`,
    );

    return response.data.data;
};

export const createService = async (
    payload: ServicePayload,
) => {
    const response = await api.post(
        '/api/services',
        payload,
    );

    return response.data;
};

export const updateService = async (
    id: number,
    payload: ServicePayload,
) => {
    const response = await api.put(
        `/api/services/${id}`,
        payload,
    );

    return response.data;
};

export const deleteService = async (id: number) => {
    const response = await api.delete(
        `/api/services/${id}`,
    );

    return response.data;
};
