'use client';

import { useEffect, useState } from 'react';
import { taskApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    User as UserIcon,
    CheckCircle2,
    Clock,
    AlertCircle,
    Pencil,
    Trash2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalR } from '@/hooks/useSignalR';

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
    const [currentTask, setCurrentTask] = useState<any>(null);
    const { user } = useAuth();

    // Form State
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        dueDate: string;
        assignedToUserId: number | null;
    }>({
        title: '',
        description: '',
        dueDate: '',
        assignedToUserId: null
    });

    const fetchData = async () => {
        try {
            const [tasksRes, usersRes] = await Promise.all([
                taskApi.get('/Tasks'),
                taskApi.get('/Users').catch(() => ({ data: [] })) // Fallback if not authorized
            ]);
            setTasks(tasksRes.data);
            if (usersRes.data.length > 0) setUsers(usersRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useSignalR(() => {
        fetchData();
    });

    const handleOpenCreate = () => {
        setFormData({ title: '', description: '', dueDate: '', assignedToUserId: null });
        setShowModal('create');
    };

    const handleOpenEdit = (task: any) => {
        setCurrentTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            dueDate: new Date(task.dueDate).toISOString().split('T')[0],
            assignedToUserId: task.assignedToUserId
        });
        setShowModal('edit');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (showModal === 'create') {
                await taskApi.post('/Tasks', formData);
            } else {
                await taskApi.put(`/Tasks/${currentTask.id}`, formData);
            }
            setShowModal(null);
            fetchData();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskApi.delete(`/Tasks/${id}`);
            fetchData();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await taskApi.patch(`/Tasks/${id}/status`, `"${status}"`, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchData();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = statusFilter === 'All' || t.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Done': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'InProgress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Todo': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-white/10';
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Tasks</h1>
                    <p className="text-slate-400 mt-1">Manage and track your team's progress</p>
                </div>

                {(user?.role === 'Admin' || user?.role === 'Manager') && (
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Create Task
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    {['All', 'Todo', 'InProgress', 'Done'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${statusFilter === status
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                                }`}
                        >
                            {status === 'InProgress' ? 'In Progress' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                    <motion.div
                        layout
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group hover:border-white/20 transition-all flex flex-col h-full"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(task.status)}`}>
                                {task.status === 'InProgress' ? 'In Progress' : task.status}
                            </span>

                            {(user?.role === 'Admin' || user?.role === 'Manager') && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenEdit(task)}
                                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {task.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
                            {task.description}
                        </p>

                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm">
                                <UserIcon className="w-4 h-4 text-indigo-500" />
                                <span className="truncate">Assigned to: {task.assignedTo?.username || 'Unassigned'}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-[#020617] flex items-center justify-center text-[10px] font-bold text-white">
                                    {task.assignedTo?.username?.substring(0, 2).toUpperCase() || '??'}
                                </div>
                            </div>

                            <div className="relative flex-1 max-w-[140px]">
                                <select
                                    value={task.status}
                                    onChange={(e) => updateStatus(task.id, e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-3 pr-8 text-xs text-slate-400 hover:text-white focus:outline-none cursor-pointer font-medium appearance-none"
                                >
                                    <option value="Todo">Todo</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Filter className="w-3 h-3 text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal Modal (Create/Edit) */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(null)}
                            className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">{showModal === 'create' ? 'Create New Task' : 'Edit Task'}</h2>
                                <button onClick={() => setShowModal(null)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Due Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Assign To</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                                            value={formData.assignedToUserId || ''}
                                            onChange={(e) => setFormData({ ...formData, assignedToUserId: parseInt(e.target.value) || null })}
                                        >
                                            <option value="">Unassigned</option>
                                            {users.map(u => (
                                                <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                                >
                                    {showModal === 'create' ? 'Create Task' : 'Save Changes'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
