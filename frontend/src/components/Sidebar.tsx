'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    CheckSquare,
    BarChart3,
    Users,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        ...(user.role === 'Admin' || user.role === 'Manager' ? [{ name: 'Team', href: '/settings', icon: Users }] : []),
    ];

    return (
        <aside className="w-72 h-screen bg-[#09090b] border-r border-white/5 flex flex-col sticky top-0">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <CheckSquare className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Enterprise TMS</span>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-white/5">
                <div className="flex items-center gap-4 px-2 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white truncate w-32">{user.username}</span>
                        <span className="text-xs text-slate-500">{user.role}</span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
