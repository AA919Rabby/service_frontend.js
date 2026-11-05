// import React, { useState, useEffect, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//     getMyOrdersApi,
//     cancelOrderApi,
//     getMyNotificationsApi,
//     getImageUrl
// } from "../api/servicesApi";
// import {
//     ArrowLeft, ShoppingBag, Loader2, RefreshCw, XCircle,
//     Eye, CheckCircle2, Clock, Bell, X,
//     Calendar, MapPin, PackageCheck, Sparkles, Check,
//     AlertTriangle, Info
// } from "lucide-react";

// const SEEN_NOTIFS_STORAGE_KEY = "TN_SEEN_NOTIFICATIONS_V1";

// export default function OrdersPage() {
//     const navigate = useNavigate();

//     // Data States
//     const [orders, setOrders] = useState([]);
//     const [notifications, setNotifications] = useState([]);
//     const [unreadNotifCount, setUnreadNotifCount] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState("ALL");
//     const [isCancelling, setIsCancelling] = useState(false);

//     // Modals & Popups States
//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [orderToCancel, setOrderToCancel] = useState(null);
//     const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//     const [toast, setToast] = useState(null);

//     const showToast = (message, type = "success") => {
//         setToast({ message, type });
//         setTimeout(() => setToast(null), 4000);
//     };

//     const getSeenNotificationIds = () => {
//         try {
//             return JSON.parse(localStorage.getItem(SEEN_NOTIFS_STORAGE_KEY) || "[]");
//         } catch {
//             return [];
//         }
//     };

//     const loadOrders = async () => {
//         setIsLoading(true);
//         try {
//             const res = await getMyOrdersApi();
//             const list = res?.data?.orders || res?.data || res?.orders || (Array.isArray(res) ? res : []);
//             setOrders(Array.isArray(list) ? list : []);
//         } catch (err) {
//             setOrders([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const loadNotifications = async () => {
//         try {
//             const res = await getMyNotificationsApi();
//             const list = res?.data?.notifications || res?.data || res?.notifications || (Array.isArray(res) ? res : []);
//             const validList = Array.isArray(list) ? list : [];
//             setNotifications(validList);

//             const seenIds = getSeenNotificationIds();
//             const unseen = validList.filter((n) => !seenIds.includes(String(n._id || n.id)));
//             setUnreadNotifCount(unseen.length);
//         } catch (err) { }
//     };

//     useEffect(() => {
//         document.title = "My Orders & Bookings | TN Services";
//         loadOrders();
//         loadNotifications();
//     }, []);

//     const handleOpenNotifications = () => {
//         setIsNotificationOpen(true);
//         if (notifications.length > 0) {
//             const allIds = notifications.map((n) => String(n._id || n.id));
//             const existingSeen = getSeenNotificationIds();
//             const merged = Array.from(new Set([...existingSeen, ...allIds]));
//             localStorage.setItem(SEEN_NOTIFS_STORAGE_KEY, JSON.stringify(merged));
//             setUnreadNotifCount(0);
//         }
//     };

//     const normalizeStatus = (statusRaw) => {
//         const s = (statusRaw || "PENDING").toUpperCase();
//         if (s.includes("CANCEL") || s.includes("REJECT") || s.includes("REFUND")) return "CANCELLED";
//         if (s.includes("APPROV") || s.includes("ACCEPT") || s.includes("CONFIRM") || s.includes("PROGRESS")) return "APPROVED";
//         if (s.includes("COMPLETE") || s.includes("DELIVER")) return "COMPLETED";
//         return "PENDING";
//     };

//     const counts = useMemo(() => {
//         return orders.reduce(
//             (acc, curr) => {
//                 const norm = normalizeStatus(curr.orderStatus || curr.status);
//                 acc[norm] = (acc[norm] || 0) + 1;
//                 return acc;
//             },
//             { ALL: orders.length, PENDING: 0, APPROVED: 0, COMPLETED: 0, CANCELLED: 0 }
//         );
//     }, [orders]);

