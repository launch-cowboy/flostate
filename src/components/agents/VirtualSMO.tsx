import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, MapPin, Search, Bot, Bell, CalendarRange, PenTool, CheckCircle, Clock, Sparkles, Download, ShieldAlert, FileCheck, Users, TrendingUp, Play, Loader2, ChevronRight, Zap } from 'lucide-react';
import userData from '../../data/coordinator_maria.json';
import { downloadFile } from '../../lib/download';

const priorityConfig: Record<string, { color: string; label: string; bg: string }> = {
    'P1': { color: 'text-red-700', label: 'P1-Critical', bg: 'bg-red-100 border-red-200' },
    'P2': { color: 'text-orange-700', label: 'P2-Urgent', bg: 'bg-orange-100 border-orange-200' },
    'P3': { color: 'text-amber-700', label: 'P3-Important', bg: 'bg-amber-100 border-amber-200' },
    'P4': { color: 'text-blue-700', label: 'P4-Routine', bg: 'bg-blue-100 border-blue-200' },
};

const docStatusIcon = (status: string) => {
    switch (status) {
        case 'current': return <span className="text-emerald-500">✓</span>;
        case 'missing': return <span className="text-red-500">✗</span>;
        case 'action': return <span className="text-amber-500">⚠</span>;
        default: return <span className="text-slate-400">—</span>;
    }
};

const ragColor = (status: string) => {
    switch (status) {
        case 'green': return 'bg-emerald-500';
        case 'yellow': return 'bg-amber-500';
        case 'red': return 'bg-red-500';
        default: return 'bg-slate-400';
    }
};

// Execution plan items the AI suggests
const executionPlanItems = [
    { id: 'ep1', action: 'Stage all 12 documents for CNS-205 monitoring visit', study: 'CNS-205', category: 'Monitoring Visit', estimatedTime: '2 min', priority: 'P1', status: 'pending' as const, detail: 'Pre-stage ISF documents, source docs, and delegation log for CRA Jennifer Walsh\'s 10:30 AM visit' },
    { id: 'ep2', action: 'Send GCP renewal reminder to Dr. Patel', study: 'ONK-301, CNS-205, CARD-112', category: 'Credential Alert', estimatedTime: '30 sec', priority: 'P1', status: 'pending' as const, detail: 'GCP certification expires in 14 days — affects 3 active studies' },
    { id: 'ep3', action: 'Approve AI-drafted query response for ONK-301', study: 'ONK-301', category: 'Query Response', estimatedTime: '1 min', priority: 'P2', status: 'pending' as const, detail: 'Protocol deviation response for Patient 301-008 missed visit window — deadline tomorrow 5 PM' },
    { id: 'ep4', action: 'Reschedule IQVIA monitoring visit to resolve conflict', study: 'CARD-112', category: 'Scheduling', estimatedTime: '30 sec', priority: 'P2', status: 'pending' as const, detail: 'Move IQVIA visit from tomorrow 2:00 PM to Wednesday 10:00 AM — conflicts with Syneos visit' },
    { id: 'ep5', action: 'Send GCP renewal reminder to Dr. Williams', study: 'DERM-110', category: 'Credential Alert', estimatedTime: '30 sec', priority: 'P3', status: 'pending' as const, detail: 'GCP certificate expired — pharmacist cannot dispense IP until renewed' },
    { id: 'ep6', action: 'Submit IRB continuing review for LUNG-812', study: 'LUNG-812', category: 'Regulatory', estimatedTime: '1 min', priority: 'P3', status: 'pending' as const, detail: 'IRB approval expires in 22 days — submission due 6 weeks before expiry' },
];

