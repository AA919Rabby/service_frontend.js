import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft, User, Mail, Camera, Loader2,
    CheckCircle2, AlertCircle, Trash2, ShieldAlert, X
} from "lucide-react";
import {
    getProfileApi,
    updateProfileApi,
    deleteAccountApi
} from "../api/profileApi";
import { getImageUrl } from "../api/servicesApi";
import tokenService from "../utils/tokenService";

export default function ProfilePage() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [feedback, setFeedback] = useState(null);
    const fileInputRef = useRef(null);

    const loadProfile = async () => {
        setIsLoading(true);
        setFeedback(null);
        try {
            const res = await getProfileApi();
            const data = res?.data?.data || res?.data || {};
            setUser(data);
            setName(data?.name || "");
            if (data?.avatar) {
                setAvatarPreview(getImageUrl(data.avatar));
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to load profile details";
            setFeedback({ type: "error", message: msg });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "My Profile | TN Services";
        loadProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setFeedback(null);
        setIsSaving(true);

        const formData = new FormData();
        if (name.trim()) formData.append("name", name.trim());
        if (avatarFile) formData.append("avatar", avatarFile);

        try {
            const res = await updateProfileApi(formData);
            const updated = res?.data?.data || res?.data || {};
            setFeedback({
                type: "success",
                message: res?.data?.message || "Profile updated successfully!",
            });

            const current = tokenService.getUser() || {};
            tokenService.saveUser({
                ...current,
                name: updated.name || name,
                avatar: updated.avatar || current.avatar,
            });

            setUser((prev) => ({
                ...prev,
                name: updated.name || name,
                avatar: updated.avatar || prev.avatar,
            }));
            setAvatarFile(null);
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Could not update profile";
            setFeedback({ type: "error", message: errorMsg });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setFeedback(null);
        try {
            await deleteAccountApi();
            tokenService.clearAuth();
            navigate("/login");
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || "Failed to delete account";
            setFeedback({ type: "error", message: errorMsg });
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
            <header className="sticky top-0 z-30 bg-[#0b0f19]/90 border-b border-slate-800 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
                        <ArrowLeft size={20} /> Back
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
                {feedback && (
                    <div
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold ${feedback.type === "success"
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                            : "bg-rose-950/60 text-rose-300 border-rose-700/60"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            <span>{feedback.message}</span>
                        </div>
                        <button onClick={() => setFeedback(null)} className="cursor-pointer">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-24 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 size={36} className="animate-spin text-indigo-400" />
                        <span className="text-xs font-bold text-slate-500">Loading your profile...</span>
                    </div>
                ) : (
                    <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-xs space-y-8">
                        <div>
                            <h1 className="text-2xl font-black text-white">Manage Your Profile</h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Update your public name and profile avatar across the marketplace.
                            </p>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-3xl bg-indigo-600 text-white flex items-center justify-center overflow-hidden border-2 border-slate-700 shadow-sm font-black text-2xl">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            user?.name?.charAt(0) || "U"
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition shadow-md cursor-pointer border border-slate-600"
                                        title="Change photo"
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <span className="text-xs font-black text-white block">Profile Picture</span>
                                    <span className="text-[11px] text-slate-500 block mt-0.5">
                                        PNG, JPG or WEBP up to 5MB.
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-300">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-indigo-400 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-300">Email Address (Fixed)</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>
                )}
            </main>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">Are you absolutely sure?</h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                This action cannot be reversed. Your account and stored session will be wiped out immediately.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                            <button
                                disabled={isDeleting}
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                            >
                                Keep Account
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={handleDeleteAccount}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                <span>Yes, Delete Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}