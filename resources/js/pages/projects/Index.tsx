import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { fileUrl } from '@/lib/utils';
import { deleteProject, getProjects } from '@/services/projects';
import type { Project } from '@/services/projects';

export default function Index() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null,
    );

    useEffect(() => {
        const fetchProjects = async () => {
            try {
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

    const handleDelete = async () => {
        if (!selectedProject) {
            return;
        }

        try {
            setDeletingId(selectedProject.id);
            setError('');

            await deleteProject(selectedProject.id);

            setProjects((currentProjects) =>
                currentProjects.filter(
                    (project) => project.id !== selectedProject.id,
                ),
            );
            setShowDeleteModal(false);
            setSelectedProject(null);
        } catch (error) {
            console.error(error);
            setError('Gagal menghapus project.');
        } finally {
            setDeletingId(null);
        }
    };

    const openDeleteModal = (project: Project) => {
        setSelectedProject(project);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedProject(null);
    };

    return (
        <AdminLayout active="projects" title="Projects">
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
                                    Hapus Project
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Apakah kamu yakin ingin menghapus project
                                    ini?
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-900">
                                {selectedProject?.title}
                            </p>
                            <p className="text-xs text-gray-500">
                                ID: {selectedProject?.id}
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
                                disabled={deletingId === selectedProject?.id}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingId === selectedProject?.id
                                    ? 'Menghapus...'
                                    : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div>
                {/* Header with Add Button */}
                <div className="mb-8 flex items-center justify-between">
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
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:-translate-y-0.5 hover:shadow-violet-600/40"
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
                        Add Project
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
                                Loading projects...
                            </p>
                        </div>
                    </div>
                ) : projects.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50 text-3xl text-violet-600">
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
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
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
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:-translate-y-0.5 hover:shadow-violet-600/40"
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
                            Add Project
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
                                        Total Projects
                                    </span>
                                    <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-sm font-semibold text-violet-700">
                                        {projects.length}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Active
                                    </span>
                                    <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-semibold text-emerald-700">
                                        {
                                            projects.filter((p) => p.is_active)
                                                .length
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Featured
                                    </span>
                                    <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-semibold text-amber-700">
                                        {
                                            projects.filter(
                                                (p) => p.is_featured,
                                            ).length
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
                            <table className="w-full min-w-[1000px] text-left">
                                <thead className="border-b border-gray-100 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Project
                                        </th>
                                        <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Category
                                        </th>
                                        <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Featured
                                        </th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {projects.map((project) => (
                                        <tr
                                            key={project.id}
                                            className="group transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-violet-50 transition-colors group-hover:bg-violet-100">
                                                        {project.image ? (
                                                            <img
                                                                src={fileUrl(
                                                                    project.image,
                                                                )}
                                                                alt={
                                                                    project.title
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <svg
                                                                className="h-5 w-5 text-violet-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-gray-900 transition-colors group-hover:text-violet-700">
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
                                                        <svg
                                                            className="h-3 w-3"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                        </svg>
                                                        Featured
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/projects/${project.id}/edit`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100"
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
                                                                project,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
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

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
                            <p className="text-xs text-gray-400">
                                Showing {projects.length} projects
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                                    disabled
                                >
                                    Previous
                                </button>
                                <button className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-violet-600/25 transition-all hover:shadow-violet-600/40">
                                    1
                                </button>
                                <button
                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                                    disabled
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
