import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Sparkles,
    AlertCircle,
    Loader2,
    RotateCcw,
    CreditCard,
    Headphones,
    ShieldCheck,
    Eye,
    EyeOff
} from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useGoogleLogin } from "@react-oauth/google";
import { loginApi, googleSignInApi, getErrorMessage } from "../api/authApi";
import tokenService from "../utils/tokenService";

export default function LoginPage() {
    const navigate = useNavigate();
    const turnstileRef = useRef(null);
    const canvasRef = useRef(null);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const [turnstileToken, setTurnstileToken] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const isAnyLoading = isEmailLoading || isGoogleLoading;

    // 🌟 Dark Mode Cyber Network Animation
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

    useEffect(() => {
        setFormData({
            email: "",
            password: "",
            rememberMe: false,
        });

        const timer = setTimeout(() => {
            setFormData((prev) => ({
                ...prev,
                password: "",
            }));
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (errorMessage) setErrorMessage("");
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isAnyLoading) return;

        if (!formData.email || !formData.password) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        setErrorMessage("");
        setIsEmailLoading(true);

        try {
            const response = await loginApi({
                email: formData.email,
                password: formData.password,
                turnstileToken,
            });

            const token =
                response?.token ||
                response?.accessToken ||
                response?.data?.token ||
                response?.data?.accessToken;

            if (!token || response?.success === false) {
                setErrorMessage(response?.message || response?.error || "Login rejected by server.");
                turnstileRef.current?.reset();
                return;
            }

            tokenService.saveAuth(response);
            navigate("/dashboard");
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            turnstileRef.current?.reset();
        } finally {
            setIsEmailLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setErrorMessage("");
            try {
                const response = await googleSignInApi({
                    idToken: tokenResponse.access_token,
                    turnstileToken,
                    mode: "login",
                });

                const authData = response?.data || response;
                const token = authData?.token || authData?.accessToken;

                if (!token || authData?.success === false) {
                    setErrorMessage(authData?.message || "Google sign-in rejected by server.");
                    turnstileRef.current?.reset();
                    return;
                }

                tokenService.saveAuth(authData);
                navigate("/dashboard");
            } catch (error) {
                setErrorMessage(getErrorMessage(error));
                turnstileRef.current?.reset();
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: () => {
            setIsGoogleLoading(false);
        },
        onNonOAuthError: () => {
            setIsGoogleLoading(false);
        },
    });

    return (
        <div className="relative min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden text-slate-100">
            {/* Background Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none block" />

            {/* Ambient Lighting Gradients */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/10 via-blue-700/5 to-transparent blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-700/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none" />

            {/* Dark Glassmorphic Card Container */}
            <div className="relative z-10 w-full max-w-lg p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_80px_rgba(3,7,18,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl transition-all duration-300">
                <div className="w-full h-full bg-[#0b0f19]/90 rounded-[2.45rem] p-7 sm:p-10 border border-slate-700/40 relative overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-6 relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-xs font-bold tracking-wide uppercase mb-3 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <Sparkles size={14} className="text-indigo-400" />
                            <span>Client Service Portal</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                            Sign in to track orders, manage active bookings &amp; view invoices
                        </p>
                    </div>


                    {/* Google Button */}
                    <div className="relative z-10">
                        <button
                            type="button"
                            disabled={isAnyLoading}
                            onClick={() => {
                                if (!isAnyLoading) {
                                    setIsGoogleLoading(true);
                                    googleLogin();
                                }
                            }}
                            className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800 active:bg-slate-750 text-slate-200 font-semibold text-xs transition-all shadow-inner mb-5 cursor-pointer ${isAnyLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                                }`}
                        >
                            {isGoogleLoading ? (
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Connecting Google...</span>
                                </div>
                            ) : (
                                <>
                                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.8 5 12 5z" />
                                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                                        <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-6.1z" />
                                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 20 7.4 23 12 23z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                        <div className="relative flex items-center justify-center my-6">
                            <div className="w-full border-t border-slate-800" />
                            <span className="relative bg-[#0b0f19] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                or sign in with email
                            </span>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 relative z-10 animate-in fade-in duration-200">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 relative z-10">
                        <input type="text" name="fakeusernameremembered" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                        <input type="password" name="fakepasswordremembered" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                                Work or Personal Email
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <Mail size={17} />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    disabled={isAnyLoading}
                                    placeholder="you@domain.com"
                                    autoComplete="off"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full py-3.5 pl-11 pr-4 rounded-2xl bg-slate-900/70 text-white text-xs font-semibold outline-none border border-slate-700/60 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-slate-500 shadow-inner"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <Lock size={17} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    disabled={isAnyLoading}
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full py-3.5 pl-11 pr-11 rounded-2xl bg-slate-900/70 text-white text-xs font-semibold outline-none border border-slate-700/60 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-slate-500 shadow-inner"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-slate-400 hover:text-slate-200 transition"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    disabled={isAnyLoading}
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                />
                                <span className="text-xs font-medium text-slate-400">Remember for 30 days</span>
                            </label>

                            <Link
                                to={isAnyLoading ? "#" : "/forgot-password"}
                                className={`text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline ${isAnyLoading ? "opacity-50 pointer-events-none" : ""
                                    }`}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <div className="flex justify-center py-2">
                            <Turnstile
                                ref={turnstileRef}
                                siteKey={import.meta.env.VITE_CLOUDFLARE_SITE_KEY}
                                options={{ theme: "dark" }}
                                onSuccess={(token) => setTurnstileToken(token)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isAnyLoading}
                            className={`w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer ${isAnyLoading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            {isEmailLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign In to Client Portal"
                            )}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-xs font-semibold text-slate-400 relative z-10">
                        New to TN Services?{" "}
                        <Link
                            to={isAnyLoading ? "#" : "/register"}
                            className={`text-indigo-400 hover:text-indigo-300 hover:underline font-bold ${isAnyLoading ? "opacity-50 pointer-events-none" : ""
                                }`}
                        >
                            Create an account
                        </Link>
                    </p>

                    <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>SSL 256-Bit Protection</span>
                        </div>
                        <div>
                            TN Services • Designed by <span className="font-bold text-slate-200">Md Rabbi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}