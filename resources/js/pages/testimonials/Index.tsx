import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { fileUrl } from '@/lib/utils';
import { deleteTestimonial, getTestimonials } from '@/services/testimonials';
import type { Testimonial } from '@/services/testimonials';

export default function Index() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] =
        useState<Testimonial | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTestimonials();

                setTestimonials(data);
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data testimonials.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!selectedTestimonial) {
            return;
        }

        try {
            setDeletingId(selectedTestimonial.id);
            setError('');

            await deleteTestimonial(selectedTestimonial.id);

            setTestimonials((current) =>
                current.filter((item) => item.id !== selectedTestimonial.id),
            );
            setShowDeleteModal(false);
            setSelectedTestimonial(null);
        } catch (error) {
            console.error(error);
            setError('Gagal menghapus testimonial.');
        } finally {
            setDeletingId(null);
        }
    };

    const openDeleteModal = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedTestimonial(null);
    };

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: rating }).map((_, i) => (
                <svg
                    key={i}
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    return (
        <AdminLayout active="testimonials" title="Testimonials">
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
                                    Hapus Testimonial
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Apakah kamu yakin ingin menghapus
                                    testimonial ini?
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-900">
                                {selectedTestimonial?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                ID: {selectedTestimonial?.id}
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
                                disabled={
                                    deletingId === selectedTestimonial?.id
                                }
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingId === selectedTestimonial?.id
                                    ? 'Menghapus...'
                                    : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header with Add Button */}
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Testimonials
                </h1>

                <Link
                    href="/testimonials/create"
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
                    Add Testimonial
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
                            Loading testimonials...
                        </p>
                    </div>
                </div>
            ) : testimonials.length === 0 ? (
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
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        Belum ada testimonial
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        Belum ada testimonial. Tambahkan testimonial pertama
                        kamu sekarang.
                    </p>
                    <Link
                        href="/testimonials/create"
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
                        Add Testimonial
                    </Link>
                </div>
            ) : (
                /* Table */
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* Stats Bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                        <div className="flex items-center gap-6">
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Total Testimonials
                                </span>
                                <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-sm font-semibold text-violet-700">
                                    {testimonials.length}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Active
                                </span>
                                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-semibold text-emerald-700">
                                    {
                                        testimonials.filter((t) => t.is_active)
                                            .length
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-400">
                            Last updated:{' '}
                            {new Date().toLocaleDateString('id-ID')}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left">
                            <thead className="border-b border-gray-100 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Client
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Company
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Content
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {testimonials.map((testimonial) => (
                                    <tr
                                        key={testimonial.id}
                                        className="group transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 overflow-hidden rounded-xl bg-violet-50">
                                                    {testimonial.photo ? (
                                                        <img
                                                            src={fileUrl(
                                                                testimonial.photo,
                                                            )}
                                                            alt={
                                                                testimonial.name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-violet-600">
                                                            {testimonial.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 transition-colors group-hover:text-violet-700">
                                                        {testimonial.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {testimonial.position ||
                                                            '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                {testimonial.company || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStars(testimonial.rating)}
                                        </td>
                                        <td className="max-w-xs px-6 py-4">
                                            <p className="truncate text-sm text-gray-600">
                                                {testimonial.content}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {testimonial.is_active ? (
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
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/testimonials/${testimonial.id}/edit`}
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
                                                        openDeleteModal(
                                                            testimonial,
                                                        )
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
                        <p className="text-xs text-gray-400">
                            Showing {testimonials.length} testimonials
                        </p>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
