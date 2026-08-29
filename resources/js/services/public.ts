import api from '@/lib/axios';

import { getCsrfCookie } from './auth';
import type { BlogPost } from './blog';
import type { Client } from './clients';
import type { CompanyProfile } from './company';
import type { HomeSection } from './homeSections';
import type { Project } from './projects';
import type { Service } from './service';
import type { TeamMember } from './team';
import type { Testimonial } from './testimonials';

interface ListResponse<T> {
    data: T[];
}

export const getPublicCompany = async (): Promise<CompanyProfile> => {
    const response = await api.get<{ data: CompanyProfile }>('/api/company');

    return response.data.data;
};

export const getPublicHomeSections = async (): Promise<HomeSection[]> => {
    const response = await api.get<{ data: Record<string, HomeSection> }>(
        '/api/home-sections',
    );

    return Object.values(response.data.data ?? {});
};

export const getPublicServices = async (): Promise<Service[]> => {
    const response = await api.get<ListResponse<Service>>('/api/services');

    return response.data.data;
};

export const getPublicProjects = async (): Promise<Project[]> => {
    const response = await api.get<ListResponse<Project>>('/api/projects');

    return response.data.data;
};

export const getPublicTeamMembers = async (): Promise<TeamMember[]> => {
    const response = await api.get<ListResponse<TeamMember>>('/api/team');

    return response.data.data;
};

export const getPublicClients = async (): Promise<Client[]> => {
    const response = await api.get<ListResponse<Client>>('/api/clients');

    return response.data.data;
};

export const getPublicTestimonials = async (): Promise<Testimonial[]> => {
    const response =
        await api.get<ListResponse<Testimonial>>('/api/testimonials');

    return response.data.data;
};

export const getPublicBlogPosts = async (): Promise<BlogPost[]> => {
    const response = await api.get<ListResponse<BlogPost>>('/api/blog');

    return response.data.data;
};

export interface ContactPayload {
    name: string;
    email: string;
    subject?: string;
    message: string;
}

export const sendContactMessage = async (payload: ContactPayload) => {
    await getCsrfCookie();

    const response = await api.post('/api/contact', payload);

    return response.data;
};
