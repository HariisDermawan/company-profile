import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/auth';
import {
    getService,
    updateService,
    type Service,
} from '@/services/service';

interface EditProps {
    id: number;
}

export default function Edit({ id }: EditProps) {
    const { user, setUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [service, setService] = useState<Service | null>(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchService = async () => {
            if (!id) {
                setError('ID service tidak ditemukan.');
                setLoading(false);
                return;
            }

            try {
                const data = await getService(Number(id));

                setService(data);
                setTitle(data.title);
                setSlug(data.slug);
                setDescription(data.description);
                setIcon(data.icon ?? '');
                setIsActive(data.is_active);
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data service.');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        if (!id) {
            return;
        }

        try {
            setSaving(true);
            setError('');

            await updateService(Number(id), {
                title,
                slug,
                description,
                icon: icon || undefined,
                is_active: isActive,
            });

            window.location.href = '/services';
        } catch (error: any) {
            console.error(error);

            if (error.response?.status === 422) {
                setError(
                    'Data tidak valid. Periksa kembali input kamu.',
                );
            } else {
                setError('Gagal mengupdate service.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();

            setUser(null);

            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">
                        Loading service...
                    </p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] p-6">
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="mt-4 text-sm text-red-600 font-medium">
                        {error || 'Service tidak ditemukan.'}
                    </p>

                    <Link
                        href="/services"
                        className="mt-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-700"
                    >
                        Kembali ke Services →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5]">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex w-72 flex-col
                    bg-white shadow-2xl
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex h-20 items-center border-b border-gray-100 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-violet-600/30">
                            CP
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">
                                Company Profile
                            </h1>
                            <p className="text-[10px] text-gray-400 font-medium tracking-wider">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto text-gray-300 hover:text-gray-600 transition-colors lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Main Menu
                    </p>
                    <nav className="space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900 group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link
                            href="/services"
                            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/25"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Services
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900 group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </Link>
                    </nav>
                </div>

                <div className="border-t border-gray-100 p-4">
                    <div className="mb-3 rounded-xl bg-gray-50 p-3">
                        <p className="truncate text-sm font-semibold text-gray-900">
                            {user?.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600 group"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="lg:pl-72">

                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-20 items-center px-6 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 transition-all lg:hidden"
                    >
                        ☰
                    </button>

                    <div className="ml-4 lg:ml-0">
                        <h2 className="text-sm text-gray-500 font-medium">Pages /</h2>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-600/30">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600 flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label
                                    htmlFor="slug"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Slug
                                </label>

                                <input
                                    id="slug"
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                    required
                                />
                            </div>

                            {/* Icon */}
                            <div>
                                <label
                                    htmlFor="icon"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Icon
                                </label>

                                <input
                                    id="icon"
                                    type="text"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                />
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-3 py-2">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                />

                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Service aktif
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                                <Link
                                    href="/services"
                                    className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:border-gray-300"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:shadow-violet-600/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Service'
                                    )}
                                </button>

                            </div>

                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
}