// Simulated execution messages
const executionMessages: Record<string, string[]> = {
    'ep1': ['Scanning eISF for CNS-205...', 'Verifying 12 documents against monitoring visit checklist...', 'Protocol v2.1 ✓ | Delegation Log v4.1 ✓ | ICF v3.0 ✓', 'All documents staged and verified — CRA packet ready'],
    'ep2': ['Generating renewal reminder email...', 'Attaching GCP training portal link...', 'Email sent to r.patel@metroclinical.org'],
    'ep3': ['Loading AI-drafted response...', 'Response reviewed for protocol compliance...', 'Submitting to sponsor query system (Pfizer Vault)...', 'Query response submitted — confirmation #QR-2026-0847'],
    'ep4': ['Checking CRA Jennifer Walsh availability...', 'Wednesday 10:00 AM confirmed available', 'Sending reschedule request to IQVIA CRA...', 'Calendar updated — conflict resolved'],
    'ep5': ['Generating renewal reminder email...', 'Email sent to j.williams@metroclinical.org'],
    'ep6': ['Pre-filling IRB continuing review form...', 'Attaching enrollment summary and safety data...', 'Generating submission package...', 'Package ready for PI signature — routed to Dr. Chen'],
};

type Phase = 'briefing' | 'plan' | 'executing' | 'done';

