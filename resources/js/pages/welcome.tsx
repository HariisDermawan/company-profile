import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { fileUrl } from '@/lib/utils';
import type { BlogPost } from '@/services/blog';
import type { Client } from '@/services/clients';
import type { CompanyProfile } from '@/services/company';
import type { HomeSection } from '@/services/homeSections';
import type { Project } from '@/services/projects';
import {
    getPublicBlogPosts,
    getPublicClients,
    getPublicCompany,
    getPublicHomeSections,
    getPublicProjects,
    getPublicServices,
    getPublicTeamMembers,
    getPublicTestimonials,
    sendContactMessage,
} from '@/services/public';
import type { Service } from '@/services/service';
import type { TeamMember } from '@/services/team';
import type { Testimonial } from '@/services/testimonials';

const NAV_LINKS = [
    { label: 'Home', href: '#hero' },
    { label: 'Tentang', href: '#about' },
    { label: 'Layanan', href: '#services' },
    { label: 'Proyek', href: '#projects' },
    { label: 'Tim', href: '#team' },
    { label: 'Blog', href: '#blog' },
    { label: 'Kontak', href: '#contact' },
];

const SOCIAL_LINKS: {
    label: string;
    key: keyof Pick<
        CompanyProfile,
        'facebook_url' | 'instagram_url' | 'twitter_url' | 'linkedin_url'
    >;
}[] = [
    { label: 'Facebook', key: 'facebook_url' },
    { label: 'Instagram', key: 'instagram_url' },
    { label: 'Twitter', key: 'twitter_url' },
    { label: 'LinkedIn', key: 'linkedin_url' },
];

function SectionHeading({
    eyebrow,
    title,
    subtitle,
}: {
    eyebrow: string;
    title: string;
    subtitle?: string | null;
}) {
    return (
        <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-700 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
                {eyebrow}
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-5 text-lg leading-relaxed text-gray-500">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

function Stars({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
                <svg
                    key={index}
                    className={
                        index < rating
                            ? 'h-4 w-4 text-amber-400'
                            : 'h-4 w-4 text-gray-200'
                    }
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ))}
        </div>
    );
}

