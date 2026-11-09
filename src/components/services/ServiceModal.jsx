import React, { useEffect, useState } from "react";
import { X, Star, ShieldCheck, Clock, Loader2, Sparkles, Calendar } from "lucide-react";
import Button from "../common/Button";
import { getServiceDetailsApi } from "../../api/servicesApi";

export default function ServiceModal({ serviceId, isOpen, onClose, onOrderNow }) {
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getTomorrowDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    const [selectedBookingDate, setSelectedBookingDate] = useState(getTomorrowDate());

    useEffect(() => {
        if (!serviceId || !isOpen) return;

        let isMounted = true;
        setLoading(true);
        setError("");

        getServiceDetailsApi(serviceId)
            .then((res) => {
                if (isMounted) {
                    const data = res?.data || res?.service || res;
                    setService(data);
                }
            })
            .catch((err) => {
                if (isMounted) setError(err?.response?.data?.message || "Failed to load details");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [serviceId, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in font-sans">
            <div className="relative w-full max-w-2xl bg-white border border-blue-100 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_25px_70px_rgba(37,99,235,0.2)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer z-10"
                >
                    <X size={20} />
                </button>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                            <Loader2 size={32} className="animate-spin text-indigo-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">Loading service details...</p>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center text-rose-600 font-semibold">
                        {error}
                    </div>
                ) : (
                    <div className="relative z-10 space-y-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                                <Sparkles size={13} />
                                <span>{service?.category?.name || service?.category || "Professional Service"}</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                {service?.title || service?.name || "Service Title"}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                ${Number(service?.price || 49.0).toFixed(2)}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500 text-sm font-bold bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 px-2.5 py-1 rounded-xl">
                                <Star size={16} fill="currentColor" />
                                <span>{Number(service?.rating || 4.9).toFixed(1)}</span>
                                <span className="text-slate-400 font-normal">({service?.totalReviews || 120})</span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">
                            {service?.description || "High quality and verified professional services provided by verified experts at TN Services."}
                        </p>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                                Desired Booking Date:
                            </label>
                            <div className="relative flex items-center">
                                <Calendar size={16} className="absolute left-3.5 text-indigo-600 pointer-events-none" />
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                    value={selectedBookingDate}
                                    onChange={(e) => setSelectedBookingDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                                <span>Stripe Escrow Protected</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                <Clock size={18} className="text-indigo-600 shrink-0" />
                                <span>{service?.deliveryTime || "24-48 Hours Delivery"}</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => onOrderNow({ ...service, bookingDate: selectedBookingDate })}
                            className="w-full py-3.5"
                        >
                            Book This Service Now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}