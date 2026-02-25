import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, GitCompare, AlertCircle, FileWarning, CheckCircle2, Upload, Download, Sparkles, Play, Loader2, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';
import { downloadFile } from '../../lib/download';

// Load mock data
import eisfDocs from '../../data/eisf_documents.json';
import etmfDocs from '../../data/etmf_documents.json';

type Phase = 'input' | 'report' | 'plan' | 'executing' | 'resolved';

interface Discrepancy {
    severity: string;
    artifact: string;
    zone: string;
    eisf: string;
    etmf: string;
    action: string;
    type: string; // version_mismatch | missing | expired | naming | filing | signature
    eisfHighlight: string; // 'newer' | 'older' | 'missing' | 'expired' | 'normal'
    etmfHighlight: string;
}

export default function ReconciliationBot({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [eisfFile, setEisfFile] = useState<File | null>(null);
    const [etmfFile, setEtmfFile] = useState<File | null>(null);
    const [phase, setPhase] = useState<Phase>('input');
    const [resolutionPlan, setResolutionPlan] = useState<any[]>([]);
    const [executionLog, setExecutionLog] = useState<string[]>([]);
    const [typingMessage, setTypingMessage] = useState('');
    const logRef = useRef<HTMLDivElement>(null);

    const handleAct = () => {
        setProcessing(true);
        setTimeout(() => {
            const discrepancies: Discrepancy[] = [];
            const eisfMap = new Map(eisfDocs.map(d => [d.id || d.name, d]));
            const etmfMap = new Map(etmfDocs.map(d => [d.id || d.name, d]));

            // 1. Missing in eISF (Critical)
            etmfDocs.forEach(d => {
                if (!eisfMap.has(d.id || d.name)) {
                    discrepancies.push({
                        severity: 'Critical', artifact: d.name, zone: (d as any).zone || '—',
                        eisf: '— Missing —', etmf: `${d.version} • ${d.status}`,
                        action: `Sync from eTMF to eISF (${(d as any).zoneName || 'Unknown Zone'})`,
                        type: 'missing', eisfHighlight: 'missing', etmfHighlight: 'normal'
                    });
                }
            });

            // 2. Version Mismatch (Critical)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.version !== etmf.version) {
                    const eisfDate = new Date((d as any).lastUpdated || 0);
                    const etmfDate = new Date((etmf as any).lastUpdated || 0);
                    const eisfNewer = eisfDate > etmfDate;
                    discrepancies.push({
                        severity: 'Critical', artifact: d.name, zone: (d as any).zone || '—',
                        eisf: `${d.version}`, etmf: `${etmf.version}`,
                        action: eisfNewer
                            ? `Upload ${d.version} to eTMF — site has current version`
                            : `Upload ${etmf.version} to eISF — sponsor has current version`,
                        type: 'version_mismatch',
                        eisfHighlight: eisfNewer ? 'newer' : 'older',
                        etmfHighlight: eisfNewer ? 'older' : 'newer'
                    });
                }
            });

            // 3. Naming Inconsistency (Minor)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.name !== etmf.name) {
                    discrepancies.push({
                        severity: 'Minor', artifact: d.name, zone: (d as any).zone || '—',
                        eisf: d.name, etmf: etmf.name,
                        action: 'Standardize naming convention',
                        type: 'naming', eisfHighlight: 'normal', etmfHighlight: 'normal'
                    });
                }
            });

            // 4. Filing Location Error (Major)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.zone !== etmf.zone) {
                    discrepancies.push({
                        severity: 'Major', artifact: d.name, zone: (d as any).zone || '—',
                        eisf: `Zone ${d.zone}`, etmf: `Zone ${etmf.zone}`,
                        action: `Refile to Zone ${d.zone} in eTMF`,
                        type: 'filing', eisfHighlight: 'normal', etmfHighlight: 'older'
                    });
                }
            });

            // 5. Expired Document (Critical)
            eisfDocs.forEach(d => {
                if (new Date(d.expirationDate) < new Date('2026-02-25')) {
                    const daysExpired = Math.floor((new Date('2026-02-25').getTime() - new Date(d.expirationDate).getTime()) / (1000 * 60 * 60 * 24));
                    discrepancies.push({
                        severity: 'Critical', artifact: d.name, zone: (d as any).zone || '—',
                        eisf: `Expired ${daysExpired}d ago`, etmf: `Expired ${daysExpired}d ago`,
                        action: `Request renewed document — expired ${daysExpired} days ago`,
                        type: 'expired', eisfHighlight: 'expired', etmfHighlight: 'expired'
                    });
                }
            });

            // 6. Signature Gap (Major)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.status === 'Signed' && etmf.status === 'Unsigned') {
                    discrepancies.push({
                        severity: 'Major', artifact: d.name, zone: (d as any).zone || '—',
                        eisf: 'Signed ✓', etmf: 'Unsigned ✗',
                        action: 'Procure signature in eTMF',
                        type: 'signature', eisfHighlight: 'newer', etmfHighlight: 'older'
                    });
                }
            });

            // Calculate matched documents
            const matchedCount = eisfDocs.filter(d => {
                const etmf = etmfMap.get(d.id || d.name);
                return etmf && d.version === etmf.version && d.zone === etmf.zone && new Date(d.expirationDate) >= new Date('2026-02-25');
            }).length;

            setProcessing(false);
            setResult({ discrepancies, matchedCount, totalEisf: eisfDocs.length, totalEtmf: etmfDocs.length });
            setPhase('report');
        }, 1500);
    };

    const generateResolutionPlan = () => {
        const plan = result.discrepancies
            .filter((d: Discrepancy) => d.severity === 'Critical' || d.severity === 'Major')
            .map((d: Discrepancy, i: number) => ({
                id: `rp-${i}`,
                action: d.action,
                artifact: d.artifact,
                zone: d.zone,
                severity: d.severity,
                type: d.type,
                status: 'pending' as const,
            }));
        setResolutionPlan(plan);
        setPhase('plan');
    };

    const executionMessages: Record<string, string[]> = {
        'version_mismatch': ['Locating document in source system...', 'Verifying version metadata...', 'Uploading to target system...', 'Version sync complete — audit trail updated'],
        'missing': ['Locating document in eTMF...', 'Extracting document and metadata...', 'Filing in eISF with correct zone mapping...', 'Document synced — TMF artifact ID assigned'],
        'expired': ['Generating renewal request email...', 'Attaching current document and expiry details...', 'Email sent to responsible party', 'Renewal tickler set for 14-day follow-up'],
        'filing': ['Identifying correct TMF zone...', 'Moving document to correct zone...', 'Filing location corrected — audit log updated'],
        'signature': ['Generating signature request...', 'Routing to authorized signatory...', 'Signature request sent via DocuSign'],
        'naming': ['Applying naming convention standard...', 'Document renamed — sync mapping updated'],
    };

    const executeResolution = async () => {
        setPhase('executing');
        setExecutionLog([]);
        for (let i = 0; i < resolutionPlan.length; i++) {
            const item = resolutionPlan[i];
            setResolutionPlan(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'running' } : p));

            const messages = executionMessages[item.type] || ['Processing...', 'Complete'];
            for (const msg of messages) {
                setTypingMessage(msg);
                setExecutionLog(prev => [...prev, `[${item.artifact}] ${msg}`]);
                await new Promise(r => setTimeout(r, 600));
            }

            setResolutionPlan(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'complete' } : p));
            setTypingMessage('');
            await new Promise(r => setTimeout(r, 300));
        }
        setPhase('resolved');
    };

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [executionLog]);

    const getCellStyle = (highlight: string) => {
        switch (highlight) {
            case 'newer': return 'bg-emerald-50 text-emerald-800 font-semibold';
            case 'older': return 'bg-red-50 text-red-700 font-semibold';
            case 'missing': return 'bg-red-100 text-red-800 font-bold';
            case 'expired': return 'bg-amber-50 text-amber-800 font-semibold';
            default: return 'text-slate-600';
        }
    };

    const completedCount = resolutionPlan.filter(p => p.status === 'complete').length;

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-slate-200 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                </Button>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                            <GitCompare size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">{agent.name}</h1>
                            <p className="text-slate-500 font-medium">{agent.description}</p>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md" onClick={handleAct} disabled={processing || phase !== 'input'}>
                            {processing ? 'Comparing Inventories...' : 'Run Reconciliation'}
                        </Button>
                    </div>
                </div>

                {/* ===== PHASE: INPUT (Upload Zones) ===== */}
                {phase === 'input' && !processing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card className="h-64 flex flex-col items-center justify-center bg-blue-50/30 border-dashed border-2 shadow-sm border-blue-200 cursor-pointer group hover:bg-blue-50">
                            <input type="file" className="hidden" id="eisf-upload" onChange={(e) => setEisfFile(e.target.files?.[0] || null)} />
                            <div onClick={() => document.getElementById('eisf-upload')?.click()} className="text-center w-full h-full flex flex-col items-center justify-center">
                                {eisfFile ? (
                                    <>
                                        <AlertCircle className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                                        <p className="font-bold text-emerald-900">{eisfFile.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-all" />
                                        <p className="font-bold text-blue-900">Upload Site eISF Index</p>
                                        <p className="text-sm text-blue-600/70">.csv, .xlsx, .zip</p>
                                    </>
                                )}
                            </div>
                        </Card>
                        <Card className="h-64 flex flex-col items-center justify-center bg-indigo-50/30 border-dashed border-2 shadow-sm border-indigo-200 cursor-pointer group hover:bg-indigo-50">
                            <input type="file" className="hidden" id="etmf-upload" onChange={(e) => setEtmfFile(e.target.files?.[0] || null)} />
                            <div onClick={() => document.getElementById('etmf-upload')?.click()} className="text-center w-full h-full flex flex-col items-center justify-center">
                                {etmfFile ? (
                                    <>
                                        <AlertCircle className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                                        <p className="font-bold text-emerald-900">{etmfFile.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-all" />
                                        <p className="font-bold text-indigo-900">Upload Sponsor eTMF Index</p>
                                        <p className="text-sm text-indigo-600/70">.csv, .xlsx, .zip</p>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* ===== PHASE: REPORT (Discrepancy Table) ===== */}
                {(phase === 'report' || phase === 'plan' || phase === 'executing' || phase === 'resolved') && result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="border-red-100 bg-red-50 text-red-900 shadow-sm">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-wide opacity-80">Critical Mismatches</p>
                                        <p className="text-4xl font-extrabold mt-1">{result.discrepancies.filter((d: any) => d.severity === 'Critical').length}</p>
                                    </div>
                                    <AlertCircle className="w-12 h-12 opacity-20" />
                                </CardContent>
                            </Card>
                            <Card className="border-amber-100 bg-amber-50 text-amber-900 shadow-sm">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-wide opacity-80">Major Findings</p>
                                        <p className="text-4xl font-extrabold mt-1">{result.discrepancies.filter((d: any) => d.severity === 'Major').length}</p>
                                    </div>
                                    <FileWarning className="w-12 h-12 opacity-20" />
                                </CardContent>
                            </Card>
                            <Card className="border-emerald-100 bg-emerald-50 text-emerald-900 shadow-sm">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-wide opacity-80">Matched Properly</p>
                                        <p className="text-4xl font-extrabold mt-1">{result.matchedCount}</p>
                                        <p className="text-xs opacity-60 mt-0.5">of {result.totalEisf} eISF / {result.totalEtmf} eTMF documents</p>
                                    </div>
                                    <CheckCircle2 className="w-12 h-12 opacity-20" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Discrepancy Table */}
                        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden mb-6">
                            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                <CardTitle>Discrepancy Report</CardTitle>
                                <div className="flex items-center gap-3">
                                    {phase === 'report' && (
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md font-bold text-xs"
                                            onClick={generateResolutionPlan}
                                        >
                                            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Suggest Resolution Plan
                                        </Button>
                                    )}
                                    <button
                                        onClick={() => downloadFile('/downloads/eISF_eTMF_Discrepancy_Report.csv', 'eISF_eTMF_Discrepancy_Report.csv')}
                                        className="inline-flex items-center justify-center whitespace-nowrap text-sm bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-900 rounded-lg shadow-sm font-medium h-9 px-3 cursor-pointer"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Export CSV Report
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">TMF Zone</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Artifact</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">eISF Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">eTMF Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action Required</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {result.discrepancies.map((d: Discrepancy, i: number) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <Badge className={
                                                        d.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100' :
                                                            d.severity === 'Major' ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' :
                                                                'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
                                                    }>{d.severity}</Badge>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-500">{d.zone}</td>
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900 text-sm">{d.artifact}</td>
                                                <td className={`px-4 py-3 whitespace-nowrap text-xs ${getCellStyle(d.eisfHighlight)}`}>
                                                    {d.eisfHighlight === 'newer' && <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>}
                                                    {d.eisfHighlight === 'older' && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>}
                                                    {d.eisfHighlight === 'missing' && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>}
                                                    {d.eisf}
                                                </td>
                                                <td className={`px-4 py-3 whitespace-nowrap text-xs ${getCellStyle(d.etmfHighlight)}`}>
                                                    {d.etmfHighlight === 'newer' && <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>}
                                                    {d.etmfHighlight === 'older' && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>}
                                                    {d.etmf}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">{d.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        {/* ===== PHASE: PLAN (Resolution Plan) ===== */}
                        {phase === 'plan' && (
                            <Card className="border-indigo-200 shadow-md rounded-2xl overflow-hidden mb-6">
                                <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-900">AI Resolution Plan</h2>
                                            <p className="text-xs text-slate-500">{resolutionPlan.length} actions to resolve critical and major findings</p>
                                        </div>
                                    </div>
                                    <Button
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md font-bold"
                                        onClick={executeResolution}
                                    >
                                        <Play className="w-4 h-4 mr-2" /> Execute Resolution Plan
                                    </Button>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {resolutionPlan.map((item, idx) => (
                                            <div key={item.id} className="p-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <Badge className={item.severity === 'Critical' ? 'bg-red-100 text-red-800 text-[10px]' : 'bg-amber-100 text-amber-800 text-[10px]'}>{item.severity}</Badge>
                                                        <span className="text-xs font-mono text-slate-400">Zone {item.zone}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-900">{item.action}</p>
                                                    <p className="text-xs text-slate-500">{item.artifact}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ===== PHASE: EXECUTING / RESOLVED ===== */}
                        {(phase === 'executing' || phase === 'resolved') && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                                {/* Left: Action Progress */}
                                <div className="lg:col-span-7">
                                    <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden">
                                        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {phase === 'resolved' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />}
                                                <h2 className="font-bold text-slate-900">{phase === 'resolved' ? 'Resolution Complete' : 'Resolving Discrepancies...'}</h2>
                                            </div>
                                            <Badge variant="secondary" className={phase === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}>
                                                {completedCount}/{resolutionPlan.length} Resolved
                                            </Badge>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5">
                                            <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1.5 transition-all duration-500" style={{ width: `${(completedCount / resolutionPlan.length) * 100}%` }}></div>
                                        </div>
                                        <CardContent className="p-0">
                                            <div className="divide-y divide-slate-100">
                                                {resolutionPlan.map((item) => (
                                                    <div key={item.id} className={`p-3 px-6 flex items-center gap-3 transition-colors ${item.status === 'running' ? 'bg-indigo-50/50' : item.status === 'complete' ? 'bg-emerald-50/30' : ''}`}>
                                                        <div className="w-5 h-5 flex-shrink-0">
                                                            {item.status === 'complete' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                                                                item.status === 'running' ? <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" /> :
                                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`text-xs font-medium ${item.status === 'complete' ? 'text-emerald-800' : item.status === 'running' ? 'text-indigo-800' : 'text-slate-500'}`}>{item.action}</p>
                                                            {item.status === 'running' && typingMessage && (
                                                                <p className="text-[10px] text-indigo-500 mt-0.5 animate-pulse">{typingMessage}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {phase === 'resolved' && (
                                        <div className="mt-4 text-center">
                                            <p className="text-sm text-emerald-700 font-semibold mb-1">✅ {resolutionPlan.length} discrepancies resolved</p>
                                            <p className="text-xs text-slate-500">Match rate improved from {Math.round((result.matchedCount / result.totalEisf) * 100)}% to {Math.min(100, Math.round(((result.matchedCount + resolutionPlan.length) / result.totalEisf) * 100))}%</p>
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
                                            <span className="ml-2">Resolution Log</span>
                                        </div>
                                        <div ref={logRef} className="bg-slate-900 text-slate-300 p-4 font-mono text-xs overflow-auto max-h-[400px] min-h-[300px]">
                                            {executionLog.map((line, i) => (
                                                <div key={i} className="mb-1">
                                                    <span className="text-slate-500">{`>`} </span>
                                                    <span className={line.includes('complete') || line.includes('synced') || line.includes('sent') || line.includes('corrected') || line.includes('updated') || line.includes('assigned') ? 'text-emerald-400' : 'text-slate-300'}>{line}</span>
                                                </div>
                                            ))}
                                            {phase === 'executing' && <span className="text-indigo-400 animate-pulse">▋</span>}
                                            {phase === 'resolved' && (
                                                <div className="mt-3 pt-3 border-t border-slate-700">
                                                    <span className="text-emerald-400">✓ All critical and major findings resolved.</span>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
