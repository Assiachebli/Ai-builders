import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const PoliciesUpload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([
        { name: 'GDPR_Compliance_2024.pdf', size: '2.4 MB', status: 'completed', date: '2 mins ago' },
        { name: 'Employee_Conduct_v2.docx', size: '1.1 MB', status: 'processing', date: 'Just now' },
        { name: 'Legacy_Policy_2020.txt', size: '0.8 MB', status: 'error', date: '1 hr ago' },
    ]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        // Handle file drop logic here
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Add file mock
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        // Handle file select logic here
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Upload Policies</h2>
                    <p className="text-slate-500">Upload your company documents for AI analysis.</p>
                </div>

                {/* Drag Drop Zone */}
                <div
                    className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${dragActive ? 'border-arca-500 bg-arca-50' : 'border-slate-300 bg-white hover:border-arca-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                    />
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                            <UploadCloud className="w-8 h-8 text-arca-600" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-slate-700">Click to upload or drag and drop</p>
                            <p className="text-sm text-slate-400">PDF, DOCX, TXT (Max 10MB)</p>
                        </div>
                        <button className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                            Select Files
                        </button>
                    </div>
                </div>

                {/* Uploads List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900">Recent Uploads</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {files.map((file, index) => (
                            <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <FileText className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{file.name}</p>
                                        <p className="text-xs text-slate-400">{file.size} • {file.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <StatusBadge status={file.status} />
                                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'completed':
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Loaded
                </span>
            );
        case 'processing':
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <UploadCloud className="w-3.5 h-3.5 animate-bounce" /> Processing...
                </span>
            );
        case 'error':
            return (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                    <AlertCircle className="w-3.5 h-3.5" /> Error
                </span>
            );
        default:
            return null;
    }
};

export default PoliciesUpload;
