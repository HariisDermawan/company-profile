import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';

import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/auth';
import { getProjects, type Project } from '@/services/projects';

export default function Index() {
    const { user, setUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getProjects();

                setProjects(data);
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data projects.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();

            setUser(null);

            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900 group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Services
                        </Link>
                        <Link
                            href="/projects"
                            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/25"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Projects
                            <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{projects.length}</span>
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900 group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
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
                        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-600/30">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6">

                    {/* Header with Add Button */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Projects
                            </h1>
                            <p className="mt-1 text-gray-500">
                                Kelola project company profile kamu.
                            </p>
                        </div>

                        <Link
                            href="/projects/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40 transition-all hover:-translate-y-0.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Project
                        </Link>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600 flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-12 w-12 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
                                <p className="text-sm text-gray-500 font-medium">
                                    Loading projects...
                                </p>
                            </div>
                        </div>
                    ) : projects.length === 0 ? (
                        /* Empty State */
                        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50 text-3xl text-violet-600">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-gray-900">
                                Belum ada project
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                Belum ada project yang tersedia. Tambahkan project
                                pertama kamu sekarang.
                            </p>

                            <Link
                                href="/projects/create"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/40 transition-all hover:-translate-y-0.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Project
                            </Link>
                        </div>
                    ) : (
                        /* Table */
                        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">

                            {/* Stats Bar */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Total Projects</span>
                                        <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-sm font-semibold text-violet-700">
                                            {projects.length}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-semibold text-emerald-700">
                                            {projects.filter(p => p.is_active).length}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Featured</span>
                                        <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-semibold text-amber-700">
                                            {projects.filter(p => p.is_featured).length}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Last updated: {new Date().toLocaleDateString('id-ID')}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px] text-left">

                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Project
                                            </th>
                                            <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Slug
                                            </th>
                                            <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Category
                                            </th>
                                            <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Featured
                                            </th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                        {projects.map((project) => (
                                            <tr
                                                key={project.id}
                                                className="group hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 text-sm font-semibold group-hover:bg-violet-100 transition-colors">
                                                            {project.image ? (
                                                                <img src={project.image} alt={project.title} className="h-8 w-8 rounded-lg object-cover" />
                                                            ) : (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                                                                {project.title}
                                                            </p>

                                                            <p className="text-xs text-gray-400">
                                                                ID: {project.id}
                                                            </p>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-4m0 0l4 4m-4-4v8" />
                                                        </svg>
                                                        {project.slug}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600">
                                                        {project.category || '-'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {project.is_active ? (
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                                                            <span className="h-2 w-2 rounded-full bg-gray-400" />
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {project.is_featured ? (
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                            </svg>
                                                            Featured
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">

                                                        <Link
                                                            href={`/projects/${project.id}/edit`}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:border-gray-300"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:border-red-300"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>

                                </table>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/50">
                                <p className="text-xs text-gray-400">
                                    Showing {projects.length} projects
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
                                        Previous
                                    </button>
                                    <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-medium text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all">
                                        1
                                    </button>
                                    <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50" disabled>
                                        Next
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}