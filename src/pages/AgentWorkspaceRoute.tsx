import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import catalogData from '../data/store_catalog.json';
import AgentWorkspaceRenderer from '../components/AgentWorkspaceRenderer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Play, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AgentWorkspaceRoute() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isWorkspaceActive, setIsWorkspaceActive] = useState(false);

    const agent = catalogData.find(item => (item.slug === id || item.id === id) && item.type === 'agent');

    if (!agent) {
        return (
            <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold mb-4">Agent Not Found</h2>
                <Button variant="outline" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>
            </div>
        );
    }

    if (isWorkspaceActive) {
        return <AgentWorkspaceRenderer agent={agent} onBack={() => navigate('/')} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            <div className="bg-florence-indigo text-white pt-16 pb-32 px-4 md:px-8 shadow-inner relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto relative z-10">
                    <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-300 hover:text-white mb-8 -ml-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                    </Button>
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{agent.name}</h1>
                            <p className="text-xl text-slate-300 font-light leading-relaxed">{agent.description}</p>
                        </div>
                        <Button
                            size="lg"
                            className="bg-florence-coral hover:bg-florence-coral/90 text-white font-bold px-8 shadow-lg shadow-florence-coral/20"
                            onClick={() => setIsWorkspaceActive(true)}
                        >
                            <Play className="w-5 h-5 mr-2" /> Activate Agent
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="shadow-md border-slate-200">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Info className="w-6 h-6 text-florence-indigo" /> What It Is
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-lg">{agent.longDescription}</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="shadow-sm border-slate-200 bg-white">
                                <CardContent className="p-6">
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-florence-coral" /> Built For
                                    </h4>
                                    <p className="text-slate-600 leading-relaxed">{agent.builtFor}</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-slate-200 bg-white">
                                <CardContent className="p-6">
                                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-emerald-500" /> Time Saved
                                    </h4>
                                    <p className="text-slate-600 leading-relaxed">{agent.timeSaved}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="shadow-sm border-slate-200 bg-slate-900 text-white">
                            <CardContent className="p-6">
                                <h4 className="font-bold text-white mb-3">How It Works</h4>
                                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                    {agent.howItWorks}
                                </p>

                                <div className="h-px w-full bg-slate-800 mb-6"></div>

                                <h4 className="font-bold text-white mb-3">Example Use Case</h4>
                                <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-florence-coral pl-4">
                                    "{agent.exampleUseCase}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