//     const filteredOrders = useMemo(() => {
//         if (activeTab === "ALL") return orders;
//         return orders.filter((o) => normalizeStatus(o.orderStatus || o.status) === activeTab);
//     }, [orders, activeTab]);

//     const confirmCancelOrder = async () => {
//         if (!orderToCancel) return;
//         const targetId = orderToCancel._id || orderToCancel.id;
//         setIsCancelling(true);

//         try {
//             await cancelOrderApi(targetId);
//             showToast("Order cancelled successfully!", "success");
//             setOrderToCancel(null);

//             if (selectedOrder && (selectedOrder._id === targetId || selectedOrder.id === targetId)) {
//                 setSelectedOrder(null);
//             }
//             loadOrders();
//             loadNotifications();
//         } catch (err) {
//             const errorMsg = err?.response?.data?.message || err?.message || "Failed to cancel order";
//             showToast(errorMsg, "error");
//         } finally {
//             setIsCancelling(false);
//         }
//     };

//     const getStatusBadge = (rawStatus) => {
//         const norm = normalizeStatus(rawStatus);
//         switch (norm) {
//             case "COMPLETED":
//                 return (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
//                         <CheckCircle2 size={13} /> Completed
//                     </span>
//                 );
//             case "APPROVED":
//                 return (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
//                         <PackageCheck size={13} /> Approved
//                     </span>
//                 );
//             case "CANCELLED":
//                 return (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
//                         <XCircle size={13} /> Cancelled
//                     </span>
//                 );
//             default:
//                 return (
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
//                         <Clock size={13} /> Pending Request
//                     </span>
//                 );
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
//             {toast && (
//                 <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-300">
//                     <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${toast.type === "success"
//                         ? "bg-emerald-950/90 text-emerald-200 border-emerald-700/60"
//                         : "bg-rose-950/90 text-rose-200 border-rose-700/60"
//                         }`}>
//                         {toast.type === "success" ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-rose-400" />}
//                         <span>{toast.message}</span>
//                         <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 cursor-pointer">
//                             <X size={15} />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Top Navigation */}
//             <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
//                     <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
//                         <ArrowLeft size={20} /> Back
//                     </Link>

