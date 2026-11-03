import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// 🌟 Remove the extra 's': it is 'serviceSlice', NOT 'servicesSlice'
import { closeModal, fetchServiceDetails } from "../../features/services/serviceSlice";
import {
    X, MapPin, Phone, Star, ShieldCheck,
    CheckCircle, Package, ArrowRight, Loader2, AlertCircle
} from "lucide-react";

export default function ServiceDetailsModal() {
    const dispatch = useDispatch();
    const { selectedService, isModalOpen, loadingDetails, error } = useSelector(
        (state) => state.services
    );

    const [activeImageIdx, setActiveImageIdx] = useState(0);

    if (!isModalOpen) return null;

    const s = selectedService;
    const images = Array.isArray(s?.images) && s.images.length > 0
        ? s.images
        : ["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            {/* Backdrop click to dismiss */}
            <div
                className="fixed inset-0"
                onClick={() => dispatch(closeModal())}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-4xl border-2 border-slate-200 shadow-2xl overflow-hidden flex flex-col z-10">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider">
                            {s?.category?.name || "Service"}
                        </span>
                        {s?.isAvailable && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                <CheckCircle size={14} /> Available Now
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => dispatch(closeModal())}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Loading / Error / Content */}
                {loadingDetails ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-3">
                        <Loader2 size={36} className="animate-spin text-indigo-600" />
                        <span className="text-xs font-bold text-slate-400">Loading service details...</span>
                    </div>
                ) : error ? (
                    <div className="py-24 px-6 text-center">
                        <AlertCircle size={40} className="mx-auto text-rose-500 mb-2" />
                        <h4 className="font-bold text-slate-800 text-sm">{error}</h4>
                    </div>
                ) : s ? (
                    <div className="overflow-y-auto p-6 sm:p-8 space-y-8">

                        {/* Section 1: Gallery & Booking Widget */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            <div className="md:col-span-7 space-y-3">
                                <div className="h-72 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                    <img
                                        src={images[activeImageIdx]}
                                        alt={s.title}
                                        className="h-full w-full object-cover transition duration-300"
                                    />
                                </div>

                                {images.length > 1 && (
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImageIdx(idx)}
                                                className={`h-16 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${activeImageIdx === idx
                                                    ? "border-indigo-600 shadow-md scale-95"
                                                    : "border-slate-200 opacity-70 hover:opacity-100"
                                                    }`}
                                            >
                                                <img src={img} alt="thumb" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-5 bg-slate-50 border-2 border-slate-200/90 rounded-3xl p-6 space-y-5">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Standard Rate</span>
                                    <div className="text-3xl font-black text-slate-900 mt-0.5">
                                        ${Number(s.price).toFixed(2)}
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin size={16} className="text-indigo-600 shrink-0" />
                                        <span className="font-semibold">{s.location || "Location not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone size={16} className="text-emerald-600 shrink-0" />
                                        <a href={`tel:${s.phoneNumber}`} className="font-bold hover:underline">
                                            {s.phoneNumber}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Package size={16} className="text-amber-600 shrink-0" />
                                        <span>Available Slots / Stock: <strong>{s.stock}</strong></span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert(`Starting booking flow for: ${s.title}`)}
                                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-[0_4px_0_#4338ca] transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Book Service Now</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Details & Provider */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{s.title}</h2>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {s.description}
                            </p>

                            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {s.author?.avatar ? (
                                        <img src={s.author.avatar} alt={s.author.name} className="h-11 w-11 rounded-full object-cover border" />
                                    ) : (
                                        <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm">
                                            {s.author?.name ? s.author.name.charAt(0) : "P"}
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                            <span>{s.author?.name || "Verified Professional"}</span>
                                            <ShieldCheck size={14} className="text-indigo-600" />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-semibold block">
                                            Service Provider Partner
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Reviews Breakdown (No fake 5.0 stars!) */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-900">Client Reviews</h3>

                                {s.totalReviews > 0 ? (
                                    <div className="flex items-center gap-1.5 font-black text-sm text-amber-500">
                                        <Star size={16} fill="currentColor" />
                                        <span>{Number(s.rating).toFixed(1)}</span>
                                        <span className="text-slate-400 font-normal text-xs">
                                            ({s.totalReviews} {s.totalReviews === 1 ? "review" : "reviews"})
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-bold text-slate-400">No reviews yet</span>
                                )}
                            </div>

                            {s.reviews && s.reviews.length > 0 ? (
                                <div className="space-y-3">
                                    {s.reviews.map((rev) => (
                                        <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                                                        {rev.reviewer?.name?.charAt(0) || "U"}
                                                    </div>
                                                    <span className="font-bold text-xs text-slate-800">{rev.reviewer?.name}</span>
                                                </div>
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            fill={i < rev.rating ? "currentColor" : "none"}
                                                            className={i < rev.rating ? "text-amber-400" : "text-slate-200"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">
                                    Be the first client to book and review this service!
                                </p>
                            )}
                        </div>

                    </div>
                ) : null}

            </div>
        </div>
    );
}