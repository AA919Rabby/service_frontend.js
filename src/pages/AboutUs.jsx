// import React, { useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//     Sparkles,
//     ShieldCheck,
//     CreditCard,
//     Headphones,
//     ArrowLeft,
//     CheckCircle2,
//     Users,
//     Zap,
//     RotateCcw,
//     Lock
// } from "lucide-react";

// export default function AboutUsPage() {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;

//         let animationFrameId;
//         let width = (canvas.width = window.innerWidth);
//         let height = (canvas.height = window.innerHeight);

//         const handleResize = () => {
//             if (!canvas) return;
//             width = canvas.width = window.innerWidth;
//             height = canvas.height = window.innerHeight;
//         };

//         window.addEventListener("resize", handleResize);

//         const nodeCount = Math.floor((width * height) / 22000);
//         const nodes = [];

//         for (let i = 0; i < Math.max(nodeCount, 45); i++) {
//             nodes.push({
//                 x: Math.random() * width,
//                 y: Math.random() * height,
//                 vx: (Math.random() - 0.5) * 0.35,
//                 vy: (Math.random() - 0.5) * 0.35,
//                 radius: Math.random() * 1.5 + 1,
//                 color: ["#6366f1", "#38bdf8", "#818cf8", "#94a3b8"][Math.floor(Math.random() * 4)],
//             });
//         }

//         const maxDistance = 140;

//         const render = () => {
//             ctx.clearRect(0, 0, width, height);

//             ctx.fillStyle = "#030712";
//             ctx.fillRect(0, 0, width, height);

//             ctx.strokeStyle = "rgba(99, 102, 241, 0.025)";
//             ctx.lineWidth = 1;
//             const gridSize = 60;
//             for (let x = 0; x < width; x += gridSize) {
//                 ctx.beginPath();
//                 ctx.moveTo(x, 0);
//                 ctx.lineTo(x, height);
//                 ctx.stroke();
//             }
//             for (let y = 0; y < height; y += gridSize) {
//                 ctx.beginPath();
//                 ctx.moveTo(0, y);
//                 ctx.lineTo(width, y);
//                 ctx.stroke();
//             }

//             for (let i = 0; i < nodes.length; i++) {
//                 const node = nodes[i];

//                 node.x += node.vx;
//                 node.y += node.vy;

//                 if (node.x <= 0 || node.x >= width) node.vx *= -1;
//                 if (node.y <= 0 || node.y >= height) node.vy *= -1;

//                 ctx.beginPath();
//                 ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
//                 ctx.fillStyle = node.color;
//                 ctx.globalAlpha = 0.5;
//                 ctx.fill();

//                 for (let j = i + 1; j < nodes.length; j++) {
//                     const other = nodes[j];
//                     const dx = node.x - other.x;
//                     const dy = node.y - other.y;
//                     const dist = Math.sqrt(dx * dx + dy * dy);

//                     if (dist < maxDistance) {
//                         ctx.beginPath();
//                         ctx.moveTo(node.x, node.y);
//                         ctx.lineTo(other.x, other.y);
//                         ctx.strokeStyle = node.color;
//                         ctx.globalAlpha = (1 - dist / maxDistance) * 0.15;
//                         ctx.lineWidth = 0.75;
//                         ctx.stroke();
//                     }
//                 }
//             }

//             ctx.globalAlpha = 1;
//             animationFrameId = requestAnimationFrame(render);
//         };

//         render();

//         return () => {
//             cancelAnimationFrame(animationFrameId);
//             window.removeEventListener("resize", handleResize);
//         };
//     }, []);

//     return (
//         <div className="relative min-h-screen w-full bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white overflow-hidden">
//             <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none block" />

//             <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/10 via-blue-700/5 to-transparent blur-[140px] pointer-events-none" />
//             <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-700/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none" />

//             <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
//                     <Link
//                         to="/dashboard"
//                         className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer"
//                     >
//                         <ArrowLeft size={20} /> Back
//                     </Link>

//                     <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
//                             <Sparkles size={20} />
//                         </div>
//                         <span className="text-lg font-black tracking-tight text-white">TN Services</span>
//                     </div>
//                 </div>
//             </header>

