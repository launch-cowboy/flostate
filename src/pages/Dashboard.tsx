import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Clock, Zap, ShieldCheck, Rocket, Trophy, Share2, FileCheck, Activity, AlertTriangle, DollarSign, Target, Users, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import {
    docCycleTimeData, docCycleKPIs, eisfActivationData, eisfKPIs,
    tmfReadinessData, tmfKPIs, siteEngagementData, adoptionFunnel,
    revenueData, financialKPIs, churnData,
    riskRadarData, siteHealthScores, predictiveAccuracy, tokenEfficiency, tokenKPIs
} from '../data/cashflo_analytics';

const dashboardData = {
    week: {
        kpis: { valueReclaimed: '$12.4M', valueReclaimedGrowth: '+312% YoY', activationDays: '14,500', findingsResolved: '28,450', hoursReclaimed: '142k' },
        usageData: [
            { day: 'Mon', tokens: 4.2, savings: 320000 }, { day: 'Tue', tokens: 5.1, savings: 410000 },
            { day: 'Wed', tokens: 8.4, savings: 680000 }, { day: 'Thu', tokens: 6.2, savings: 520000 },
            { day: 'Fri', tokens: 9.8, savings: 850000 }, { day: 'Sat', tokens: 2.1, savings: 150000 },
            { day: 'Sun', tokens: 1.8, savings: 120000 },
        ],
        agentActivity: [
            { name: 'Virtual SMO', calls: 34200 }, { name: 'CRA Visit Prep', calls: 15400 },
            { name: 'Protocol Scorer', calls: 12450 }, { name: 'Recon Bot', calls: 11200 },
            { name: 'Audit Trail Gen.', calls: 9300 }, { name: 'Reg. Factory', calls: 8700 },
        ]
    },
    month: {
        kpis: { valueReclaimed: '$48.2M', valueReclaimedGrowth: '+280% YoY', activationDays: '60,200', findingsResolved: '115,300', hoursReclaimed: '580k' },
        usageData: [
            { day: 'Wk 1', tokens: 28.5, savings: 1200000 }, { day: 'Wk 2', tokens: 32.1, savings: 1400000 },
            { day: 'Wk 3', tokens: 38.4, savings: 1750000 }, { day: 'Wk 4', tokens: 41.2, savings: 2100000 },
        ],
        agentActivity: [
            { name: 'Virtual SMO', calls: 145000 }, { name: 'CRA Visit Prep', calls: 62000 },
            { name: 'Protocol Scorer', calls: 52400 }, { name: 'Recon Bot', calls: 48000 },
            { name: 'Audit Trail Gen.', calls: 41000 }, { name: 'Reg. Factory', calls: 38000 },
        ]
    },
    year: {
        kpis: { valueReclaimed: '$412.5M', valueReclaimedGrowth: '+450% YoY', activationDays: '725,000', findingsResolved: '1.42M', hoursReclaimed: '6.8M' },
        usageData: [
            { day: 'Q1', tokens: 345, savings: 85000000 }, { day: 'Q2', tokens: 412, savings: 98000000 },
            { day: 'Q3', tokens: 528, savings: 112000000 }, { day: 'Q4', tokens: 615, savings: 117500000 },
        ],
        agentActivity: [
            { name: 'Virtual SMO', calls: 1850000 }, { name: 'CRA Visit Prep', calls: 780000 },
            { name: 'Protocol Scorer', calls: 620000 }, { name: 'Recon Bot', calls: 590000 },
            { name: 'Audit Trail Gen.', calls: 520000 }, { name: 'Reg. Factory', calls: 450000 },
        ]
    }
};

const topOperators = [
    { name: 'Sarah Jenkins', role: 'Sr. ClinOps Manager', tokens: '45.2M', value: '$1.2M' },
    { name: 'Dr. Michael Chen', role: 'Medical Director', tokens: '38.7M', value: '$950k' },
    { name: 'Elena Rodriguez', role: 'Lead CRA', tokens: '32.1M', value: '$840k' },
    { name: 'James Wilson', role: 'Regulatory Affairs', tokens: '28.5M', value: '$620k' },
];

const topContributors = [
    { name: 'Innovation Lab Team', role: 'Syneos COE', agents: 4, templates: 12, skills: 8 },
    { name: 'David Kim', role: 'Data Science', agents: 2, templates: 5, skills: 14 },
    { name: 'Anita Patel', role: 'Quality Assurance', agents: 1, templates: 8, skills: 3 },
    { name: 'Marcus Johnson', role: 'Clinical Tech', agents: 0, templates: 6, skills: 9 },
];

