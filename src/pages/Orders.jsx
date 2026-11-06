


// import React, { useState, useEffect, useMemo } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import {
//     getMyOrdersApi,
//     cancelOrderApi,
//     getMyNotificationsApi,
//     verifyStripeSessionApi,
//     getImageUrl
// } from "../api/servicesApi";
// import {
//     ArrowLeft, ShoppingBag, Loader2, RefreshCw, XCircle,
//     Eye, CheckCircle2, Clock, Calendar, MapPin, PackageCheck, Sparkles,
//     AlertTriangle, X
// } from "lucide-react";

// export default function Orders() {
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();

//     const [orders, setOrders] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState("ALL");
//     const [isCancelling, setIsCancelling] = useState(false);

//     const [selectedOrder, setSelectedOrder] = useState(null);
//     const [orderToCancel, setOrderToCancel] = useState(null);
//     const [toast, setToast] = useState(null);

//     const showToast = (message, type = "success") => {
//         setToast({ message, type });
//         setTimeout(() => setToast(null), 4000);
//     };

//     const loadOrders = async () => {
//         setIsLoading(true);
//         try {
//             const res = await getMyOrdersApi();
//             const list = res?.data?.orders || res?.data || res?.orders || (Array.isArray(res) ? res : []);
//             setOrders(Array.isArray(list) ? list : []);
//         } catch (_) {
//             setOrders([]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         const isSuccess = searchParams.get("success") === "true";
//         const orderId = searchParams.get("order_id");
//         const sessionId = searchParams.get("session_id");

//         if (isSuccess && orderId) {
//             if (sessionId) {
//                 verifyStripeSessionApi({ sessionId, orderId })
//                     .then(() => {
//                         showToast("Payment verified! Your order is placed for review.", "success");
//                         loadOrders();
//                     })
//                     .catch(() => {
//                         loadOrders();
//                     });
//             } else {
//                 showToast("Payment confirmed successfully!", "success");
//                 loadOrders();
//             }
//         } else if (searchParams.get("canceled") === "true") {
//             showToast("Payment was cancelled and order is marked cancelled.", "error");
//             loadOrders();
//         } else {
//             loadOrders();
//         }
//     }, [searchParams]);

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
//             loadOrders();
//         } catch (err) {
//             showToast(err?.response?.data?.message || "Failed to cancel order", "error");
//         } finally {
//             setIsCancelling(false);
//         }
//     };

//     const getStatusBadge = (rawStatus, paymentStatus) => {
//         const norm = normalizeStatus(rawStatus);
//         const isPaid = (paymentStatus || "").toUpperCase() === "PAID";

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
//                         <PackageCheck size={13} /> {isPaid ? "Processing (Paid)" : "Approved"}
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
//                         <Clock size={13} /> {isPaid ? "Paid (Pending Review)" : "Pending Payment"}
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

//             <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
//                     <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
//                         <ArrowLeft size={20} /> Back
//                     </Link>

//                     <button
//                         onClick={loadOrders}
//                         className="p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white transition cursor-pointer"
//                         title="Refresh Data"
//                     >
//                         <RefreshCw size={18} className={isLoading ? "animate-spin text-indigo-400" : ""} />
//                     </button>
//                 </div>
//             </header>

