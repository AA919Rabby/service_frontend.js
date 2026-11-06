// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//     Search, Sparkles, Star, LogOut,
//     ChevronLeft, ChevronRight, Layers, ShieldCheck,
//     RefreshCw, Menu, X,
//     ShoppingBag, Home, Bot, User, Heart, Bell, Info
// } from "lucide-react";
// import Button from "../components/common/Button";
// import tokenService from "../utils/tokenService";
// import { getCategoriesApi, getServicesApi, getImageUrl } from "../api/servicesApi";
// import { getProfileApi } from "../api/profileApi";
// import AiAssistantModal from "../components/services/ai/AiAssistantModal";
// import { selectSavedItems, toggleSaveService } from "../features/saved/savedSlice";

// import {
//     ServicesGridSkeleton,
//     CategoryTabsSkeleton,
//     DrawerProfileSkeleton,
//     AiFloatingBtnSkeleton,
// } from "../components/common/Skeletons";

// export default function Dashboard() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const savedItems = useSelector(selectSavedItems);

//     const [currentUser, setCurrentUser] = useState(null);
//     const [isProfileLoading, setIsProfileLoading] = useState(true);
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const [isAiModalOpen, setIsAiModalOpen] = useState(false);

//     const [categories, setCategories] = useState([]);
//     const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
//     const [selectedCategory, setSelectedCategory] = useState("all");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [page, setPage] = useState(1);
//     const [limit] = useState(6);
//     const [totalPages, setTotalPages] = useState(1);

//     const [services, setServices] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         if (!tokenService.isAuthenticated()) {
//             navigate("/login");
//             return;
//         }

//         const storedUser = tokenService.getUser();
//         if (storedUser) {
//             setCurrentUser(storedUser);
//             setIsProfileLoading(false);
//         }

//         getProfileApi()
//             .then((res) => {
//                 const userData = res?.data?.data || res?.data || {};
//                 if (userData && userData.name) {
//                     setCurrentUser(userData);
//                     tokenService.saveUser(userData);
//                 }
//             })
//             .catch(() => { })
//             .finally(() => {
//                 setIsProfileLoading(false);
//             });
//     }, [navigate]);

//     useEffect(() => {
//         setIsCategoriesLoading(true);
//         getCategoriesApi()
//             .then((res) => {
//                 const list = res?.data || res?.categories || (Array.isArray(res) ? res : []);
//                 setCategories(Array.isArray(list) ? list.filter(Boolean) : []);
//             })
//             .catch(() => { })
//             .finally(() => {
//                 setIsCategoriesLoading(false);
//             });
//     }, []);

//     const fetchServices = async (forcedCategory = selectedCategory, forcedSearch = searchQuery) => {
//         setIsLoading(true);
//         try {
//             const response = await getServicesApi({
//                 page,
//                 limit,
//                 search: forcedSearch,
//                 category: forcedCategory === "all" ? "" : forcedCategory,
//             });

//             const list = response?.data?.services || response?.services || response?.data || [];
//             const total = response?.data?.totalPages || response?.totalPages || Math.ceil((response?.total || 6) / limit);

//             setServices(Array.isArray(list) ? list : []);
//             setTotalPages(total > 0 ? total : 1);
//         } catch {
//             setServices([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchServices(selectedCategory, searchQuery);
//     }, [page, selectedCategory]);

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         setPage(1);
//         fetchServices(selectedCategory, searchQuery);
//     };

//     const handleClearFilters = () => {
//         setSearchQuery("");
//         setSelectedCategory("all");
//         setPage(1);
//         fetchServices("all", "");
//     };

//     const handleLogout = () => {
//         tokenService.clearAuth();
//         navigate("/login");
//     };

//     return (
//         <div className="min-h-screen bg-[#030712] text-slate-100 pb-16 font-sans selection:bg-indigo-500 selection:text-white">

//             {isDrawerOpen && (
//                 <div onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity" />
//             )}