export default function VirtualSMO({ onBack }: { agent: any, onBack: () => void }) {
    const [tasks, setTasks] = useState(userData.tasks);
    const [alerts, setAlerts] = useState(userData.alerts);
    const [phase, setPhase] = useState<Phase>('briefing');
    const [planItems, setPlanItems] = useState(executionPlanItems);
    const [executionLog, setExecutionLog] = useState<string[]>([]);
    const [typingMessage, setTypingMessage] = useState('');
    const logRef = useRef<HTMLDivElement>(null);

    const toggleTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const dismissAlert = (id: string) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const generatePlan = () => {
        setPhase('plan');
    };

    const executeAction = async (index: number) => {
        const item = planItems[index];
        const messages = executionMessages[item.id] || ['Processing...', 'Complete'];

        setPlanItems(prev => prev.map((p, i) => i === index ? { ...p, status: 'running' as any } : p));

        for (const msg of messages) {
            setTypingMessage(msg);
            setExecutionLog(prev => [...prev, `[${item.study}] ${msg}`]);
            await new Promise(r => setTimeout(r, 800));
        }

        setPlanItems(prev => prev.map((p, i) => i === index ? { ...p, status: 'complete' as any } : p));
        setTypingMessage('');
    };

    const executeAll = async () => {
        setPhase('executing');
        setExecutionLog([]);
        for (let i = 0; i < planItems.length; i++) {
            await executeAction(i);
            await new Promise(r => setTimeout(r, 400));
        }
        setPhase('done');
    };

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [executionLog]);

    const completedCount = planItems.filter(p => (p as any).status === 'complete').length;

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" onClick={onBack} size="sm" className="hidden sm:flex text-slate-500 hover:text-slate-900 border-r border-slate-200 rounded-none pr-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Store
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {userData.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 leading-tight">Good morning, {userData.name.split(' ')[0]}</h1>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                                    <MapPin size={12} /> {userData.site}, {(userData as any).city} • {userData.date}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex bg-slate-100 rounded-full px-4 py-2 border border-slate-200">
                            <Search className="w-4 h-4 text-slate-400 mr-2 my-auto" />
                            <input type="text" placeholder="Ask Virtual Assistant..." className="bg-transparent border-none outline-none text-sm w-48" />
                            <Bot className="w-4 h-4 text-indigo-500 ml-2" />
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg text-xs font-medium" onClick={() => downloadFile('/downloads/SMO_Weekly_Portfolio_Status.csv', 'SMO_Weekly_Portfolio_Status.csv')}>
                            <Download className="w-3 h-3 mr-1" /> Portfolio Report
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <Bell className="w-4 h-4 text-slate-600" />
                            {alerts.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Workload Bar */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-2">
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-6 text-xs">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-700 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Workload</span>
                        <span className="text-slate-500">{(userData as any).workload.activeStudies} studies (threshold: {(userData as any).workload.studyThreshold})</span>
                        <span className="text-slate-500">{(userData as any).workload.activePatients} patients (threshold: {(userData as any).workload.patientThreshold})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-100 rounded-full h-2">
                            <div className="bg-gradient-to-r from-emerald-400 to-amber-400 h-2 rounded-full" style={{ width: `${((userData as any).workload.activePatients / (userData as any).workload.patientThreshold) * 100}%` }}></div>
                        </div>
                        <span className="text-emerald-700 font-bold">{(userData as any).workload.riskLevel}</span>
                    </div>
                </div>
            </div>

            {/* ===== PHASE 1: BRIEFING ===== */}
            {phase === 'briefing' && (
                <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
                    <Card className="border-indigo-200 shadow-md rounded-2xl overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <Sparkles className="w-6 h-6" />
                                <h2 className="text-lg font-bold">Your Monday Morning Briefing</h2>
                            </div>
                            <p className="text-indigo-100 text-sm max-w-2xl">
                                I've analyzed your {(userData as any).workload.activeStudies} active studies, {tasks.length} pending tasks, and {alerts.length} credential alerts. Here's what needs your attention today.
                            </p>
                        </div>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                <div className="p-6 text-center">
                                    <p className="text-3xl font-extrabold text-indigo-600">{tasks.filter(t => (t as any).priority === 'P1').length}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">Critical Items</p>
                                </div>
                                <div className="p-6 text-center">
                                    <p className="text-3xl font-extrabold text-orange-500">{alerts.length}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">Credential Alerts</p>
                                </div>
                                <div className="p-6 text-center">
                                    <p className="text-3xl font-extrabold text-emerald-600">1</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">Monitoring Visit Today</p>
                                </div>
                                <div className="p-6 text-center">
                                    <p className="text-3xl font-extrabold text-blue-600">{tasks.length}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">Total Actions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick summary cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {tasks.filter(t => (t as any).priority === 'P1' || (t as any).priority === 'P2').slice(0, 3).map(task => {
                            const pc = priorityConfig[(task as any).priority] || priorityConfig['P4'];
                            return (
                                <Card key={task.id} className="border-slate-200 shadow-sm rounded-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className={`${pc.bg} ${pc.color} text-xs`}>{pc.label}</Badge>
                                            <span className="text-xs text-slate-400">{(task as any).study}</span>
                                        </div>
                                        <p className="font-semibold text-sm text-slate-900">{task.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{(task as any).description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg px-8 py-3 text-base font-bold"
                            onClick={generatePlan}
                        >
                            <Sparkles className="w-5 h-5 mr-2" /> Generate Execution Plan
                        </Button>
                        <p className="text-xs text-slate-400 mt-2">AI will analyze priorities and suggest optimal action sequence</p>
                    </div>
                </main>
            )}

            {/* ===== PHASE 2: EXECUTION PLAN ===== */}
            {phase === 'plan' && (
                <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
                    <Card className="border-indigo-200 shadow-md rounded-2xl overflow-hidden mb-6">
                        <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">AI Execution Plan</h2>
                                    <p className="text-xs text-slate-500">{planItems.length} actions • Estimated time: ~6 minutes</p>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md font-bold"
                                onClick={executeAll}
                            >
                                <Play className="w-4 h-4 mr-2" /> Execute All Actions
                            </Button>
                        </div>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {planItems.map((item, idx) => {
                                    const pc = priorityConfig[item.priority] || priorityConfig['P4'];
                                    return (
                                        <div key={item.id} className="p-5 px-8 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 flex-shrink-0 mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className={`${pc.bg} ${pc.color} text-xs`}>{pc.label}</Badge>
                                                    <span className="text-xs text-slate-400">{item.category}</span>
                                                    <span className="text-xs text-slate-400">• {item.study}</span>
                                                </div>
                                                <p className="font-semibold text-sm text-slate-900">{item.action}</p>
                                                <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.estimatedTime}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-center text-xs text-slate-400">Review the plan above, then click "Execute All Actions" to proceed</p>
                </main>
            )}

            {/* ===== PHASE 3: EXECUTING ===== */}
            {(phase === 'executing' || phase === 'done') && (
                <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Action Progress */}
                        <div className="lg:col-span-7">
                            <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden">
                                <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {phase === 'done' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />}
                                        <h2 className="font-bold text-slate-900">{phase === 'done' ? 'All Actions Complete' : 'Executing Actions...'}</h2>
                                    </div>
                                    <Badge variant="secondary" className={phase === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}>
                                        {completedCount}/{planItems.length} Complete
                                    </Badge>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full bg-slate-100 h-1.5">
                                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1.5 transition-all duration-500" style={{ width: `${(completedCount / planItems.length) * 100}%` }}></div>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {planItems.map((item) => {
                                            const itemStatus = (item as any).status;
                                            return (
                                                <div key={item.id} className={`p-4 px-6 flex items-center gap-4 transition-colors ${itemStatus === 'running' ? 'bg-indigo-50/50' : itemStatus === 'complete' ? 'bg-emerald-50/30' : ''}`}>
                                                    <div className="w-6 h-6 flex-shrink-0">
                                                        {itemStatus === 'complete' ? (
                                                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                                                        ) : itemStatus === 'running' ? (
                                                            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${itemStatus === 'complete' ? 'text-emerald-800' : itemStatus === 'running' ? 'text-indigo-800' : 'text-slate-500'}`}>{item.action}</p>
                                                        {itemStatus === 'running' && typingMessage && (
                                                            <p className="text-xs text-indigo-500 mt-1 animate-pulse">{typingMessage}</p>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-400">{item.study}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {phase === 'done' && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-emerald-700 font-semibold mb-2">✅ All {planItems.length} actions completed successfully</p>
                                    <p className="text-xs text-slate-500">Estimated 47 minutes of manual work automated in under 30 seconds</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Execution Log */}
                        <div className="lg:col-span-5">
                            <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden h-full">
                                <div className="bg-slate-800 text-slate-200 px-4 py-3 flex items-center gap-2 text-xs font-mono">
                                    <div className="flex gap-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                    </div>
                                    <span className="ml-2">Execution Log</span>
                                </div>
                                <div ref={logRef} className="bg-slate-900 text-slate-300 p-4 font-mono text-xs overflow-auto max-h-[500px] min-h-[400px]">
                                    {executionLog.map((line, i) => (
                                        <div key={i} className="mb-1.5">
                                            <span className="text-slate-500">{`>`} </span>
                                            <span className={line.includes('✓') || line.includes('sent') || line.includes('submitted') || line.includes('ready') || line.includes('resolved') || line.includes('updated') || line.includes('Complete') || line.includes('confirmation') ? 'text-emerald-400' : 'text-slate-300'}>{line}</span>
                                        </div>
                                    ))}
                                    {phase === 'executing' && (
                                        <span className="text-indigo-400 animate-pulse">▋</span>
                                    )}
                                    {phase === 'done' && (
                                        <div className="mt-3 pt-3 border-t border-slate-700">
                                            <span className="text-emerald-400">✓ All actions complete. Morning briefing executed.</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            )}

            {/* ===== FULL DASHBOARD (shown after 'done' phase) ===== */}
            {phase === 'done' && (
                <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center gap-2 mb-4">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <h3 className="font-bold text-slate-700 text-sm">Full Dashboard</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            {/* Priority Tasks */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-indigo-600" /> Morning Priorities
                                    </h2>
                                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">{tasks.length} Tasks</Badge>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {tasks.map((task) => {
                                            const pc = priorityConfig[(task as any).priority] || priorityConfig['P4'];
                                            return (
                                                <div key={task.id} className="p-4 px-6 flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                                                    <button onClick={() => toggleTask(task.id)} className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 group-hover:border-indigo-500 transition-colors"></button>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge className={`${pc.bg} ${pc.color} text-[10px] font-semibold`}>{pc.label}</Badge>
                                                            <span className="text-xs text-slate-400">{(task as any).study}</span>
                                                        </div>
                                                        <p className="font-semibold text-sm text-slate-900 leading-snug">{task.title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{(task as any).description}</p>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3" /> {(task as any).estimatedTime || '15 min'}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Monitoring Visit Prep */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><FileCheck className="w-5 h-5 text-indigo-600" /> Monitoring Visit Prep</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">{(userData as any).monitoringVisitPrep.study} — {(userData as any).monitoringVisitPrep.visitType} — CRA: {(userData as any).monitoringVisitPrep.cra}</p>
                                </div>
                                <CardContent className="p-0 overflow-x-auto">
                                    <table className="min-w-full text-xs">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="text-left px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider">eBinder Zone</th>
                                                <th className="text-left px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider">Document</th>
                                                <th className="text-center px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                                <th className="text-left px-4 py-2 font-semibold text-slate-500 uppercase tracking-wider">Note</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {((userData as any).monitoringVisitPrep.documents || []).map((doc: any, i: number) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-2 font-mono text-slate-500">{doc.zone}</td>
                                                    <td className="px-4 py-2 font-medium text-slate-800">{doc.name}</td>
                                                    <td className="px-4 py-2 text-center text-lg">{docStatusIcon(doc.status)}</td>
                                                    <td className="px-4 py-2 text-slate-500">{doc.note || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>

                            {/* AI-Drafted Comms */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><PenTool className="w-5 h-5 text-indigo-600" /> AI-Drafted Comms</h2>
                                </div>
                                <CardContent className="p-0 divide-y divide-slate-100">
                                    {((userData as any).draftedComms || []).map((comm: any, i: number) => (
                                        <div key={i} className="p-4 px-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">AI-DRAFTED</Badge>
                                                <span className="text-xs text-slate-400">{comm.study}</span>
                                            </div>
                                            <p className="font-semibold text-sm text-slate-900">{comm.subject}</p>
                                            <p className="text-xs text-slate-500 mt-1">{comm.preview}</p>
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm" variant="outline" className="rounded-lg text-xs h-7">Review & Edit</Button>
                                                <Button size="sm" variant="outline" className="rounded-lg text-xs h-7 text-emerald-700 border-emerald-200">Approve & Send</Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Scheduling Conflicts */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><CalendarRange className="w-5 h-5 text-indigo-600" /> Scheduling Conflicts</h2>
                                </div>
                                <CardContent className="p-4 px-6">
                                    {((userData as any).schedulingConflicts || []).map((conflict: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                                            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{conflict.description}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{conflict.resolution}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Credential Alerts */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /> Credential Alerts</h2>
                                </div>
                                <CardContent className="p-0 divide-y divide-slate-100">
                                    {alerts.map((alert) => (
                                        <div key={alert.id} className="p-4 px-6 flex items-start gap-3 group">
                                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-slate-900">{(alert as any).staffName}</p>
                                                <p className="text-xs text-slate-500">{(alert as any).credential} — {(alert as any).status}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">Affects: {(alert as any).affectedStudies?.join(', ')}</p>
                                            </div>
                                            <button onClick={() => dismissAlert(alert.id)} className="text-xs text-slate-400 hover:text-red-500">×</button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Portfolio Status */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-600" /> Portfolio Status</h2>
                                </div>
                                <CardContent className="p-0 divide-y divide-slate-100">
                                    {((userData as any).portfolio || []).map((study: any, i: number) => (
                                        <div key={i} className="p-4 px-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm text-slate-900">{study.study}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${ragColor(study.regulatoryStatus)}`}></div>
                                                    <span className="text-xs text-slate-500">{study.enrolled}/{study.target}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(study.enrolled / study.target) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}
