import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import catalogData from '../data/store_catalog.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, FileText, ToggleRight, Loader2, Sparkles, Play, Info, Users, Clock } from 'lucide-react';
import TemplateWorkspaceRenderer from '../components/TemplateWorkspaceRenderer';

export default function TemplateRoute() {
    const { id } = useParams();
    const navigate = useNavigate();
    const template = catalogData.find(item => (item.slug === id || item.id === id) && item.type === 'template');

    const [isInstalling, setIsInstalling] = useState(false);
    const [stage, setStage] = useState(0);

    useEffect(() => {
        if (!isInstalling) return;

        // Run animation sequence
        const sequence = async () => {
            setStage(0);
            await new Promise(r => setTimeout(r, 500));
            setStage(1); // Connecting Data Models
            await new Promise(r => setTimeout(r, 1500));
            setStage(2); // Ingesting Knowledge
            await new Promise(r => setTimeout(r, 1500));
            setStage(3); // Activating Skills
            await new Promise(r => setTimeout(r, 1500));
            setStage(4); // Compiling
            await new Promise(r => setTimeout(r, 1000));
            setStage(5); // Complete
        };
        sequence();
    }, [isInstalling]);

    if (!template) {
        return (
            <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold mb-4">Template Not Found</h2>
                <Button variant="outline" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>
            </div>
        );
    }

    if (!isInstalling) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans pb-24">
                <div className="bg-florence-indigo text-white pt-16 pb-32 px-4 md:px-8 shadow-inner relative overflow-hidden">
                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-300 hover:text-white mb-8 -ml-4">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                        </Button>
                        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                            <div className="max-w-2xl">
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{template.name}</h1>
                                <p className="text-xl text-slate-300 font-light leading-relaxed">{template.description}</p>
                            </div>
                            <Button
                                size="lg"
                                className="bg-florence-coral hover:bg-florence-coral/90 text-white font-bold px-8 shadow-lg shadow-florence-coral/20"
                                onClick={() => setIsInstalling(true)}
                            >
                                <Play className="w-5 h-5 mr-2" /> Install Template
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
                                    <p className="text-slate-600 leading-relaxed text-lg">{template.longDescription || template.description}</p>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="shadow-sm border-slate-200 bg-white">
                                    <CardContent className="p-6">
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-florence-coral" /> Built For
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">{template.builtFor || 'Clinical teams'}</p>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm border-slate-200 bg-white">
                                    <CardContent className="p-6">
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-emerald-500" /> Time Saved
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">{template.timeSaved || 'Significant operational time savings.'}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="shadow-sm border-slate-200 bg-slate-900 text-white">
                                <CardContent className="p-6">
                                    <h4 className="font-bold text-white mb-3">How It Works</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                        {template.howItWorks || 'Install the workspace and instantly leverage predefined AI instructions and data sources.'}
                                    </p>

                                    <div className="h-px w-full bg-slate-800 mb-6"></div>

                                    <h4 className="font-bold text-white mb-3">Example Use Case</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-florence-coral pl-4">
                                        "{template.exampleUseCase || 'Expedite study startup with automated reference knowledge.'}"
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto flex flex-col">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4 flex items-center shadow-sm">
                <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Exit Installation
                </Button>
                <div>
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Template Deployment</p>
                    <h2 className="text-lg font-bold text-slate-800">{template.name}</h2>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="max-w-2xl w-full">
                    <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
                        {stage < 5 ? (
                            <>
                                <div className="bg-gradient-to-r from-florence-indigo to-indigo-800 p-8 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    <Sparkles className="w-12 h-12 text-white/50 mx-auto mb-4 animate-pulse" />
                                    <h2 className="text-2xl font-bold text-white relative z-10">Installing Environment...</h2>
                                </div>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        <div className={`flex items-center gap-4 transition-all duration-700 ${stage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage > 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {stage > 1 ? <CheckCircle2 size={20} /> : <Loader2 size={20} className="animate-spin" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">Scaffolding Data Models</p>
                                                <p className="text-sm text-slate-500">{stage > 1 ? 'Taxonomy generated.' : 'Loading schema definitions...'}</p>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-4 transition-all duration-700 ${stage >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage > 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {stage > 2 ? <CheckCircle2 size={20} /> : stage === 2 ? <Loader2 size={20} className="animate-spin text-blue-600" /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">Ingesting Knowledge Base</p>
                                                <p className="text-sm text-slate-500">{stage > 2 ? 'GCP/ICH E6 synced.' : stage === 2 ? 'Vectorizing SOPs...' : 'Awaiting context limit...'}</p>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-4 transition-all duration-700 ${stage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stage > 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {stage > 3 ? <CheckCircle2 size={20} /> : stage === 3 ? <Loader2 size={20} className="animate-spin text-blue-600" /> : <ToggleRight size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">Activating Core Skills</p>
                                                <p className="text-slate-500 text-sm">{stage > 3 ? 'Skills wired.' : stage === 3 ? 'Enabling Document Classification...' : 'Pending instructions...'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <CardContent className="p-0">
                                <TemplateWorkspaceRenderer template={template} onBack={() => navigate('/')} />
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
