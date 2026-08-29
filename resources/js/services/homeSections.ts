import api from '@/lib/axios';

export interface HomeSection {
    id: number;
    section_key: string;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    data: Record<string, unknown> | null;
    is_active: boolean;
}

export interface HomeSectionPayload {
    section_key: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: File | null;
    data?: Record<string, string>;
    is_active?: boolean;
}

interface ListResponse {
    data: HomeSection[];
}

export const getHomeSections = async (): Promise<HomeSection[]> => {
    const response = await api.get<ListResponse>('/api/admin/home-sections');

    return response.data.data;
};

export const getHomeSection = async (id: number): Promise<HomeSection> => {
    const response = await api.get<{ data: HomeSection }>(
        `/api/admin/home-sections/${id}`,
    );

    return response.data.data;
};

export const createHomeSection = async (payload: HomeSectionPayload) => {
    const formData = new FormData();

    formData.append('section_key', payload.section_key);

    appendOptionalStrings(formData, payload);
    if (payload.data && Object.keys(payload.data).length > 0) {
        formData.append('data', JSON.stringify(payload.data));
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post('/api/admin/home-sections', formData);

    return response.data;
};

export const updateHomeSection = async (
    id: number,
    payload: HomeSectionPayload,
) => {
    const formData = new FormData();

    formData.append('section_key', payload.section_key);

    appendOptionalStrings(formData, payload);
    if (payload.data && Object.keys(payload.data).length > 0) {
        formData.append('data', JSON.stringify(payload.data));
    }

    formData.append('is_active', payload.is_active ? '1' : '0');
    formData.append('_method', 'PUT');

    const response = await api.post(`/api/admin/home-sections/${id}`, formData);

    return response.data;
};

export const deleteHomeSection = async (id: number) => {
    const response = await api.delete(`/api/admin/home-sections/${id}`);

    return response.data;
};

function appendOptionalStrings(
    formData: FormData,
    payload: HomeSectionPayload,
) {
    const keys: (keyof HomeSectionPayload)[] = [
        'title',
        'subtitle',
        'description',
    ];

    keys.forEach((key) => {
        const value = payload[key];

        if (typeof value === 'string' && value.trim() !== '') {
            formData.append(key, value);
        }
    });
}