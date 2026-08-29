import api from '@/lib/axios';

export interface CompanyProfile {
    id: number;
    name: string;
    tagline: string | null;
    about: string | null;
    mission: string | null;
    vision: string | null;
    logo: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    website_url: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    is_active: boolean;
}

export interface CompanyProfilePayload {
    name: string;
    tagline?: string;
    about?: string;
    mission?: string;
    vision?: string;
    logo?: File | null;
    email?: string;
    phone?: string;
    address?: string;
    website_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    is_active?: boolean;
}

interface ListResponse {
    data: CompanyProfile[];
}

export const getCompanyProfiles = async (): Promise<CompanyProfile[]> => {
    const response = await api.get<ListResponse>('/api/admin/company');

    return response.data.data;
};

export const getCompanyProfile = async (id: number): Promise<CompanyProfile> => {
    const response = await api.get<{ data: CompanyProfile }>(
        `/api/admin/company/${id}`,
    );

    return response.data.data;
};

export const createCompanyProfile = async (payload: CompanyProfilePayload) => {
    const formData = new FormData();

    formData.append('name', payload.name);

    appendOptionalStrings(formData, payload);
    if (payload.logo) formData.append('logo', payload.logo);

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post('/api/admin/company', formData);

    return response.data;
};

export const updateCompanyProfile = async (
    id: number,
    payload: CompanyProfilePayload,
) => {
    const formData = new FormData();

    formData.append('name', payload.name);

    appendOptionalStrings(formData, payload);
    if (payload.logo) formData.append('logo', payload.logo);

    formData.append('is_active', payload.is_active ? '1' : '0');
    formData.append('_method', 'PUT');

    const response = await api.post(`/api/admin/company/${id}`, formData);

    return response.data;
};

function appendOptionalStrings(
    formData: FormData,
    payload: CompanyProfilePayload,
) {
    const keys: (keyof CompanyProfilePayload)[] = [
        'tagline',
        'about',
        'mission',
        'vision',
        'email',
        'phone',
        'address',
        'website_url',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'linkedin_url',
    ];

    keys.forEach((key) => {
        const value = payload[key];

        if (typeof value === 'string' && value.trim() !== '') {
            formData.append(key, value);
        }
    });
}