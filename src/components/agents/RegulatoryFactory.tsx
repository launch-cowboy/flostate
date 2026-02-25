import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, Play, Shield, Activity, UserCheck, FileText, CheckCircle2, Upload, Download } from 'lucide-react';

export default function RegulatoryFactory({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [running, setRunning] = useState(false);
    const [stage, setStage] = useState(0);
    const [fileCount, setFileCount] = useState(0);

    const handleUploadClick = () => {
        const input = document.getElementById('reg-upload') as HTMLInputElement;
        if (input) input.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFileCount(prev => prev + e.target.files!.length);
        }
    };

    const startFactory = () => {
        setRunning(true);
        setStage(1);
        setTimeout(() => setStage(2), 1500);
        setTimeout(() => setStage(3), 3000);
        setTimeout(() => setStage(4), 4500);
    };

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">{agent.name}</h1>
                            <p className="text-slate-500 font-medium">Orchestrating robust credential tracking and automated Form 1572 population.</p>
                        </div>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md h-12 px-6" onClick={startFactory} disabled={running}>
                        <Play className="w-4 h-4 mr-2" /> {stage === 4 ? 'Run Again' : 'Initialize Multi-Agent Factory'}
                    </Button>
                </div>

                {!running && stage === 0 && (
                    <Card className="mb-8 border-dashed border-2 border-indigo-200 bg-indigo-50/30">
                        <CardContent className="p-8 text-center cursor-pointer group hover:bg-indigo-50 transition-colors" onClick={handleUploadClick}>
                            <input type="file" multiple id="reg-upload" className="hidden" onChange={handleFileChange} />
                            {fileCount > 0 ? (
                                <>
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                    <p className="font-bold text-emerald-900">{fileCount} Document(s) Staged</p>
                                    <p className="text-sm text-indigo-600 font-medium">Ready for orchestration</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-all" />
                                    <p className="font-bold text-indigo-900 mb-1">Drag & Drop Regulatory Package</p>
                                    <p className="text-sm text-indigo-600/70">Upload 1572, CVs, and Delegation Logs</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <Card className={`border-slate-200 shadow-sm transition-all duration-500 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center gap-3">
                            <div className={`p-2 rounded-lg ${stage >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                <FileText size={20} />
                            </div>
                            <CardTitle className="text-md">1572 Populator</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {stage === 1 ? (
                                <div className="flex items-center text-blue-600 font-medium animate-pulse"><Activity className="w-4 h-4 mr-2 animate-spin" /> Auto-populating fields...</div>
                            ) : stage >= 2 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center text-emerald-600 text-sm font-semibold mb-4"><CheckCircle2 className="w-4 h-4 mr-1" /> Form 1572 Drafted</div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                        <p className="text-slate-500 text-xs uppercase">Detected Change</p>
                                        <p className="font-medium">1 New Sub-Investigator added since V2.</p>
                                    </div>
                                    <div className="pt-2">
                                        <a
                                            href="/downloads/DERM110_Form1572_Final.txt"
                                            download="DERM110_Form1572_Final.txt"
                                            className="inline-flex w-full items-center justify-center whitespace-nowrap text-xs bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:text-indigo-900 text-indigo-700 rounded-lg shadow-sm font-semibold h-8 px-3 transition-colors"
                                        >
                                            <Download className="w-3 h-3 mr-2" /> Export Pre-Populated 1572
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm">Awaiting orchestration...</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className={`border-slate-200 shadow-sm transition-all duration-500 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center gap-3">
                            <div className={`p-2 rounded-lg ${stage >= 3 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                <UserCheck size={20} />
                            </div>
                            <CardTitle className="text-md">Delegation Analyzer</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {stage === 2 ? (
                                <div className="flex items-center text-blue-600 font-medium animate-pulse"><Activity className="w-4 h-4 mr-2 animate-spin" /> Cross-referencing DOA...</div>
                            ) : stage >= 3 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center text-amber-600 text-sm font-semibold mb-4"><CheckCircle2 className="w-4 h-4 mr-1" /> Gap Analysis Complete</div>
                                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                                        <p className="text-red-800 text-xs uppercase font-bold mb-1">Warning Triggered</p>
                                        <p className="font-medium text-red-900">Dr. Smith lacks Protocol V2 Training before Delegation</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm">Triggered by 1572 changes...</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className={`border-slate-200 shadow-sm transition-all duration-500 ${stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center gap-3">
                            <div className={`p-2 rounded-lg ${stage >= 4 ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                <Shield size={20} />
                            </div>
                            <CardTitle className="text-md">CV / License Monitor</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {stage === 3 ? (
                                <div className="flex items-center text-blue-600 font-medium animate-pulse"><Activity className="w-4 h-4 mr-2 animate-spin" /> Validating Credentials...</div>
                            ) : stage >= 4 ? (
                                <div className="space-y-3">
                                    <div className="flex items-center text-amber-600 text-sm font-semibold mb-4"><CheckCircle2 className="w-4 h-4 mr-1" /> Scan Complete</div>
                                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm">
                                        <p className="text-amber-800 text-xs uppercase font-bold mb-1">Action Reminder</p>
                                        <p className="font-medium text-amber-900">Dr. Patel Medical License expires in 30 Days.</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm">Validing active staff definitions...</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
