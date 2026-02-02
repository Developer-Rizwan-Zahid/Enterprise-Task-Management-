'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskApi } from '@/lib/api';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, refreshToken: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await taskApi.get('/Auth/me');
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (token: string, refreshToken: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        await fetchUser();
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
