import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, Upload, File as FileIcon, Loader2, Download, CheckCircle, AlertTriangle, TrendingUp, Clock, Shield, Users, Beaker } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { claudeAdapter, ProtocolScoringOutput, DomainScore } from '../../lib/claude-adapter';
import { downloadFile } from '../../lib/download';

const ratingColor = (rating: string) => {
    switch (rating) {
        case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        case 'Moderate': return 'text-amber-700 bg-amber-50 border-amber-200';
        case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
        case 'Very High': return 'text-red-700 bg-red-50 border-red-200';
        default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
};

const domainIcon = (domain: string) => {
    switch (domain) {
        case 'Operational Execution': return <Clock className="w-4 h-4" />;
        case 'Regulatory Oversight': return <Shield className="w-4 h-4" />;
        case 'Patient Burden': return <Users className="w-4 h-4" />;
        case 'Site Burden': return <TrendingUp className="w-4 h-4" />;
        case 'Study Design': return <Beaker className="w-4 h-4" />;
        default: return <FileIcon className="w-4 h-4" />;
    }
};

export default function ProtocolScorer({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<ProtocolScoringOutput | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleAct = async () => {
        setProcessing(true);
        await new Promise(r => setTimeout(r, 600));
        const mockPdfText = "Simulating raw parsed PDF text for ONK-301 Phase III Protocol...";
        try {
            const score = await claudeAdapter.scoreProtocol(mockPdfText);
            setResult(score);
        } catch (error) {
            console.error("Scoring failed", error);
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
                    {/* Upload Panel */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg">Upload Protocol</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <input type="file" id="protocol-scorer-upload" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                <div onClick={() => document.getElementById('protocol-scorer-upload')?.click()} className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer group">
                                    {file ? (
                                        <>
                                            <FileIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-blue-900 mb-1">{file.name}</p>
                                            <p className="text-xs text-emerald-600 font-bold">Ready to analyze</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-all" />
                                            <p className="text-sm font-semibold text-blue-900 mb-1">Drag & Drop PDF</p>
                                            <p className="text-xs text-blue-600/70 mb-3">Max 50MB</p>
                                            <Button variant="outline" size="sm" className="bg-white px-4 border-blue-200 text-blue-700 hover:bg-blue-50">Select File</Button>
                                        </>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <Button
                                        className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-xl h-11 text-sm font-semibold transition-all shadow-md"
                                        onClick={handleAct}
                                        disabled={processing}
                                    >
                                        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : 'Generate Score'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-9">
                        <Card className="min-h-[500px] border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-lg">Analysis Dashboard</CardTitle>
                                {result && (
                                    <Button variant="outline" size="sm" className="rounded-lg shadow-sm font-medium" onClick={() => downloadFile('/downloads/ONK301_Complexity_Scorecard.csv', 'ONK301_Complexity_Scorecard.csv')}>
                                        <Download className="w-4 h-4 mr-2" /> Export Scorecard
                                    </Button>
                                )}
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
                                        <p className="mt-6 font-semibold text-blue-900 animate-pulse">Scoring across 5 domains...</p>
                                    </div>
                                )}

                                {result && (
                                    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                                        {/* Protocol Summary */}
                                        <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100">
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" />
                                                <span className="font-medium">Analysis Complete: <strong>{result.protocolId}</strong> | {result.phase} | {result.therapeuticArea} | {result.indication}</span>
                                            </div>
                                            <span className="text-xs bg-emerald-200 px-2 py-1 rounded font-mono">Multiplier: {result.therapeuticAreaMultiplier}×</span>
                                        </div>

                                        {/* Key Metrics Row */}
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            <div className={`p-4 rounded-2xl shadow-sm text-center border-2 ${result.overallRating === 'Very High' ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-white'}`}>
                                                <p className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Composite</p>
                                                <p className="text-3xl font-extrabold text-red-950">{result.overallScore}<span className="text-sm text-slate-400 font-medium">/10</span></p>
                                                <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded border ${ratingColor(result.overallRating)}`}>{result.overallRating}</span>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Site Hours</p>
                                                <p className="text-3xl font-extrabold text-slate-900">{result.burdenEstimate.siteHours.totalPerPatient}</p>
                                                <p className="text-xs text-slate-400">per patient</p>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Visits</p>
                                                <p className="text-3xl font-extrabold text-slate-900">{result.burdenEstimate.totalVisits}</p>
                                                <p className="text-xs text-slate-400">planned</p>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Screen Fail</p>
                                                <p className="text-3xl font-extrabold text-slate-900">{result.burdenEstimate.screenFailRiskPct}<span className="text-sm text-slate-400">%</span></p>
                                                <p className="text-xs text-slate-400">estimated</p>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm text-center">
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Training</p>
                                                <p className="text-3xl font-extrabold text-slate-900">{result.burdenEstimate.trainingRoles}</p>
                                                <p className="text-xs text-slate-400">roles required</p>
                                            </div>
                                        </div>

                                        {/* Domain Scorecard Table */}
                                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                            <div className="p-4 bg-slate-50 border-b border-slate-200">
                                                <h3 className="font-semibold text-slate-800">Complexity Scorecard</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-slate-50/50">
                                                        <tr>
                                                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Domain</th>
                                                            <th className="text-center px-3 py-3 font-semibold text-slate-600">Weight</th>
                                                            <th className="text-center px-3 py-3 font-semibold text-slate-600">Score</th>
                                                            <th className="text-center px-3 py-3 font-semibold text-slate-600">Rating</th>
                                                            <th className="text-center px-3 py-3 font-semibold text-slate-600">Benchmark</th>
                                                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Key Drivers</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.domainScores.map((d: DomainScore, i: number) => (
                                                            <tr key={d.domain} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                                <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                                                                    {domainIcon(d.domain)}
                                                                    {d.domain}
                                                                </td>
                                                                <td className="text-center px-3 py-3 text-slate-500">{Math.round(d.weight * 100)}%</td>
                                                                <td className="text-center px-3 py-3 font-bold text-slate-900">{d.score}</td>
                                                                <td className="text-center px-3 py-3">
                                                                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${ratingColor(d.rating)}`}>{d.rating}</span>
                                                                </td>
                                                                <td className="text-center px-3 py-3 text-slate-500">{d.benchmark}</td>
                                                                <td className="px-4 py-3 text-xs text-slate-600">{d.keyDrivers[0]}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                                            <td className="px-4 py-3 text-slate-900">COMPOSITE</td>
                                                            <td className="text-center px-3 py-3">100%</td>
                                                            <td className="text-center px-3 py-3 text-slate-900">{result.overallScore}</td>
                                                            <td className="text-center px-3 py-3">
                                                                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${ratingColor(result.overallRating)}`}>{result.overallRating}</span>
                                                            </td>
                                                            <td className="text-center px-3 py-3">5.2</td>
                                                            <td className="px-4 py-3 text-xs text-red-600">Above all benchmarks</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Charts Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                                <h3 className="font-semibold text-slate-800 mb-4 px-2">Domain Profile</h3>
                                                <div className="h-[220px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={
                                                            result.domainScores.map((d: DomainScore) => ({ subject: d.domain.split(' ')[0], A: d.score, B: d.benchmark, fullMark: 10 }))
                                                        }>
                                                            <PolarGrid stroke="#e2e8f0" />
                                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                                                            <Radar name="Protocol" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.35} />
                                                            <Radar name="Benchmark" dataKey="B" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.15} strokeDasharray="5 5" />
                                                        </RadarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="flex justify-center gap-4 text-xs text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><span className="w-3 h-1.5 bg-blue-500 rounded-full"></span> Protocol</span>
                                                    <span className="flex items-center gap-1"><span className="w-3 h-1.5 bg-slate-300 rounded-full"></span> Benchmark</span>
                                                </div>
                                            </div>

                                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                                <h3 className="font-semibold text-slate-800 mb-4 px-2">Site Hours Breakdown</h3>
                                                <div className="h-[220px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={[
                                                            { name: 'Screening', hours: result.burdenEstimate.siteHours.screening },
                                                            { name: 'Treatment\n(per cycle)', hours: result.burdenEstimate.siteHours.treatment / 12 },
                                                            { name: 'EOT', hours: result.burdenEstimate.siteHours.endOfTreatment },
                                                            { name: 'Follow-Up', hours: result.burdenEstimate.siteHours.followUp },
                                                        ]} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                                                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8' } }} />
                                                            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                            <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                                                                {[
                                                                    { name: 'Screening', fill: '#6366f1' },
                                                                    { name: 'Treatment', fill: '#3b82f6' },
                                                                    { name: 'EOT', fill: '#8b5cf6' },
                                                                    { name: 'Follow-Up', fill: '#a78bfa' },
                                                                ].map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                                ))}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Burden Flags */}
                                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                            <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                <h3 className="font-semibold text-amber-800">Burden Flags — Elements Exceeding Benchmarks</h3>
                                            </div>
                                            <div className="divide-y divide-slate-100">
                                                {result.burdenFlags.map((flag, i) => (
                                                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                                                        <span className="text-amber-500 mt-0.5">▸</span>
                                                        <div className="flex-1">
                                                            <span className="font-semibold text-slate-800 text-sm">{flag.element}:</span>
                                                            <span className="text-sm text-slate-600 ml-1">{flag.protocolValue} vs. {flag.benchmarkValue}</span>
                                                            <p className="text-xs text-slate-500 mt-0.5">{flag.impact}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Amendment Risk + Recommendations side by side */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Amendment Risk */}
                                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                                <div className="p-4 bg-red-50 border-b border-red-100">
                                                    <h3 className="font-semibold text-red-800">Amendment Risk Assessment</h3>
                                                </div>
                                                <div className="p-4 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-600">Estimated probability</span>
                                                        <span className="text-xl font-bold text-red-700">{result.amendmentRisk.probability}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                                                        <div className="bg-gradient-to-r from-amber-400 to-red-500 h-2.5 rounded-full" style={{ width: `${result.amendmentRisk.probability}%` }}></div>
                                                    </div>
                                                    <p className="text-xs text-slate-500">Industry baseline: {result.amendmentRisk.baselineProbability}% | Est. cost: {result.amendmentRisk.estimatedCostPerAmendment} | Est. days: {result.amendmentRisk.estimatedDaysPerAmendment}</p>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs font-semibold text-slate-700">Risk Drivers:</p>
                                                        {result.amendmentRisk.riskDrivers.map((d, i) => (
                                                            <p key={i} className="text-xs text-slate-500 pl-3">• {d}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Recommendations */}
                                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                                <div className="p-4 bg-blue-50 border-b border-blue-100">
                                                    <h3 className="font-semibold text-blue-800">Actionable Recommendations</h3>
                                                </div>
                                                <div className="divide-y divide-slate-100">
                                                    {result.recommendations.map((rec) => (
                                                        <div key={rec.rank} className="px-4 py-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">{rec.rank}</span>
                                                                <span className="text-sm font-medium text-slate-800">{rec.recommendation}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 pl-7">{rec.expectedReduction} → {rec.domainImpact}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compliance Footer */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                                            <p className="text-xs text-slate-500">
                                                <strong>Advisory Only</strong> — This analysis requires human review before action. Do not modify safety-related procedures or primary endpoint assessments based solely on this output. Compliant with ICH E6(R3) GCP principles and ALCOA+ data integrity standards.
                                            </p>
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
