import api from '@/lib/axios';

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    category: string | null;
    tags: string[] | null;
    author: string | null;
    published_at: string | null;
    is_active: boolean;
}

export interface BlogPostPayload {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    cover_image?: File | null;
    category?: string;
    tags?: string[];
    author?: string;
    published_at?: string;
    is_active?: boolean;
}

interface ListResponse {
    data: BlogPost[];
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    const response = await api.get<ListResponse>('/api/admin/blog');

    return response.data.data;
};

export const getBlogPost = async (id: number): Promise<BlogPost> => {
    const response = await api.get<{ data: BlogPost }>(`/api/admin/blog/${id}`);

    return response.data.data;
};

export const createBlogPost = async (payload: BlogPostPayload) => {
    const formData = new FormData();

    formData.append('title', payload.title);
    formData.append('content', payload.content);

    if (payload.slug) {
        formData.append('slug', payload.slug);
    }

    if (payload.excerpt) {
        formData.append('excerpt', payload.excerpt);
    }

    if (payload.cover_image) {
        formData.append('cover_image', payload.cover_image);
    }

    if (payload.category) {
        formData.append('category', payload.category);
    }

    if (payload.author) {
        formData.append('author', payload.author);
    }

    if (payload.published_at) {
        formData.append('published_at', payload.published_at);
    }

    if (payload.tags?.length) {
        formData.append('tags', JSON.stringify(payload.tags));
    }

    formData.append('is_active', payload.is_active ? '1' : '0');

    const response = await api.post('/api/admin/blog', formData);

    return response.data;
};

export const updateBlogPost = async (id: number, payload: BlogPostPayload) => {
    const formData = new FormData();

    formData.append('title', payload.title);
    formData.append('content', payload.content);

    if (payload.slug) {
        formData.append('slug', payload.slug);
    }

    if (payload.excerpt) {
        formData.append('excerpt', payload.excerpt);
    }

    if (payload.cover_image) {
        formData.append('cover_image', payload.cover_image);
    }

    if (payload.category) {
        formData.append('category', payload.category);
    }

    if (payload.author) {
        formData.append('author', payload.author);
    }

    if (payload.published_at) {
        formData.append('published_at', payload.published_at);
    }

    if (payload.tags?.length) {
        formData.append('tags', JSON.stringify(payload.tags));
    }

    formData.append('is_active', payload.is_active ? '1' : '0');
    formData.append('_method', 'PUT');

    const response = await api.post(`/api/admin/blog/${id}`, formData);

    return response.data;
};

export const deleteBlogPost = async (id: number) => {
    const response = await api.delete(`/api/admin/blog/${id}`);

    return response.data;
};
