import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Scale, Mail, Lock, Bot } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login attempt:', email);
        // Simulate login success
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-law-900 via-slate-800 to-arca-900 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-arca-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[60%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl z-10 p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-4 mb-6">
                        {/* AI Identity */}
                        <div className="group relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-arca-500 to-arca-700 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                                <Bot className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-arca-400 opacity-0 group-hover:opacity-100 transition-opacity">AI</div>
                        </div>

                        {/* Connection */}
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>

                        {/* Law Identity */}
                        <div className="group relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-all duration-300">
                                <Scale className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">LAW</div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">ARCA AI</h2>
                    <p className="text-slate-300 text-sm mt-2 font-medium bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10">
                        <Scale className="w-3 h-3 inline mr-1 mb-0.5" />
                        Auditing & Legal Intelligence
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-arca-500 focus:border-transparent transition-all outline-none bg-black/20 text-white placeholder-slate-400 hover:bg-black/30"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-arca-500 focus:border-transparent transition-all outline-none bg-black/20 text-white placeholder-slate-400 hover:bg-black/30"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end mt-1">
                            <a href="#" className="text-xs font-medium text-arca-400 hover:text-arca-300">Forgot password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-arca-600 hover:bg-arca-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        <span>Sign In </span>
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} ARCA AI. Enterprise Edition.
                </div>
            </div>
        </div>
    );
};

export default Login;
