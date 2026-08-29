import api from '@/lib/axios';

export interface TeamMember {
    id: number;
    name: string;
    position: string;
    photo: string | null;
    bio: string | null;
    email: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    order: number;
    is_active: boolean;
}

export interface TeamMemberPayload {
    name: string;
    position: string;
    photo?: File | null;
    bio?: string;
    email?: string;
    linkedin_url?: string;
    twitter_url?: string;
    order?: number;
    is_active?: boolean;
}

interface ListResponse {
    data: TeamMember[];
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    const response = await api.get<ListResponse>('/api/admin/team');

    return response.data.data;
};

export const getTeamMember = async (id: number): Promise<TeamMember> => {
    const response = await api.get<{ data: TeamMember }>(
        `/api/admin/team/${id}`,
    );

    return response.data.data;
};

export const createTeamMember = async (payload: TeamMemberPayload) => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('position', payload.position);

    if (payload.photo) {
        formData.append('photo', payload.photo);
    }

    if (payload.bio) {
        formData.append('bio', payload.bio);
    }

    if (payload.email) {
        formData.append('email', payload.email);
    }

    if (payload.linkedin_url) {
        formData.append('linkedin_url', payload.linkedin_url);
    }

    if (payload.twitter_url) {
        formData.append('twitter_url', payload.twitter_url);
    }

    formData.append('order', String(payload.order ?? 0));
    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post('/api/admin/team', formData);

    return response.data;
};

export const updateTeamMember = async (
    id: number,
    payload: TeamMemberPayload,
) => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('position', payload.position);

    if (payload.photo) {
        formData.append('photo', payload.photo);
    }

    if (payload.bio) {
        formData.append('bio', payload.bio);
    }

    if (payload.email) {
        formData.append('email', payload.email);
    }

    if (payload.linkedin_url) {
        formData.append('linkedin_url', payload.linkedin_url);
    }

    if (payload.twitter_url) {
        formData.append('twitter_url', payload.twitter_url);
    }

    formData.append('order', String(payload.order ?? 0));
    formData.append('is_active', payload.is_active ? '1' : '0');
    formData.append('_method', 'PUT');

    const response = await api.post(`/api/admin/team/${id}`, formData);

    return response.data;
};

export const deleteTeamMember = async (id: number) => {
    const response = await api.delete(`/api/admin/team/${id}`);

    return response.data;
};
