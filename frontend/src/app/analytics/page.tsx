'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Legend
} from 'recharts';
import {
    BarChart3,
    Download,
    Calendar,
    Filter as FilterIcon,
    RefreshCcw,
    FileSpreadsheet,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const [trends, setTrends] = useState<any[]>([]);
    const [completionRate, setCompletionRate] = useState('0%');
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const [trendsRes, rateRes] = await Promise.all([
                analyticsApi.get('/analytics/tasks-by-date'),
                analyticsApi.get('/analytics/completion-rate')
            ]);

            // Transform date data for LineChart
            const dateMap = trendsRes.data;
            const sortedDates = Object.keys(dateMap).sort();
            setTrends(sortedDates.map(date => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                count: dateMap[date]
            })));

            setCompletionRate(rateRes.data.completion_rate);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleExport = async (format: 'csv' | 'pdf') => {
        try {
            if (format === 'csv') {
                const response = await analyticsApi.get('/reports/export/csv', {
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'task-report.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                const res = await analyticsApi.get('/reports/export/pdf');
                alert(`${res.data.message}\n\nA professional PDF engine (like ReportLab or WeasyPrint) can now convert the current data trends into a branded PDF document.\n\nMock Path: ${res.data.download_url}`);
            }
        } catch (error) {
            console.error('Export failed', error);
            alert('Export failed. Please ensure the Analytics Service is running.');
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Reports</h1>
                    <p className="text-slate-400 mt-1">Detailed performance trends and exportable summaries</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAnalytics}
                        className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>

                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1">
                        <button
                            onClick={() => handleExport('csv')}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                            CSV
                        </button>
                        <div className="w-px h-4 bg-white/10" />
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <FileText className="w-4 h-4 text-rose-400" />
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-semibold text-white">Task Activity Trends</h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            Last 30 Days
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-blue-500/20">
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-slate-400 text-sm font-medium">Completion Rate</h4>
                                <div className="text-3xl font-bold text-white">{completionRate}</div>
                            </div>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: completionRate }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                        <p className="text-xs text-slate-500">Target: 85% by end of month</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <h4 className="text-white font-semibold mb-6">Quick Insights</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Highest Busy Day', value: trends.length > 0 ? trends.reduce((max, obj) => max.count > obj.count ? max : obj).date : 'N/A' },
                                { label: 'Active Users', value: '12 Team Members' },
                                { label: 'Open Issues', value: '8 High Priority' }
                            ].map((item) => (
                                <li key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <span className="text-sm text-slate-400">{item.label}</span>
                                    <span className="text-sm font-bold text-white">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