//             <aside className={`fixed top-0 left-0 z-50 h-full w-80 bg-[#0b0f19] border-r border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
//                 }`}>
//                 <div>
//                     <div className="p-6 border-b border-slate-800 flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
//                                 <Sparkles size={20} />
//                             </div>
//                             <div>
//                                 <span className="text-lg font-black text-white">TN Services</span>
//                                 <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</span>
//                             </div>
//                         </div>

//                         <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
//                             <X size={20} />
//                         </button>
//                     </div>

//                     <nav className="p-4 space-y-1.5">
//                         <button
//                             onClick={() => { setIsDrawerOpen(false); navigate("/dashboard"); }}
//                             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-sm transition text-left cursor-pointer"
//                         >
//                             <Home size={18} />
//                             <span>Explore Marketplace</span>
//                         </button>

//                         <button
//                             onClick={() => { setIsDrawerOpen(false); navigate("/about-us"); }}
//                             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-900 text-slate-400 hover:text-white font-bold text-sm transition text-left cursor-pointer"
//                         >
//                             <Info size={18} />
//                             <span>About Us</span>
//                         </button>

//                         <button
//                             onClick={() => {
//                                 setIsDrawerOpen(false);
//                                 navigate("/orders");
//                             }}
//                             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-900 text-slate-400 hover:text-white font-bold text-sm transition text-left cursor-pointer"
//                         >
//                             <ShoppingBag size={18} />
//                             <span>My Orders &amp; Bookings</span>
//                         </button>

//                         <button
//                             onClick={() => {
//                                 setIsDrawerOpen(false);
//                                 navigate("/notifications");
//                             }}
//                             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-900 text-slate-400 hover:text-white font-bold text-sm transition text-left cursor-pointer"
//                         >
//                             <Bell size={18} />
//                             <span>Notifications</span>
//                         </button>

//                         <button
//                             onClick={() => {
//                                 setIsDrawerOpen(false);
//                                 navigate("/profile");
//                             }}
//                             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-900 text-slate-400 hover:text-white font-bold text-sm transition text-left cursor-pointer"
//                         >
//                             <User size={18} />
//                             <span>My Profile</span>
//                         </button>

//                         <button
//                             onClick={() => {
//                                 setIsDrawerOpen(false);
//                                 setIsAiModalOpen(true);
//                             }}
//                             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition text-left cursor-pointer ${isAiModalOpen
//                                     ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
//                                     : "text-slate-400 hover:bg-slate-900 hover:text-indigo-400"
//                                 }`}
//                         >
//                             <Bot size={18} />
//                             <span>Ask AI Assistant</span>
//                         </button>
//                     </nav>
//                 </div>

//                 <div className="p-6 border-t border-slate-800 bg-slate-900/40 space-y-3">
//                     {isProfileLoading ? (
//                         <DrawerProfileSkeleton />
//                     ) : (
//                         <div className="flex items-center gap-3">
//                             <div className="h-11 w-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 overflow-hidden border border-slate-700 shadow-xs">
//                                 {currentUser?.avatar ? (
//                                     <img
//                                         src={getImageUrl(currentUser.avatar)}
//                                         alt={currentUser?.name || "Avatar"}
//                                         className="h-full w-full object-cover"
//                                         onError={(e) => {
//                                             e.currentTarget.style.display = "none";
//                                         }}
//                                     />
//                                 ) : (
//                                     currentUser?.name?.charAt(0)?.toUpperCase() || "M"
//                                 )}
//                             </div>

//                             <div className="overflow-hidden flex-1 text-left">
//                                 <span className="block text-xs font-bold text-white truncate">
//                                     {currentUser?.name || "Md Rabbi"}
//                                 </span>
//                                 <span className="block text-[11px] text-slate-500 truncate">
//                                     {currentUser?.email || "user@example.com"}
//                                 </span>
//                             </div>
//                         </div>
//                     )}

//                     <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition cursor-pointer"
//                     >
//                         <LogOut size={16} />
//                         <span>Sign Out</span>
//                     </button>
//                 </div>
//             </aside>

