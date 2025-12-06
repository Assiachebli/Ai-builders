import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MoreVertical } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const ChatARCA = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello! I am ARCA, your Compliance Assistant. How can I help you regarding company policies today?', time: '10:00 AM' },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newUserMsg = { id: Date.now(), sender: 'user', text: input, time: 'Now' };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const newAiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: 'I have analyzed your request. According to the "IT Security Policy v2", all employees must enable 2FA. Would you like me to draft a reminder email?',
                time: 'Now'
            };
            setMessages(prev => [...prev, newAiMsg]);
        }, 1500);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-arca-500 to-arca-600 rounded-full flex items-center justify-center shadow-sm">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">ARCA Compliance Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-xs text-slate-500">Online • AI-Powered</p>
                            </div>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-slate-200' : 'bg-arca-100'
                                    }`}>
                                    {msg.sender === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-arca-600" />}
                                </div>
                                <div>
                                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-slate-900 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <p className={`text-[10px] text-slate-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your compliance question..."
                            className="w-full pl-5 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-arca-500/20 focus:border-arca-500 transition-all text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-2 p-2 bg-arca-600 text-white rounded-lg hover:bg-arca-500 disabled:opacity-50 disabled:bg-slate-300 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChatARCA;
