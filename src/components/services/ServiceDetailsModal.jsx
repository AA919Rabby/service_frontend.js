


// import React, { useState } from "react";
// import {
//     X,
//     CreditCard,
//     ShieldCheck,
//     CheckCircle2,
//     Globe,
//     ExternalLink
// } from "lucide-react";
// import { createStripeSessionApi, createSSLCommerzSessionApi } from "../../api/servicesApi";

// export default function ServiceDetailsModal({ isOpen, onClose, order }) {
//     if (!isOpen || !order) return null;

//     const [selectedGateway, setSelectedGateway] = useState("STRIPE");
//     const [isLoading, setIsLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [gatewayUrl, setGatewayUrl] = useState(null);

//     const handlePayNow = async () => {
//         setIsLoading(true);
//         setErrorMessage("");

//         const orderId = order.id || order._id;

//         try {
//             if (selectedGateway === "STRIPE") {
//                 const res = await createStripeSessionApi(orderId);
//                 const url = res?.data?.checkoutUrl || res?.checkoutUrl;
//                 if (url) {
//                     setGatewayUrl(url);
//                 } else {
//                     throw new Error("Stripe checkout URL not returned");
//                 }
//             } else {
//                 const res = await createSSLCommerzSessionApi(orderId);
//                 const url = res?.data?.checkoutUrl || res?.checkoutUrl;
//                 if (url) {
//                     setGatewayUrl(url);
//                 } else {
//                     throw new Error("SSLCommerz checkout URL not returned");
//                 }
//             }
//         } catch (err) {
//             setErrorMessage(err?.response?.data?.message || err?.message || "Failed to initialize payment gateway");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
//             <div className={`relative w-full ${gatewayUrl ? "max-w-4xl h-[90vh]" : "max-w-lg"} bg-[#0b0f19] border border-slate-800 rounded-[2.5rem] p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-slate-100 flex flex-col transition-all duration-300`}>

//                 <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
//                     <div>
//                         <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
//                             {gatewayUrl ? `${selectedGateway} Secure Session` : "Secure Gateway Checkout"}
//                         </span>
//                         <h2 className="text-xl font-black text-white tracking-tight">
//                             {gatewayUrl ? "Complete Checkout" : "Select Payment Gateway"}
//                         </h2>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         {gatewayUrl && (
//                             <a
//                                 href={gatewayUrl}
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
//                                 title="Open in new window"
//                             >
//                                 <ExternalLink size={18} />
//                             </a>
//                         )}
//                         <button
//                             onClick={() => {
//                                 setGatewayUrl(null);
//                                 onClose();
//                             }}
//                             className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
//                         >
//                             <X size={18} />
//                         </button>
//                     </div>
//                 </div>

//                 {errorMessage && (
//                     <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
//                         {errorMessage}
//                     </div>
//                 )}

//                 {/* Embedded Gateway Frame */}
//                 {gatewayUrl ? (
//                     <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-inner relative">
//                         <iframe
//                             src={gatewayUrl}
//                             title="Payment Checkout Gateway"
//                             className="w-full h-full border-0 rounded-2xl bg-[#0f172a]"
//                         />
//                     </div>
//                 ) : (
//                     <>
//                         <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 flex items-center justify-between">
//                             <div>
//                                 <span className="text-[11px] font-bold text-slate-400 block">Total Due Amount</span>
//                                 <span className="text-2xl font-black text-white">${Number(order.totalAmount || order.price || 0).toFixed(2)}</span>
//                             </div>
//                             <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
//                                 Slot: {order.quantity || 1}
//                             </span>
//                         </div>

//                         <div className="space-y-3 mb-7">
//                             <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
//                                 Select Payment Method
//                             </label>

//                             <div
//                                 onClick={() => setSelectedGateway("STRIPE")}
//                                 className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedGateway === "STRIPE"
//                                     ? "bg-indigo-600/15 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
//                                     : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
//                                     }`}
//                             >
//                                 <div className="flex items-center gap-3.5">
//                                     <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
//                                         <CreditCard size={20} />
//                                     </div>
//                                     <div>
//                                         <h4 className="text-sm font-black text-white">Stripe International</h4>
//                                         <p className="text-[11px] text-slate-400 font-medium">Visa, Mastercard, American Express</p>
//                                     </div>
//                                 </div>
//                                 <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === "STRIPE" ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-700"
//                                     }`}>
//                                     {selectedGateway === "STRIPE" && <CheckCircle2 size={13} />}
//                                 </div>
//                             </div>

//                             <div
//                                 onClick={() => setSelectedGateway("SSLCOMMERZ")}
//                                 className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedGateway === "SSLCOMMERZ"
//                                     ? "bg-emerald-600/15 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
//                                     : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
//                                     }`}
//                             >
//                                 <div className="flex items-center gap-3.5">
//                                     <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
//                                         <Globe size={20} />
//                                     </div>
//                                     <div>
//                                         <h4 className="text-sm font-black text-white">SSLCommerz Digital Pay</h4>
//                                         <p className="text-[11px] text-slate-400 font-medium">bKash, Nagad, Rocket, Local Banking</p>
//                                     </div>
//                                 </div>
//                                 <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === "SSLCOMMERZ" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-700"
//                                     }`}>
//                                     {selectedGateway === "SSLCOMMERZ" && <CheckCircle2 size={13} />}
//                                 </div>
//                             </div>
//                         </div>

