import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { fileUrl } from '@/lib/utils';
import { getCompanyProfiles } from '@/services/company';
import type { CompanyProfile } from '@/services/company';

export default function Index() {
    const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError('');

                const data = await getCompanyProfiles();

                setProfiles(data);
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data company profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AdminLayout active="company" title="Company Profile">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Company Profile
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Kelola informasi profil perusahaan yang tampil di
                        halaman publik.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
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
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                        <p className="text-sm font-medium text-gray-500">
                            Loading company profile...
                        </p>
                    </div>
                </div>
            ) : profiles.length === 0 ? (
                /* Empty State */
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <svg
                            className="h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        Belum ada company profile
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        Jangan lupa isi profil perusahaan agar tampil di halaman
                        publik.
                    </p>
                </div>
            ) : (
                /* Profile Cards */
                <div className="grid gap-6 lg:grid-cols-2">
                    {profiles.map((profile) => (
                        <div
                            key={profile.id}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-violet-50 to-indigo-50 px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                                        {profile.logo ? (
                                            <img
                                                src={fileUrl(profile.logo)}
                                                alt={profile.name}
                                                className="h-full w-full object-contain p-1.5"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-violet-600">
                                                {profile.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {profile.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {profile.tagline || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {profile.is_active ? (
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
                                    <Link
                                        href={`/company/${profile.id}/edit`}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-200 transition hover:bg-violet-600 hover:text-white"
                                    >
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
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Edit
                                    </Link>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="space-y-5 px-6 py-6">
                                {profile.about && (
                                    <div>
                                        <h3 className="mb-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                            About
                                        </h3>
                                        <p className="text-sm leading-relaxed text-gray-600">
                                            {profile.about}
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {profile.mission && (
                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                                Mission
                                            </h3>
                                            <p className="text-sm leading-relaxed text-gray-600">
                                                {profile.mission}
                                            </p>
                                        </div>
                                    )}
                                    {profile.vision && (
                                        <div className="rounded-xl bg-gray-50 p-4">
                                            <h3 className="mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                                Vision
                                            </h3>
                                            <p className="text-sm leading-relaxed text-gray-600">
                                                {profile.vision}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Contact & Socials */}
                                <div className="grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
                                    {profile.email && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <svg
                                                className="h-4 w-4 shrink-0 text-violet-500"
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
                                            <span className="truncate">
                                                {profile.email}
                                            </span>
                                        </div>
                                    )}
                                    {profile.phone && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <svg
                                                className="h-4 w-4 shrink-0 text-violet-500"
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
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                    {profile.address && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <svg
                                                className="h-4 w-4 shrink-0 text-violet-500"
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
                                            <span className="truncate">
                                                {profile.address}
                                            </span>
                                        </div>
                                    )}
                                    {profile.website_url && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <svg
                                                className="h-4 w-4 shrink-0 text-violet-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.657 0l-1.414-1.414a4 4 0 010-5.657l3-3a4 4 0 015.657 0M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.657 0l1.414 1.414a4 4 0 010 5.657l-3 3a4 4 0 01-5.657 0"
                                                />
                                            </svg>
                                            <a
                                                href={profile.website_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="truncate text-violet-600 hover:underline"
                                            >
                                                {profile.website_url}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Socials */}
                                {(profile.facebook_url ||
                                    profile.instagram_url ||
                                    profile.twitter_url ||
                                    profile.linkedin_url) && (
                                    <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                                        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                            Social:
                                        </span>
                                        {profile.facebook_url && (
                                            <a
                                                href={profile.facebook_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-gray-400 transition hover:text-violet-600"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.instagram_url && (
                                            <a
                                                href={profile.instagram_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-gray-400 transition hover:text-violet-600"
                                            >
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
                                                        d="M16 3a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5h8zm-4 6a3 3 0 100 6 3 3 0 000-6zm4.5-2.5h.01"
                                                    />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.twitter_url && (
                                            <a
                                                href={profile.twitter_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-gray-400 transition hover:text-violet-600"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </a>
                                        )}
                                        {profile.linkedin_url && (
                                            <a
                                                href={profile.linkedin_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-gray-400 transition hover:text-violet-600"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
