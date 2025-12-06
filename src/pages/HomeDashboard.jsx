import React from 'react';
import { AlertTriangle, Clock, FileText } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const HomeDashboard = () => {
    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Welcome to ARCA Compliance Agent</h2>
                        <p className="text-slate-300 max-w-2xl">Your automated auditing assistant is ready. You have 3 pending reports and 12 policies analyzed today.</p>
                        <button className="mt-6 px-4 py-2 bg-arca-600 hover:bg-arca-500 rounded-lg font-medium text-sm transition-colors shadow-lg hover:shadow-arca-500/25">
                            Start New Audit
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-arca-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard
                        title="Total Policies Loaded"
                        value="142"
                        trend="+12% from last month"
                        icon={FileText}
                        color="text-blue-600"
                        bg="bg-blue-50"
                    />
                    <KpiCard
                        title="Conflicts Detected"
                        value="8"
                        trend="2 Critical attention needed"
                        icon={AlertTriangle}
                        color="text-amber-600"
                        bg="bg-amber-50"
                    />
                    <KpiCard
                        title="Last Analysis"
                        value="2 hrs ago"
                        trend="Audit Report #2931"
                        icon={Clock}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                    />
                </div>

                {/* Recent Activity Section Placeholder */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[300px]">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Audit Activity</h3>
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <p>Activity timeline will appear here.</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const KpiCard = ({ title, value, trend, icon: Icon, color, bg }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-default">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">Daily</span>
        </div>
        <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
            <p className="text-xs text-slate-500">{trend}</p>
        </div>
    </div>
);

export default HomeDashboard;
