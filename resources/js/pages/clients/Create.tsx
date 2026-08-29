import { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

import AdminLayout from '@/components/AdminLayout';
import { createClient } from '@/services/clients';

export default function Create() {
    const [name, setName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [order, setOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await createClient({
                name,
                logo,
                website_url: websiteUrl || undefined,
                order,
                is_active: isActive,
            });

            window.location.href = '/clients';
        } catch (error: any) {
            console.error(error);

            if (error.response?.status === 422) {
                setError('Data tidak valid. Periksa kembali input kamu.');
            } else {
                setError('Gagal membuat client.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout active="clients" title="Add Client">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Logo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-violet-50">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <svg className="h-8 w-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                            >
                                Upload Logo
                            </button>
                            {logoPreview && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLogo(null);
                                        setLogoPreview('');
                                    }}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                            Nama Client
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: PT Maju Bersama"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            required
                        />
                    </div>

                    {/* Website */}
                    <div>
                        <label htmlFor="website_url" className="mb-2 block text-sm font-medium text-gray-700">
                            Website URL
                        </label>
                        <input
                            id="website_url"
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://clientsite.com"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {/* Order */}
                    <div>
                        <label htmlFor="order" className="mb-2 block text-sm font-medium text-gray-700">
                            Order
                        </label>
                        <input
                            id="order"
                            type="number"
                            min={0}
                            value={order}
                            onChange={(e) => setOrder(Number(e.target.value))}
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
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Client aktif
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href="/clients"
                            className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:translate-y-[-0.125rem] hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Client'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}