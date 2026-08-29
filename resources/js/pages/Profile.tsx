import { Link } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { logout } from '@/services/auth';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-900 group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Projects
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/25"
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
                        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
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

                        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-3xl font-bold text-white shadow-lg shadow-violet-600/30">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user?.name || 'User'}
                                </h1>

                                <p className="text-gray-500">
                                    {user?.email || '-'}
                                </p>

                                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                    Active
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-5 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase text-gray-400">
                                        Name
                                    </p>
                                </div>

                                <p className="font-semibold text-gray-900">
                                    {user?.name || '-'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-5 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase text-gray-400">
                                        Email
                                    </p>
                                </div>

                                <p className="font-semibold text-gray-900">
                                    {user?.email || '-'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-5 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase text-gray-400">
                                        Role
                                    </p>
                                </div>

                                <p className="font-semibold text-gray-900">
                                    Administrator
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-5 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase text-gray-400">
                                        Status
                                    </p>
                                </div>

                                <p className="font-semibold text-emerald-600 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                    Active
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}