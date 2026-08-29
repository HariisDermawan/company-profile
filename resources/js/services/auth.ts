import api from '@/lib/axios';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role?: string;
}

export interface LoginResponse {
    message: string;
    user: User;
}

export const getCsrfCookie = async (): Promise<void> => {
    await api.get('/sanctum/csrf-cookie');
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    await getCsrfCookie();

    const response = await api.post<LoginResponse>('/api/auth/login', payload);

    return response.data;
};

export const getMe = async (): Promise<{ data: User }> => {
    const response = await api.get<{ data: User }>('/api/auth/me');

    return response.data;
};

export const logout = async () => {
    const response = await api.post('/api/auth/logout');

    return response.data;
};
