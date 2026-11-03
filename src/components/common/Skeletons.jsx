import React from "react";

// 1. Single Service Card Skeleton (Dark Theme)
export function ServiceCardSkeleton() {
    return (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-[420px] animate-pulse">
            <div>
                {/* Image Placeholder */}
                <div className="h-44 w-full rounded-2xl bg-slate-800/80 mb-4 border border-slate-800/60" />

                {/* Category Pill & Rating Placeholder */}
                <div className="flex items-center justify-between mb-3">
                    <div className="h-6 w-20 rounded-lg bg-slate-800" />
                    <div className="h-4 w-12 rounded-md bg-slate-800" />
                </div>

                {/* Title Line */}
                <div className="h-5 w-3/4 rounded-md bg-slate-800 mb-2.5" />

                {/* Description Lines */}
                <div className="space-y-1.5">
                    <div className="h-3.5 w-full rounded bg-slate-800/70" />
                    <div className="h-3.5 w-4/5 rounded bg-slate-800/70" />
                </div>
            </div>

            {/* Bottom Price & Button Row */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                    <div className="h-2.5 w-14 rounded bg-slate-800" />
                    <div className="h-7 w-20 rounded-lg bg-slate-800" />
                </div>
                <div className="h-9 w-28 rounded-xl bg-slate-800" />
            </div>
        </div>
    );
}

// 2. Services Grid (6-Card Dark Skeleton Grid)
export function ServicesGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
                <ServiceCardSkeleton key={i} />
            ))}
        </div>
    );
}

// 3. Category Filter Tabs Skeleton (Dark Theme)
export function CategoryTabsSkeleton() {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none animate-pulse">
            <div className="h-9 w-24 rounded-xl bg-slate-800 shrink-0 border border-slate-800/60" />
            <div className="h-9 w-28 rounded-xl bg-slate-800 shrink-0 border border-slate-800/60" />
            <div className="h-9 w-24 rounded-xl bg-slate-800 shrink-0 border border-slate-800/60" />
            <div className="h-9 w-32 rounded-xl bg-slate-800 shrink-0 border border-slate-800/60" />
            <div className="h-9 w-20 rounded-xl bg-slate-800 shrink-0 border border-slate-800/60" />
            <div className="h-9 w-28 rounded-xl bg-slate-800 shrink-0 border border-slate-800/60" />
        </div>
    );
}

// 4. Drawer User Profile Skeleton (Dark Avatar + Stacked Lines)
export function DrawerProfileSkeleton() {
    return (
        <div className="flex items-center gap-3 animate-pulse">
            <div className="h-11 w-11 rounded-full bg-slate-800 shrink-0 border border-slate-700/60" />
            <div className="flex-1 space-y-2 text-left">
                <div className="h-3.5 w-24 rounded bg-slate-800" />
                <div className="h-2.5 w-36 rounded bg-slate-800/70" />
            </div>
        </div>
    );
}

// 5. Drawer Navigation Links Skeleton (Dark Theme)
export function DrawerNavSkeleton() {
    return (
        <div className="p-4 space-y-2 animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full rounded-2xl bg-slate-900/80 border border-slate-800/60" />
            ))}
        </div>
    );
}

// 6. Floating AI Assistant Button Skeleton (Dark Theme)
export function AiFloatingBtnSkeleton() {
    return (
        <div className="fixed bottom-6 right-6 z-40 p-4 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse shadow-xl flex items-center gap-2.5 h-14 w-14 sm:w-44" />
    );
}