import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, MapPin, Search, Bot, Bell, AlertTriangle, CalendarRange, PenTool, CheckCircle, Clock, Sparkles } from 'lucide-react';
import userData from '../../data/coordinator_maria.json';

export default function VirtualSMO({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [tasks, setTasks] = useState(userData.tasks);
    const [alerts, setAlerts] = useState(userData.alerts);

    const toggleTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const dismissAlert = (id: string) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

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
                                    <MapPin size={12} /> {userData.site} • {userData.date}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex bg-slate-100 rounded-full px-4 py-2 border border-slate-200">
                            <Search className="w-4 h-4 text-slate-400 mr-2 my-auto" />
                            <input type="text" placeholder="Ask Virtual Assistant..." className="bg-transparent border-none outline-none text-sm w-64" />
                            <Bot className="w-4 h-4 text-indigo-500 ml-2" />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <Bell className="w-4 h-4 text-slate-600" />
                            {alerts.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: 8 cols */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Priority Tasks */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-indigo-600" /> AI-Prioritized Tasks
                                </h2>
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">{tasks.length} Open</Badge>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="p-4 px-6 flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                                            <button onClick={() => toggleTask(task.id)} className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 group-hover:border-indigo-500 transition-colors"></button>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={`text-xs border-none ${task.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                                        {task.priority.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Clock size={12} /> {task.due}</span>
                                                </div>
                                                <p className="font-medium text-slate-800 text-sm">{task.title}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="hidden group-hover:block text-indigo-600 font-semibold shadow-sm border border-slate-200 bg-white hover:bg-indigo-50">Auto-Solve</Button>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && <div className="p-8 text-center text-slate-500"><CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2" /> All tasks complete!</div>}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* AI Drafts */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                        <PenTool className="w-5 h-5 text-emerald-600" /> AI-Drafted Comms
                                    </h2>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {userData.communications.map(c => (
                                            <div key={c.id} className="p-5 hover:bg-slate-50 cursor-pointer">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">{c.type}</span>
                                                    <span className="text-xs text-slate-500">To: {c.to}</span>
                                                </div>
                                                <p className="font-semibold text-slate-800 text-sm mb-1">{c.subject}</p>
                                                <p className="text-sm text-slate-500 truncate">{c.preview}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Scheduling Conflicts */}
                            <Card className="border-slate-200 shadow-sm rounded-2xl">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                        <CalendarRange className="w-5 h-5 text-rose-500" /> Schedule Conflicts
                                    </h2>
                                </div>
                                <CardContent className="p-5">
                                    {userData.scheduleConflicts.map((sc, i) => (
                                        <div key={i} className="mb-4 last:mb-0">
                                            <Badge className="bg-rose-100 text-rose-800 border-rose-200 mb-2">{sc.date}</Badge>
                                            <p className="text-sm font-medium text-slate-800 mb-2">{sc.issue}</p>
                                            <div className="bg-slate-100 rounded-lg p-3 relative">
                                                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-indigo-500" />
                                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">AI Recommendation</p>
                                                <p className="text-sm text-indigo-900 font-medium">{sc.recommendation}</p>
                                                <Button size="sm" className="mt-3 bg-indigo-600 text-white w-full h-8">Resolve Automatically</Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: 4 cols */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Regulatory Alerts */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl border-t-4 border-t-rose-500">
                            <div className="px-6 pt-5 pb-3">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-rose-500" /> Regulatory Alerts
                                </h2>
                            </div>
                            <CardContent className="px-5 pb-5">
                                <div className="space-y-3">
                                    {alerts.map(alert => (
                                        <div key={alert.id} className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex gap-3 relative overflow-hidden group">
                                            <div className={`w-1 h-full absolute left-0 top-0 ${alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-400'}`}></div>
                                            <p className="text-sm text-rose-900 font-medium z-10">{alert.message}</p>
                                            <button onClick={() => dismissAlert(alert.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-800 text-xs font-bold transition-all">✕</button>
                                        </div>
                                    ))}
                                    {alerts.length === 0 && <p className="text-sm text-slate-500 text-center py-4">All clear.</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Portfolio */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl flex-1">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800">Active Portfolio ({userData.activeStudies.length})</h2>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                    {userData.activeStudies.map(study => (
                                        <div key={study.id} className="p-4 px-6 hover:bg-slate-50 cursor-pointer flex justify-between items-center group">
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                                    {study.id}
                                                    <span className={`w-2 h-2 rounded-full ${study.status === 'recruiting' ? 'bg-emerald-500' : study.status === 'startup' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">{study.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{study.patients}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patients</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