//             <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
//                 <div className="text-center max-w-2xl mx-auto space-y-4">
//                     <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)]">
//                         <Sparkles size={14} /> Certified Digital Marketplace
//                     </div>
//                     <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
//                         Connecting Clients with Verified Service Professionals.
//                     </h1>
//                     <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
//                         TN Services is a high-reliability service platform built to eliminate friction in booking, management, and fulfillment of on-demand professional tasks.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_50px_rgba(3,7,18,0.7)] backdrop-blur-xl">
//                         <div className="w-full h-full bg-[#0b0f19]/90 rounded-[1.95rem] p-7 space-y-3 border border-slate-700/40">
//                             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
//                                 <ShieldCheck size={24} />
//                             </div>
//                             <h3 className="text-lg font-bold text-white">Pre-Vetted Specialists</h3>
//                             <p className="text-xs text-slate-400 leading-relaxed">
//                                 Every service specialist undergoes strict identity verification, review scoring, and background auditing before accepting bookings.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_50px_rgba(3,7,18,0.7)] backdrop-blur-xl">
//                         <div className="w-full h-full bg-[#0b0f19]/90 rounded-[1.95rem] p-7 space-y-3 border border-slate-700/40">
//                             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
//                                 <CreditCard size={24} />
//                             </div>
//                             <h3 className="text-lg font-bold text-white">Escrow Settlement</h3>
//                             <p className="text-xs text-slate-400 leading-relaxed">
//                                 Payments through Stripe and SSLCommerz remain protected. Funds are only confirmed once the client verifies completed work.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_50px_rgba(3,7,18,0.7)] backdrop-blur-xl">
//                         <div className="w-full h-full bg-[#0b0f19]/90 rounded-[1.95rem] p-7 space-y-3 border border-slate-700/40">
//                             <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
//                                 <RotateCcw size={24} />
//                             </div>
//                             <h3 className="text-lg font-bold text-white">Instant Stock Refunds</h3>
//                             <p className="text-xs text-slate-400 leading-relaxed">
//                                 Need to cancel? Our automated ledger instantly restores reservation inventory and triggers an automatic refund return.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_80px_rgba(3,7,18,0.9)] backdrop-blur-2xl">
//                     <div className="w-full h-full bg-[#0b0f19]/90 rounded-[2.45rem] p-8 sm:p-12 border border-slate-700/40 flex flex-col md:flex-row items-center justify-between gap-8">
//                         <div className="space-y-4 max-w-xl">
//                             <h2 className="text-2xl sm:text-3xl font-black text-white">
//                                 Reliable appointments, guaranteed peace of mind.
//                             </h2>
//                             <div className="space-y-2.5 text-xs text-slate-300">
//                                 <div className="flex items-center gap-2">
//                                     <CheckCircle2 size={16} className="text-emerald-400" />
//                                     <span>100% money-back guarantee for incomplete appointments</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <CheckCircle2 size={16} className="text-emerald-400" />
//                                     <span>Stripe International Card &amp; SSLCommerz (bKash/Nagad/Rocket)</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <CheckCircle2 size={16} className="text-emerald-400" />
//                                     <span>Integrated AI Chat Assistant for automated service queries</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <Link
//                             to="/dashboard"
//                             className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(99,102,241,0.4)] whitespace-nowrap"
//                         >
//                             Explore Marketplace
//                         </Link>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }




import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    ShieldCheck,
    CreditCard,
    ArrowLeft,
    CheckCircle2,
    RotateCcw,
} from "lucide-react";