//             {/* Header: About Us is placed directly beside Saved */}
//             <header className="sticky top-0 z-30 bg-[#0b0f19]/90 border-b border-slate-800 backdrop-blur-md shadow-xs">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
//                     <div className="flex items-center gap-4">
//                         <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="p-2.5 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition cursor-pointer">
//                             {isDrawerOpen ? <X size={22} /> : <Menu size={22} />}
//                         </button>
//                         <div className="flex items-center gap-3">
//                             <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_4px_0_#4338ca]">
//                                 <Sparkles size={22} />
//                             </div>
//                             <div>
//                                 <span className="text-xl font-black text-white tracking-tight">TN Services</span>
//                                 <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marketplace</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Header Navigation: About Us + Saved */}
//                     <div className="flex items-center gap-3">
//                         <Link
//                             to="/about-us"
//                             className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition"
//                         >
//                             <Info size={16} className="text-indigo-400" />
//                             <span>About Us</span>
//                         </Link>

//                         <button
//                             onClick={() => navigate("/saved")}
//                             className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition cursor-pointer"
//                             title="View Saved Services"
//                         >
//                             <Heart size={18} fill={savedItems.length > 0 ? "currentColor" : "none"} />
//                             <span className="hidden sm:inline">Saved</span>
//                             {savedItems.length > 0 && (
//                                 <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
//                                     {savedItems.length}
//                                 </span>
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Hero Banner */}
//             <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
//                 <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl text-white">
//                     <div className="relative z-10 max-w-2xl">
//                         <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider mb-4">
//                             <ShieldCheck size={16} className="text-emerald-400" />
//                             <span>Verified Experts Platform</span>
//                         </div>
//                         <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-4">
//                             Get the best professionals for your work.
//                         </h1>
//                         <p className="text-sm sm:text-base text-slate-400 font-medium mb-8 leading-relaxed">
//                             Explore verified digital services, local specialists, and custom tasks.
//                         </p>
//                         <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
//                             <div className="relative flex-1">
//                                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search services..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 text-white text-sm font-semibold outline-hidden border border-slate-700/80 focus:border-indigo-400 placeholder:text-slate-500 shadow-inner"
//                                 />
//                             </div>
//                             <Button type="submit" className="sm:w-auto px-7 py-3.5 whitespace-nowrap bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border-0">
//                                 Search
//                             </Button>
//                         </form>
//                     </div>
//                 </div>
//             </section>

//             {/* Category Filter Tabs */}
//             <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                 {isCategoriesLoading ? (
//                     <CategoryTabsSkeleton />
//                 ) : (
//                     <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
//                         <button
//                             onClick={() => { setSelectedCategory("all"); setPage(1); }}
//                             className={`px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${selectedCategory === "all"
//                                     ? "bg-indigo-600 text-white shadow-[0_3px_0_#4338ca]"
//                                     : "bg-[#0b0f19] border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
//                                 }`}
//                         >
//                             All Services
//                         </button>

//                         {categories.map((cat, idx) => {
//                             const catName = cat?.name || cat?.title || (typeof cat === "string" ? cat : "");
//                             const catImg = cat?.image;

//                             return (
//                                 <button
//                                     key={cat?.id || cat?._id || idx}
//                                     onClick={() => { setSelectedCategory(catName); setPage(1); }}
//                                     className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-2 ${selectedCategory === catName
//                                             ? "bg-indigo-600 text-white shadow-[0_3px_0_#4338ca]"
//                                             : "bg-[#0b0f19] border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
//                                         }`}
//                                 >
//                                     {catImg && (
//                                         <img src={getImageUrl(catImg)} alt="" className="h-5 w-5 rounded-md object-cover" />
//                                     )}
//                                     <span>{catName}</span>
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 )}
//             </section>

