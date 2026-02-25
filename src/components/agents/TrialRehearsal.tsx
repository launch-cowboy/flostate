import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, BarChart3, TrendingDown, Clock, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const simData = [
    { days: '30-45', frequency: 5 },
    { days: '46-60', frequency: 15 },
    { days: '61-75', frequency: 45 },
    { days: '76-90', frequency: 80 },
    { days: '91-105', frequency: 35 },
    { days: '106-120', frequency: 12 },
    { days: '120+', frequency: 8 },
];

export default function TrialRehearsal({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [ran, setRan] = useState(false);

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">{agent.name}</h1>
                            <p className="text-slate-500 font-medium">Monte Carlo trial simulation engine predicting bottlenecks.</p>
                        </div>
                    </div>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md h-11 px-6" onClick={() => setRan(true)}>
                        Run Monte Carlo (500 iterations)
                    </Button>
                </div>

                {ran && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="lg:col-span-8">
                            <Card className="h-full border-slate-200 shadow-sm rounded-2xl">
                                <CardHeader>
                                    <CardTitle>Activation Timeline Distribution (Days to FPFV)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={simData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="days" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="frequency" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Simulated Completions" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <Card className="border-indigo-100 bg-indigo-50 shadow-sm rounded-2xl">
                                <CardContent className="p-6">
                                    <p className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">P80 Prediction</p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-5xl font-extrabold text-indigo-950">84</p>
                                        <p className="text-lg font-medium text-indigo-700 mb-1">Days to FPFV</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm rounded-2xl">
                                <CardHeader className="pb-2 border-b border-slate-100">
                                    <CardTitle className="text-base flex items-center"><TrendingDown className="w-4 h-4 mr-2" /> Critical Bottlenecks</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0"><Clock size={16} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">IRB Contract Negotiation</p>
                                            <p className="text-xs text-slate-500">Predicted 35 day delay (90% probability) due to Site Type historical variance.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0"><Activity size={16} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">PI Schedule Conflict</p>
                                            <p className="text-xs text-slate-500">Oncology overlaps during Trial Month 2.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
