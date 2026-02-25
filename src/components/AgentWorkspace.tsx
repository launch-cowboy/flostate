import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ArrowLeft, Upload, File as FileIcon, Loader2, Download } from 'lucide-react';

export default function AgentWorkspace({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAct = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setResult({ score: 8.2, visits: 26, duration: '24 Months', procedures: 14 });
        }, 2000);
    };

    return (
        <div className="absolute inset-0 bg-white z-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={onBack} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <FileIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{agent.name}</h1>
                        <p className="text-slate-500">{agent.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Input Requirements</CardTitle></CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                                    <p className="text-sm font-medium mb-1">Upload Protocol PDF</p>
                                    <p className="text-xs text-slate-500 mb-4">Max 50MB</p>
                                    <Button variant="outline" size="sm">Select File</Button>
                                </div>
                                <div className="mt-6">
                                    <Button className="w-full" size="lg" onClick={handleAct} disabled={processing}>
                                        {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Run Analysis'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="h-full min-h-[400px]">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
                                <CardTitle>Analysis Output</CardTitle>
                                {result && <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>}
                            </CardHeader>
                            <CardContent className="pt-6">
                                {!result && !processing && (
                                    <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                                        <FileIcon className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Upload a protocol document to begin analysis.</p>
                                    </div>
                                )}
                                {processing && (
                                    <div className="h-[300px] flex flex-col items-center justify-center text-blue-600">
                                        <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                                        <p className="font-medium animate-pulse">Extracting parameters & computing score...</p>
                                    </div>
                                )}
                                {result && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                                            <p className="text-sm text-blue-600 font-semibold mb-1">Complexity</p>
                                            <p className="text-3xl font-bold text-slate-900">{result.score}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <p className="text-sm text-slate-500 font-semibold mb-1">Total Visits</p>
                                            <p className="text-3xl font-bold text-slate-900">{result.visits}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <p className="text-sm text-slate-500 font-semibold mb-1">Duration</p>
                                            <p className="text-3xl font-bold text-slate-900">{result.duration}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <p className="text-sm text-slate-500 font-semibold mb-1">Procedures</p>
                                            <p className="text-3xl font-bold text-slate-900">{result.procedures}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