//             {/* Services Grid */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 {isLoading ? (
//                     <ServicesGridSkeleton count={6} />
//                 ) : services.length === 0 ? (
//                     <div className="py-20 text-center bg-[#0b0f19] border border-slate-800 rounded-3xl p-8 shadow-xs">
//                         <Layers size={44} className="mx-auto text-slate-700 mb-3" />
//                         <h3 className="text-xl font-black text-white">No Services Found</h3>
//                         <p className="text-xs text-slate-400 mt-1 font-medium">Try searching with a different term.</p>
//                         <button
//                             onClick={handleClearFilters}
//                             className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
//                         >
//                             <RefreshCw size={14} /> Clear filters
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {services.map((item) => {
//                             const itemId = item._id || item.id;
//                             const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;

//                             const isSaved = savedItems.some(
//                                 (s) => (s._id || s.id) === itemId
//                             );

//                             return (
//                                 <div
//                                     key={itemId}
//                                     className="bg-[#0b0f19] border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between shadow-xs"
//                                 >
//                                     <div>
//                                         <div className="relative h-44 w-full rounded-2xl bg-slate-900 overflow-hidden mb-4 border border-slate-800">
//                                             <img
//                                                 src={getImageUrl(firstImage)}
//                                                 alt={item.title}
//                                                 className="h-full w-full object-cover"
//                                             />

//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => {
//                                                     e.preventDefault();
//                                                     e.stopPropagation();
//                                                     dispatch(toggleSaveService(item));
//                                                 }}
//                                                 className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md shadow-md transition-all duration-200 cursor-pointer ${isSaved
//                                                         ? "bg-rose-500/20 text-rose-500 border border-rose-500/40 scale-105"
//                                                         : "bg-slate-900/80 text-slate-400 hover:text-rose-500 border border-slate-700"
//                                                     }`}
//                                                 title={isSaved ? "Remove from saved" : "Save service"}
//                                             >
//                                                 <Heart
//                                                     size={18}
//                                                     fill={isSaved ? "currentColor" : "none"}
//                                                     className={isSaved ? "text-rose-500" : ""}
//                                                 />
//                                             </button>
//                                         </div>

//                                         <div className="flex items-center justify-between mb-3">
//                                             <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-indigo-400">
//                                                 {item.categoryName || item.category || "Service"}
//                                             </span>

//                                             {(item.totalReviews > 0 || item.reviewsCount > 0) ? (
//                                                 <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
//                                                     <Star size={14} fill="currentColor" />
//                                                     <span>{Number(item.rating || 0).toFixed(1)}</span>
//                                                 </div>
//                                             ) : (
//                                                 <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider">
//                                                     New
//                                                 </span>
//                                             )}
//                                         </div>

//                                         <h3 className="text-lg font-black text-white leading-snug mb-2 line-clamp-1">
//                                             {item.title || item.name}
//                                         </h3>

//                                         <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
//                                             {item.description}
//                                         </p>
//                                     </div>

//                                     <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
//                                         <div>
//                                             <span className="block text-[10px] font-bold text-slate-500 uppercase">Starting at</span>
//                                             <span className="text-2xl font-black text-white">${item.price || "25"}</span>
//                                         </div>

//                                         <Link
//                                             to={`/service/${itemId}`}
//                                             className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
//                                         >
//                                             <span>View Details</span>
//                                             <span className="text-[14px]">&rarr;</span>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}

//                 {/* Pagination */}
//                 {totalPages > 1 && !isLoading && (
//                     <div className="mt-12 flex items-center justify-center gap-3">
//                         <button
//                             disabled={page <= 1}
//                             onClick={() => setPage((p) => Math.max(1, p - 1))}
//                             className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
//                         >
//                             <ChevronLeft size={18} />
//                         </button>

//                         <span className="text-xs font-bold text-slate-300 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
//                             Page {page} of {totalPages}
//                         </span>

//                         <button
//                             disabled={page >= totalPages}
//                             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                             className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
//                         >
//                             <ChevronRight size={18} />
//                         </button>
//                     </div>
//                 )}
//             </main>

//             {/* Floating AI Button */}
//             {isLoading ? (
//                 <AiFloatingBtnSkeleton />
//             ) : (
//                 <button
//                     onClick={() => setIsAiModalOpen(true)}
//                     className="fixed bottom-6 right-6 z-40 p-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.35)] flex items-center gap-2.5 transition duration-200 hover:scale-105 cursor-pointer animate-in fade-in"
//                     title="Chat with AI Assistant"
//                 >
//                     <Bot size={22} />
//                     <span className="text-xs font-black tracking-wide pr-1 hidden sm:inline">Ask AI Assistant</span>
//                 </button>
//             )}

//             <AiAssistantModal
//                 isOpen={isAiModalOpen}
//                 onClose={() => setIsAiModalOpen(false)}
//             />

//             <footer className="mt-16 text-center text-xs font-semibold text-slate-500">
//                 TN Services • Designed &amp; Developed by <span className="font-bold text-slate-300">Md Rabbi</span>
//             </footer>
//         </div>
//     );
// }






import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    Search, Sparkles, Star, LogOut,
    ChevronLeft, ChevronRight, Layers, ShieldCheck,
    RefreshCw, Menu, X,
    ShoppingBag, Home, Bot, User, Heart, Bell, Info
} from "lucide-react";
import Button from "../components/common/Button";
import tokenService from "../utils/tokenService";
import { getCategoriesApi, getServicesApi, getImageUrl } from "../api/servicesApi";
import { getProfileApi } from "../api/profileApi";
import AiAssistantModal from "../components/services/ai/AiAssistantModal";
import { selectSavedItems, toggleSaveService } from "../features/saved/savedSlice";

import {
    ServicesGridSkeleton,
    CategoryTabsSkeleton,
    DrawerProfileSkeleton,
    AiFloatingBtnSkeleton,
} from "../components/common/Skeletons";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const savedItems = useSelector(selectSavedItems);

    const [currentUser, setCurrentUser] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const [categories, setCategories] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!tokenService.isAuthenticated()) {
            navigate("/login");
            return;
        }

        const storedUser = tokenService.getUser();
        if (storedUser) {
            setCurrentUser(storedUser);
            setIsProfileLoading(false);
        }

        getProfileApi()
            .then((res) => {
                const userData = res?.data?.data || res?.data || {};
                if (userData && userData.name) {
                    setCurrentUser(userData);
                    tokenService.saveUser(userData);
                }
            })
            .catch(() => { })
            .finally(() => {
                setIsProfileLoading(false);
            });
    }, [navigate]);

    useEffect(() => {
        setIsCategoriesLoading(true);
        getCategoriesApi()
            .then((res) => {
                const list = res?.data || res?.categories || (Array.isArray(res) ? res : []);
                setCategories(Array.isArray(list) ? list.filter(Boolean) : []);
            })
            .catch(() => { })
            .finally(() => {
                setIsCategoriesLoading(false);
            });
    }, []);

    const fetchServices = async (forcedCategory = selectedCategory, forcedSearch = searchQuery) => {
        setIsLoading(true);
        try {
            const response = await getServicesApi({
                page,
                limit,
                search: forcedSearch,
                category: forcedCategory === "all" ? "" : forcedCategory,
            });

            const list = response?.data?.services || response?.services || response?.data || [];
            const total = response?.data?.totalPages || response?.totalPages || Math.ceil((response?.total || 6) / limit);

            setServices(Array.isArray(list) ? list : []);
            setTotalPages(total > 0 ? total : 1);
        } catch {
            setServices([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices(selectedCategory, searchQuery);
    }, [page, selectedCategory]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchServices(selectedCategory, searchQuery);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setPage(1);
        fetchServices("all", "");
    };

    const handleLogout = () => {
        tokenService.clearAuth();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">

            {isDrawerOpen && (
                <div
                    onClick={() => setIsDrawerOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity"
                />
            )}

            <aside className={`fixed top-0 left-0 z-50 flex h-full w-80 flex-col justify-between border-r border-indigo-100 bg-white shadow-2xl shadow-indigo-100/40 transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div>
                    <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-blue-50/50 p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <span className="text-lg font-black text-slate-900">TN Services</span>
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-indigo-500">Navigation</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="space-y-1.5 p-4">
                        <button
                            onClick={() => { setIsDrawerOpen(false); navigate("/dashboard"); }}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 text-left text-sm font-bold text-indigo-700 transition"
                        >
                            <Home size={18} />
                            <span>Explore Marketplace</span>
                        </button>

                        <button
                            onClick={() => { setIsDrawerOpen(false); navigate("/about-us"); }}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <Info size={18} />
                            <span>About Us</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsDrawerOpen(false);
                                navigate("/orders");
                            }}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <ShoppingBag size={18} />
                            <span>My Orders &amp; Bookings</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsDrawerOpen(false);
                                navigate("/notifications");
                            }}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <Bell size={18} />
                            <span>Notifications</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsDrawerOpen(false);
                                navigate("/profile");
                            }}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <User size={18} />
                            <span>My Profile</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsDrawerOpen(false);
                                setIsAiModalOpen(true);
                            }}
                            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${isAiModalOpen
                                ? "border border-indigo-100 bg-indigo-50 text-indigo-700"
                                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                                }`}
                        >
                            <Bot size={18} />
                            <span>Ask AI Assistant</span>
                        </button>
                    </nav>
                </div>

                <div className="space-y-3 border-t border-slate-100 bg-slate-50/80 p-6">
                    {isProfileLoading ? (
                        <DrawerProfileSkeleton />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-100 bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-black text-white shadow-md shadow-indigo-100">
                                {currentUser?.avatar ? (
                                    <img
                                        src={getImageUrl(currentUser.avatar)}
                                        alt={currentUser?.name || "Avatar"}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    currentUser?.name?.charAt(0)?.toUpperCase() || "M"
                                )}
                            </div>

                            <div className="flex-1 overflow-hidden text-left">
                                <span className="block truncate text-xs font-bold text-slate-900">
                                    {currentUser?.name || "Md Rabbi"}
                                </span>
                                <span className="block truncate text-[11px] text-slate-500">
                                    {currentUser?.email || "user@example.com"}
                                </span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-100"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <header className="sticky top-0 z-30 border-b border-indigo-100/70 bg-white/90 shadow-sm shadow-indigo-100/20 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            {isDrawerOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <span className="text-xl font-black tracking-tight text-slate-900">TN Services</span>
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-indigo-500">Marketplace</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/about-us"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:px-4"
                        >
                            <Info size={16} className="text-indigo-500" />
                            <span className="hidden sm:inline">About Us</span>
                        </Link>

                        <button
                            onClick={() => navigate("/saved")}
                            className="relative flex cursor-pointer items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-100 sm:px-4"
                            title="View Saved Services"
                        >
                            <Heart size={18} fill={savedItems.length > 0 ? "currentColor" : "none"} />
                            <span className="hidden sm:inline">Saved</span>
                            {savedItems.length > 0 && (
                                <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                                    {savedItems.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/80 to-blue-50 p-8 shadow-xl shadow-indigo-100/50 sm:p-12">
                    <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-200/50 to-blue-200/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />

                    <div className="relative z-10 max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-700">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            <span>Verified Experts Platform</span>
                        </div>

                        <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                            Get the best professionals for your work.
                        </h1>

                        <p className="mb-8 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                            Explore verified digital services, local specialists, and custom tasks.
                        </p>

                        <form onSubmit={handleSearchSubmit} className="flex max-w-lg flex-col gap-2 sm:flex-row">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-2xl border border-indigo-100 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="whitespace-nowrap border-0 bg-gradient-to-r from-indigo-600 to-blue-600 px-7 py-3.5 text-white shadow-lg shadow-indigo-200 transition hover:from-indigo-700 hover:to-blue-700 sm:w-auto"
                            >
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                {isCategoriesLoading ? (
                    <CategoryTabsSkeleton />
                ) : (
                    <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => { setSelectedCategory("all"); setPage(1); }}
                            className={`flex cursor-pointer items-center whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition ${selectedCategory === "all"
                                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                }`}
                        >
                            All Services
                        </button>

                        {categories.map((cat, idx) => {
                            const catName = cat?.name || cat?.title || (typeof cat === "string" ? cat : "");
                            const catImg = cat?.image;

                            return (
                                <button
                                    key={cat?.id || cat?._id || idx}
                                    onClick={() => { setSelectedCategory(catName); setPage(1); }}
                                    className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition ${selectedCategory === catName
                                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                        }`}
                                >
                                    {catImg && (
                                        <img
                                            src={getImageUrl(catImg)}
                                            alt=""
                                            className="h-5 w-5 rounded-md object-cover"
                                        />
                                    )}
                                    <span>{catName}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {isLoading ? (
                    <ServicesGridSkeleton count={6} />
                ) : services.length === 0 ? (
                    <div className="rounded-3xl border border-indigo-100 bg-white p-8 py-20 text-center shadow-lg shadow-indigo-100/30">
                        <Layers size={44} className="mx-auto mb-3 text-indigo-200" />
                        <h3 className="text-xl font-black text-slate-900">No Services Found</h3>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            Try searching with a different term.
                        </p>

                        <button
                            onClick={handleClearFilters}
                            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-indigo-600 transition hover:text-indigo-800 hover:underline"
                        >
                            <RefreshCw size={14} />
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((item) => {
                            const itemId = item._id || item.id;
                            const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;

                            const isSaved = savedItems.some(
                                (s) => (s._id || s.id) === itemId
                            );

                            return (
                                <div
                                    key={itemId}
                                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
                                >
                                    <div>
                                        <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                                            <img
                                                src={getImageUrl(firstImage)}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                            />

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    dispatch(toggleSaveService(item));
                                                }}
                                                className={`absolute right-3 top-3 cursor-pointer rounded-2xl border p-2.5 shadow-md backdrop-blur-md transition-all duration-200 ${isSaved
                                                    ? "scale-105 border-rose-200 bg-rose-50 text-rose-600"
                                                    : "border-white/80 bg-white/90 text-slate-500 hover:border-rose-200 hover:text-rose-600"
                                                    }`}
                                                title={isSaved ? "Remove from saved" : "Save service"}
                                            >
                                                <Heart
                                                    size={18}
                                                    fill={isSaved ? "currentColor" : "none"}
                                                    className={isSaved ? "text-rose-600" : ""}
                                                />
                                            </button>
                                        </div>

                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-700">
                                                {item.categoryName || item.category || "Service"}
                                            </span>

                                            {(item.totalReviews > 0 || item.reviewsCount > 0) ? (
                                                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                                    <Star size={14} fill="currentColor" />
                                                    <span>{Number(item.rating || 0).toFixed(1)}</span>
                                                </div>
                                            ) : (
                                                <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mb-2 line-clamp-1 text-lg font-black leading-snug text-slate-900">
                                            {item.title || item.name}
                                        </h3>

                                        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                        <div>
                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                Starting at
                                            </span>
                                            <span className="text-2xl font-black text-slate-900">
                                                ${item.price || "25"}
                                            </span>
                                        </div>

                                        <Link
                                            to={`/service/${itemId}`}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:border-indigo-200 hover:from-indigo-600 hover:to-blue-600 hover:text-white"
                                        >
                                            <span>ils</span>
                                            <span className="text-[14px]">&rarr;</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && !isLoading && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <span className="rounded-xl border border-indigo-100 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </main>

            {isLoading ? (
                <AiFloatingBtnSkeleton />
            ) : (
                <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="fixed bottom-6 right-6 z-40 flex cursor-pointer animate-in items-center gap-2.5 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white shadow-xl shadow-indigo-300/50 transition duration-200 hover:scale-105 hover:from-indigo-700 hover:to-blue-700"
                    title="Chat with AI Assistant"
                >
                    <Bot size={22} />
                    <span className="hidden pr-1 text-xs font-black tracking-wide sm:inline">
                        Ask AI Assistant
                    </span>
                </button>
            )}

            <AiAssistantModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
            />

            <footer className="mt-16 text-center text-xs font-semibold text-slate-400">
                TN Services • Designed &amp; Developed by{" "}
                <span className="font-bold text-indigo-600">Md Rabbi</span>
            </footer>
        </div>
    );
}
