// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { getMyNotificationsApi } from "../api/servicesApi";
// import {
//     ArrowLeft, Bell, Loader2,
//     Calendar, CheckCircle2, Info,
//     ShoppingBag, ShieldAlert, CheckCheck
// } from "lucide-react";

// const SEEN_NOTIFS_STORAGE_KEY = "TN_SEEN_NOTIFICATIONS_V1";

// export default function NotificationsPage() {
//     const [notifications, setNotifications] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     const getSeenIds = () => {
//         try {
//             return JSON.parse(localStorage.getItem(SEEN_NOTIFS_STORAGE_KEY) || "[]");
//         } catch {
//             return [];
//         }
//     };

//     const loadNotifications = async () => {
//         setIsLoading(true);
//         try {
//             const res = await getMyNotificationsApi();
//             const list = res?.data?.notifications || res?.data || res?.notifications || (Array.isArray(res) ? res : []);
//             const valid = Array.isArray(list) ? list : [];
//             setNotifications(valid);

//             if (valid.length > 0) {
//                 const allIds = valid.map((n) => String(n._id || n.id));
//                 const existing = getSeenIds();
//                 const merged = Array.from(new Set([...existing, ...allIds]));
//                 localStorage.setItem(SEEN_NOTIFS_STORAGE_KEY, JSON.stringify(merged));
//             }
//         } catch (err) {
//             setNotifications([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         document.title = "Notifications | TN Services";
//         loadNotifications();
//     }, []);

//     const getNotificationIcon = (title = "") => {
//         const t = title.toLowerCase();
//         if (t.includes("order") || t.includes("booking")) {
//             return (
//                 <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-400/20">
//                     <ShoppingBag size={20} />
//                 </div>
//             );
//         }
//         if (t.includes("cancel") || t.includes("alert")) {
//             return (
//                 <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
//                     <ShieldAlert size={20} />
//                 </div>
//             );
//         }
//         return (
//             <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
//                 <CheckCircle2 size={20} />
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
//             {/* Top Navigation */}
//             <header className="sticky top-0 z-30 bg-[#0b0f19]/90 border-b border-slate-800 backdrop-blur-md">
//                 <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
//                     <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
//                         <ArrowLeft size={20} /> Back
//                     </Link>
//                 </div>
//             </header>

//             <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
//                 <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
//                     <div className="flex items-center justify-between border-b border-slate-800 pb-4">
//                         <div className="flex items-center gap-2">
//                             <h2 className="text-sm font-black text-white">All Updates</h2>
//                             <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-black">
//                                 {notifications.length}
//                             </span>
//                         </div>
//                         <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
//                             <CheckCheck size={14} className="text-indigo-400" /> All marked as read
//                         </span>
//                     </div>

//                     {isLoading ? (
//                         <div className="py-24 flex flex-col items-center justify-center gap-2">
//                             <Loader2 size={36} className="animate-spin text-indigo-400" />
//                             <span className="text-xs font-bold text-slate-500">Loading your notifications...</span>
//                         </div>
//                     ) : notifications.length === 0 ? (
//                         <div className="py-20 text-center space-y-3">
//                             <Info size={40} className="mx-auto text-slate-700" />
//                             <h3 className="text-base font-black text-white">You are all caught up!</h3>
//                             <p className="text-xs text-slate-500 max-w-sm mx-auto">
//                                 You do not have any new notifications or booking updates at this time.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="space-y-3 pt-2">
//                             {notifications.map((item, index) => {
//                                 const id = item._id || item.id || index;
//                                 const dateStr = item.createdAt
//                                     ? new Date(item.createdAt).toLocaleString([], {
//                                         dateStyle: "medium",
//                                         timeStyle: "short",
//                                     })
//                                     : "Recent";

//                                 return (
//                                     <div
//                                         key={id}
//                                         className="p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 bg-slate-900/40 transition flex items-start gap-4"
//                                     >
//                                         {getNotificationIcon(item.title || "")}

//                                         <div className="flex-1 space-y-1">
//                                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
//                                                 <h4 className="text-sm font-black text-white">
//                                                     {item.title || "Order Status Notification"}
//                                                 </h4>
//                                                 <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
//                                                     <Calendar size={12} /> {dateStr}
//                                                 </span>
//                                             </div>
//                                             <p className="text-xs text-slate-400 leading-relaxed font-medium">
//                                                 {item.message || item.body || "Your service booking status has been updated by the system."}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }




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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                    <ShoppingBag size={21} />
                </div>
            );
        }

        if (t.includes("cancel") || t.includes("alert")) {
            return (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600">
                    <ShieldAlert size={21} />
                </div>
            );
        }

        return (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

            {/* Background Decorations */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
            </div>

            {/* Top Navigation */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-slate-600 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={19} />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Bell size={18} className="text-indigo-600" />
                        Notifications
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-4xl space-y-6 px-4 pt-8 sm:px-6 sm:pt-10">

                {/* Page Heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                            <SparklesIcon />
                            Stay Updated
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            Notifications
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Keep track of your latest orders and service updates.
                        </p>
                    </div>

                    <div className="flex h-12 items-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Bell size={17} />
                        </div>
                        <div>
                            <p className="text-lg font-extrabold leading-5 text-slate-900">
                                {notifications.length}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Total Updates
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notifications Container */}
                <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_15px_50px_-25px_rgba(15,23,42,0.15)]">

                    {/* Section Header */}
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/20">
                                <Bell size={19} />
                            </div>

                            <div>
                                <h2 className="text-sm font-extrabold text-slate-900">
                                    All Updates
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Your notification history
                                </p>
                            </div>

                            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-extrabold text-indigo-700">
                                {notifications.length}
                            </span>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                            <CheckCheck size={15} />
                            All marked as read
                        </span>
                    </div>

                    <div className="p-5 sm:p-7">

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-24">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                                    <Loader2 size={30} className="animate-spin text-indigo-600" />
                                </div>

                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-700">
                                        Loading your notifications...
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Please wait a moment.
                                    </p>
                                </div>
                            </div>
                        ) : notifications.length === 0 ? (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-400">
                                    <Bell size={34} />
                                </div>

                                <h3 className="text-lg font-extrabold text-slate-800">
                                    You are all caught up!
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    You do not have any new notifications or booking updates at this time.
                                </p>

                                <Link
                                    to="/dashboard"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                                >
                                    <ArrowLeft size={15} />
                                    Back to Dashboard
                                </Link>
                            </div>
                        ) : (
                            /* Notification List */
                            <div className="space-y-3">
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
                                            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/20 hover:shadow-lg hover:shadow-indigo-100/40 sm:p-5"
                                        >
                                            {getNotificationIcon(item.title || "")}

                                            <div className="min-w-0 flex-1 space-y-2">
                                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                    <h4 className="text-sm font-extrabold leading-5 text-slate-800 transition group-hover:text-indigo-700">
                                                        {item.title || "Order Status Notification"}
                                                    </h4>

                                                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                                                        <Calendar size={13} />
                                                        {dateStr}
                                                    </span>
                                                </div>

                                                <p className="text-xs font-medium leading-6 text-slate-500">
                                                    {item.message || item.body || "Your service booking status has been updated by the system."}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Bottom Note */}
                {!isLoading && notifications.length > 0 && (
                    <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                        <Info size={17} className="mt-0.5 shrink-0 text-blue-600" />
                        <p className="text-xs leading-5 text-blue-700">
                            You are viewing your notification history. Updates about your bookings and services will appear here.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

function SparklesIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2L12 3Z" />
            <path d="M5 3v4" />
            <path d="M3 5h4" />
        </svg>
    );
}
