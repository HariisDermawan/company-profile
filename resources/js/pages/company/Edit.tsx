import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import AdminLayout from '@/components/AdminLayout';
import { fileUrl } from '@/lib/utils';
import { getCompanyProfile, updateCompanyProfile } from '@/services/company';

export default function Edit({ id }: { id: number }) {
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [about, setAbout] = useState('');
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getCompanyProfile(id);

                setName(profile.name);
                setTagline(profile.tagline ?? '');
                setAbout(profile.about ?? '');
                setMission(profile.mission ?? '');
                setVision(profile.vision ?? '');
                setEmail(profile.email ?? '');
                setPhone(profile.phone ?? '');
                setAddress(profile.address ?? '');
                setWebsiteUrl(profile.website_url ?? '');
                setFacebookUrl(profile.facebook_url ?? '');
                setInstagramUrl(profile.instagram_url ?? '');
                setTwitterUrl(profile.twitter_url ?? '');
                setLinkedinUrl(profile.linkedin_url ?? '');
                setIsActive(profile.is_active);
                setLogoPreview(profile.logo ? fileUrl(profile.logo) : '');
            } catch (error) {
                console.error(error);
                setError('Gagal mengambil data company profile.');
            } finally {
                setPageLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

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
            await updateCompanyProfile(id, {
                name,
                tagline: tagline || undefined,
                about: about || undefined,
                mission: mission || undefined,
                vision: vision || undefined,
                email: email || undefined,
                phone: phone || undefined,
                address: address || undefined,
                website_url: websiteUrl || undefined,
                facebook_url: facebookUrl || undefined,
                instagram_url: instagramUrl || undefined,
                twitter_url: twitterUrl || undefined,
                linkedin_url: linkedinUrl || undefined,
                logo,
                is_active: isActive,
            });

            window.location.href = '/company';
        } catch (error: any) {
            console.error(error);

            if (error.response?.status === 422) {
                setError('Data tidak valid. Periksa kembali input kamu.');
            } else {
                setError('Gagal memperbarui company profile.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <AdminLayout active="company" title="Edit Company Profile">
                <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                        <p className="text-sm font-medium text-gray-500">
                            Loading company profile...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout active="company" title="Edit Company Profile">
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
                    {/* Logo */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Logo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-violet-50">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Preview"
                                        className="h-full w-full object-contain p-2"
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
                                            d="M8 13h.01M8 9h.01M8 17h.01M18 4a2 2 0 00-2 2v2H4a2 2 0 002 2h8v2a2 2 0 002 2h4m-8-6v2a2 2 0 002 2h4"
                                        />
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
                            {logoPreview && !logo && (
                                <button
                                    type="button"
                                    onClick={() => setLogoPreview('')}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Name & Tagline */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Nama Perusahaan
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="tagline"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Tagline
                            </label>
                            <input
                                id="tagline"
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                placeholder="Contoh: Menghadirkan solusi digital terbaik"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <label
                            htmlFor="about"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Tentang Perusahaan
                        </label>
                        <textarea
                            id="about"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={5}
                            placeholder="Deskripsi singkat tentang perusahaan..."
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="mission"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Misi
                            </label>
                            <textarea
                                id="mission"
                                value={mission}
                                onChange={(e) => setMission(e.target.value)}
                                rows={4}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="vision"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Visi
                            </label>
                            <textarea
                                id="vision"
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                rows={4}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Telepon
                            </label>
                            <input
                                id="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="address"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Alamat
                        </label>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="website_url"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Website
                        </label>
                        <input
                            id="website_url"
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://perusahaan.com"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Media Sosial
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="facebook_url"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Facebook
                                </label>
                                <input
                                    id="facebook_url"
                                    type="url"
                                    value={facebookUrl}
                                    onChange={(e) =>
                                        setFacebookUrl(e.target.value)
                                    }
                                    placeholder="https://facebook.com/..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="instagram_url"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Instagram
                                </label>
                                <input
                                    id="instagram_url"
                                    type="url"
                                    value={instagramUrl}
                                    onChange={(e) =>
                                        setInstagramUrl(e.target.value)
                                    }
                                    placeholder="https://instagram.com/..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="twitter_url"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Twitter / X
                                </label>
                                <input
                                    id="twitter_url"
                                    type="url"
                                    value={twitterUrl}
                                    onChange={(e) =>
                                        setTwitterUrl(e.target.value)
                                    }
                                    placeholder="https://twitter.com/..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="linkedin_url"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    LinkedIn
                                </label>
                                <input
                                    id="linkedin_url"
                                    type="url"
                                    value={linkedinUrl}
                                    onChange={(e) =>
                                        setLinkedinUrl(e.target.value)
                                    }
                                    placeholder="https://linkedin.com/..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200"
                                />
                            </div>
                        </div>
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
                            Company profile aktif
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                        <Link
                            href="/company"
                            className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:translate-y-[-0.125rem] hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