type ActiveTier = 'overview' | 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5';

const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === 'down') return <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
};

const MiniKPI = ({ label, value, sub, color = 'indigo' }: { label: string; value: string; sub?: string; color?: string }) => (
    <div className={`bg-${color}-50/40 border border-${color}-100 rounded-xl p-4`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider text-${color}-600/70 mb-1`}>{label}</p>
        <p className={`text-xl font-extrabold text-${color}-950`}>{value}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
);

const readinessColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-red-500';
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
    const [activeTier, setActiveTier] = useState<ActiveTier>('overview');
    const currentData = dashboardData[timeframe];

    const tiers = [
        { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
        { id: 'tier1' as const, label: 'Operational Velocity', icon: Rocket },
        { id: 'tier2' as const, label: 'Site Performance', icon: Users },
        { id: 'tier3' as const, label: 'Financial Impact', icon: DollarSign },
        { id: 'tier4' as const, label: 'Predictive Intel', icon: Target },
        { id: 'tier5' as const, label: 'Token Economics', icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-slate-100 rounded-full">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-florence-coral to-florence-peach tracking-tight">
                            Cash Flo
                        </h1>
                        <span className="hidden md:inline text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">AI ROI Intelligence</span>
                    </div>
                    <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                        {['week', 'month', 'year'].map((t) => (
                            <button key={t} onClick={() => setTimeframe(t as any)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md capitalize transition-colors ${timeframe === t ? 'bg-florence-indigo text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cash Flo Dashboard</h2>
                        <p className="text-slate-500 mt-1">Enterprise AI ROI Intelligence — 1,200+ global active studies</p>
                    </div>
                </div>

                {/* Tier Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-1 hide-scrollbar">
                    {tiers.map(t => (
                        <button key={t.id} onClick={() => setActiveTier(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTier === t.id ? 'bg-florence-indigo text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                </div>

                {/* ===== OVERVIEW ===== */}
                {activeTier === 'overview' && (<>
                    {/* Hero KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="border-emerald-100 bg-emerald-50/30 shadow-sm"><CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">{currentData.kpis.valueReclaimedGrowth}</span>
                            </div>
                            <p className="text-sm font-semibold text-emerald-800/70 uppercase tracking-wider mb-1">Total Value Reclaimed</p>
                            <h3 className="text-3xl font-extrabold text-emerald-950">{currentData.kpis.valueReclaimed}</h3>
                        </CardContent></Card>
                        <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm"><CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"><Rocket className="w-5 h-5 text-indigo-600" /></div></div>
                            <p className="text-sm font-semibold text-indigo-800/70 uppercase tracking-wider mb-1">Site Activation Accelerated</p>
                            <h3 className="text-3xl font-extrabold text-indigo-950">{currentData.kpis.activationDays}<span className="text-lg text-indigo-700/50 font-medium"> days</span></h3>
                        </CardContent></Card>
                        <Card className="border-blue-100 bg-blue-50/30 shadow-sm"><CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4"><div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-blue-600" /></div></div>
                            <p className="text-sm font-semibold text-blue-800/70 uppercase tracking-wider mb-1">Compliance Findings Resolved</p>
                            <h3 className="text-3xl font-extrabold text-blue-950">{currentData.kpis.findingsResolved}<span className="text-lg text-blue-700/50 font-medium"> auto</span></h3>
                        </CardContent></Card>
                        <Card className="border-amber-100 bg-amber-50/30 shadow-sm"><CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4"><div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div></div>
                            <p className="text-sm font-semibold text-amber-800/70 uppercase tracking-wider mb-1">Global Hours Reclaimed</p>
                            <h3 className="text-3xl font-extrabold text-amber-950">{currentData.kpis.hoursReclaimed}<span className="text-lg text-amber-700/50 font-medium"> hrs</span></h3>
                        </CardContent></Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-florence-coral" /> Token Usage vs. Value Delivery</CardTitle></CardHeader>
                            <CardContent className="pt-6"><div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={currentData.usageData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                        <defs><linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6D4D" stopOpacity={0.3} /><stop offset="95%" stopColor="#FF6D4D" stopOpacity={0} /></linearGradient></defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${val}M`} width={50} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="tokens" stroke="#FF6D4D" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div></CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold">Tasks Completed by Concierge</CardTitle></CardHeader>
                            <CardContent className="pt-6"><div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={currentData.agentActivity} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val} tick={{ fill: '#64748b', fontSize: 11 }} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={120} />
                                        <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="calls" fill="#1E1B4B" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div></CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-white border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-florence-coral" /> Top AI Operators</CardTitle></CardHeader>
                            <CardContent className="p-0"><table className="min-w-full divide-y divide-slate-100"><thead className="bg-slate-50"><tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Operator</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Tokens</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                            </tr></thead><tbody className="bg-white divide-y divide-slate-50">
                                    {topOperators.map((op, i) => (<tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-florence-indigo text-white flex items-center justify-center font-bold text-xs">{op.name.charAt(0)}</div><div><p className="font-bold text-slate-900 text-sm">{op.name}</p><p className="text-xs text-slate-500">{op.role}</p></div></div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-600">{op.tokens}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-600">{op.value}</td>
                                    </tr>))}
                                </tbody></table></CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-white border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Share2 className="w-5 h-5 text-florence-purple" /> Top Builders</CardTitle></CardHeader>
                            <CardContent className="p-0 overflow-x-auto"><table className="min-w-full divide-y divide-slate-100"><thead className="bg-slate-50"><tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Creator</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Agents</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Templates</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</th>
                            </tr></thead><tbody className="bg-white divide-y divide-slate-50">
                                    {topContributors.map((col, i) => (<tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">{col.name.charAt(0)}</div><div><p className="font-bold text-slate-900 text-sm">{col.name}</p><p className="text-xs text-slate-500">{col.role}</p></div></div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-indigo-600">{col.agents}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-emerald-600">{col.templates}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-blue-600">{col.skills}</td>
                                    </tr>))}
                                </tbody></table></CardContent>
                        </Card>
                    </div>
                </>)}

                {/* ===== TIER 1: OPERATIONAL VELOCITY ===== */}
                {activeTier === 'tier1' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <MiniKPI label="AI Speed Multiplier" value={docCycleKPIs.speedMultiplier} sub="vs. non-AI docs" color="emerald" />
                        <MiniKPI label="Mean Cycle Time" value={docCycleKPIs.meanCycleTime} sub="AI-assisted" color="blue" />
                        <MiniKPI label="First-Pass Approval" value={docCycleKPIs.firstPassApproval} sub="↑ from 65% baseline" color="purple" />
                        <MiniKPI label="Doc Velocity" value={docCycleKPIs.velocityScore} sub="docs/site/week" color="amber" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><FileCheck className="w-5 h-5 text-blue-600" /> Document Cycle Time — AI vs. Non-AI</CardTitle></CardHeader>
                            <CardContent className="pt-6"><div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={docCycleTimeData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => `${v}d`} width={40} />
                                        <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="aiAssisted" name="AI-Assisted" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="nonAI" name="Non-AI" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div></CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Rocket className="w-5 h-5 text-indigo-600" /> eISF Activation Waterfall</CardTitle></CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {eisfActivationData.map(phase => (
                                        <div key={phase.phase}>
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-semibold text-slate-700 w-24">{phase.phase}</span>
                                                <span className="text-emerald-600 font-bold">-{phase.aiSaved}d saved</span>
                                            </div>
                                            <div className="flex h-6 rounded-md overflow-hidden">
                                                <div className="bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${(phase.actual / phase.planned) * 100}%` }}>{phase.actual}d</div>
                                                <div className="bg-emerald-200 flex items-center justify-center text-[10px] text-emerald-800 font-bold" style={{ width: `${(phase.aiSaved / phase.planned) * 100}%` }}>AI</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                                    <p className="text-xs font-bold text-emerald-800">{eisfKPIs.daysSavedThisPeriod} days saved across {eisfKPIs.siteActivations} site activations</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* TMF Readiness */}
                    <Card className="border-slate-200 shadow-sm mb-8">
                        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-600" /> Inspection-Ready TMF Score</CardTitle>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="font-bold text-slate-500">Enterprise Index:</span>
                                <span className={`text-2xl font-extrabold ${tmfKPIs.enterpriseIndex >= 90 ? 'text-emerald-600' : tmfKPIs.enterpriseIndex >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{tmfKPIs.enterpriseIndex}/100</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <MiniKPI label="Completeness" value={tmfKPIs.completeness} color="blue" />
                                <MiniKPI label="Quality Score" value={tmfKPIs.qualityScore} color="purple" />
                                <MiniKPI label="Days Since Gap" value={`${tmfKPIs.daysSinceGap}`} color="emerald" />
                                <MiniKPI label="Auto-Resolved" value={tmfKPIs.autoResolved.toLocaleString()} color="amber" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {tmfReadinessData.map(study => (
                                    <div key={study.study} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-sm text-slate-900">{study.study}</span>
                                            <div className={`w-2.5 h-2.5 rounded-full ${readinessColor(study.score)}`}></div>
                                        </div>
                                        <p className={`text-2xl font-extrabold ${study.score >= 90 ? 'text-emerald-600' : study.score >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{study.score}</p>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(study.enrolled / study.target) * 100}%` }}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1">{study.enrolled}/{study.target} enrolled</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>)}

                {/* ===== TIER 2: SITE PERFORMANCE ===== */}
                {activeTier === 'tier2' && (<>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" /> Site Engagement vs. Enrollment</CardTitle></CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative h-[320px] border border-slate-100 rounded-xl bg-white p-4">
                                    <div className="absolute bottom-4 left-14 text-[10px] text-slate-400 font-semibold">Engagement Score →</div>
                                    <div className="absolute top-4 left-4 text-[10px] text-slate-400 font-semibold writing-mode-vertical" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Enrollment Rate →</div>
                                    {siteEngagementData.map((site, i) => (
                                        <div key={i} className="absolute group" style={{ left: `${(site.engagement / 100) * 85 + 8}%`, bottom: `${(site.enrollment / 5) * 80 + 10}%` }}>
                                            <div className={`rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform hover:scale-150 ${site.adoption === 'high' ? 'bg-emerald-500/80 border-emerald-600' : site.adoption === 'medium' ? 'bg-amber-500/80 border-amber-600' : 'bg-red-400/80 border-red-500'}`}
                                                style={{ width: `${Math.max(16, site.size / 6)}px`, height: `${Math.max(16, site.size / 6)}px` }}></div>
                                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">{site.name} — {site.enrollment} pts/mo</div>
                                        </div>
                                    ))}
                                    <div className="absolute bottom-2 right-4 flex items-center gap-3 text-[9px]">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> High AI</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Low</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" /> Adoption Funnel</CardTitle></CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {adoptionFunnel.map((stage, i) => (
                                        <div key={stage.stage}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-semibold text-slate-700">{stage.stage}</span>
                                                <span className="text-slate-500">{stage.count.toLocaleString()} ({stage.pct}%)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-7 overflow-hidden">
                                                <div className={`h-7 rounded-full flex items-center pl-3 text-[10px] text-white font-bold transition-all ${i === 0 ? 'bg-slate-400' : i === 1 ? 'bg-indigo-500' : i === 2 ? 'bg-purple-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${stage.pct}%` }}>{stage.pct}%</div>
                                            </div>
                                            {i < adoptionFunnel.length - 1 && (
                                                <p className="text-[10px] text-slate-400 mt-1 text-right">{Math.round((adoptionFunnel[i + 1].count / stage.count) * 100)}% conversion</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Churn & Retention */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <MiniKPI label="Logo Retention" value={churnData.logoRetention} color="emerald" />
                        <MiniKPI label="Net Revenue Retention" value={churnData.nrr} color="blue" />
                        <MiniKPI label="AI-Engaged Retention" value={churnData.aiEngagedRetention} sub="vs 91.4% non-AI" color="purple" />
                        <MiniKPI label="Time to Value" value={churnData.timeToValue} color="amber" />
                        <MiniKPI label="CRA Capacity" value={financialKPIs.craCapacityMultiplier} sub="sites per CRA" color="indigo" />
                    </div>
                </>)}

                {/* ===== TIER 3: FINANCIAL IMPACT ===== */}
                {activeTier === 'tier3' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <MiniKPI label="Revenue Accelerated" value={financialKPIs.revenueAccelerated} sub="this quarter" color="emerald" />
                        <MiniKPI label="Labor Efficiency" value={financialKPIs.laborEfficiency} sub="revenue per FTE" color="blue" />
                        <MiniKPI label="EBITDA Margin Impact" value={financialKPIs.marginImpact} color="purple" />
                        <MiniKPI label="Rework Cost Avoided" value={financialKPIs.reworkAvoided} color="amber" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-600" /> Backlog → Revenue Conversion</CardTitle></CardHeader>
                            <CardContent className="pt-6"><div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="revAI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                                            <linearGradient id="revBase" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} /><stop offset="95%" stopColor="#94a3b8" stopOpacity={0} /></linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => `$${v}M`} width={55} />
                                        <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="aiAccelerated" name="AI-Accelerated" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#revAI)" />
                                        <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#revBase)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div></CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-600" /> EBITDA Margin Bridge</CardTitle></CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {[
                                        { label: 'Starting Margin', value: '22.4%', delta: '', color: 'slate' },
                                        { label: 'Labor Efficiency', value: '+0.8%', delta: '+80 bps', color: 'emerald' },
                                        { label: 'Cost Avoidance', value: '+0.4%', delta: '+40 bps', color: 'blue' },
                                        { label: 'Rework Reduction', value: '+0.3%', delta: '+30 bps', color: 'purple' },
                                        { label: 'CRA Capacity', value: '+0.3%', delta: '+30 bps', color: 'indigo' },
                                        { label: 'AI-Attributed Margin', value: '24.2%', delta: '+180 bps total', color: 'emerald' },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${i === 0 ? 'bg-slate-100' : i === 5 ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-slate-100'}`}>
                                            <span className={`text-sm font-semibold ${i === 5 ? 'text-emerald-800' : 'text-slate-700'}`}>{item.label}</span>
                                            <div className="text-right">
                                                <span className={`text-sm font-bold ${i === 5 ? 'text-emerald-700' : i === 0 ? 'text-slate-800' : 'text-emerald-600'}`}>{item.value}</span>
                                                {item.delta && <span className="text-[10px] text-slate-400 ml-2">{item.delta}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <MiniKPI label="Cost per Site" value={financialKPIs.costPerSite} sub="reduction" color="blue" />
                        <MiniKPI label="Headcount Savings" value={financialKPIs.headcountSavings} sub="equivalent avoided" color="purple" />
                        <MiniKPI label="CRA Capacity Multiplier" value={financialKPIs.craCapacityMultiplier} sub="sites managed per CRA" color="emerald" />
                    </div>
                </>)}

                {/* ===== TIER 4: PREDICTIVE INTELLIGENCE ===== */}
                {activeTier === 'tier4' && (<>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-red-500" /> Risk Radar</CardTitle></CardHeader>
                            <CardContent className="pt-6"><div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={riskRadarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <Radar name="Risk Level" dataKey="level" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div></CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Sites Needing Attention</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {siteHealthScores.map(site => (
                                        <div key={site.site} className="p-4 px-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white ${site.score >= 80 ? 'bg-emerald-500' : site.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}>{site.score}</div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-slate-900">{site.site}</p>
                                                {site.alert && <p className="text-xs text-red-500 font-medium mt-0.5">⚠ {site.alert}</p>}
                                            </div>
                                            <TrendIcon trend={site.trend} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MiniKPI label="Enrollment Prediction" value={predictiveAccuracy.enrollment} sub="accuracy" color="blue" />
                        <MiniKPI label="Regulatory Prediction" value={predictiveAccuracy.regulatory} sub="accuracy" color="emerald" />
                        <MiniKPI label="Quality Prediction" value={predictiveAccuracy.quality} sub="accuracy" color="purple" />
                        <MiniKPI label="Overall Accuracy" value={predictiveAccuracy.overall} sub="all risk models" color="indigo" />
                    </div>
                </>)}

                {/* ===== TIER 5: TOKEN ECONOMICS ===== */}
                {activeTier === 'tier5' && (<>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <MiniKPI label="Value per Token" value={tokenKPIs.valuePerToken} sub="↑ trending up" color="emerald" />
                        <MiniKPI label="Token Cost / Outcome" value={tokenKPIs.tokenCostPerOutcome} sub="tokens per outcome" color="blue" />
                        <MiniKPI label="Budget Utilization" value={tokenKPIs.budgetUtilization} color="purple" />
                        <MiniKPI label="Marginal Value" value="Increasing" sub="value scales with usage" color="amber" />
                    </div>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-florence-coral" /> Agent Token Efficiency Ranking</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50"><tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Value/Token</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Tokens Used</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Value Delivered</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Efficiency</th>
                                </tr></thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {tokenEfficiency.map((agent, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-slate-900">{agent.agent}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-600">${agent.valuePerToken.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-600">{agent.tokensUsed}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-600">{agent.valueDelivered}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="inline-flex items-center">
                                                    <div className="w-20 bg-slate-100 rounded-full h-2 mr-2">
                                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(agent.valuePerToken / 9) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </>)}
            </main>
        </div>
    );
}
