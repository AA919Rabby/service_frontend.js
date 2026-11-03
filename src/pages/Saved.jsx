import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    ArrowLeft, Heart, Star,
    BookmarkX, Sparkles
} from "lucide-react";
import { selectSavedItems, toggleSaveService } from "../features/saved/savedSlice";
import { getImageUrl } from "../api/servicesApi";

export default function SavedPage() {
    const dispatch = useDispatch();
    const savedItems = useSelector(selectSavedItems);

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#0b0f19]/90 border-b border-slate-800 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
                        <ArrowLeft size={20} /> Back
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
                {savedItems.length === 0 ? (
                    <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-16 text-center space-y-4">
                        <BookmarkX size={48} className="mx-auto text-slate-700" />
                        <h3 className="text-lg font-black text-white">No Saved Services Yet</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            When exploring services, click the heart icon to save listings here for quick booking.
                        </p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                        >
                            <Sparkles size={16} /> Explore Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedItems.map((item) => {
                            const itemId = item._id || item.id;
                            const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;

                            return (
                                <div
                                    key={itemId}
                                    className="bg-[#0b0f19] border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-44 w-full rounded-2xl bg-slate-900 overflow-hidden mb-4 border border-slate-800">
                                            <img
                                                src={getImageUrl(firstImage)}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                onClick={() => dispatch(toggleSaveService(item))}
                                                className="absolute top-3 right-3 p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md shadow-md text-rose-500 hover:scale-110 transition cursor-pointer border border-rose-500/30"
                                                title="Remove from saved"
                                            >
                                                <Heart size={18} fill="currentColor" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-indigo-400">
                                                {item.categoryName || item.category?.name || item.category || "Service"}
                                            </span>

                                            {(item.totalReviews > 0 || item.reviewsCount > 0) ? (
                                                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                                    <Star size={14} fill="currentColor" />
                                                    <span>{Number(item.rating || 0).toFixed(1)}</span>
                                                </div>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                                    Verified
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-black text-white leading-snug mb-2 line-clamp-1">
                                            {item.title || item.name}
                                        </h3>

                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-500 uppercase">Starting at</span>
                                            <span className="text-2xl font-black text-white">${item.price || "25"}</span>
                                        </div>

                                        <Link
                                            to={`/service/${itemId}`}
                                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                                        >
                                            <span>View Details</span>
                                            <span className="text-[14px]">&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}