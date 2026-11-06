// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function Home() {
//     return (
//         <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-indigo-500 selection:text-white">
//             <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-[0_0_30px_rgba(99,102,241,0.35)] mb-6 text-white">
//                 S
//             </div>
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
//                 Service Marketplace Platform
//             </h1>

//             <div className="flex gap-4">
//                 <Link
//                     to="/register"
//                     className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
//                 >
//                     Go to Register Page →
//                 </Link>
//             </div>
//         </div>
//     );
// }


import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Users,
    Sparkles,
    BriefcaseBusiness,
} from 'lucide-react';

export default function Home() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-6 py-16 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100/40 blur-3xl" />

                <div
                    className="absolute inset-0 opacity-[0.35]"
                    style={{
                        backgroundImage:
                            'radial-gradient(#94a3b8 0.8px, transparent 0.8px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            {/* Main Content */}
            <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">

                {/* Brand Logo */}
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 text-4xl font-extrabold text-white shadow-xl shadow-indigo-600/25 ring-8 ring-white">
                    S
                </div>

                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
                    <Sparkles size={16} />
                    Your Trusted Service Marketplace
                </div>

                {/* Heading */}
                <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Find the Right Services
                    <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                        All in One Place.
                    </span>
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    Discover trusted professionals, explore quality services,
                    and find the right solutions for your everyday needs.
                    Your next service experience starts here.
                </p>

                {/* CTA */}
                <div className="mt-9 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
                    <Link
                        to="/register"
                        className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition duration-300 hover:-translate-y-1 hover:from-indigo-500 hover:to-blue-500 hover:shadow-xl hover:shadow-indigo-600/30"
                    >
                        Get Started
                        <ArrowRight
                            size={20}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        Trusted Services
                    </div>

                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-blue-600" />
                        Easy to Use
                    </div>

                    <div className="flex items-center gap-2">
                        <Zap size={18} className="text-amber-500" />
                        Quick Access
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="mt-16 grid w-full grid-cols-1 gap-5 sm:grid-cols-3">

                    <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-left shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                            <BriefcaseBusiness size={23} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                            Quality Services
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Explore services designed to meet your needs.
                        </p>
                    </div>

                    <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-left shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                            <Users size={23} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                            Trusted Professionals
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Connect with service providers in one place.
                        </p>
                    </div>

                    <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-left shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                            <Zap size={23} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900">
                            Simple Experience
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Find and explore services with ease.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <footer className="mt-16 border-t border-slate-200 pt-6 text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Service Marketplace Platform.
                        All rights reserved.
                    </p>
                </footer>

            </main>
        </div>
    );
}