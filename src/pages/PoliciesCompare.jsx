import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const PoliciesCompare = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = () => {
        setAnalyzing(true);
        // Simulate AI delay
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                risk: 'High',
                score: 85,
                conflicts: [
                    'Clause 4.2 contradicts GDPR Article 17 (Right to Erasure).',
                    'Data retention period of "indefinite" is non-compliant.',
                ],
                missing: [
                    'Data Prediction Officer (DPO) contact details.',
                    'Explicit consent withdrawal mechanism.'
                ]
            });
        }, 2000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Policy Analyzer</h2>
                    <p className="text-slate-500">Compare new policies against your compliance database.</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Policy Content or Keyword</label>
                    <textarea
                        className="w-full h-48 p-4 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-arca-500 focus:border-arca-500 transition-all font-mono text-sm resize-none"
                        placeholder="Paste your policy text here for analysis..."
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="px-6 py-2.5 bg-arca-600 hover:bg-arca-500 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {analyzing ? (
                                <>Analyzing...</>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" /> Analyze Risk
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className={`p-6 rounded-xl border-l-4 shadow-sm ${result.risk === 'High' ? 'bg-red-50 border-red-500' :
                                result.risk === 'Medium' ? 'bg-amber-50 border-amber-500' : 'bg-emerald-50 border-emerald-500'
                            }`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className={`text-lg font-bold ${result.risk === 'High' ? 'text-red-800' :
                                            result.risk === 'Medium' ? 'text-amber-800' : 'text-emerald-800'
                                        }`}>
                                        Risk Level: {result.risk}
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-1">Based on comparisons with 142 loaded policies.</p>
                                </div>
                                <div className={`text-3xl font-bold ${result.risk === 'High' ? 'text-red-600' :
                                        result.risk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>
                                    {result.score}%
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    Conflicts Detected
                                </h4>
                                <ul className="space-y-3">
                                    {result.conflicts.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-slate-600 bg-red-50/50 p-3 rounded-lg">
                                            <ArrowRight className="w-4 h-4 text-red-400 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-amber-500" />
                                    Missing Components
                                </h4>
                                <ul className="space-y-3">
                                    {result.missing.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-slate-600 bg-amber-50/50 p-3 rounded-lg">
                                            <ArrowRight className="w-4 h-4 text-amber-400 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PoliciesCompare;
