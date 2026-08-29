import { Link } from '@inertiajs/react';
import { useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { createService } from '@/services/service';

export default function Create() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await createService({
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
                setError('Data tidak valid. Periksa kembali input kamu.');
            } else {
                setError('Gagal membuat service.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout active="services" title="Add Service">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
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
                            placeholder="Contoh: Web Development"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
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
                            placeholder="Contoh: web-development"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
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
                            placeholder="Deskripsi service..."
                            rows={5}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
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
                            placeholder="Contoh: globe"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
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
                            className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:-translate-y-0.5 hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Service'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
