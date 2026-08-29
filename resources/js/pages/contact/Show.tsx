import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { getMessage, markMessageAsRead } from '@/services/contact';
import type { ContactMessage } from '@/services/contact';

export default function Show({ id }: { id: number }) {
    const [message, setMessage] = useState<ContactMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                setError('');

                const data = await getMessage(id);

                setMessage(data);

                if (!data.is_read) {
                    await markMessageAsRead(data.id, true);
                    setMessage((current) =>
                        current
                            ? {
                                  ...current,
                                  is_read: true,
                                  read_at: new Date().toISOString(),
                              }
                            : current,
                    );
                }
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data pesan.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessage();
    }, [id]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    if (loading) {
        return (
            <AdminLayout active="contact" title="Message Detail">
                <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                        <p className="text-sm font-medium text-gray-500">
                            Loading message...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!message) {
        return (
            <AdminLayout active="contact" title="Message Detail">
                <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900">
                        Pesan tidak ditemukan
                    </h2>
                    <Link
                        href="/contact"
                        className="mt-6 inline-flex rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                        Kembali ke daftar pesan
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout active="contact" title="Message Detail">
            {/* Error banner for actions */}
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

            {/* Back + title */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link
                        href="/contact"
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition hover:text-violet-700"
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Kembali ke daftar
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Detail Pesan
                    </h1>
                </div>
                {message.is_read ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Sudah dibaca
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Belum dibaca
                    </span>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Message Content */}
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
                    <div className="flex items-start gap-4 border-b border-gray-100 pb-6">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-xl font-bold text-violet-700">
                            {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {message.subject || message.name}
                            </h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                dari{' '}
                                <span className="font-medium text-gray-700">
                                    {message.name}
                                </span>
                            </p>
                            <p className="text-xs text-gray-400">
                                {formatDate(message.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Isi Pesan
                        </h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                            {message.message}
                        </p>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold text-gray-900">
                            Informasi Pengirim
                        </h3>
                        <dl className="space-y-4 text-sm">
                            <div>
                                <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                                    Nama
                                </dt>
                                <dd className="mt-1 font-semibold text-gray-900">
                                    {message.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                                    Email
                                </dt>
                                <dd className="mt-1">
                                    <a
                                        href={`mailto:${message.email}`}
                                        className="font-medium text-violet-600 hover:underline"
                                    >
                                        {message.email}
                                    </a>
                                </dd>
                            </div>
                            {message.subject && (
                                <div>
                                    <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                                        Subjek
                                    </dt>
                                    <dd className="mt-1 font-medium text-gray-900">
                                        {message.subject}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                                    Status
                                </dt>
                                <dd className="mt-1">
                                    {message.is_read ? (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            Dibaca
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                                            Belum dibaca
                                        </span>
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                                    Dikirim pada
                                </dt>
                                <dd className="mt-1 font-medium text-gray-900">
                                    {formatDate(message.created_at)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                        <p className="text-sm text-gray-500">
                            Ingin membalas pesan ini?
                        </p>
                        <a
                            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject ?? 'Pesan dari website')}`}
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:translate-y-[-0.125rem] hover:shadow-violet-600/40"
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
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Balas via Email
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
