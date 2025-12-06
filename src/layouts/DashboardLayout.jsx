import React from 'react';
import {
    LayoutDashboard,
    FileText,
    UploadCloud,
    MessageSquare,
    Settings,
    Bell,
    Search,
    User,
    LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-arca-500 to-arca-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white">A</span>
                        </div>
                        ARCA AI
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 ml-10">Compliance Agent</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        path="/dashboard"
                        isActive={location.pathname === '/dashboard'}
                        onClick={() => navigate('/dashboard')}
                    />
                    <NavItem
                        icon={FileText}
                        label="Policies Analyzer"
                        path="/compare"
                        isActive={location.pathname === '/compare'}
                        onClick={() => navigate('/compare')}
                    />
                    <NavItem
                        icon={UploadCloud}
                        label="Upload Center"
                        path="/upload"
                        isActive={location.pathname === '/upload'}
                        onClick={() => navigate('/upload')}
                    />
                    <NavItem
                        icon={MessageSquare}
                        label="Chat with ARCA"
                        path="/chat"
                        isActive={location.pathname === '/chat'}
                        onClick={() => navigate('/chat')}
                    />
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <NavItem
                            icon={Settings}
                            label="Settings"
                            path="/settings"
                            isActive={location.pathname === '/settings'}
                            onClick={() => navigate('/settings')}
                        />
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-arca-900 flex items-center justify-center border border-slate-700">
                                <User className="w-4 h-4 text-arca-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Admin User</p>
                                <p className="text-[10px] text-slate-400">admin@company.com</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-slate-500 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper (shifted by sidebar width) */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4 w-96">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search policies, reports..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-arca-500/20 focus:border-arca-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-arca-600 text-white shadow-lg shadow-arca-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

export default DashboardLayout;
