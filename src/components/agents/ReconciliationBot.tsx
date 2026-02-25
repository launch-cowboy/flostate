import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, GitCompare, AlertCircle, FileWarning, CheckCircle2, Upload, Download } from 'lucide-react';
import { Badge } from '../ui/badge';

// Load mock data
import eisfDocs from '../../data/eisf_documents.json';
import etmfDocs from '../../data/etmf_documents.json';

export default function ReconciliationBot({ agent, onBack }: { agent: any, onBack: () => void }) {
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [eisfFile, setEisfFile] = useState<File | null>(null);
    const [etmfFile, setEtmfFile] = useState<File | null>(null);

    const handleAct = () => {
        setProcessing(true);
        setTimeout(() => {
            // Comparison Engine
            const discrepancies: any[] = [];
            const eisfMap = new Map(eisfDocs.map(d => [d.id || d.name, d]));
            const etmfMap = new Map(etmfDocs.map(d => [d.id || d.name, d]));

            // 1. Missing in eISF (Critical)
            etmfDocs.forEach(d => {
                if (!eisfMap.has(d.id || d.name)) {
                    discrepancies.push({ severity: 'Critical', artifact: d.name, eisf: 'Missing', etmf: d.status, action: 'Sync from eTMF to eISF' });
                }
            });

            // 2. Version Mismatch (Critical)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.version !== etmf.version) {
                    discrepancies.push({ severity: 'Critical', artifact: d.name, eisf: d.version, etmf: etmf.version, action: 'Upload newer version to eTMF' });
                }
            });

            // 3. Naming Inconsistency (Minor)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.name !== etmf.name) {
                    discrepancies.push({ severity: 'Minor', artifact: d.name, eisf: d.name, etmf: etmf.name, action: 'Rename manually for sync mapping' });
                }
            });

            // 4. Filing Location Error (Major)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.zone !== etmf.zone) {
                    discrepancies.push({ severity: 'Major', artifact: d.name, eisf: d.zone, etmf: etmf.zone, action: `Move to ${d.zone} in eTMF` });
                }
            });

            // 5. Expired Document (Critical)
            eisfDocs.forEach(d => {
                if (new Date(d.expirationDate) < new Date('2025-01-01')) {
                    discrepancies.push({ severity: 'Critical', artifact: d.name, eisf: 'Expired', etmf: 'Expired', action: 'Request renewed document' });
                }
            });

            // 6. Signature Gap (Major)
            eisfDocs.forEach(d => {
                const etmf = etmfMap.get(d.id || d.name);
                if (etmf && d.status === 'Signed' && etmf.status === 'Unsigned') {
                    discrepancies.push({ severity: 'Major', artifact: d.name, eisf: 'Signed', etmf: 'Unsigned', action: 'Procure signature in eTMF' });
                }
            });

            setProcessing(false);
            setResult({ discrepancies });
        }, 1500);
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
                            <GitCompare size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">{agent.name}</h1>
                            <p className="text-slate-500 font-medium">{agent.description}</p>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md" onClick={handleAct} disabled={processing}>
                            {processing ? 'Comparing Inventories...' : 'Run Reconciliation'}
                        </Button>
                    </div>
                </div>

                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
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
                                        <p className="text-4xl font-extrabold mt-1">20</p>
                                    </div>
                                    <CheckCircle2 className="w-12 h-12 opacity-20" />
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between pb-4">
                                <CardTitle>Discrepancy Report</CardTitle>
                                <a
                                    href="/downloads/eISF_eTMF_Discrepancy_Report.csv"
                                    download="eISF_eTMF_Discrepancy_Report.csv"
                                    className="inline-flex items-center justify-center whitespace-nowrap text-sm bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-900 rounded-lg shadow-sm font-medium h-9 px-3"
                                >
                                    <Download className="w-4 h-4 mr-2" /> Export CSV Report
                                </a>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Artifact</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">eISF Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">eTMF Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action Required</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {result.discrepancies.map((d: any, i: number) => (
                                            <tr key={i}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={
                                                        d.severity === 'Critical' ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100' :
                                                            d.severity === 'Major' ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' :
                                                                'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
                                                    }>{d.severity}</Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{d.artifact}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-slate-500 ${d.eisf.includes('Missing') || d.eisf.includes('Expired') ? 'bg-red-50 text-red-700' : ''}`}>{d.eisf}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-slate-500 ${d.etmf.includes('Missing') || d.etmf.includes('Expired') || d.etmf.includes('Unsigned') ? 'bg-amber-50 text-amber-900' : ''}`}>{d.etmf}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{d.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {!result && !processing && (
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
            </div>
        </div>
    );
}
