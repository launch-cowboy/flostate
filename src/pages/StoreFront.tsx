import { useState } from 'react';
import catalogData from '../data/store_catalog.json';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck, BarChart3, Rocket, Shield, Users, FlaskConical, Search, ArrowRight, Settings, Sparkles, Layers, ClipboardCheck, Target, GitBranch, Calendar, ArrowLeftRight, Languages, FileLock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const icons = { FileCheck, BarChart3, Rocket, Shield, Users, FlaskConical, Settings, Sparkles, ClipboardCheck, Target, GitBranch, Calendar, ArrowLeftRight, Languages, FileLock };
const DefaultIcon = Settings;

export default function StoreFront() {
    const [activeTab, setActiveTab] = useState('agents');
    const [enabledSkills, setEnabledSkills] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();

    const toggleSkill = (id: string) => {
        setEnabledSkills(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const activeSkillCount = Object.values(enabledSkills).filter(Boolean).length;

    const items = catalogData.filter((item) => item.type === activeTab.replace('s', '') || item.type + 's' === activeTab);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            <div className="bg-florence-indigo text-white pt-24 pb-16 px-4 md:px-8 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-florence-purple rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-florence-coral rounded-full blur-3xl opacity-10 pointer-events-none"></div>

                <div className="absolute top-6 right-6 md:right-12 z-20">
                    <Button
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 text-white border-0 font-bold backdrop-blur-sm"
                        onClick={() => navigate('/dashboard')}
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Cash Flo
                    </Button>
                </div>

                <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white flex items-center gap-2">
                            <div className="flex -space-x-1 items-end">
                                <span className="text-white lowercase">flo</span>
                                <span className="text-white lowercase ml-1">state</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-florence-coral mb-2 ml-0.5"></span>
                            </div>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light">
                            Your ClinOps Concierge for Everyday AI.
                        </p>
                    </div>
                    <div className="mt-8 md:mt-0 relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search agents, templates, skills..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
                <div className="flex space-x-2 border-b border-slate-200 pb-px overflow-x-auto hide-scrollbar">
                    {['agents', 'templates', 'skills'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-semibold text-sm capitalize transition-colors relative whitespace-nowrap
                                ${activeTab === tab ? 'text-florence-coral' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-florence-coral rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item: any) => {
                        const IconComponent = icons[item.icon as keyof typeof icons] || DefaultIcon;
                        const isSkillEnabled = enabledSkills[item.id] || false;

                        return (
                            <Card key={item.id} className="group flex flex-col hover:shadow-xl transition-all duration-300 border-slate-200/60 hover:border-blue-200 bg-white">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm 
                                            ${item.type === 'agent' ? 'bg-blue-100/80 text-blue-600' :
                                                item.type === 'template' ? 'bg-indigo-100/80 text-indigo-600' :
                                                    'bg-emerald-100/80 text-emerald-600'}`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <Badge variant={item.type === 'agent' ? 'default' : item.type === 'template' ? 'secondary' : 'outline'}
                                            className="uppercase text-[10px] font-bold tracking-wider px-2.5 py-1">
                                            {item.type}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-800 mb-2 truncate group-hover:text-blue-700 transition-colors">
                                        {item.name}
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 text-sm h-10 line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-grow pt-0 pb-6">
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {item.tags?.map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200/50">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-1">
                                        {item.metrics?.map((metric: { label: string, value: string }, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm py-1">
                                                <span className="text-slate-500 font-medium">{metric.label}</span>
                                                <span className="font-bold text-slate-800">{metric.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-0 pb-6 shrink-0">
                                    {item.type === 'skill' ? (
                                        <div className="w-full flex gap-2">
                                            <Button
                                                className="w-1/2 font-bold transition-all shadow-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                                variant="outline"
                                                onClick={() => navigate(`/skills/${item.slug || item.id}`)}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                className={`w-1/2 font-bold transition-all shadow-sm ${isSkillEnabled ? 'bg-florence-peach/30 text-florence-coral border border-florence-coral/30 hover:bg-florence-peach/50' : 'bg-florence-indigo text-white hover:bg-florence-indigo/90'}`}
                                                variant={isSkillEnabled ? 'outline' : 'default'}
                                                onClick={() => toggleSkill(item.id)}
                                            >
                                                {isSkillEnabled ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full bg-florence-indigo text-white hover:bg-florence-coral transition-colors font-bold shadow-sm group-hover:shadow-md"
                                            onClick={() => navigate(`/${item.type}s/${item.slug || item.id}`)}
                                        >
                                            {item.type === 'agent' ? 'Open Workspace' : 'Install Template'} <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {activeSkillCount > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 border border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <Layers className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{activeSkillCount} Skill{activeSkillCount > 1 ? 's' : ''} Active</p>
                                <p className="text-xs text-slate-400 font-medium">Ready for workspace integration</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-700"></div>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-full px-6 shadow-md transition-colors" onClick={() => navigate('/agents/agent-1')}>
                            Apply Context
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