//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={() => { loadOrders(); loadNotifications(); }}
//                             className="p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white transition cursor-pointer"
//                             title="Refresh Data"
//                         >
//                             <RefreshCw size={18} className={isLoading ? "animate-spin text-indigo-400" : ""} />
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
//                 {/* Hero Header Card */}
//                 <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
//                     <div>
//                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 text-xs font-bold uppercase tracking-wider mb-3">
//                             <Sparkles size={14} /> Service Orders &amp; Booking Management
//                         </div>
//                         <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Orders Ledger</h1>
//                         <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg">
//                             Monitor real-time approval status, service scheduling, and cancellations from one place.
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
//                         <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center">
//                             <span className="block text-[11px] font-bold text-slate-400 uppercase">Total</span>
//                             <span className="text-xl font-black text-white">{counts.ALL}</span>
//                         </div>
//                         <div className="bg-amber-500/10 rounded-2xl p-3 border border-amber-500/20 text-center">
//                             <span className="block text-[11px] font-bold text-amber-400 uppercase">Pending</span>
//                             <span className="text-xl font-black text-amber-400">{counts.PENDING || 0}</span>
//                         </div>
//                         <div className="bg-blue-500/10 rounded-2xl p-3 border border-blue-500/20 text-center">
//                             <span className="block text-[11px] font-bold text-blue-400 uppercase">Approved</span>
//                             <span className="text-xl font-black text-blue-400">{counts.APPROVED || 0}</span>
//                         </div>
//                         <div className="bg-emerald-500/10 rounded-2xl p-3 border border-emerald-500/20 text-center">
//                             <span className="block text-[11px] font-bold text-emerald-400 uppercase">Completed</span>
//                             <span className="text-xl font-black text-emerald-400">{counts.COMPLETED || 0}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Filter Tabs */}
//                 <div className="bg-[#0b0f19] rounded-2xl border border-slate-800 p-2 flex items-center gap-1.5 overflow-x-auto">
//                     {[
//                         { id: "ALL", label: "All Orders", count: counts.ALL },
//                         { id: "PENDING", label: "Pending Approval", count: counts.PENDING || 0 },
//                         { id: "APPROVED", label: "Approved", count: counts.APPROVED || 0 },
//                         { id: "COMPLETED", label: "Completed", count: counts.COMPLETED || 0 },
//                         { id: "CANCELLED", label: "Cancelled", count: counts.CANCELLED || 0 },
//                     ].map((tab) => {
//                         const isActive = activeTab === tab.id;
//                         return (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${isActive
//                                     ? "bg-indigo-600 text-white shadow-[0_3px_0_#4338ca]"
//                                     : "bg-transparent text-slate-400 hover:bg-slate-900 hover:text-white"
//                                     }`}
//                             >
//                                 <span>{tab.label}</span>
//                                 <span
//                                     className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
//                                         }`}
//                                 >
//                                     {tab.count}
//                                 </span>
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Orders List */}
//                 {isLoading ? (
//                     <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-24 text-center flex flex-col items-center justify-center gap-3">
//                         <Loader2 size={36} className="animate-spin text-indigo-400" />
//                         <span className="text-xs font-bold text-slate-400">Retrieving live orders...</span>
//                     </div>
//                 ) : filteredOrders.length === 0 ? (
//                     <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-16 text-center">
//                         <ShoppingBag size={44} className="mx-auto text-slate-700 mb-3" />
//                         <h3 className="text-base font-black text-white">No Orders Under "{activeTab}"</h3>
//                         <p className="text-xs text-slate-400 mt-1">There are no records matching the selected status.</p>
//                         {activeTab !== "ALL" && (
//                             <button
//                                 onClick={() => setActiveTab("ALL")}
//                                 className="mt-4 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 text-xs font-bold rounded-xl hover:bg-indigo-500/20 transition cursor-pointer"
//                             >
//                                 Show All Orders
//                             </button>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {filteredOrders.map((order, idx) => {
//                             const orderId = order._id || order.id || idx;
//                             const statusRaw = order.orderStatus || order.status || "PENDING";
//                             const normStatus = normalizeStatus(statusRaw);
//                             const isCancelable = normStatus === "PENDING" || normStatus === "APPROVED";
//                             const items = order.items || order.services || [];
//                             const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent";

//                             return (
//                                 <div
//                                     key={orderId}
//                                     className="bg-[#0b0f19]/90 rounded-3xl border border-slate-800 hover:border-indigo-500/40 p-5 sm:p-6 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
//                                 >
//                                     <div className="space-y-3 flex-1">
//                                         <div className="flex flex-wrap items-center gap-2.5">
//                                             <span className="font-mono text-xs font-black text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
//                                                 ID: #{String(orderId).slice(-6).toUpperCase()}
//                                             </span>
//                                             {getStatusBadge(statusRaw)}
//                                             <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
//                                                 <Calendar size={13} /> {dateStr}
//                                             </span>
//                                         </div>

//                                         <div className="flex items-center gap-3">
//                                             <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
//                                                 {items[0]?.service?.images?.[0] ? (
//                                                     <img
//                                                         src={getImageUrl(items[0].service.images[0])}
//                                                         alt="preview"
//                                                         className="h-full w-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <ShoppingBag size={20} className="text-slate-600" />
//                                                 )}
//                                             </div>

