import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { createHomeSection } from '@/services/homeSections';

const SECTION_KEY_OPTIONS = [
    { value: 'hero', label: 'Hero' },
    { value: 'about', label: 'About' },
    { value: 'cta', label: 'Call to Action' },
];

export default function Create() {
    const [sectionKey, setSectionKey] = useState('hero');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [extraKey, setExtraKey] = useState('');
    const [extraValue, setExtraValue] = useState('');
    const [extraData, setExtraData] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addExtraData = () => {
        if (!extraKey.trim()) {
            return;
        }

        setExtraData((current) => ({
            ...current,
            [extraKey.trim()]: extraValue,
        }));
        setExtraKey('');
        setExtraValue('');
    };

    const removeExtraData = (key: string) => {
        setExtraData((current) => {
            const next = { ...current };

            delete next[key];

            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await createHomeSection({
                section_key: sectionKey,
                title: title || undefined,
                subtitle: subtitle || undefined,
                description: description || undefined,
                image,
                data: extraData,
                is_active: isActive,
            });

            window.location.href = '/home-sections';
        } catch (error: any) {
            console.error(error);

            if (error.response?.status === 422) {
                setError('Data tidak valid. Periksa kembali input kamu.');
            } else {
                setError('Gagal membuat home section.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout active="home-sections" title="Add Home Section">
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
                    {/* Section Key */}
                    <div>
                        <label
                            htmlFor="section_key"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Tipe Section
                        </label>
                        <select
                            id="section_key"
                            value={sectionKey}
                            onChange={(e) => setSectionKey(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        >
                            {SECTION_KEY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1.5 text-xs text-gray-400">
                            section_key: {sectionKey}
                        </p>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Gambar
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-28 w-40 items-center justify-center overflow-hidden rounded-2xl bg-violet-50">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="h-8 w-8 text-violet-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                            >
                                Upload Gambar
                            </button>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview('');
                                    }}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Judul
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Solusi Digital untuk Bisnis Anda"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="subtitle"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Subtitle
                            </label>
                            <input
                                id="subtitle"
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Deskripsi
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {/* Extra data */}
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-900">
                            Data Tambahan
                        </h3>
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center">
                            <input
                                type="text"
                                value={extraKey}
                                onChange={(e) => setExtraKey(e.target.value)}
                                placeholder="Kunci (contoh: button_text)"
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                            <input
                                type="text"
                                value={extraValue}
                                onChange={(e) => setExtraValue(e.target.value)}
                                placeholder="Nilai (contoh: Lihat Layanan)"
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                            <button
                                type="button"
                                onClick={addExtraData}
                                disabled={!extraKey.trim()}
                                className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Tambah
                            </button>
                        </div>

                        {Object.keys(extraData).length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {Object.entries(extraData).map(
                                    ([key, value]) => (
                                        <span
                                            key={key}
                                            className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
                                        >
                                            {key}: {value}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExtraData(key)
                                                }
                                                className="text-violet-400 transition hover:text-red-500"
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
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    ),
                                )}
                            </div>
                        )}
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
                            Section aktif
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href="/home-sections"
                            className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:translate-y-[-0.125rem] hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Section'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
