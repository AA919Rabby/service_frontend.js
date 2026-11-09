import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    getMyOrdersApi,
    cancelOrderApi,
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

                            // ⚡ Booking Date
                            const bookingDate = order.bookingDate || order.booking_date || order.shippingAddress?.bookingDate || null;

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

                                            {bookingDate && (
                                                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                                                    <Calendar size={13} className="text-indigo-600" /> Booking: {bookingDate}
                                                </span>
                                            )}

                                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                                Placed: {dateStr}
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
                                            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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

            {/* View Details Modal with Booking Date */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Order Details</h3>
                                <p className="text-xs text-slate-500 font-mono">#{String(selectedOrder._id || selectedOrder.id).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="block font-bold text-slate-500 uppercase text-[10px]">Scheduled Service Date</span>
                                <span className="text-sm font-black text-indigo-600">
                                    {selectedOrder.bookingDate || selectedOrder.booking_date || selectedOrder.shippingAddress?.bookingDate || "Standard Booking"}
                                </span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="block font-bold text-slate-500 uppercase text-[10px]">Payment Status</span>
                                <span className={`text-sm font-black ${selectedOrder.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
                                    {selectedOrder.paymentStatus || "UNPAID"} ({selectedOrder.paymentMethod || "Online"})
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                            <span className="font-bold text-slate-700 block">Service Location &amp; Contact:</span>
                            <p className="text-slate-600">Receiver: <strong className="text-slate-800">{selectedOrder.receiverName || selectedOrder.receiver_name || selectedOrder.shippingAddress?.receiverName}</strong></p>
                            <p className="text-slate-600">Phone: <strong className="text-slate-800">{selectedOrder.phoneNumber || selectedOrder.phone_number || selectedOrder.shippingAddress?.phoneNumber}</strong></p>
                            <p className="text-slate-600">Address: <strong className="text-slate-800">{selectedOrder.locationAddress || selectedOrder.location_address || selectedOrder.shippingAddress?.address}, {selectedOrder.city || selectedOrder.shippingAddress?.city}</strong></p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-black text-base text-slate-900">
                            <span>Total Charged:</span>
                            <span>${Number(selectedOrder.totalAmount || selectedOrder.price || 0).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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