export default function AboutUsPage() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        const nodeCount = Math.floor((width * height) / 22000);
        const nodes = [];

        for (let i = 0; i < Math.max(nodeCount, 45); i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 1.5 + 1,
                color: ["#6366f1", "#38bdf8", "#818cf8", "#a78bfa"][
                    Math.floor(Math.random() * 4)
                ],
            });
        }

        const maxDistance = 140;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = "rgba(99, 102, 241, 0.045)";
            ctx.lineWidth = 1;

            const gridSize = 60;

            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];

                node.x += node.vx;
                node.y += node.vy;

                if (node.x <= 0 || node.x >= width) node.vx *= -1;
                if (node.y <= 0 || node.y >= height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.globalAlpha = 0.35;
                ctx.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];

                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = node.color;
                        ctx.globalAlpha = (1 - dist / maxDistance) * 0.12;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 pb-20 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 z-0 block"
            />

            <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-400/15 via-blue-400/10 to-transparent blur-[140px]" />

            <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-purple-400/15 via-indigo-400/10 to-transparent blur-[140px]" />

            <header className="sticky top-0 z-30 border-b border-indigo-100/70 bg-white/85 shadow-sm shadow-indigo-100/20 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">

                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200">
                            <Sparkles size={20} />
                        </div>

                        <span className="text-lg font-black tracking-tight text-slate-900">
                            TN Services
                        </span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-5xl space-y-12 px-4 pt-12 sm:px-6">

                <div className="mx-auto max-w-2xl space-y-5 text-center">

                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-wider text-indigo-700 shadow-lg shadow-indigo-100/60">
                        <Sparkles size={14} className="text-indigo-500" />
                        Certified Digital Marketplace
                    </div>

                    <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                        Connecting Clients with{" "}
                        <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                            Verified Service Professionals.
                        </span>
                    </h1>

                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                        TN Services is a high-reliability service platform built
                        to eliminate friction in booking, management, and
                        fulfillment of on-demand professional tasks.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                    <div className="group relative rounded-[2rem] border border-indigo-100 bg-white/90 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/70">

                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 transition group-hover:scale-110">
                            <ShieldCheck size={24} />
                        </div>

                        <h3 className="mb-3 text-lg font-bold text-slate-900">
                            Pre-Vetted Specialists
                        </h3>

                        <p className="text-xs leading-relaxed text-slate-600">
                            Every service specialist undergoes strict identity
                            verification, review scoring, and background
                            auditing before accepting bookings.
                        </p>
                    </div>

                    <div className="group relative rounded-[2rem] border border-emerald-100 bg-white/90 p-7 shadow-xl shadow-emerald-100/30 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/60">

                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 transition group-hover:scale-110">
                            <CreditCard size={24} />
                        </div>

                        <h3 className="mb-3 text-lg font-bold text-slate-900">
                            Escrow Settlement
                        </h3>

                        <p className="text-xs leading-relaxed text-slate-600">
                            Payments through Stripe and SSLCommerz remain
                            protected. Funds are only confirmed once the
                            client verifies completed work.
                        </p>
                    </div>

                    <div className="group relative rounded-[2rem] border border-amber-100 bg-white/90 p-7 shadow-xl shadow-amber-100/30 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-100/60">

                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 transition group-hover:scale-110">
                            <RotateCcw size={24} />
                        </div>

                        <h3 className="mb-3 text-lg font-bold text-slate-900">
                            Instant Stock Refunds
                        </h3>

                        <p className="text-xs leading-relaxed text-slate-600">
                            Need to cancel? Our automated ledger instantly
                            restores reservation inventory and triggers an
                            automatic refund return.
                        </p>
                    </div>
                </div>

                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-[1px] shadow-2xl shadow-indigo-200/60">

                    <div className="flex h-full w-full flex-col items-center justify-between gap-8 rounded-[2.45rem] bg-white/95 p-8 backdrop-blur-xl sm:p-12 md:flex-row">

                        <div className="max-w-xl space-y-5">

                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                                <ShieldCheck size={14} />
                                Your trust is our priority
                            </div>

                            <h2 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                                Reliable appointments, guaranteed peace of mind.
                            </h2>

                            <div className="space-y-3 text-xs text-slate-600">

                                <div className="flex items-start gap-2.5">
                                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                                    <span>
                                        100% money-back guarantee for incomplete appointments
                                    </span>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                                    <span>
                                        Stripe International Card &amp; SSLCommerz (bKash/Nagad/Rocket)
                                    </span>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                                    <span>
                                        Integrated AI Chat Assistant for automated service queries
                                    </span>
                                </div>

                            </div>
                        </div>

                        <Link
                            to="/dashboard"
                            className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl hover:shadow-indigo-300"
                        >
                            Explore Marketplace
                        </Link>

                    </div>
                </div>

            </main>
        </div>
    );
}