function formatDate(value?: string | null): string {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function Welcome() {
    const { user } = useAuth();

    const [company, setCompany] = useState<CompanyProfile | null>(null);
    const [sections, setSections] = useState<HomeSection[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactSubject, setContactSubject] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [contactError, setContactError] = useState('');
    const [contactSuccess, setContactSuccess] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [
                    companyData,
                    sectionsData,
                    servicesData,
                    projectsData,
                    teamData,
                    clientsData,
                    testimonialsData,
                    postsData,
                ] = await Promise.all([
                    getPublicCompany(),
                    getPublicHomeSections(),
                    getPublicServices(),
                    getPublicProjects(),
                    getPublicTeamMembers(),
                    getPublicClients(),
                    getPublicTestimonials(),
                    getPublicBlogPosts(),
                ]);

                setCompany(companyData);
                setSections(sectionsData);
                setServices(servicesData);
                setProjects(projectsData);
                setTeam(teamData);
                setClients(clientsData);
                setTestimonials(testimonialsData);
                setPosts(postsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const getSection = (key: string) =>
        sections.find((section) => section.section_key === key);

    const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSending(true);
        setContactError('');
        setContactSuccess(false);

        try {
            await sendContactMessage({
                name: contactName,
                email: contactEmail,
                subject: contactSubject || undefined,
                message: contactMessage,
            });

            setContactSuccess(true);
            setContactName('');
            setContactEmail('');
            setContactSubject('');
            setContactMessage('');
        } catch (error) {
            console.error(error);

            setContactError('Gagal mengirim pesan. Silakan coba lagi.');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0f1a]">
                <Head title="Home" />
                <div className="relative">
                    <div className="absolute inset-0 -z-0 animate-ping rounded-3xl bg-violet-500/40 blur-2xl" />
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 text-2xl font-bold text-white shadow-2xl shadow-violet-600/50">
                        {(company?.name ?? 'C').charAt(0)}
                    </div>
                </div>
                <p className="mt-6 animate-pulse text-sm font-semibold tracking-widest text-gray-400 uppercase">
                    Memuat...
                </p>
            </div>
        );
    }

    const hero = getSection('hero');
    const about = getSection('about');
    const cta = getSection('cta');

    const heroTitle = hero?.title || company?.tagline || company?.name;
    const heroSubtitle =
        hero?.description || hero?.subtitle || company?.about || '';
    const aboutTitle = about?.title || 'Tentang Kami';
    const aboutSubtitle =
        about?.subtitle || 'Mengenal lebih dekat perusahaan kami';
    const aboutDescription = about?.description || company?.about || '';
    const heroImage = hero?.image ?? null;
    const aboutImage = about?.image ?? null;
    const ctaTitle = cta?.title || 'Siap Bekerja Sama dengan Kami?';
    const ctaSubtitle =
        cta?.description ||
        cta?.subtitle ||
        'Hubungi kami sekarang untuk mendiskusikan kebutuhan bisnis Anda.';

    const [titlePart, highlightPart] = splitHighlight(heroTitle ?? '');
    const featuredProjects = projects.filter((p) => p.is_featured);
    const showProjects = featuredProjects.length > 0 ? featuredProjects : projects;

    return (
        <div className="min-h-screen overflow-x-hidden bg-white text-gray-900">
            <Head title="Home" />

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <a href="#hero" className="group flex items-center gap-3">
                        {company?.logo ? (
                            <img
                                src={fileUrl(company.logo)}
                                alt={company.name ?? ''}
                                className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-violet-500/20 ring-1 ring-violet-100"
                            />
                        ) : (
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-violet-600/40 transition-transform group-hover:scale-105">
                                {(company?.name ?? 'C').charAt(0)}
                            </span>
                        )}
                        <div className="leading-none">
                            <span className="block text-lg font-extrabold tracking-tight text-gray-900">
                                {company?.name ?? 'Company Profile'}
                            </span>
                            {company?.tagline && (
                                <span className="mt-0.5 block text-[11px] font-medium text-gray-400">
                                    {company.tagline}
                                </span>
                            )}
                        </div>
                    </a>

                    <div className="hidden items-center gap-1 lg:flex">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-violet-50 hover:text-violet-700"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/40"
                            >
                                Dashboard
                                <svg
                                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 7l5 5-5 5M6 12h12"
                                    />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 transition-all hover:border-violet-400 hover:bg-violet-50"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                Login
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-violet-50 hover:text-violet-700 lg:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </nav>

                {mobileMenuOpen && (
                    <div className="border-t border-violet-100 bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden">
                        <div className="flex flex-col gap-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="mt-3 border-t border-violet-100 pt-3">
                                {user ? (
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero */}
            <section
                id="hero"
                className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50"
            >
                {/* Decorative grid + blobs */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.5]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,92,246,0.06) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] animate-pulse rounded-full bg-violet-300/50 blur-3xl" />
                <div className="pointer-events-none absolute top-40 -left-32 h-[24rem] w-[24rem] rounded-full bg-fuchsia-300/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 right-1/3 h-[22rem] w-[22rem] rounded-full bg-indigo-300/40 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600" />
                            </span>
                            Selamat datang di {company?.name}
                        </span>

                        <h1 className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                                {highlightPart}
                            </span>
                            <span className="text-gray-900">{titlePart}</span>
                        </h1>

                        {heroSubtitle && (
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500 lg:mx-0">
                                {heroSubtitle}
                            </p>
                        )}

                        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                            <a
                                href="#contact"
                                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/40"
                            >
                                Mulai Sekarang
                                <svg
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </a>
                            <a
                                href="#services"
                                className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white/70 px-8 py-4 text-sm font-semibold text-violet-700 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50"
                            >
                                Lihat Layanan
                            </a>
                        </div>

                        {(projects.length > 0 || services.length > 0) && (
                            <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
                                <div>
                                    <p className="text-2xl font-extrabold text-gray-900">
                                        {projects.length}+
                                    </p>
                                    <p className="text-xs font-medium text-gray-400">
                                        Proyek Selesai
                                    </p>
                                </div>
                                <div className="h-10 w-px bg-violet-200" />
                                <div>
                                    <p className="text-2xl font-extrabold text-gray-900">
                                        {services.length}+
                                    </p>
                                    <p className="text-xs font-medium text-gray-400">
                                        Layanan
                                    </p>
                                </div>
                                <div className="h-10 w-px bg-violet-200" />
                                <div>
                                    <p className="text-2xl font-extrabold text-gray-900">
                                        {team.length}+
                                    </p>
                                    <p className="text-xs font-medium text-gray-400">
                                        Tim Profesional
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-violet-200 via-fuchsia-200 to-indigo-200 opacity-70 blur-2xl" />
                        <div className="relative rounded-[2rem] border border-white/60 bg-white/60 p-2.5 shadow-2xl shadow-violet-500/30 backdrop-blur-xl">
                            {heroImage ? (
                                <img
                                    src={fileUrl(heroImage)}
                                    alt={heroTitle ?? 'Hero'}
                                    className="w-full rounded-[1.6rem] object-cover"
                                />
                            ) : (
                                <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600">
                                    <div
                                        className="absolute inset-0 opacity-20"
                                        style={{
                                            backgroundImage:
                                                'radial-gradient(circle at 20% 30%, white 0, transparent 30%), radial-gradient(circle at 80% 70%, white 0, transparent 30%)',
                                        }}
                                    />
                                    <div className="relative flex flex-col items-center gap-4 px-10 text-center text-white">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-4xl font-extrabold backdrop-blur">
                                            {(company?.name ?? 'C').charAt(0)}
                                        </div>
                                        <p className="text-xl font-bold">
                                            {company?.name}
                                        </p>
                                        <p className="text-sm text-violet-100">
                                            {company?.tagline}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="absolute -top-5 -left-5 hidden rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl backdrop-blur md:block">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">
                                        {services.filter((s) => s.is_active).length} Layanan
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        Selalu aktif
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-5 -bottom-5 hidden rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl backdrop-blur md:block">
                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">
                                        {team.length} Anggota Tim
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        Siap membantu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
                    <svg
                        viewBox="0 0 1200 60"
                        className="h-12 w-full text-gray-50"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 60h1200V20c-100 20-250 30-400 20S550 0 600 0s120 40 240 30 240-10 360-15V60z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            </section>

            {/* Clients */}
            {clients.length > 0 && (
                <section className="border-b border-gray-100 bg-gray-50 py-14">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p className="mb-8 text-center text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                            Dipercaya oleh klien kami
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-10">
                            {clients.map((client) => (
                                <a
                                    key={client.id}
                                    href={client.website_url || undefined}
                                    target={client.website_url ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="flex h-16 items-center justify-center opacity-50 grayscale transition-all duration-300 hover:scale-105 hover:opacity-100 hover:grayscale-0"
                                >
                                    {client.logo ? (
                                        <img
                                            src={fileUrl(client.logo)}
                                            alt={client.name}
                                            className="max-h-12 max-w-[8rem] object-contain"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold text-gray-400 transition-colors hover:text-violet-600">
                                            {client.name}
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About */}
            {aboutDescription && (
                <section id="about" className="relative bg-white py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="About Us"
                            title={aboutTitle}
                            subtitle={aboutSubtitle}
                        />

                        <div className="flex flex-col items-center gap-14 lg:flex-row">
                            {aboutImage && (
                                <div className="relative flex-1">
                                    <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-60 blur-xl" />
                                    <img
                                        src={fileUrl(aboutImage)}
                                        alt={aboutTitle}
                                        className="relative w-full rounded-[2rem] object-cover shadow-2xl"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-700 uppercase">
                                    Keunggulan Kami
                                </span>
                                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                                    {aboutDescription}
                                </p>

                                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                                    <div className="group rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-violet-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-110">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mt-4 font-bold text-gray-900">
                                            Misi
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                            {company?.mission ||
                                                'Memberikan solusi terbaik untuk kebutuhan bisnis Anda.'}
                                        </p>
                                    </div>
                                    <div className="group rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-indigo-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mt-4 font-bold text-gray-900">
                                            Visi
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                            {company?.vision ||
                                                'Menjadi perusahaan terpercaya dalam bidang kami.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Services */}
            {services.length > 0 && (
                <section
                    id="services"
                    className="relative overflow-hidden bg-gray-950 py-24 text-white"
                >
                    <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-fuchsia-600/30 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-16 max-w-2xl text-center">
                            <span className="inline-flex items-center gap-2 rounded-full border border-violet-700/60 bg-violet-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-violet-300 uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                                Our Services
                            </span>
                            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Layanan Kami
                            </h2>
                            <p className="mt-5 text-lg leading-relaxed text-gray-400">
                                Solusi lengkap yang kami tawarkan untuk membantu
                                bisnis Anda berkembang.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all hover:-translate-y-2 hover:border-violet-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-violet-600/20"
                                >
                                    <span className="absolute top-5 right-6 text-4xl font-black text-white/5 transition-colors group-hover:text-white/10">
                                        0{index + 1}
                                    </span>
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl text-white shadow-lg shadow-violet-500/40 transition-transform group-hover:scale-110 group-hover:rotate-3">
                                        {service.icon ?? '✦'}
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-white">
                                        {service.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-400">
                                        {service.description}
                                    </p>
                                    <div className="mt-5 h-0.5 w-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-500 group-hover:w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects */}
            {showProjects.length > 0 && (
                <section id="projects" className="bg-gray-50 py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Our Work"
                            title="Proyek Kami"
                            subtitle="Beberapa proyek terbaik yang telah kami kerjakan."
                        />

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {showProjects.slice(0, 6).map((project) => (
                                <a
                                    key={project.id}
                                    href={project.project_url || '#projects'}
                                    target={project.project_url ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-violet-100 to-fuchsia-100">
                                        {project.image ? (
                                            <img
                                                src={fileUrl(project.image)}
                                                alt={project.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <span className="text-5xl text-white/80">✦</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        {project.is_featured && (
                                            <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                                ★ Featured
                                            </span>
                                        )}
                                        <span className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-violet-700 opacity-0 shadow-lg backdrop-blur transition-all group-hover:opacity-100">
                                            {project.category || 'Proyek'}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-violet-600">
                                            {project.title}
                                        </h3>
                                        {project.client && (
                                            <p className="mt-1 text-sm text-gray-400">
                                                {project.client}
                                            </p>
                                        )}
                                        {project.description && (
                                            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 py-20">
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 20%, white 0, transparent 25%), radial-gradient(circle at 80% 80%, white 0, transparent 25%)',
                    }}
                />
                <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            {ctaTitle}
                        </h2>
                        <p className="mt-3 text-lg text-violet-100">
                            {ctaSubtitle}
                        </p>
                    </div>
                    <a
                        href="#contact"
                        className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-violet-700 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
                    >
                        Mulai Sekarang
                        <svg
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </a>
                </div>
            </section>

            {/* Team */}
            {team.length > 0 && (
                <section id="team" className="bg-white py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Our Team"
                            title="Tim Kami"
                            subtitle="Orang-orang hebat di balik setiap kesuksesan."
                        />

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {team.slice(0, 8).map((member) => (
                                <div
                                    key={member.id}
                                    className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-6 text-center shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20"
                                >
                                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-violet-100 via-fuchsia-100 to-indigo-100" />
                                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-white shadow-xl">
                                        {member.photo ? (
                                            <img
                                                src={fileUrl(member.photo)}
                                                alt={member.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <span className="bg-gradient-to-br from-violet-600 to-fuchsia-500 bg-clip-text text-3xl font-extrabold text-transparent">
                                                {(member.name ?? 'T').charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative mt-5">
                                        <h3 className="font-bold text-gray-900">
                                            {member.name}
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-violet-600">
                                            {member.position}
                                        </p>
                                        {(member.email || member.linkedin_url) && (
                                            <div className="mt-4 flex items-center justify-center gap-2">
                                                {member.email && (
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-violet-100 hover:text-violet-600">
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </span>
                                                )}
                                                {member.linkedin_url && (
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-violet-100 hover:text-violet-600">
                                                        <span className="text-[10px] font-black">
                                                            in
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
                <section
                    id="testimonials"
                    className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24"
                >
                    <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Testimonials"
                            title="Apa Kata Mereka"
                            subtitle="Kepuasan klien adalah prioritas utama kami."
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="relative flex flex-col rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20"
                                >
                                    <span className="absolute top-6 right-8 font-serif text-6xl leading-none text-violet-200">
                                        "
                                    </span>
                                    <Stars rating={testimonial.rating} />
                                    <p className="mt-4 flex-1 leading-relaxed text-gray-600">
                                        {testimonial.content}
                                    </p>
                                    <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                                            {testimonial.photo ? (
                                                <img
                                                    src={fileUrl(
                                                        testimonial.photo,
                                                    )}
                                                    alt={testimonial.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="font-bold text-white">
                                                    {(
                                                        testimonial.name ?? 'T'
                                                    ).charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {[
                                                    testimonial.position,
                                                    testimonial.company,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ') || 'Client'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Blog */}
            {posts.length > 0 && (
                <section id="blog" className="bg-white py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Blog"
                            title="Artikel Terbaru"
                            subtitle="Berita, tips, dan wawasan dari tim kami."
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.slice(0, 3).map((post) => (
                                <a
                                    key={post.id}
                                    href="#blog"
                                    className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-100 to-fuchsia-100">
                                        {post.cover_image ? (
                                            <img
                                                src={fileUrl(post.cover_image)}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-5xl text-white/80">
                                                ✎
                                            </div>
                                        )}
                                        <span className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                            {post.category || 'Artikel'}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs font-medium text-gray-400">
                                            {formatDate(post.published_at)}
                                        </span>
                                        <h3 className="mt-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-violet-600">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600">
                                            Baca Selengkapnya
                                            <svg
                                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 7l5 5-5 5M6 12h12"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact */}
            <section
                id="contact"
                className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white py-24"
            >
                <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-fuchsia-200/50 blur-3xl" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Contact"
                        title="Hubungi Kami"
                        subtitle="Ada pertanyaan atau siap memulai? Kirimkan pesan Anda."
                    />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                        <div className="space-y-5 lg:col-span-2">
                            {company?.address && (
                                <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            Alamat
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {company.address}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {company?.phone && (
                                <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            Telepon
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {company.phone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {company?.email && (
                                <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            Email
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {company.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                {SOCIAL_LINKS.map((social) =>
                                    company?.[social.key] ? (
                                        <a
                                            key={social.key}
                                            href={company[social.key] ?? '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-600 hover:to-fuchsia-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/30"
                                            aria-label={social.label}
                                        >
                                            <span className="text-sm font-black">
                                                {social.label.charAt(0)}
                                            </span>
                                        </a>
                                    ) : null,
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-violet-100 bg-white p-8 shadow-2xl shadow-violet-500/10 lg:col-span-3">
                            {contactSuccess && (
                                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-medium text-emerald-700">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Pesan berhasil dikirim. Kami akan segera
                                    menghubungi Anda.
                                </div>
                            )}

                            {contactError && (
                                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {contactError}
                                </div>
                            )}

                            <form
                                onSubmit={handleContactSubmit}
                                className="space-y-5"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="contact-name"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Nama
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            value={contactName}
                                            onChange={(e) =>
                                                setContactName(e.target.value)
                                            }
                                            placeholder="Nama lengkap"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 transition outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="contact-email"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            value={contactEmail}
                                            onChange={(e) =>
                                                setContactEmail(e.target.value)
                                            }
                                            placeholder="email@contoh.com"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 transition outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-subject"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Subjek
                                    </label>
                                    <input
                                        id="contact-subject"
                                        type="text"
                                        value={contactSubject}
                                        onChange={(e) =>
                                            setContactSubject(e.target.value)
                                        }
                                        placeholder="Subjek pesan"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 transition outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-message"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Pesan
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        value={contactMessage}
                                        onChange={(e) =>
                                            setContactMessage(e.target.value)
                                        }
                                        rows={5}
                                        placeholder="Tulis pesan Anda di sini..."
                                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900 transition outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {sending ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            Kirim Pesan
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative overflow-hidden bg-gray-950 text-gray-400">
                <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3">
                                {company?.logo ? (
                                    <img
                                        src={fileUrl(company.logo)}
                                        alt={company.name ?? ''}
                                        className="h-10 w-10 rounded-xl bg-white/10 object-cover"
                                    />
                                ) : (
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 text-lg font-bold text-white">
                                        {(company?.name ?? 'C').charAt(0)}
                                    </span>
                                )}
                                <span className="text-lg font-extrabold text-white">
                                    {company?.name ?? 'Company Profile'}
                                </span>
                            </div>
                            <p className="mt-5 max-w-md text-sm leading-relaxed">
                                {company?.about ||
                                    company?.tagline ||
                                    'Solusi terbaik untuk kebutuhan bisnis Anda.'}
                            </p>
                            <div className="mt-6 flex gap-3">
                                {SOCIAL_LINKS.map((social) =>
                                    company?.[social.key] ? (
                                        <a
                                            key={social.key}
                                            href={company[social.key] ?? '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-all hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-violet-600 hover:to-fuchsia-500 hover:text-white"
                                            aria-label={social.label}
                                        >
                                            <span className="text-xs font-black">
                                                {social.label.charAt(0)}
                                            </span>
                                        </a>
                                    ) : null,
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                Navigasi
                            </h4>
                            <ul className="mt-5 space-y-3 text-sm">
                                {NAV_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="inline-flex items-center gap-2 transition-colors hover:text-violet-400"
                                        >
                                            <span className="h-1 w-1 rounded-full bg-white/20" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
                                Kontak
                            </h4>
                            <ul className="mt-5 space-y-3 text-sm">
                                {company?.email && <li>{company.email}</li>}
                                {company?.phone && <li>{company.phone}</li>}
                                {company?.address && <li>{company.address}</li>}
                                {company?.website_url && (
                                    <li>
                                        <a
                                            href={company.website_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="transition-colors hover:text-violet-400"
                                        >
                                            {company.website_url.replace(
                                                /^https?:\/\//,
                                                '',
                                            )}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} {company?.name}. Hak
                            cipta dilindungi.
                        </p>
                        <p className="text-gray-500">
                            Dibuat dengan{' '}
                            <span className="text-fuchsia-500">♥</span> oleh{' '}
                            {company?.name ?? 'kami'}
                        </p>
                        {user && (
                            <Link
                                href="/dashboard"
                                className="font-medium text-violet-400 transition-colors hover:text-violet-300"
                            >
                                Login ke Dashboard →
                            </Link>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}

function splitHighlight(text: string): [string, string] {
    const words = text.split(' ');
    const half = Math.ceil(words.length / 2);

    return [words.slice(half).join(' '), words.slice(0, half).join(' ')];
}
