'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { analyticsApi, taskApi } from '@/lib/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSignalR } from '@/hooks/useSignalR';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [summaryRes, statusRes, perfRes] = await Promise.all([
                analyticsApi.get('/analytics/task-summary'),
                analyticsApi.get('/analytics/tasks-by-status'),
                analyticsApi.get('/analytics/user-performance')
            ]);

            setStats(summaryRes.data);

            // Transform status data for PieChart
            const statusMap = statusRes.data;
            setStatusData(Object.keys(statusMap).map((key) => ({
                name: key,
                value: statusMap[key]
            })));

            setPerformanceData(perfRes.data.map((item: any) => ({
                user: `User ${item.user_id}`,
                count: item.task_count
            })));

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useSignalR(() => {
        fetchDashboardData();
    });

    const statCards = [
        { label: 'Total Events', value: stats?.total_events || 0, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Completed', value: statusData.find(d => d.name === 'Done')?.value || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'In Progress', value: statusData.find(d => d.name === 'InProgress')?.value || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Overdue', value: 0, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    ];

    if (loading) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
                    <p className="text-slate-400 mt-1">Real-time performance metrics and task distribution</p>
                </div>
                <Link
                    href="/analytics"
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                    <TrendingUp className="w-4 h-4" />
                    Generate Report
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                                +12% <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
                        <div className="text-slate-400 text-sm font-medium">{card.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">Task Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {statusData.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-xs text-slate-400 font-medium">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Performance */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">Team Performance</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="user"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
