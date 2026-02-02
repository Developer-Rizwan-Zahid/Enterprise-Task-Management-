'use client';

import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const publicPaths = ['/', '/login', '/register'];
        if (!loading && !user && !publicPaths.includes(pathname)) {
            router.push('/login');
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register';

    if (isPublicPage) return <>{children}</>;

    return (
        <div className="flex min-h-screen bg-[#09090b]">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

