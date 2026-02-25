import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, BarChart3, Clock, Activity, Download, AlertTriangle, CheckCircle, Zap, DollarSign, Users, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { runSimulation, getSiteTypes, SimulationResult, PhaseResult } from '../../lib/simulation-engine';
import { downloadFile } from '../../lib/download';

const riskColor = (risk: string) => {
    switch (risk) {
        case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
        case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
        case 'Very High': return 'text-red-700 bg-red-50 border-red-200';
        default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
};

export default function TrialRehearsal({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [siteType, setSiteType] = useState('Academic Medical Center');
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [running, setRunning] = useState(false);

    const handleRun = async () => {
        setRunning(true);
        await new Promise(r => setTimeout(r, 2000)); // Simulate computation
        setResult(runSimulation(siteType));
        setRunning(false);
    };

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 shadow-sm border border-violet-200">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-purple-700">{agent.name}</h1>
                            <p className="text-slate-500 font-medium">Monte Carlo simulation predicting activation bottlenecks and enrollment timelines.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={siteType}
                            onChange={(e) => setSiteType(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm"
                        >
                            {getSiteTypes().map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <Button
                            className="bg-slate-900 hover:bg-violet-600 text-white rounded-xl shadow-md h-11 px-6 transition-colors"
                            onClick={handleRun}
                            disabled={running}
                        >
                            {running ? (
                                <><span className="animate-spin mr-2">⚙</span> Simulating...</>
                            ) : (
                                'Run Monte Carlo (1,000 iterations)'
                            )}
                        </Button>
                    </div>
                </div>

                {running && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-violet-200 rounded-full"></div>
                            <div className="w-20 h-20 border-4 border-violet-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                            <BarChart3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-violet-600 w-8 h-8" />
                        </div>
                        <p className="mt-6 font-semibold text-violet-900 animate-pulse">Running 1,000 Monte Carlo iterations...</p>
                        <p className="text-sm text-slate-500 mt-2">Sampling from LogNormal distributions for {siteType}</p>
                    </div>
                )}

                {result && !running && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Summary Banner */}
                        <div className="flex items-center justify-between bg-violet-50 text-violet-800 p-4 rounded-xl border border-violet-100">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-3 text-violet-500" />
                                <span className="font-medium">
                                    Simulation Complete: <strong>{result.protocolId}</strong> | {result.siteType} | Complexity: {result.complexityScore} (×{result.complexityMultiplier})
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-lg font-medium" onClick={() => downloadFile('/downloads/ONK301_Rehearsal_Report.csv', 'ONK301_Rehearsal_Report.csv')}>
                                <Download className="w-4 h-4 mr-2" /> Export Report
                            </Button>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Card className="border-violet-200 bg-violet-50 rounded-2xl shadow-sm">
                                <CardContent className="p-4 text-center">
                                    <p className="text-xs text-violet-600 font-bold uppercase tracking-wider mb-1">Median Activation</p>
                                    <p className="text-3xl font-extrabold text-violet-950">{result.totalActivation.median}</p>
                                    <p className="text-xs text-violet-500">days</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-100 rounded-2xl shadow-sm">
                                <CardContent className="p-4 text-center">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Best Case (P10)</p>
                                    <p className="text-3xl font-extrabold text-emerald-700">{result.totalActivation.p10}</p>
                                    <p className="text-xs text-slate-400">days</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-100 rounded-2xl shadow-sm">
                                <CardContent className="p-4 text-center">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Worst Case (P90)</p>
                                    <p className="text-3xl font-extrabold text-red-700">{result.totalActivation.p90}</p>
                                    <p className="text-xs text-slate-400">days</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-100 rounded-2xl shadow-sm">
                                <CardContent className="p-4 text-center">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Iterations</p>
                                    <p className="text-3xl font-extrabold text-slate-900">{result.iterations.toLocaleString()}</p>
                                    <p className="text-xs text-slate-400">simulations</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Distribution Chart + Phase Timeline */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-7">
                                <Card className="border-slate-200 rounded-2xl shadow-sm h-full">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Activation Timeline Distribution</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[280px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={result.distributionData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="days" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                    <Bar dataKey="frequency" name="Simulated Outcomes" radius={[3, 3, 0, 0]}>
                                                        {result.distributionData.map((_entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index === result.distributionData.reduce((maxI, item, i, arr) => item.frequency > arr[maxI].frequency ? i : maxI, 0) ? '#7c3aed' : '#a78bfa'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-5">
                                <Card className="border-slate-200 rounded-2xl shadow-sm h-full">
                                    <CardHeader className="pb-2 border-b border-slate-100">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Phase-by-Phase Forecast
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        <th className="text-left px-3 py-2 font-semibold text-slate-600">Phase</th>
                                                        <th className="text-center px-2 py-2 font-semibold text-slate-600">Median</th>
                                                        <th className="text-center px-2 py-2 font-semibold text-slate-600">P10</th>
                                                        <th className="text-center px-2 py-2 font-semibold text-slate-600">P90</th>
                                                        <th className="text-center px-2 py-2 font-semibold text-slate-600">Risk</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.phases.map((p: PhaseResult, i: number) => (
                                                        <tr key={p.phase} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                            <td className="px-3 py-2 font-medium text-slate-800">{p.phase}</td>
                                                            <td className="text-center px-2 py-2 font-bold">{p.medianDays}d</td>
                                                            <td className="text-center px-2 py-2 text-emerald-600">{p.p10Days}d</td>
                                                            <td className="text-center px-2 py-2 text-red-600">{p.p90Days}d</td>
                                                            <td className="text-center px-2 py-2">
                                                                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskColor(p.riskLevel)}`}>{p.riskLevel}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                                        <td className="px-3 py-2 text-slate-900">TOTAL</td>
                                                        <td className="text-center px-2 py-2">{result.totalActivation.median}d</td>
                                                        <td className="text-center px-2 py-2 text-emerald-600">{result.totalActivation.p10}d</td>
                                                        <td className="text-center px-2 py-2 text-red-600">{result.totalActivation.p90}d</td>
                                                        <td className="text-center px-2 py-2"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Enrollment Forecast */}
                        <Card className="border-slate-200 rounded-2xl shadow-sm">
                            <CardHeader className="pb-2 border-b border-slate-100">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Enrollment Forecast (450 patients, 30 sites)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left px-4 py-3 font-semibold text-slate-600">Milestone</th>
                                                <th className="text-center px-3 py-3 font-semibold text-emerald-700">Optimistic (P10)</th>
                                                <th className="text-center px-3 py-3 font-semibold text-violet-700">Median</th>
                                                <th className="text-center px-3 py-3 font-semibold text-red-700">Pessimistic (P90)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.enrollment.map((e, i) => (
                                                <tr key={e.milestone} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                    <td className="px-4 py-2.5 font-medium text-slate-800 text-sm">{e.milestone}</td>
                                                    <td className="text-center px-3 py-2.5 text-emerald-700 font-medium">{e.optimistic} days</td>
                                                    <td className="text-center px-3 py-2.5 text-violet-700 font-bold">{e.median} days</td>
                                                    <td className="text-center px-3 py-2.5 text-red-700 font-medium">{e.pessimistic} days</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bottlenecks + Critical Path */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-slate-200 rounded-2xl shadow-sm">
                                <CardHeader className="bg-red-50 border-b border-red-100 pb-3">
                                    <CardTitle className="text-base text-red-800 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> Bottleneck Identification
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    {result.bottlenecks.map((b) => (
                                        <div key={b.rank} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                                            <span className={`w-6 h-6 ${b.rank === 1 ? 'bg-red-100 text-red-600' : b.rank === 2 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>{b.rank}</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{b.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{b.probability}% probability | +{b.impactDays} days impact</p>
                                                <p className="text-xs text-slate-600 mt-1 bg-slate-50 rounded p-2">{b.mitigation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 rounded-2xl shadow-sm">
                                <CardHeader className="bg-violet-50 border-b border-violet-100 pb-3">
                                    <CardTitle className="text-base text-violet-800 flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> Critical Path Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    {result.criticalPath.map((cp, i) => (
                                        <div key={cp.phase} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                                            <div className={`w-6 h-6 ${i === 0 ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'} rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>{cp.probability}%</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{cp.phase}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">On critical path in {cp.probability}% of simulations</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{cp.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Site Comparison (only for Academic archetype which has it) */}
                        {result.siteComparisons.length > 0 && (
                            <Card className="border-slate-200 rounded-2xl shadow-sm">
                                <CardHeader className="pb-2 border-b border-slate-100">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Site Comparison — Top 5 Recommended
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="text-center px-2 py-2 font-semibold text-slate-600">#</th>
                                                    <th className="text-left px-3 py-2 font-semibold text-slate-600">Site</th>
                                                    <th className="text-left px-3 py-2 font-semibold text-slate-600">Type</th>
                                                    <th className="text-center px-3 py-2 font-semibold text-slate-600">Activation</th>
                                                    <th className="text-center px-3 py-2 font-semibold text-slate-600">Enrollment/mo</th>
                                                    <th className="text-center px-3 py-2 font-semibold text-slate-600">Risk</th>
                                                    <th className="text-center px-3 py-2 font-semibold text-slate-600">Wave</th>
                                                    <th className="text-left px-3 py-2 font-semibold text-slate-600">Rationale</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.siteComparisons.map((s, i) => (
                                                    <tr key={s.rank} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                                        <td className="text-center px-2 py-2 font-bold text-slate-400">{s.rank}</td>
                                                        <td className="px-3 py-2 font-medium text-slate-800">{s.siteName}</td>
                                                        <td className="px-3 py-2 text-xs text-slate-500">{s.siteType}</td>
                                                        <td className="text-center px-3 py-2 font-bold">{s.medianActivation}d</td>
                                                        <td className="text-center px-3 py-2">{s.enrollmentRate}</td>
                                                        <td className="text-center px-3 py-2">
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskColor(s.risk)}`}>{s.risk}</span>
                                                        </td>
                                                        <td className="text-center px-3 py-2 text-xs font-medium">{s.wave}</td>
                                                        <td className="px-3 py-2 text-xs text-slate-500">{s.rationale}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Cost of Delay + Conflicts side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-slate-200 rounded-2xl shadow-sm">
                                <CardHeader className="bg-amber-50 border-b border-amber-100 pb-3">
                                    <CardTitle className="text-base text-amber-800 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" /> Cost-of-Delay Estimate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-600">Daily site cost (30 sites)</span>
                                        <span className="font-bold text-slate-800">{result.costOfDelay.dailyCost}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-600">Monthly portfolio cost</span>
                                        <span className="font-bold text-slate-800">{result.costOfDelay.monthlyCost}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 bg-emerald-50 rounded-lg px-3">
                                        <span className="text-sm text-emerald-700 font-medium">Potential savings</span>
                                        <span className="font-bold text-emerald-800">{result.costOfDelay.savingsEstimate}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {result.conflicts.length > 0 && (
                                <Card className="border-slate-200 rounded-2xl shadow-sm">
                                    <CardHeader className="bg-orange-50 border-b border-orange-100 pb-3">
                                        <CardTitle className="text-base text-orange-800 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Scheduling Conflicts Detected
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        {result.conflicts.map((c) => (
                                            <div key={c.id} className="pb-3 border-b border-slate-100 last:border-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-mono bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">{c.id}</span>
                                                    <span className="text-xs font-bold text-slate-800">{c.type}</span>
                                                </div>
                                                <p className="text-xs text-slate-600">{c.studies} — {c.date}</p>
                                                <p className="text-xs text-slate-500">{c.description}</p>
                                                <p className="text-xs text-emerald-600 mt-1 font-medium">↳ {c.resolution}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Compliance Footer */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                            <p className="text-xs text-slate-500">
                                <strong>Probabilistic Projections</strong> — Results based on {result.iterations.toLocaleString()} Monte Carlo iterations using industry benchmark LogNormal distributions (Zhong et al. 2023, Anisimov & Fedorov 2007). Not guarantees. All projections require human judgment before operational decisions.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
