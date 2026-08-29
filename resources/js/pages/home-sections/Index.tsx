import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { fileUrl } from '@/lib/utils';
import { deleteHomeSection, getHomeSections } from '@/services/homeSections';
import type { HomeSection } from '@/services/homeSections';

const SECTION_LABELS: Record<string, string> = {
    hero: 'Hero',
    about: 'About',
    cta: 'Call to Action',
};

export default function Index() {
    const [sections, setSections] = useState<HomeSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState<HomeSection | null>(
        null,
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHomeSections();

                setSections(data);
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data home sections.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!selectedSection) {
            return;
        }

        try {
            setDeletingId(selectedSection.id);
            setError('');

            await deleteHomeSection(selectedSection.id);

            setSections((current) =>
                current.filter((item) => item.id !== selectedSection.id),
            );
            setShowDeleteModal(false);
            setSelectedSection(null);
        } catch (error) {
            console.error(error);
            setError('Gagal menghapus home section.');
        } finally {
            setDeletingId(null);
        }
    };

    const openDeleteModal = (section: HomeSection) => {
        setSelectedSection(section);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedSection(null);
    };

    const getSectionLabel = (key: string) => SECTION_LABELS[key] ?? key;

    return (
        <AdminLayout active="home-sections" title="Home Sections">
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Hapus Home Section
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Apakah kamu yakin ingin menghapus section
                                    ini?
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-900">
                                {getSectionLabel(
                                    selectedSection?.section_key ?? '',
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                section_key: {selectedSection?.section_key} ·
                                ID: {selectedSection?.id}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deletingId === selectedSection?.id}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingId === selectedSection?.id
                                    ? 'Menghapus...'
                                    : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header with Add Button */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Home Sections
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Kelola section pada halaman beranda (hero, about, CTA).
                    </p>
                </div>

                <Link
                    href="/home-sections/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:translate-y-[-0.125rem] hover:shadow-violet-600/40"
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Section
                </Link>
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
                            Loading home sections...
                        </p>
                    </div>
                </div>
            ) : sections.length === 0 ? (
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
                                d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v14h7v-7h2v7h1v-8a1 1 0 011-1h1V6h-3a1 1 0 010-2h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        Belum ada home section
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        Tambahkan section pertama untuk halaman beranda kamu.
                    </p>
                    <Link
                        href="/home-sections/create"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:translate-y-[-0.125rem] hover:shadow-violet-600/40"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Section
                    </Link>
                </div>
            ) : (
                /* Cards Grid */
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-100">
                                {section.image ? (
                                    <img
                                        src={fileUrl(section.image)}
                                        alt={section.title ?? 'Home section'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100">
                                        <span className="rounded-xl bg-white/80 px-4 py-2 text-lg font-bold text-violet-700 shadow-sm backdrop-blur">
                                            {getSectionLabel(
                                                section.section_key,
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
                                        {getSectionLabel(section.section_key)}
                                    </span>
                                    {section.is_active ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-500/90 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5">
                                <h2 className="font-bold text-gray-900 transition-colors group-hover:text-violet-700">
                                    {section.title ?? 'Tanpa judul'}
                                </h2>
                                {section.subtitle && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {section.subtitle}
                                    </p>
                                )}
                                {section.description && (
                                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                        {section.description}
                                    </p>
                                )}

                                {/* Data extras */}
                                {section.data &&
                                    Object.keys(section.data).length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {Object.entries(section.data).map(
                                                ([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                                                    >
                                                        {key}: {String(value)}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    )}

                                {/* Actions */}
                                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                        {section.section_key}
                                    </span>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/home-sections/${section.id}/edit`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
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
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDeleteModal(section)
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
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
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
