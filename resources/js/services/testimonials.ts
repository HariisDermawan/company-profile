import api from '@/lib/axios';

export interface Testimonial {
    id: number;
    name: string;
    company: string | null;
    position: string | null;
    photo: string | null;
    content: string;
    rating: number;
    is_active: boolean;
}

export interface TestimonialPayload {
    name: string;
    content: string;
    company?: string;
    position?: string;
    photo?: File | null;
    rating?: number;
    is_active?: boolean;
}

interface ListResponse {
    data: Testimonial[];
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
    const response = await api.get<ListResponse>('/api/admin/testimonials');

    return response.data.data;
};

export const getTestimonial = async (id: number): Promise<Testimonial> => {
    const response = await api.get<{ data: Testimonial }>(
        `/api/admin/testimonials/${id}`,
    );

    return response.data.data;
};

export const createTestimonial = async (payload: TestimonialPayload) => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('content', payload.content);

    if (payload.photo) {
        formData.append('photo', payload.photo);
    }

    if (payload.company) {
        formData.append('company', payload.company);
    }

    if (payload.position) {
        formData.append('position', payload.position);
    }

    formData.append('rating', String(payload.rating ?? 5));
    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post('/api/admin/testimonials', formData);

    return response.data;
};

export const updateTestimonial = async (
    id: number,
    payload: TestimonialPayload,
) => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('content', payload.content);

    if (payload.photo) {
        formData.append('photo', payload.photo);
    }

    if (payload.company) {
        formData.append('company', payload.company);
    }

    if (payload.position) {
        formData.append('position', payload.position);
    }

    formData.append('rating', String(payload.rating ?? 5));
    formData.append('is_active', payload.is_active ? '1' : '0');
    formData.append('_method', 'PUT');

    const response = await api.post(`/api/admin/testimonials/${id}`, formData);

    return response.data;
};

export const deleteTestimonial = async (id: number) => {
    const response = await api.delete(`/api/admin/testimonials/${id}`);

    return response.data;
};