//             <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
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
//                                 <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
//                                     }`}>
//                                     {tab.count}
//                                 </span>
//                             </button>
//                         );
//                     })}
//                 </div>

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
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {filteredOrders.map((order, idx) => {
//                             const orderId = order._id || order.id || idx;
//                             const statusRaw = order.orderStatus || order.status || "PENDING";
//                             const normStatus = normalizeStatus(statusRaw);
//                             const items = order.items || order.services || [];
//                             const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent";
//                             const paymentStatus = (order.paymentStatus || "").toUpperCase();
//                             const isPaid = paymentStatus === "PAID";

//                             // ⚡ CANCEL BUTTON ONLY SHOWN IF NOT PAID AND PENDING
//                             const isCancelable = !isPaid && normStatus === "PENDING";

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
//                                             {getStatusBadge(statusRaw, paymentStatus)}
//                                             <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
//                                                 <Calendar size={13} /> {dateStr}
//                                             </span>
//                                         </div>

//                                         <div className="flex items-center gap-3">
//                                             <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
//                                                 {items[0]?.service?.images?.[0] || order.serviceImage ? (
//                                                     <img
//                                                         src={getImageUrl(items[0]?.service?.images?.[0] || order.serviceImage)}
//                                                         alt="preview"
//                                                         className="h-full w-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <ShoppingBag size={20} className="text-slate-600" />
//                                                 )}
//                                             </div>

//                                             <div>
//                                                 <h4 className="text-sm font-black text-white leading-tight">
//                                                     {items[0]?.service?.title || order.serviceTitle || `Service Booking (${order.quantity || 1} Slot)`}
//                                                 </h4>
//                                                 <p className="text-[11px] text-slate-400 font-medium">
//                                                     Total Bill:{" "}
//                                                     <strong className="text-white font-black">
//                                                         ${Number(order.totalAmount || order.price || 0).toFixed(2)}
//                                                     </strong>{" "}
//                                                     • {order.paymentMethod || "Online"}
//                                                     {isPaid && (
//                                                         <span className="ml-1.5 font-bold text-emerald-400">
//                                                             (PAID)
//                                                         </span>
//                                                     )}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {order.shippingAddress && (
//                                             <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
//                                                 <MapPin size={13} className="text-slate-500 shrink-0" />
//                                                 <span>
//                                                     {order.shippingAddress.address || order.shippingAddress.street || ""}, {order.shippingAddress.city || ""}
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

//             {orderToCancel && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
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
//                                 ? This booking request will be terminated.
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={13} /> Completed
                    </span>
                );
            case "APPROVED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
                        <PackageCheck size={13} /> {isPaid ? "Processing (Paid)" : "Approved"}
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle size={13} /> Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={13} /> {isPaid ? "Paid (Pending Review)" : "Pending Payment"}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
                <div className="absolute top-[35%] -left-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
            </div>

            {toast && (
                <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-300">
                    <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold backdrop-blur-xl ${toast.type === "success"
                        ? "bg-white text-emerald-700 border-emerald-200"
                        : "bg-white text-rose-700 border-rose-200"
                        }`}>
                        {toast.type === "success"
                            ? <CheckCircle2 size={18} className="text-emerald-500" />
                            : <AlertTriangle size={18} className="text-rose-500" />}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 cursor-pointer">
                            <X size={15} />
                        </button>
                    </div>
                </div>
            )}

            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition cursor-pointer">
                        <ArrowLeft size={19} /> Back to Dashboard
                    </Link>

                    <button
                        onClick={loadOrders}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-200 bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition cursor-pointer shadow-sm"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin text-indigo-600" : ""} />
                    </button>
                </div>
            </header>

            <main className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-7 sm:p-10 shadow-xl shadow-indigo-200/60 text-white flex flex-col md:flex-row md:items-center justify-between gap-7">
                    <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full border-[35px] border-white/10" />
                    <div className="absolute right-40 -bottom-32 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 text-[11px] font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
                            <Sparkles size={14} /> Service Orders &amp; Booking Management
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">Orders Ledger</h1>
                        <p className="text-indigo-100 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
                            Monitor order approval status, service scheduling, and cancellations from one place.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-center min-w-[78px]">
                            <span className="block text-[10px] font-bold text-indigo-100 uppercase tracking-wider">Total</span>
                            <span className="text-2xl font-black text-white">{counts.ALL}</span>
                        </div>
                        <div className="bg-amber-300/15 backdrop-blur-md rounded-2xl p-3.5 border border-amber-200/20 text-center min-w-[78px]">
                            <span className="block text-[10px] font-bold text-amber-100 uppercase tracking-wider">Pending</span>
                            <span className="text-2xl font-black text-white">{counts.PENDING || 0}</span>
                        </div>
                        <div className="bg-blue-300/15 backdrop-blur-md rounded-2xl p-3.5 border border-blue-100/20 text-center min-w-[78px]">
                            <span className="block text-[10px] font-bold text-blue-100 uppercase tracking-wider">Approved</span>
                            <span className="text-2xl font-black text-white">{counts.APPROVED || 0}</span>
                        </div>
                        <div className="bg-emerald-300/15 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-100/20 text-center min-w-[78px]">
                            <span className="block text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Completed</span>
                            <span className="text-2xl font-black text-white">{counts.COMPLETED || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-2 flex items-center gap-1.5 overflow-x-auto shadow-sm">
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
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                                    }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {isLoading ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-24 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                        <Loader2 size={36} className="animate-spin text-indigo-600" />
                        <span className="text-xs font-semibold text-slate-500">Retrieving live orders...</span>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
                        <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={30} className="text-indigo-400" />
                        </div>
                        <h3 className="text-base font-black text-slate-800">No Orders Under "{activeTab}"</h3>
                        <p className="text-xs text-slate-500 mt-2">There are no records matching the selected status.</p>
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

                            const isCancelable = !isPaid && normStatus === "PENDING";

                            return (
                                <div
                                    key={orderId}
                                    className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 p-5 sm:p-6 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                                >
                                    <div className="space-y-3 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="font-mono text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                                                ID: #{String(orderId).slice(-6).toUpperCase()}
                                            </span>
                                            {getStatusBadge(statusRaw, paymentStatus)}
                                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                                <Calendar size={13} className="text-slate-400" /> {dateStr}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {items[0]?.service?.images?.[0] || order.serviceImage ? (
                                                    <img
                                                        src={getImageUrl(items[0]?.service?.images?.[0] || order.serviceImage)}
                                                        alt="preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ShoppingBag size={20} className="text-slate-400" />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                                                    {items[0]?.service?.title || order.serviceTitle || `Service Booking (${order.quantity || 1} Slot)`}
                                                </h4>
                                                <p className="text-[11px] text-slate-500 font-medium mt-1">
                                                    Total Bill:{" "}
                                                    <strong className="text-slate-800 font-black">
                                                        ${Number(order.totalAmount || order.price || 0).toFixed(2)}
                                                    </strong>{" "}
                                                    • {order.paymentMethod || "Online"}
                                                    {isPaid && (
                                                        <span className="ml-1.5 font-bold text-emerald-600">
                                                            (PAID)
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {order.shippingAddress && (
                                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                                                <MapPin size={13} className="text-indigo-400 shrink-0" />
                                                <span>
                                                    {order.shippingAddress.address || order.shippingAddress.street || ""}, {order.shippingAddress.city || ""}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-indigo-100"
                                        >
                                            <Eye size={15} />
                                            <span>View Details</span>
                                        </button>

                                        {isCancelable && (
                                            <button
                                                onClick={() => setOrderToCancel(order)}
                                                className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 sm:p-7 shadow-2xl shadow-slate-900/20 space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Cancel this order?</h3>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                Are you sure you want to cancel order{" "}
                                <span className="font-mono font-bold text-slate-800">
                                    #{String(orderToCancel._id || orderToCancel.id).slice(-6).toUpperCase()}
                                </span>
                                ? This booking request will be terminated.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                            <button
                                disabled={isCancelling}
                                onClick={() => setOrderToCancel(null)}
                                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                            >
                                Keep Order
                            </button>
                            <button
                                disabled={isCancelling}
                                onClick={confirmCancelOrder}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-rose-200"
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
