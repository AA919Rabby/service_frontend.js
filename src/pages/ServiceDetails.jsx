import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    getServiceDetailsApi,
    getImageUrl,
    addServiceReviewApi,
    createOrderApi,
    createStripeSessionApi,
    createSSLCommerzSessionApi
} from "../api/servicesApi";
import {
    MapPin, Phone, Star, ShieldCheck,
    Package, ArrowLeft, Loader2, AlertCircle, ShoppingBag,
    CreditCard, X, Send, CheckCircle2, Heart, Calendar
} from "lucide-react";
import { selectSavedItems, toggleSaveService } from "../features/saved/savedSlice";

export default function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const savedItems = useSelector(selectSavedItems);

    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImgIdx, setActiveImgIdx] = useState(0);

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("STRIPE");
    const [orderQuantity, setOrderQuantity] = useState(1);

    const getTomorrowDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    };

    const [shippingForm, setShippingForm] = useState({
        receiverName: "Mohammad Rabbi",
        phoneNumber: "+8801700000000",
        locationAddress: "House 12, Road 4, Sector 3, Uttara",
        city: "Dhaka",
        postcode: "1230",
        bookingDate: getTomorrowDate(),
    });
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderSuccessMsg, setOrderSuccessMsg] = useState("");

    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewToast, setReviewToast] = useState("");

    const fallbackImage = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800";

    const loadService = () => {
        if (!id) return;
        setIsLoading(true);
        getServiceDetailsApi(id)
            .then((res) => {
                const data = res?.data || res;
                setService(data);
                if (data?.title) {
                    document.title = `${data.title} | TN Services`;
                }
            })
            .catch((err) => {
                setError(err?.response?.data?.message || err?.message || "Failed to load service");
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadService();
    }, [id]);

    const isSaved = service
        ? savedItems.some((s) => (s._id || s.id) === (service._id || service.id))
        : false;

    const handlePlaceOrderSubmit = async (e) => {
        e.preventDefault();
        setIsPlacingOrder(true);
        setOrderSuccessMsg("");
        setError(null);

        try {
            const idempotencyKey =
                typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

            const targetServiceId = service.id || service._id;
            const cleanPrice = Number(service.price) || 0;

            const orderPayload = {
                serviceId: targetServiceId,
                quantity: parseInt(orderQuantity, 10),
                totalAmount: (cleanPrice * parseInt(orderQuantity, 10)).toFixed(2),
                bookingDate: shippingForm.bookingDate,
                receiverName: shippingForm.receiverName.trim(),
                phoneNumber: shippingForm.phoneNumber.trim(),
                locationAddress: shippingForm.locationAddress.trim(),
                city: shippingForm.city.trim(),
                postcode: shippingForm.postcode.trim(),
                paymentMethod: paymentMethod,
                idempotencyKey: idempotencyKey,
            };

            const orderRes = await createOrderApi(orderPayload);

            const directUrl =
                orderRes?.checkoutUrl ||
                orderRes?.data?.checkoutUrl ||
                orderRes?.url ||
                orderRes?.data?.url;

            if (directUrl && typeof directUrl === "string" && directUrl.startsWith("http")) {
                setOrderSuccessMsg("Order locked! Redirecting to Payment Gateway...");
                setTimeout(() => {
                    window.location.href = directUrl;
                }, 1000);
                return;
            }

            const createdOrder = orderRes?.data || orderRes?.order || orderRes;
            const orderId = createdOrder?.id || createdOrder?._id || createdOrder?.orderId;

            if (!orderId) {
                throw new Error("Order was created, but server did not return an Order ID.");
            }

            setOrderSuccessMsg("Order locked! Connecting to Payment Gateway...");

            let paymentRes;
            if (paymentMethod === "STRIPE") {
                paymentRes = await createStripeSessionApi(orderId);
            } else {
                paymentRes = await createSSLCommerzSessionApi(orderId);
            }

            const checkoutUrl =
                paymentRes?.checkoutUrl ||
                paymentRes?.data?.checkoutUrl ||
                paymentRes?.url ||
                paymentRes?.data?.url ||
                paymentRes?.sessionUrl;

            if (checkoutUrl && typeof checkoutUrl === "string") {
                setOrderSuccessMsg("Redirecting to Secure Checkout...");
                window.location.href = checkoutUrl;
            } else {
                setTimeout(() => {
                    navigate("/orders");
                }, 1500);
            }
        } catch (err) {
            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Payment gateway connection failed.";
            setOrderSuccessMsg("");
            alert(backendMessage);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!userComment.trim()) return;

        setIsSubmittingReview(true);
        try {
            await addServiceReviewApi(service.id || service._id, {
                rating: userRating,
                comment: userComment.trim(),
            });

            setReviewToast("Review submitted successfully!");
            setUserComment("");
            setTimeout(() => setReviewToast(""), 4000);
            loadService();
        } catch (err) {
            alert(err?.response?.data?.message || err?.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 font-sans text-slate-900">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
                <p className="text-sm font-bold text-slate-500">Loading service details...</p>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans text-slate-900">
                <div className="w-20 h-20 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-3">
                    <AlertCircle size={42} className="text-rose-500" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Service Not Found</h2>
                <p className="text-sm text-slate-500 mb-6">{error || "This listing is unavailable."}</p>
                <Link to="/dashboard" className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:from-blue-700 hover:to-indigo-700 transition">
                    Return to Marketplace
                </Link>
            </div>
        );
    }

    const images = Array.isArray(service.images) && service.images.length > 0
        ? service.images
        : [fallbackImage];

    const providerAvatar =
        service.author?.avatar ||
        service.provider?.avatar ||
        service.author?.image ||
        service.author?.photo ||
        service.creator?.avatar ||
        service.user?.avatar;

    const providerName =
        service.author?.name ||
        service.provider?.name ||
        service.author?.fullName ||
        service.author?.username ||
        "Verified Professional";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-700">
            {isOrderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 my-8 text-slate-900">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Complete Your Order</h3>
                                <p className="text-xs text-slate-500 mt-1">{service.title}</p>
                            </div>
                            <button onClick={() => setIsOrderModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        {orderSuccessMsg ? (
                            <div className="py-10 text-center space-y-3">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={36} className="text-emerald-500 animate-bounce" />
                                </div>
                                <h4 className="font-black text-slate-900 text-base">{orderSuccessMsg}</h4>
                                <p className="text-xs text-slate-500">Redirecting to payment gateway...</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePlaceOrderSubmit} className="space-y-3.5 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase mb-1.5">Quantity / Slots</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={service.stock || 10}
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(e.target.value)}
                                            className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase mb-1.5">Service Date *</label>
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split("T")[0]}
                                            value={shippingForm.bookingDate}
                                            onChange={(e) => setShippingForm({ ...shippingForm, bookingDate: e.target.value })}
                                            className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase mb-1.5">Receiver Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingForm.receiverName}
                                            onChange={(e) => setShippingForm({ ...shippingForm, receiverName: e.target.value })}
                                            className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase mb-1.5">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={shippingForm.phoneNumber}
                                            onChange={(e) => setShippingForm({ ...shippingForm, phoneNumber: e.target.value })}
                                            className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-600 uppercase mb-1.5">Location Address *</label>
                                    <input
                                        type="text"
                                        required
                                        value={shippingForm.locationAddress}
                                        onChange={(e) => setShippingForm({ ...shippingForm, locationAddress: e.target.value })}
                                        className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase mb-1.5">City *</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingForm.city}
                                            onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                                            className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-600 uppercase mb-1.5">Postcode / Zip *</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingForm.postcode}
                                            onChange={(e) => setShippingForm({ ...shippingForm, postcode: e.target.value })}
                                            className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-600 uppercase mb-2">Select Payment Method</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("STRIPE")}
                                            className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 transition cursor-pointer ${paymentMethod === "STRIPE"
                                                ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm ring-2 ring-indigo-100"
                                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                                }`}
                                        >
                                            <CreditCard size={18} className="text-indigo-600" />
                                            <span>Stripe (Card)</span>
                                            <span className="text-[10px] text-slate-500">Visa, Mastercard</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("SSLCOMMERZ")}
                                            className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 transition cursor-pointer ${paymentMethod === "SSLCOMMERZ"
                                                ? "border-rose-300 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-100"
                                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span className="text-sm font-black text-rose-500">bKash / Nagad</span>
                                            <span>SSLCommerz</span>
                                            <span className="text-[10px] text-slate-500">Local Mobile Banking</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-black text-sm text-slate-900">
                                    <span>Total Amount:</span>
                                    <span>${(Number(service.price) * orderQuantity).toFixed(2)} USD</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPlacingOrder}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isPlacingOrder ? <Loader2 size={16} className="animate-spin" /> : <span>Confirm &amp; Place Order</span>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <header className="sticky top-0 z-30 bg-white/90 border-b border-slate-200 backdrop-blur-xl shadow-sm">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-base font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">
                        <ArrowLeft size={20} />
                        Back
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 pt-8">
                <div className="bg-white border border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                    src={getImageUrl(images[activeImgIdx])}
                                    alt={service.title}
                                    onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {images.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImgIdx(idx)}
                                            className={`h-20 w-24 rounded-2xl overflow-hidden border-2 shrink-0 transition ${activeImgIdx === idx ? "border-indigo-500 shadow-md shadow-indigo-100 scale-95" : "border-slate-200 opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <img
                                                src={getImageUrl(img)}
                                                alt="thumb"
                                                onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl inline-block mb-3">
                                        {service.category?.name || "Service"}
                                    </span>
                                    <h1 className="text-2xl font-black text-slate-900 leading-snug">{service.title}</h1>
                                </div>

                                <button
                                    onClick={() => dispatch(toggleSaveService(service))}
                                    className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${isSaved
                                        ? "border-rose-200 bg-rose-50 text-rose-500 scale-105"
                                        : "border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200"
                                        }`}
                                    title={isSaved ? "Remove from saved" : "Save this service"}
                                >
                                    <Heart size={22} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Standard Price</span>
                                <div className="text-4xl font-black text-slate-900 mt-1">${Number(service.price).toFixed(2)}</div>
                            </div>

                            <div className="space-y-3 text-xs pt-2 border-t border-slate-200">
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <MapPin size={16} className="text-indigo-600 shrink-0" />
                                    <span className="font-semibold">{service.location || "Dhaka, Bangladesh"}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <Phone size={16} className="text-emerald-600 shrink-0" />
                                    <a href={`tel:${service.phoneNumber}`} className="font-bold hover:text-indigo-600 hover:underline">
                                        {service.phoneNumber}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <Package size={16} className="text-amber-500 shrink-0" />
                                    <span>Available Slots / Stock: <strong className="text-slate-900">{service.stock}</strong></span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOrderModalOpen(true)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ShoppingBag size={18} />
                                <span>Book This Service</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-3">
                        <h2 className="text-lg font-black text-slate-900">About this service</h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {service.description}
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-3">Service Provider</h3>
                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3.5">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 overflow-hidden border border-indigo-100 shadow-sm">
                                {providerAvatar ? (
                                    <img
                                        src={getImageUrl(providerAvatar)}
                                        alt={providerName}
                                        className="h-full w-full object-cover"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                ) : (
                                    providerName.charAt(0).toUpperCase()
                                )}
                            </div>

                            <div>
                                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                    <span>{providerName}</span>
                                    <ShieldCheck size={15} className="text-indigo-600" />
                                </div>
                                <span className="text-[11px] text-slate-500 block mt-0.5">Verified TN Services Partner</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-6">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-black text-slate-900">Client Reviews</h3>
                            {service.totalReviews > 0 ? (
                                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                                    <Star size={16} fill="currentColor" />
                                    <span>{Number(service.rating).toFixed(1)}</span>
                                    <span className="text-slate-400 font-normal">({service.totalReviews} reviews)</span>
                                </div>
                            ) : (
                                <span className="text-xs font-bold text-slate-400">No reviews yet</span>
                            )}
                        </div>

                        <form onSubmit={handleReviewSubmit} className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                            <span className="font-bold text-xs text-slate-700 block">Leave a Verified Review:</span>

                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setUserRating(star)}
                                        className="p-1 text-amber-500 hover:scale-110 transition cursor-pointer"
                                    >
                                        <Star size={20} fill={star <= userRating ? "currentColor" : "none"} />
                                    </button>
                                ))}
                                <span className="text-xs font-bold text-slate-500 ml-2">{userRating} Stars</span>
                            </div>

                            <textarea
                                rows="2"
                                required
                                placeholder="Share your experience with this service..."
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 bg-white text-slate-900 placeholder:text-slate-400 transition"
                            />

                            <button
                                type="submit"
                                disabled={isSubmittingReview}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmittingReview ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                <span>Post Review</span>
                            </button>

                            {reviewToast && (
                                <span className="text-xs font-bold text-emerald-600 block">{reviewToast}</span>
                            )}
                        </form>

                        {service.reviews && service.reviews.length > 0 ? (
                            <div className="space-y-3">
                                {service.reviews.map((rev) => (
                                    <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {rev.reviewer?.avatar ? (
                                                    <img src={getImageUrl(rev.reviewer.avatar)} alt="" className="h-7 w-7 rounded-full object-cover border border-slate-200" />
                                                ) : (
                                                    <div className="h-7 w-7 rounded-full bg-indigo-50 border border-indigo-100 font-bold text-[10px] flex items-center justify-center text-indigo-600">
                                                        {rev.reviewer?.name?.charAt(0) || "U"}
                                                    </div>
                                                )}
                                                <span className="font-bold text-slate-800">{rev.reviewer?.name || "Client"}</span>
                                            </div>
                                            <div className="flex text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-500 italic">"{rev.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic">Be the first client to book and review this service!</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}