//                                             <div>
//                                                 <h4 className="text-sm font-black text-white leading-tight">
//                                                     {items[0]?.service?.title || items[0]?.title || `Service Request (${items.length || 1} item)`}
//                                                 </h4>
//                                                 <p className="text-[11px] text-slate-400 font-medium">
//                                                     Total Bill:{" "}
//                                                     <strong className="text-white font-black">
//                                                         ${Number(order.totalAmount || order.total || 0).toFixed(2)}
//                                                     </strong>{" "}
//                                                     • {order.paymentMethod || "Online"} (
//                                                     <span className={`font-semibold ${order.paymentStatus === "PAID" ? "text-emerald-400" : "text-amber-400"}`}>
//                                                         {order.paymentStatus || "PENDING"}
//                                                     </span>
//                                                     )
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {order.shippingAddress && (
//                                             <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
//                                                 <MapPin size={13} className="text-slate-500 shrink-0" />
//                                                 <span>
//                                                     {order.shippingAddress.street || ""}, {order.shippingAddress.city || ""}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
//                                         <button
//                                             onClick={() => setSelectedOrder(order)}
//                                             className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
//                                         >
//                                             <Eye size={15} />
//                                             <span>View Details</span>
//                                         </button>

//                                         {isCancelable && (
//                                             <button
//                                                 onClick={() => setOrderToCancel(order)}
//                                                 className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
//                                             >
//                                                 <XCircle size={15} />
//                                                 <span>Cancel Order</span>
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </main>

//             {/* Custom Cancel Confirmation Modal */}
//             {orderToCancel && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
//                     <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-4">
//                         <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
//                             <AlertTriangle size={24} />
//                         </div>
//                         <div>
//                             <h3 className="text-lg font-black text-white">Cancel this order?</h3>
//                             <p className="text-xs text-slate-400 mt-1 leading-relaxed">
//                                 Are you sure you want to cancel order{" "}
//                                 <span className="font-mono font-bold text-white">
//                                     #{String(orderToCancel._id || orderToCancel.id).slice(-6).toUpperCase()}
//                                 </span>
//                                 ? This will terminate the booking request with the provider.
//                             </p>
//                         </div>
//                         <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
//                             <button
//                                 disabled={isCancelling}
//                                 onClick={() => setOrderToCancel(null)}
//                                 className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
//                             >
//                                 Keep Order
//                             </button>
//                             <button
//                                 disabled={isCancelling}
//                                 onClick={confirmCancelOrder}
//                                 className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
//                             >
//                                 {isCancelling ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
//                                 <span>Yes, Cancel Order</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Order Details Modal */}
//             {selectedOrder && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
//                     <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
//                         <div className="flex items-start justify-between border-b border-slate-800 pb-4">
//                             <div>
//                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Order Information</span>
//                                 <h2 className="text-xl font-black text-white">
//                                     Order #{String(selectedOrder._id || selectedOrder.id).slice(-8).toUpperCase()}
//                                 </h2>
//                             </div>
//                             <button
//                                 onClick={() => setSelectedOrder(null)}
//                                 className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
//                             <div>
//                                 <span className="block text-[10px] font-bold text-slate-500 uppercase">Live Status</span>
//                                 <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus || selectedOrder.status)}</div>
//                             </div>
//                             <div>
//                                 <span className="block text-[10px] font-bold text-slate-500 uppercase">Created On</span>
//                                 <span className="text-xs font-black text-slate-300">
//                                     {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}
//                                 </span>
//                             </div>
//                             <div>
//                                 <span className="block text-[10px] font-bold text-slate-500 uppercase">Payment Status</span>
//                                 <span className="text-xs font-black text-emerald-400">
//                                     {selectedOrder.paymentStatus || "PAID"} ({selectedOrder.paymentMethod || "CARD"})
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="space-y-3">
//                             <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Booked Services</h3>
//                             <div className="space-y-2">
//                                 {(selectedOrder.items || selectedOrder.services || []).map((item, idx) => (
//                                     <div
//                                         key={idx}
//                                         className="p-3 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-between gap-4"
//                                     >
//                                         <div className="flex items-center gap-3">
//                                             <div className="h-12 w-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
//                                                 {item?.service?.images?.[0] ? (
//                                                     <img
//                                                         src={getImageUrl(item.service.images[0])}
//                                                         alt=""
//                                                         className="h-full w-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <ShoppingBag size={20} className="m-3 text-slate-500" />
//                                                 )}
//                                             </div>
//                                             <div>
//                                                 <h5 className="text-sm font-black text-white leading-tight">
//                                                     {item?.service?.title || item?.title || "Professional Service"}
//                                                 </h5>
//                                                 <span className="text-xs text-slate-400 font-semibold">
//                                                     Qty: {item.quantity || 1}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <span className="text-sm font-black text-white">
//                                             ${Number(item.price || item?.service?.price || selectedOrder.totalAmount || 0).toFixed(2)}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {selectedOrder.shippingAddress && (
//                             <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2 text-xs">
//                                 <span className="block text-[10px] font-black uppercase text-slate-500">Service Location</span>
//                                 <p className="font-semibold text-slate-300">
//                                     {selectedOrder.shippingAddress.street || "N/A"}
//                                     <br />
//                                     {selectedOrder.shippingAddress.city || ""}, {selectedOrder.shippingAddress.postalCode || ""}
//                                 </p>
//                             </div>
//                         )}

//                         <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
//                             <span className="text-sm font-bold text-slate-400">Total Charged</span>
//                             <span className="text-2xl font-black text-white">
//                                 ${Number(selectedOrder.totalAmount || selectedOrder.total || 0).toFixed(2)}
//                             </span>
//                         </div>

//                         <div className="flex items-center justify-end gap-3 pt-2">
//                             {(normalizeStatus(selectedOrder.orderStatus || selectedOrder.status) === "PENDING" ||
//                                 normalizeStatus(selectedOrder.orderStatus || selectedOrder.status) === "APPROVED") && (
//                                     <button
//                                         onClick={() => { setOrderToCancel(selectedOrder); }}
//                                         className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition cursor-pointer"
//                                     >
//                                         Cancel Order
//                                     </button>
//                                 )}
//                             <button
//                                 onClick={() => setSelectedOrder(null)}
//                                 className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer border border-slate-700"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    getMyOrdersApi,
    cancelOrderApi,
    getMyNotificationsApi,
    verifyStripeSessionApi,
    getImageUrl
} from "../api/servicesApi";
import {
    ArrowLeft, ShoppingBag, Loader2, RefreshCw, XCircle,
    Eye, CheckCircle2, Clock, Calendar, MapPin, PackageCheck, Sparkles,
    AlertTriangle, X
} from "lucide-react";

export default function Orders() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");
    const [isCancelling, setIsCancelling] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const res = await getMyOrdersApi();
            const list = res?.data?.orders || res?.data || res?.orders || (Array.isArray(res) ? res : []);
            setOrders(Array.isArray(list) ? list : []);
        } catch (_) {
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const isSuccess = searchParams.get("success") === "true";
        const orderId = searchParams.get("order_id");
        const sessionId = searchParams.get("session_id");

        if (isSuccess && orderId) {
            if (sessionId) {
                verifyStripeSessionApi({ sessionId, orderId })
                    .then(() => {
                        showToast("Payment verified! Your order is placed for review.", "success");
                        loadOrders();
                    })
                    .catch(() => {
                        loadOrders();
                    });
            } else {
                showToast("Payment confirmed successfully!", "success");
                loadOrders();
            }
        } else if (searchParams.get("canceled") === "true") {
            showToast("Payment was cancelled and order is marked cancelled.", "error");
            loadOrders();
        } else {
            loadOrders();
        }
    }, [searchParams]);

    const normalizeStatus = (statusRaw) => {
        const s = (statusRaw || "PENDING").toUpperCase();
        if (s.includes("CANCEL") || s.includes("REJECT") || s.includes("REFUND")) return "CANCELLED";
        if (s.includes("APPROV") || s.includes("ACCEPT") || s.includes("CONFIRM") || s.includes("PROGRESS")) return "APPROVED";
        if (s.includes("COMPLETE") || s.includes("DELIVER")) return "COMPLETED";
        return "PENDING";
    };

    const counts = useMemo(() => {
        return orders.reduce(
            (acc, curr) => {
                const norm = normalizeStatus(curr.orderStatus || curr.status);
                acc[norm] = (acc[norm] || 0) + 1;
                return acc;
            },
            { ALL: orders.length, PENDING: 0, APPROVED: 0, COMPLETED: 0, CANCELLED: 0 }
        );
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (activeTab === "ALL") return orders;
        return orders.filter((o) => normalizeStatus(o.orderStatus || o.status) === activeTab);
    }, [orders, activeTab]);

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        const targetId = orderToCancel._id || orderToCancel.id;
        setIsCancelling(true);

        try {
            await cancelOrderApi(targetId);
            showToast("Order cancelled successfully!", "success");
            setOrderToCancel(null);
            loadOrders();
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to cancel order", "error");
        } finally {
            setIsCancelling(false);
        }
    };

    const getStatusBadge = (rawStatus, paymentStatus) => {
        const norm = normalizeStatus(rawStatus);
        const isPaid = (paymentStatus || "").toUpperCase() === "PAID";

        switch (norm) {
            case "COMPLETED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 size={13} /> Completed
                    </span>
                );
            case "APPROVED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        <PackageCheck size={13} /> {isPaid ? "Processing (Paid)" : "Approved"}
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <XCircle size={13} /> Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <Clock size={13} /> {isPaid ? "Paid (Pending Review)" : "Pending Payment"}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
            {toast && (
                <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-300">
                    <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold ${toast.type === "success"
                        ? "bg-emerald-950/90 text-emerald-200 border-emerald-700/60"
                        : "bg-rose-950/90 text-rose-200 border-rose-700/60"
                        }`}>
                        {toast.type === "success" ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-rose-400" />}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 cursor-pointer">
                            <X size={15} />
                        </button>
                    </div>
                </div>
            )}

            <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
                        <ArrowLeft size={20} /> Back
                    </Link>

                    <button
                        onClick={loadOrders}
                        className="p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin text-indigo-400" : ""} />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
                <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 text-xs font-bold uppercase tracking-wider mb-3">
                            <Sparkles size={14} /> Service Orders &amp; Booking Management
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Orders Ledger</h1>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg">
                            Monitor real-time approval status, service scheduling, and cancellations from one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-center">
                            <span className="block text-[11px] font-bold text-slate-400 uppercase">Total</span>
                            <span className="text-xl font-black text-white">{counts.ALL}</span>
                        </div>
                        <div className="bg-amber-500/10 rounded-2xl p-3 border border-amber-500/20 text-center">
                            <span className="block text-[11px] font-bold text-amber-400 uppercase">Pending</span>
                            <span className="text-xl font-black text-amber-400">{counts.PENDING || 0}</span>
                        </div>
                        <div className="bg-blue-500/10 rounded-2xl p-3 border border-blue-500/20 text-center">
                            <span className="block text-[11px] font-bold text-blue-400 uppercase">Approved</span>
                            <span className="text-xl font-black text-blue-400">{counts.APPROVED || 0}</span>
                        </div>
                        <div className="bg-emerald-500/10 rounded-2xl p-3 border border-emerald-500/20 text-center">
                            <span className="block text-[11px] font-bold text-emerald-400 uppercase">Completed</span>
                            <span className="text-xl font-black text-emerald-400">{counts.COMPLETED || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0b0f19] rounded-2xl border border-slate-800 p-2 flex items-center gap-1.5 overflow-x-auto">
                    {[
                        { id: "ALL", label: "All Orders", count: counts.ALL },
                        { id: "PENDING", label: "Pending Approval", count: counts.PENDING || 0 },
                        { id: "APPROVED", label: "Approved", count: counts.APPROVED || 0 },
                        { id: "COMPLETED", label: "Completed", count: counts.COMPLETED || 0 },
                        { id: "CANCELLED", label: "Cancelled", count: counts.CANCELLED || 0 },
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${isActive
                                    ? "bg-indigo-600 text-white shadow-[0_3px_0_#4338ca]"
                                    : "bg-transparent text-slate-400 hover:bg-slate-900 hover:text-white"
                                    }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {isLoading ? (
                    <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-24 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 size={36} className="animate-spin text-indigo-400" />
                        <span className="text-xs font-bold text-slate-400">Retrieving live orders...</span>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-16 text-center">
                        <ShoppingBag size={44} className="mx-auto text-slate-700 mb-3" />
                        <h3 className="text-base font-black text-white">No Orders Under "{activeTab}"</h3>
                        <p className="text-xs text-slate-400 mt-1">There are no records matching the selected status.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order, idx) => {
                            const orderId = order._id || order.id || idx;
                            const statusRaw = order.orderStatus || order.status || "PENDING";
                            const normStatus = normalizeStatus(statusRaw);
                            const items = order.items || order.services || [];
                            const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent";
                            const paymentStatus = (order.paymentStatus || "").toUpperCase();
                            const isPaid = paymentStatus === "PAID";

                            // ⚡ CANCEL BUTTON ONLY SHOWN IF NOT PAID AND PENDING
                            const isCancelable = !isPaid && normStatus === "PENDING";

                            return (
                                <div
                                    key={orderId}
                                    className="bg-[#0b0f19]/90 rounded-3xl border border-slate-800 hover:border-indigo-500/40 p-5 sm:p-6 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                                >
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="font-mono text-xs font-black text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                                ID: #{String(orderId).slice(-6).toUpperCase()}
                                            </span>
                                            {getStatusBadge(statusRaw, paymentStatus)}
                                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                                <Calendar size={13} /> {dateStr}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                                {items[0]?.service?.images?.[0] || order.serviceImage ? (
                                                    <img
                                                        src={getImageUrl(items[0]?.service?.images?.[0] || order.serviceImage)}
                                                        alt="preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ShoppingBag size={20} className="text-slate-600" />
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-black text-white leading-tight">
                                                    {items[0]?.service?.title || order.serviceTitle || `Service Booking (${order.quantity || 1} Slot)`}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 font-medium">
                                                    Total Bill:{" "}
                                                    <strong className="text-white font-black">
                                                        ${Number(order.totalAmount || order.price || 0).toFixed(2)}
                                                    </strong>{" "}
                                                    • {order.paymentMethod || "Online"}
                                                    {isPaid && (
                                                        <span className="ml-1.5 font-bold text-emerald-400">
                                                            (PAID)
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {order.shippingAddress && (
                                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                                                <MapPin size={13} className="text-slate-500 shrink-0" />
                                                <span>
                                                    {order.shippingAddress.address || order.shippingAddress.street || ""}, {order.shippingAddress.city || ""}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                                        >
                                            <Eye size={15} />
                                            <span>View Details</span>
                                        </button>

                                        {isCancelable && (
                                            <button
                                                onClick={() => setOrderToCancel(order)}
                                                className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <XCircle size={15} />
                                                <span>Cancel Order</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {orderToCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">Cancel this order?</h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                Are you sure you want to cancel order{" "}
                                <span className="font-mono font-bold text-white">
                                    #{String(orderToCancel._id || orderToCancel.id).slice(-6).toUpperCase()}
                                </span>
                                ? This booking request will be terminated.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                            <button
                                disabled={isCancelling}
                                onClick={() => setOrderToCancel(null)}
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                            >
                                Keep Order
                            </button>
                            <button
                                disabled={isCancelling}
                                onClick={confirmCancelOrder}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isCancelling ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                                <span>Yes, Cancel Order</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}