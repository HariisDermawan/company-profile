import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { fileUrl } from '@/lib/utils';
import { deleteTeamMember, getTeamMembers } from '@/services/team';
import type { TeamMember } from '@/services/team';

export default function Index() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(
        null,
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTeamMembers();

                setTeamMembers(data);
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data team.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!selectedMember) {
            return;
        }

        try {
            setDeletingId(selectedMember.id);
            setError('');

            await deleteTeamMember(selectedMember.id);

            setTeamMembers((current) =>
                current.filter((member) => member.id !== selectedMember.id),
            );
            setShowDeleteModal(false);
            setSelectedMember(null);
        } catch (error) {
            console.error(error);
            setError('Gagal menghapus anggota tim.');
        } finally {
            setDeletingId(null);
        }
    };

    const openDeleteModal = (member: TeamMember) => {
        setSelectedMember(member);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedMember(null);
    };

    return (
        <AdminLayout active="team" title="Team">
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
                                    Hapus Anggota Tim
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Apakah kamu yakin ingin menghapus anggota
                                    ini?
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-900">
                                {selectedMember?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                ID: {selectedMember?.id}
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
                                disabled={deletingId === selectedMember?.id}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingId === selectedMember?.id
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
                    <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                </div>

                <Link
                    href="/team/create"
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
                    Add Member
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
                            Loading team...
                        </p>
                    </div>
                </div>
            ) : teamMembers.length === 0 ? (
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        Belum ada anggota tim
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        Belum ada anggota tim yang tersedia. Tambahkan anggota
                        pertama kamu sekarang.
                    </p>
                    <Link
                        href="/team/create"
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
                        Add Member
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
                                    Total Members
                                </span>
                                <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-sm font-semibold text-violet-700">
                                    {teamMembers.length}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Active
                                </span>
                                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-semibold text-emerald-700">
                                    {
                                        teamMembers.filter((m) => m.is_active)
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
                                        Member
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Position
                                    </th>
                                    <th className="px-6 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Order
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
                                {teamMembers.map((member) => (
                                    <tr
                                        key={member.id}
                                        className="group transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 overflow-hidden rounded-xl bg-violet-50">
                                                    {member.photo ? (
                                                        <img
                                                            src={fileUrl(
                                                                member.photo,
                                                            )}
                                                            alt={member.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-violet-600">
                                                            {member.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 transition-colors group-hover:text-violet-700">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        ID: {member.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                {member.position || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {member.order}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.is_active ? (
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
                                                    href={`/team/${member.id}/edit`}
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
                                                        openDeleteModal(member)
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
                            Showing {teamMembers.length} members
                        </p>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
