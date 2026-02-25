import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, Upload, File as FileIcon, Loader2, Download, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { claudeAdapter, ProtocolScoringOutput } from '../../lib/claude-adapter';

export default function ProtocolScorer({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<ProtocolScoringOutput | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleAct = async () => {
        setProcessing(true);
        // We simulate a PDF text extraction delay
        await new Promise(r => setTimeout(r, 600));
        const mockPdfText = "Simulating raw parsed PDF text for ONK-301 Phase III Protocol...";

        try {
            const score = await claudeAdapter.scoreProtocol(mockPdfText);
            setResult(score);
        } catch (error) {
            console.error("Scoring failed", error);
            // Handle error state visually if needed
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                            <FileIcon size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">{agent.name}</h1>
                            <p className="text-slate-500 font-medium">{agent.description}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg">Upload Protocol</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <input type="file" id="protocol-scorer-upload" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                <div onClick={() => document.getElementById('protocol-scorer-upload')?.click()} className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group">
                                    {file ? (
                                        <>
                                            <FileIcon className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                                            <p className="text-sm font-semibold text-blue-900 mb-1">{file.name}</p>
                                            <p className="text-xs text-emerald-600 mb-4 font-bold">Ready to analyze</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-blue-400 mx-auto mb-4 group-hover:scale-110 group-hover:text-blue-500 transition-all" />
                                            <p className="text-sm font-semibold text-blue-900 mb-1">Drag & Drop PDF</p>
                                            <p className="text-xs text-blue-600/70 mb-4">Max 50MB</p>
                                            <Button variant="outline" size="sm" className="bg-white px-6 border-blue-200 text-blue-700 hover:bg-blue-50">Select File</Button>
                                        </>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <Button
                                        className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-xl h-12 text-md font-semibold transition-all shadow-md"
                                        onClick={handleAct}
                                        disabled={processing}
                                    >
                                        {processing ? <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Analyzing Document...</> : 'Generate Score'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-8">
                        <Card className="h-full min-h-[500px] border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-lg">Analysis Dashboard</CardTitle>
                                {result && <Button variant="outline" size="sm" className="rounded-lg shadow-sm font-medium"><Download className="w-4 h-4 mr-2" /> Export PDF</Button>}
                            </CardHeader>
                            <CardContent className="p-0">
                                {!result && !processing && (
                                    <div className="h-[450px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                        <FileIcon className="w-16 h-16 mb-4 opacity-20" />
                                        <p className="font-medium">Upload a document to begin analysis.</p>
                                    </div>
                                )}

                                {processing && (
                                    <div className="h-[450px] flex flex-col items-center justify-center bg-slate-50/50">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                                            <div className="w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                                            <FileIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8" />
                                        </div>
                                        <p className="mt-6 font-semibold text-blue-900 animate-pulse">Extracting parameters...</p>
                                    </div>
                                )}

                                {result && (
                                    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="flex items-center justify-between mb-6 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100">
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" />
                                                <span className="font-medium">Analysis Complete for: <strong>ONK-301-2025 (NSCLC, Phase III)</strong></span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                            <div className="bg-white border-2 border-red-100 p-5 rounded-2xl shadow-sm text-center">
                                                <p className="text-sm text-red-500 font-bold mb-1 uppercase tracking-wider">Overall Burden</p>
                                                <p className="text-4xl font-extrabold text-red-950">{result.overallScore}<span className="text-lg text-slate-400 font-medium">/10</span></p>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center">
                                                <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Est. Site Hours</p>
                                                <p className="text-4xl font-extrabold text-slate-900">{result.burdenEstimate.siteHoursPerPatient}</p>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center">
                                                <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Training Hours</p>
                                                <p className="text-4xl font-extrabold text-slate-900">{result.burdenEstimate.trainingHours}</p>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center">
                                                <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Screen Fail Risk</p>
                                                <p className="text-4xl font-extrabold text-slate-900">{result.burdenEstimate.screenFailRiskPct}<span className="text-lg text-slate-400 font-medium tracking-normal">%</span></p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                                <h3 className="font-semibold text-slate-800 mb-4 px-2">Dimensional Breakdown</h3>
                                                <div className="h-[250px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={
                                                            Object.entries(result.dimensionScores).map(([key, val]) => ({ subject: key, A: val, fullMark: 10 }))
                                                        }>
                                                            <PolarGrid stroke="#e2e8f0" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                                            <Radar name="Score" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>

                                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                                <h3 className="font-semibold text-slate-800 mb-4 px-2">Benchmark Comparison</h3>
                                                <div className="h-[250px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={[
                                                            { name: 'This Protocol', score: result.overallScore },
                                                            { name: 'Oncology Avg', score: 6.5 },
                                                            { name: 'Phase III Avg', score: 7.1 },
                                                            { name: 'Industry Avg', score: 5.4 },
                                                        ]} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                                                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
