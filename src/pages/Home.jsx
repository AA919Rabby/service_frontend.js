import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-indigo-500 selection:text-white">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-[0_0_30px_rgba(99,102,241,0.35)] mb-6 text-white">
                S
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                Service Marketplace Platform
            </h1>

            <div className="flex gap-4">
                <Link
                    to="/register"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200"
                >
                    Go to Register Page →
                </Link>
            </div>
        </div>
    );
}