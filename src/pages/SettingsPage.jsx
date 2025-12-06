import React, { useState } from 'react';
import { User, Lock, Bell, Moon, Sun, Shield, Save } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const SettingsPage = () => {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                    <p className="text-slate-500">Manage your profile, security, and preferences.</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-arca-500" />
                            Profile Information
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                <User className="w-10 h-10 text-slate-400" />
                            </div>
                            <div>
                                <button className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors">
                                    Change Avatar
                                </button>
                                <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                <input type="text" defaultValue="Admin" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-arca-500/20 focus:border-arca-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                <input type="text" defaultValue="User" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-arca-500/20 focus:border-arca-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input type="email" defaultValue="admin@company.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500" disabled />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-arca-500" />
                            Security
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                            <div>
                                <h4 className="font-medium text-slate-900">Change Password</h4>
                                <p className="text-sm text-slate-500">Update your password associated with this account.</p>
                            </div>
                            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                                Update
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                            <div>
                                <h4 className="font-medium text-slate-900">API Keys</h4>
                                <p className="text-sm text-slate-500">Manage API keys for external integrations.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">sk_live_...93j1</span>
                                <button className="text-arca-600 text-sm font-medium hover:underline">Reveal</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-arca-500" />
                            Preferences
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Auto-Update Policies</p>
                                    <p className="text-sm text-slate-500">Automatically sync with regulatory changes.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-arca-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arca-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <Moon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Dark Mode</p>
                                    <p className="text-sm text-slate-500">Switch between light and dark themes.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-arca-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-arca-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700">Cancel</button>
                    <button className="px-6 py-2 bg-arca-600 hover:bg-arca-500 text-white font-medium rounded-lg shadow-lg flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
