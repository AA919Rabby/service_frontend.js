import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyNotificationsApi } from "../api/servicesApi";
import {
    ArrowLeft, Bell, Loader2,
    Calendar, CheckCircle2, Info,
    ShoppingBag, ShieldAlert, CheckCheck
} from "lucide-react";

const SEEN_NOTIFS_STORAGE_KEY = "TN_SEEN_NOTIFICATIONS_V1";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getSeenIds = () => {
        try {
            return JSON.parse(localStorage.getItem(SEEN_NOTIFS_STORAGE_KEY) || "[]");
        } catch {
            return [];
        }
    };

    const loadNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await getMyNotificationsApi();
            const list = res?.data?.notifications || res?.data || res?.notifications || (Array.isArray(res) ? res : []);
            const valid = Array.isArray(list) ? list : [];
            setNotifications(valid);

            if (valid.length > 0) {
                const allIds = valid.map((n) => String(n._id || n.id));
                const existing = getSeenIds();
                const merged = Array.from(new Set([...existing, ...allIds]));
                localStorage.setItem(SEEN_NOTIFS_STORAGE_KEY, JSON.stringify(merged));
            }
        } catch (err) {
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Notifications | TN Services";
        loadNotifications();
    }, []);

    const getNotificationIcon = (title = "") => {
        const t = title.toLowerCase();
        if (t.includes("order") || t.includes("booking")) {
            return (
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-400/20">
                    <ShoppingBag size={20} />
                </div>
            );
        }
        if (t.includes("cancel") || t.includes("alert")) {
            return (
                <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                    <ShieldAlert size={20} />
                </div>
            );
        }
        return (
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <CheckCircle2 size={20} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
            {/* Top Navigation */}
            <header className="sticky top-0 z-30 bg-[#0b0f19]/90 border-b border-slate-800 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
                        <ArrowLeft size={20} /> Back
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
                <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-black text-white">All Updates</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-black">
                                {notifications.length}
                            </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <CheckCheck size={14} className="text-indigo-400" /> All marked as read
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-2">
                            <Loader2 size={36} className="animate-spin text-indigo-400" />
                            <span className="text-xs font-bold text-slate-500">Loading your notifications...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="py-20 text-center space-y-3">
                            <Info size={40} className="mx-auto text-slate-700" />
                            <h3 className="text-base font-black text-white">You are all caught up!</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                You do not have any new notifications or booking updates at this time.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-2">
                            {notifications.map((item, index) => {
                                const id = item._id || item.id || index;
                                const dateStr = item.createdAt
                                    ? new Date(item.createdAt).toLocaleString([], {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })
                                    : "Recent";

                                return (
                                    <div
                                        key={id}
                                        className="p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 bg-slate-900/40 transition flex items-start gap-4"
                                    >
                                        {getNotificationIcon(item.title || "")}

                                        <div className="flex-1 space-y-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <h4 className="text-sm font-black text-white">
                                                    {item.title || "Order Status Notification"}
                                                </h4>
                                                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Calendar size={12} /> {dateStr}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                {item.message || item.body || "Your service booking status has been updated by the system."}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}