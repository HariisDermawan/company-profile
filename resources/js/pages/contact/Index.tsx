import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { deleteMessage, getMessages } from '@/services/contact';
import type { ContactMessage } from '@/services/contact';

export default function Index() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] =
        useState<ContactMessage | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMessages();

                setMessages(data);
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data pesan.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!selectedMessage) {
            return;
        }

        try {
            setDeletingId(selectedMessage.id);
            setError('');

            await deleteMessage(selectedMessage.id);

            setMessages((current) =>
                current.filter((message) => message.id !== selectedMessage.id),
            );
            setShowDeleteModal(false);
            setSelectedMessage(null);
        } catch (error) {
            console.error(error);
            setError('Gagal menghapus pesan.');
        } finally {
            setDeletingId(null);
        }
    };

    const openDeleteModal = (message: ContactMessage) => {
        setSelectedMessage(message);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedMessage(null);
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const unreadCount = messages.filter((message) => !message.is_read).length;

    return (
        <AdminLayout active="contact" title="Contact Messages">
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
                                    Hapus Pesan
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Apakah kamu yakin ingin menghapus pesan ini?
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-xl bg-gray-50 p-4">
                            <p className="text-sm font-medium text-gray-900">
                                {selectedMessage?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {selectedMessage?.email}
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
                                disabled={deletingId === selectedMessage?.id}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingId === selectedMessage?.id
                                    ? 'Menghapus...'
                                    : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Contact Messages
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Pesan masuk dari form kontak di halaman publik.
                </p>
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
                            Loading messages...
                        </p>
                    </div>
                </div>
            ) : messages.length === 0 ? (
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
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        Belum ada pesan
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        Pesan dari pengunjung website akan muncul di sini.
                    </p>
                </div>
            ) : (
                /* Messages List */
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* Stats Bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                        <div className="flex items-center gap-6">
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Total Pesan
                                </span>
                                <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-sm font-semibold text-violet-700">
                                    {messages.length}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Belum Dibaca
                                </span>
                                <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-semibold text-amber-700">
                                    {unreadCount}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-400">
                            Last updated:{' '}
                            {new Date().toLocaleDateString('id-ID')}
                        </div>
                    </div>

                    <ul className="divide-y divide-gray-100">
                        {messages.map((message) => (
                            <li key={message.id}>
                                <Link
                                    href={`/contact/${message.id}`}
                                    className={`flex items-start gap-4 px-6 py-5 transition-colors hover:bg-gray-50 ${
                                        !message.is_read
                                            ? 'bg-violet-50/40'
                                            : ''
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold ${
                                                message.is_read
                                                    ? 'bg-gray-100 text-gray-500'
                                                    : 'bg-violet-100 text-violet-700'
                                            }`}
                                        >
                                            {message.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        {!message.is_read && (
                                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-violet-500"></span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="truncate font-semibold text-gray-900">
                                                {message.name}
                                            </h3>
                                            <span className="shrink-0 text-xs text-gray-400">
                                                {formatDate(message.created_at)}
                                            </span>
                                        </div>
                                        <p
                                            className={`mt-0.5 truncate text-sm ${message.is_read ? 'text-gray-500' : 'font-medium text-gray-700'}`}
                                        >
                                            {message.subject ||
                                                '(tanpa subjek)'}{' '}
                                            · {message.email}
                                        </p>
                                        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">
                                            {message.message}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-2">
                                        {!message.is_read && (
                                            <span className="rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                                                Baru
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                openDeleteModal(message);
                                            }}
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
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
                        <p className="text-xs text-gray-400">
                            Showing {messages.length} messages
                        </p>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
