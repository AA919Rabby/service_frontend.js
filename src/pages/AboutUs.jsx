import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    ShieldCheck,
    CreditCard,
    Headphones,
    ArrowLeft,
    CheckCircle2,
    Users,
    Zap,
    RotateCcw,
    Lock
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
            if (!canvas) return;
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
                color: ["#6366f1", "#38bdf8", "#818cf8", "#94a3b8"][Math.floor(Math.random() * 4)],
            });
        }

        const maxDistance = 140;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "#030712";
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = "rgba(99, 102, 241, 0.025)";
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
                ctx.globalAlpha = 0.5;
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
                        ctx.globalAlpha = (1 - dist / maxDistance) * 0.15;
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
        <div className="relative min-h-screen w-full bg-[#030712] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none block" />

            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/10 via-blue-700/5 to-transparent blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-700/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none" />

            <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer"
                    >
                        <ArrowLeft size={20} /> Back
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-lg font-black tracking-tight text-white">TN Services</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <Sparkles size={14} /> Certified Digital Marketplace
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        Connecting Clients with Verified Service Professionals.
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        TN Services is a high-reliability service platform built to eliminate friction in booking, management, and fulfillment of on-demand professional tasks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_50px_rgba(3,7,18,0.7)] backdrop-blur-xl">
                        <div className="w-full h-full bg-[#0b0f19]/90 rounded-[1.95rem] p-7 space-y-3 border border-slate-700/40">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Pre-Vetted Specialists</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Every service specialist undergoes strict identity verification, review scoring, and background auditing before accepting bookings.
                            </p>
                        </div>
                    </div>

                    <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_50px_rgba(3,7,18,0.7)] backdrop-blur-xl">
                        <div className="w-full h-full bg-[#0b0f19]/90 rounded-[1.95rem] p-7 space-y-3 border border-slate-700/40">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <CreditCard size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Escrow Settlement</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Payments through Stripe and SSLCommerz remain protected. Funds are only confirmed once the client verifies completed work.
                            </p>
                        </div>
                    </div>

                    <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_50px_rgba(3,7,18,0.7)] backdrop-blur-xl">
                        <div className="w-full h-full bg-[#0b0f19]/90 rounded-[1.95rem] p-7 space-y-3 border border-slate-700/40">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <RotateCcw size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Instant Stock Refunds</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Need to cancel? Our automated ledger instantly restores reservation inventory and triggers an automatic refund return.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_80px_rgba(3,7,18,0.9)] backdrop-blur-2xl">
                    <div className="w-full h-full bg-[#0b0f19]/90 rounded-[2.45rem] p-8 sm:p-12 border border-slate-700/40 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-xl">
                            <h2 className="text-2xl sm:text-3xl font-black text-white">
                                Reliable appointments, guaranteed peace of mind.
                            </h2>
                            <div className="space-y-2.5 text-xs text-slate-300">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    <span>100% money-back guarantee for incomplete appointments</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    <span>Stripe International Card &amp; SSLCommerz (bKash/Nagad/Rocket)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    <span>Integrated AI Chat Assistant for automated service queries</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/dashboard"
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(99,102,241,0.4)] whitespace-nowrap"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}