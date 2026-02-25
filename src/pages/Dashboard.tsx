import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Clock, Zap, ShieldCheck, Rocket, Trophy, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const dashboardData = {
    week: {
        kpis: {
            valueReclaimed: '$12.4M',
            valueReclaimedGrowth: '+312% YoY',
            activationDays: '14,500',
            findingsResolved: '28,450',
            hoursReclaimed: '142k'
        },
        usageData: [
            { day: 'Mon', tokens: 4.2, savings: 320000 },
            { day: 'Tue', tokens: 5.1, savings: 410000 },
            { day: 'Wed', tokens: 8.4, savings: 680000 },
            { day: 'Thu', tokens: 6.2, savings: 520000 },
            { day: 'Fri', tokens: 9.8, savings: 850000 },
            { day: 'Sat', tokens: 2.1, savings: 150000 },
            { day: 'Sun', tokens: 1.8, savings: 120000 },
        ],
        agentActivity: [
            { name: 'Virtual SMO', calls: 34200 },
            { name: 'CRA Visit Prep', calls: 15400 },
            { name: 'Protocol Scorer', calls: 12450 },
            { name: 'Recon Bot', calls: 11200 },
            { name: 'Audit Trail Gen.', calls: 9300 },
            { name: 'Reg. Factory', calls: 8700 },
        ]
    },
    month: {
        kpis: {
            valueReclaimed: '$48.2M',
            valueReclaimedGrowth: '+280% YoY',
            activationDays: '60,200',
            findingsResolved: '115,300',
            hoursReclaimed: '580k'
        },
        usageData: [
            { day: 'Wk 1', tokens: 28.5, savings: 1200000 },
            { day: 'Wk 2', tokens: 32.1, savings: 1400000 },
            { day: 'Wk 3', tokens: 38.4, savings: 1750000 },
            { day: 'Wk 4', tokens: 41.2, savings: 2100000 },
        ],
        agentActivity: [
            { name: 'Virtual SMO', calls: 145000 },
            { name: 'CRA Visit Prep', calls: 62000 },
            { name: 'Protocol Scorer', calls: 52400 },
            { name: 'Recon Bot', calls: 48000 },
            { name: 'Audit Trail Gen.', calls: 41000 },
            { name: 'Reg. Factory', calls: 38000 },
        ]
    },
    year: {
        kpis: {
            valueReclaimed: '$412.5M',
            valueReclaimedGrowth: '+450% YoY',
            activationDays: '725,000',
            findingsResolved: '1.42M',
            hoursReclaimed: '6.8M'
        },
        usageData: [
            { day: 'Q1', tokens: 345, savings: 85000000 },
            { day: 'Q2', tokens: 412, savings: 98000000 },
            { day: 'Q3', tokens: 528, savings: 112000000 },
            { day: 'Q4', tokens: 615, savings: 117500000 },
        ],
        agentActivity: [
            { name: 'Virtual SMO', calls: 1850000 },
            { name: 'CRA Visit Prep', calls: 780000 },
            { name: 'Protocol Scorer', calls: 620000 },
            { name: 'Recon Bot', calls: 590000 },
            { name: 'Audit Trail Gen.', calls: 520000 },
            { name: 'Reg. Factory', calls: 450000 },
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

export default function Dashboard() {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
    const currentData = dashboardData[timeframe];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-slate-100 rounded-full">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-florence-coral to-florence-peach tracking-tight">
                            Cash Flo
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cash Flo Dashboard</h2>
                        <p className="text-slate-500 mt-1">Enterprise-scale ROI & Performance across 1,200+ global active studies (Syneos Health).</p>
                    </div>
                    <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                        {['week', 'month', 'year'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTimeframe(t as any)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md capitalize transition-colors ${timeframe === t ? 'bg-florence-indigo text-white' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-emerald-100 bg-emerald-50/30 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full flex items-center gap-1">
                                    {currentData.kpis.valueReclaimedGrowth}
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-emerald-800/70 uppercase tracking-wider mb-1">Total Value Reclaimed</p>
                            <h3 className="text-3xl font-extrabold text-emerald-950">{currentData.kpis.valueReclaimed}</h3>
                        </CardContent>
                    </Card>

                    <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Rocket className="w-5 h-5 text-indigo-600" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-indigo-800/70 uppercase tracking-wider mb-1">Site Activation Accelerated</p>
                            <h3 className="text-3xl font-extrabold text-indigo-950">{currentData.kpis.activationDays}<span className="text-lg text-indigo-700/50 font-medium tracking-normal"> days</span></h3>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-100 bg-blue-50/30 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-blue-800/70 uppercase tracking-wider mb-1">Compliance Findings Resolved</p>
                            <h3 className="text-3xl font-extrabold text-blue-950">{currentData.kpis.findingsResolved}<span className="text-lg text-blue-700/50 font-medium tracking-normal"> auto</span></h3>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100 bg-amber-50/30 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-amber-600" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-amber-800/70 uppercase tracking-wider mb-1">Global Hours Reclaimed</p>
                            <h3 className="text-3xl font-extrabold text-amber-950">{currentData.kpis.hoursReclaimed}<span className="text-lg text-amber-700/50 font-medium tracking-normal"> hrs</span></h3>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-florence-coral" />
                                Token Usage vs. Value Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={currentData.usageData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF6D4D" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#FF6D4D" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${val}M`} width={50} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontWeight: 600 }}
                                        />
                                        <Area type="monotone" dataKey="tokens" stroke="#FF6D4D" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Secondary Chart */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold">Tasks Completed by Concierge</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={currentData.agentActivity} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val} tick={{ fill: '#64748b', fontSize: 11 }} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} width={120} />
                                        <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="calls" fill="#1E1B4B" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Top Operators */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-florence-coral" />
                                Top AI Operators (Global Reach)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Operator</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Tokens Used</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Value Derived</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {topOperators.map((op, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-florence-indigo text-white flex items-center justify-center font-bold text-xs">{op.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{op.name}</p>
                                                        <p className="text-xs text-slate-500">{op.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-600">{op.tokens}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-600">{op.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Top Contributors */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-florence-purple" />
                                Top Builders in FloState
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Creator</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Agents Add.</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Templates Add.</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills Add.</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-50">
                                    {topContributors.map((col, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">{col.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{col.name}</p>
                                                        <p className="text-xs text-slate-500">{col.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-indigo-600">{col.agents}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-emerald-600">{col.templates}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-blue-600">{col.skills}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
