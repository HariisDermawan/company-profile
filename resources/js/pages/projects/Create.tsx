import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { createProject } from '@/services/projects';

export default function Create() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('');
    const [client, setClient] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
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

    const handleTitleChange = (value: string) => {
        setTitle(value);
        setSlug(
            value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-'),
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await createProject({
                title,
                slug: slug || undefined,
                category: category || undefined,
                client: client || undefined,
                project_url: projectUrl || undefined,
                description: description || undefined,
                image,
                is_featured: isFeatured,
                is_active: isActive,
            });

            window.location.href = '/projects';
        } catch (error: any) {
            console.error(error);

            if (error.response?.status === 422) {
                setError('Data tidak valid. Periksa kembali input kamu.');
            } else {
                setError('Gagal membuat project.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout active="projects" title="Add Project">
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
                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Gambar Project
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-32 w-48 items-center justify-center overflow-hidden rounded-2xl bg-violet-50">
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

                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Judul Project
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Contoh: Website Company Profile"
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
                            placeholder="diisi otomatis dari judul"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {/* Category & Client */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Kategori
                            </label>
                            <input
                                id="category"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Contoh: Web Development"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="client"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Client
                            </label>
                            <input
                                id="client"
                                type="text"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                placeholder="Contoh: PT Maju Bersama"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                    </div>

                    {/* Project URL */}
                    <div>
                        <label
                            htmlFor="project_url"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            URL Project
                        </label>
                        <input
                            id="project_url"
                            type="url"
                            value={projectUrl}
                            onChange={(e) => setProjectUrl(e.target.value)}
                            placeholder="https://project-live.com"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
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
                            rows={5}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap items-center gap-6 py-2">
                        <div className="flex items-center gap-3">
                            <input
                                id="is_featured"
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) =>
                                    setIsFeatured(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <label
                                htmlFor="is_featured"
                                className="text-sm font-medium text-gray-700"
                            >
                                Featured project
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
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
                                Project aktif
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href="/projects"
                            className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:translate-y-[-0.125rem] hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
