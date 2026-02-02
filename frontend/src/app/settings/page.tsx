'use client';

import { useEffect, useState } from 'react';
import { taskApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    Users as UsersIcon,
    Shield,
    Mail,
    UserCheck,
    UserX,
    MoreVertical,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        try {
            const res = await taskApi.get('/Users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (userId: number, newRole: string) => {
        if (currentUser?.role !== 'Admin') return;
        try {
            await taskApi.put(`/Users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            alert('Failed to update role');
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Team Management</h1>
                <p className="text-slate-400 mt-1">Manage users, roles and permissions</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search team members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">User</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Role</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                                            {u.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-white font-medium">{u.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        {u.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className={`w-4 h-4 ${u.role === 'Admin' ? 'text-rose-400' : u.role === 'Manager' ? 'text-amber-400' : 'text-blue-400'}`} />
                                        {currentUser?.role === 'Admin' ? (
                                            <select
                                                value={u.role}
                                                onChange={(e) => updateRole(u.id, e.target.value)}
                                                className="bg-transparent text-sm text-slate-300 hover:text-white focus:outline-none cursor-pointer"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Employee">Employee</option>
                                            </select>
                                        ) : (
                                            <span className="text-slate-300 text-sm">{u.role}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                        {u.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                        {u.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-500 hover:text-white transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
