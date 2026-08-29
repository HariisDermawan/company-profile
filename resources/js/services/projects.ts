import api from '@/lib/axios';

export interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image: string | null;
    category: string | null;
    client: string | null;
    project_url: string;
    is_featured: boolean;
    is_active: boolean;
}

export interface ProjectPayload {
    title: string;
    slug?: string;
    description?: string;
    image?: File | null;
    category?: string;
    client?: string;
    project_url?: string;
    is_featured?: boolean;
    is_active?: boolean;
}

export interface ProjectResponse {
    data: Project[];
}

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get<ProjectResponse>('/api/admin/projects');

    return response.data.data;
};

export const getProject = async (id: number): Promise<Project> => {
    const response = await api.get<{ data: Project }>(
        `/api/admin/projects/${id}`,
    );

    return response.data.data;
};

export const createProject = async (payload: ProjectPayload) => {
    const formData = new FormData();

    formData.append('title', payload.title);

    if (payload.slug) {
        formData.append('slug', payload.slug);
    }

    if (payload.description) {
        formData.append('description', payload.description);
    }

    if (payload.image) {
        formData.append('image', payload.image);
    }

    if (payload.category) {
        formData.append('category', payload.category);
    }

    if (payload.client) {
        formData.append('client', payload.client);
    }

    if (payload.project_url) {
        formData.append('project_url', payload.project_url);
    }

    formData.append('is_featured', payload.is_featured ? '1' : '0');

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post('/api/admin/projects', formData);

    return response.data;
};

export const updateProject = async (id: number, payload: ProjectPayload) => {
    const formData = new FormData();

    formData.append('title', payload.title);

    if (payload.slug) {
        formData.append('slug', payload.slug);
    }

    if (payload.description) {
        formData.append('description', payload.description);
    }

    if (payload.image) {
        formData.append('image', payload.image);
    }

    if (payload.category) {
        formData.append('category', payload.category);
    }

    if (payload.client) {
        formData.append('client', payload.client);
    }

    if (payload.project_url) {
        formData.append('project_url', payload.project_url);
    }

    formData.append('is_featured', payload.is_featured ? '1' : '0');

    formData.append('is_active', payload.is_active ? '1' : '0');
    formData.append('_method', 'PUT');

    const response = await api.post(`/api/admin/projects/${id}`, formData);

    return response.data;
};

export const deleteProject = async (id: number) => {
    const response = await api.delete(`/api/admin/projects/${id}`);

    return response.data;
};