//                         <button
//                             disabled={isLoading}
//                             onClick={handlePayNow}
//                             className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
//                         >
//                             {isLoading ? (
//                                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                             ) : (
//                                 `Proceed to Pay $${Number(order.totalAmount || order.price || 0).toFixed(2)}`
//                             )}
//                         </button>
//                     </>
//                 )}

//                 <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
//                     <ShieldCheck size={14} className="text-emerald-400" />
//                     <span>256-Bit Encrypted Gateway Session</span>
//                 </div>
//             </div>
//         </div>
//     );
// }




import React, { useState } from "react";
import {
    X,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    Globe,
    ExternalLink
} from "lucide-react";
import { createStripeSessionApi, createSSLCommerzSessionApi } from "../../api/servicesApi";

export default function ServiceDetailsModal({ isOpen, onClose, order }) {
    if (!isOpen || !order) return null;

    const [selectedGateway, setSelectedGateway] = useState("STRIPE");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [gatewayUrl, setGatewayUrl] = useState(null);

    const handlePayNow = async () => {
        setIsLoading(true);
        setErrorMessage("");

        const orderId = order.id || order._id;

        try {
            if (selectedGateway === "STRIPE") {
                const res = await createStripeSessionApi(orderId);
                const url = res?.data?.checkoutUrl || res?.checkoutUrl;
                if (url) {
                    setGatewayUrl(url);
                } else {
                    throw new Error("Stripe checkout URL not returned");
                }
            } else {
                const res = await createSSLCommerzSessionApi(orderId);
                const url = res?.data?.checkoutUrl || res?.checkoutUrl;
                if (url) {
                    setGatewayUrl(url);
                } else {
                    throw new Error("SSLCommerz checkout URL not returned");
                }
            }
        } catch (err) {
            setErrorMessage(err?.response?.data?.message || err?.message || "Failed to initialize payment gateway");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in font-sans">
            <div className={`relative w-full ${gatewayUrl ? "max-w-4xl h-[90vh]" : "max-w-lg"} bg-white border border-blue-100 rounded-[2.5rem] p-7 sm:p-9 shadow-[0_25px_80px_rgba(37,99,235,0.2)] text-slate-900 flex flex-col transition-all duration-300 overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                            {gatewayUrl ? `${selectedGateway} Secure Session` : "Secure Gateway Checkout"}
                        </span>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            {gatewayUrl ? "Complete Checkout" : "Select Payment Gateway"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {gatewayUrl && (
                            <a
                                href={gatewayUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-blue-50 hover:bg-indigo-100 text-indigo-600 transition border border-blue-100"
                                title="Open in new window"
                            >
                                <ExternalLink size={18} />
                            </a>
                        )}
                        <button
                            onClick={() => {
                                setGatewayUrl(null);
                                onClose();
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition cursor-pointer border border-slate-200"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                        {errorMessage}
                    </div>
                )}

                {gatewayUrl ? (
                    <div className="flex-1 w-full rounded-2xl overflow-hidden border border-blue-100 bg-slate-50 shadow-inner relative">
                        <iframe
                            src={gatewayUrl}
                            title="Payment Checkout Gateway"
                            className="w-full h-full border-0 rounded-2xl bg-white"
                        />
                    </div>
                ) : (
                    <>
                        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 border border-indigo-400 mb-6 flex items-center justify-between overflow-hidden shadow-lg shadow-indigo-200">
                            <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <span className="text-[11px] font-bold text-blue-100 block">
                                    Total Due Amount
                                </span>
                                <span className="text-2xl font-black text-white">
                                    ${Number(order.totalAmount || order.price || 0).toFixed(2)}
                                </span>
                            </div>
                            <span className="relative z-10 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold">
                                Slot: {order.quantity || 1}
                            </span>
                        </div>

                        <div className="space-y-3 mb-7">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Select Payment Method
                            </label>

                            <div
                                onClick={() => setSelectedGateway("STRIPE")}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedGateway === "STRIPE"
                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-400 shadow-md shadow-indigo-100"
                                        : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-300 flex items-center justify-center text-white shadow-md shadow-blue-100">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">Stripe International</h4>
                                        <p className="text-[11px] text-slate-500 font-medium">Visa, Mastercard, American Express</p>
                                    </div>
                                </div>
                                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === "STRIPE"
                                        ? "border-indigo-600 bg-indigo-600 text-white"
                                        : "border-slate-300"
                                    }`}>
                                    {selectedGateway === "STRIPE" && <CheckCircle2 size={13} />}
                                </div>
                            </div>

                            <div
                                onClick={() => setSelectedGateway("SSLCOMMERZ")}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${selectedGateway === "SSLCOMMERZ"
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400 shadow-md shadow-emerald-100"
                                        : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-300 flex items-center justify-center text-white shadow-md shadow-emerald-100">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">SSLCommerz Digital Pay</h4>
                                        <p className="text-[11px] text-slate-500 font-medium">bKash, Nagad, Rocket, Local Banking</p>
                                    </div>
                                </div>
                                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedGateway === "SSLCOMMERZ"
                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                        : "border-slate-300"
                                    }`}>
                                    {selectedGateway === "SSLCOMMERZ" && <CheckCircle2 size={13} />}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            onClick={handlePayNow}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                `Proceed to Pay $${Number(order.totalAmount || order.price || 0).toFixed(2)}`
                            )}
                        </button>
                    </>
                )}

                <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>256-Bit Encrypted Gateway Session</span>
                </div>
            </div>
        </div>
    );
}
