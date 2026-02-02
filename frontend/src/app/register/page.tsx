'use client';

import { useState } from 'react';
import { taskApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, User, Lock, Mail, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Employee'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await taskApi.post('/Auth/register', formData);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-4">
                        <UserPlus className="w-8 h-8 text-violet-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 mt-2">Join our platform to start managing tasks</p>
                </div>

                {error && (
                    <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <User className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Email Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Briefcase className="w-5 h-5" />
                            </span>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                            >
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-400 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
