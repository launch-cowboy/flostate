import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, FileText, GitBranch, Calendar, CheckSquare, Square, Users, Download, Upload, Loader2, FileCheck } from 'lucide-react';

const changes = [
    { id: 1, section: '5.1 Eligibility', type: 'Modified', severity: 'Critical', desc: 'New exclusion criterion: prior anti-PD-L1 therapy', original: 'Patients with prior immunotherapy are eligible if washout ≥ 4 weeks.', amended: 'Patients with prior anti-PD-L1 therapy are excluded. Prior anti-PD-1 permitted if washout ≥ 4 weeks.' },
    { id: 2, section: '6.2 Visit Schedule', type: 'Added', severity: 'Major', desc: 'PK sampling added at Visit 8 (Week 12)', original: 'Visit 8: Vital signs, labs, CT scan, AE assessment.', amended: 'Visit 8: Vital signs, labs, CT scan, AE assessment, PK sampling (Cohort 1 only — pre-dose, 1h, 2h, 4h post-dose).' },
    { id: 3, section: '7.3 Imaging', type: 'Modified', severity: 'Major', desc: 'CT scan interval changed Q9W → Q6W for first 6 months', original: 'Tumor assessments per RECIST 1.1 every 9 weeks (±7 days).', amended: 'Tumor assessments per RECIST 1.1 every 6 weeks (±7 days) for first 24 weeks, then every 9 weeks thereafter.' },
    { id: 4, section: '8.1 Safety Reporting', type: 'Modified', severity: 'Major', desc: 'SAE reporting window extended 30 → 90 days post last dose', original: 'SAEs must be reported within 24 hours through 30 days after last dose.', amended: 'SAEs must be reported within 24 hours through 90 days after last dose of study treatment.' },
    { id: 5, section: '4.2 Study Design', type: 'Modified', severity: 'Minor', desc: 'Stratification factor clarified: PD-L1 TPS ≥50% vs <50%', original: 'Stratified by PD-L1 status (positive vs negative).', amended: 'Stratified by PD-L1 TPS (≥50% vs <50%) using Dako 22C3 pharmDx assay.' },
    { id: 6, section: '9.1 Statistics', type: 'Modified', severity: 'Minor', desc: 'Interim analysis timing adjusted from 60% to 50% events', original: 'Interim analysis at approximately 60% of target PFS events.', amended: 'Interim analysis at approximately 50% of target PFS events (N=180).' },
    { id: 7, section: 'Appendix B', type: 'Modified', severity: 'Minor', desc: 'EORTC QLQ-C30 administration updated to electronic', original: 'EORTC QLQ-C30 administered on paper at clinic visits.', amended: 'EORTC QLQ-C30 administered electronically via ePRO device at clinic visits.' },
];

const cascadeData = [
    { change: 'New exclusion criterion', area: 'ICF', action: 'Update ICF, re-consent enrolled subjects', owner: 'CRC', priority: 'Critical', effort: '2-4 hours/subject' },
    { change: 'New exclusion criterion', area: 'Screening', action: 'Update screening checklist, retrain CRCs', owner: 'CRC Lead', priority: 'Critical', effort: '2 hours' },
    { change: 'New exclusion criterion', area: 'EDC', action: 'Update edit checks for eligibility eCRF', owner: 'Data Mgmt', priority: 'High', effort: '1 week' },
    { change: 'PK sampling at Visit 8', area: 'Visit Schedule', action: 'Update SoA, source documents, train staff', owner: 'CRC', priority: 'High', effort: '4 hours' },
    { change: 'PK sampling at Visit 8', area: 'Lab Manual', action: 'Update specimen collection procedures', owner: 'Lab Tech', priority: 'High', effort: '2 hours' },
    { change: 'PK sampling at Visit 8', area: 'Budget', action: 'Amend clinical trial agreement', owner: 'Finance', priority: 'Medium', effort: '1-2 weeks' },
    { change: 'PK sampling at Visit 8', area: 'IRT/IWRS', action: 'Request system update from sponsor', owner: 'CRC', priority: 'Medium', effort: 'N/A' },
    { change: 'CT scan Q9W → Q6W', area: 'Visit Schedule', action: 'Add extra scan visits to calendar', owner: 'CRC', priority: 'High', effort: '3 hours' },
    { change: 'CT scan Q9W → Q6W', area: 'Radiology', action: 'Increase scan scheduling capacity', owner: 'Rad Dept', priority: 'Medium', effort: '1 hour' },
    { change: 'CT scan Q9W → Q6W', area: 'Budget', action: 'Additional imaging costs — amend budget', owner: 'Finance', priority: 'Medium', effort: '1-2 weeks' },
    { change: 'SAE window 30→90 days', area: 'Safety SOPs', action: 'Update safety SOPs, retrain all staff', owner: 'PI', priority: 'Critical', effort: '4 hours' },
    { change: 'SAE window 30→90 days', area: 'Follow-up', action: 'Extend patient follow-up tracking', owner: 'CRC', priority: 'High', effort: '1 hour/patient' },
];

const affectedDocs = [
    { doc: 'Informed Consent Form', from: 'v3.0', to: 'v4.0', status: 'pending' },
    { doc: 'Visit Schedule / Schedule of Assessments', from: 'v2.1', to: 'v3.0', status: 'pending' },
    { doc: 'Source Document Worksheets (Visits 8, 12, 16)', from: 'v1.2', to: 'v2.0', status: 'pending' },
    { doc: 'Staff Training Log', from: '—', to: 'Update', status: 'pending' },
    { doc: 'Delegation Log', from: '—', to: 'Update if new procedures delegated', status: 'pending' },
    { doc: 'IRB Notification/Approval', from: '—', to: 'Submit', status: 'pending' },
    { doc: 'CRF/EDC Specifications', from: 'v3.0', to: 'v4.0', status: 'pending' },
    { doc: 'Monitoring Plan', from: 'v1.1', to: 'v1.2', status: 'pending' },
    { doc: 'Safety Management Plan', from: 'v2.0', to: 'v3.0', status: 'pending' },
    { doc: 'Site Reference Card', from: 'v2.0', to: 'v3.0', status: 'pending' },
];

const timelinePhases = [
    { phase: 'IRB Submission', start: 0, duration: 5, critical: false },
    { phase: 'IRB Review & Approval', start: 5, duration: 21, critical: true },
    { phase: 'ICF Update & Translation', start: 5, duration: 14, critical: false },
    { phase: 'EDC & IRT Updates', start: 5, duration: 28, critical: true },
    { phase: 'Staff Training', start: 26, duration: 7, critical: false },
    { phase: 'Source Doc Updates', start: 12, duration: 10, critical: false },
    { phase: 'Subject Re-consent', start: 26, duration: 21, critical: true },
    { phase: 'Safety SOP Update', start: 0, duration: 7, critical: true },
];
const totalDays = 47;

type TabId = 'changes' | 'cascade' | 'documents' | 'timeline' | 'reconsent';

const severityColor = (s: string) => {
    if (s === 'Critical') return 'bg-red-50 text-red-700 border-red-200';
    if (s === 'Major' || s === 'High') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-blue-50 text-blue-700 border-blue-200';
};

export default function AmendmentImpactAssessment({ template, onBack }: { template: any, onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<TabId>('changes');
    const [docChecked, setDocChecked] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [originalFile, setOriginalFile] = useState<string | null>(null);
    const [amendedFile, setAmendedFile] = useState<string | null>(null);

    const handleRunAssessment = () => {
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); setIsLoaded(true); }, 3000);
    };

    const handleLoadSample = () => {
        setOriginalFile('PHOENIX-301_Protocol_v3.0.pdf');
        setAmendedFile('PHOENIX-301_Protocol_v4.0_Amendment2.pdf');
    };

    const tabs: { id: TabId; label: string }[] = [
        { id: 'changes', label: 'Changes' },
        { id: 'cascade', label: 'Cascade' },
        { id: 'documents', label: 'Documents' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'reconsent', label: 'Re-consent' },
    ];

    if (!isLoaded) {
        return (
            <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto flex flex-col items-center justify-center p-8">
                <Card className="max-w-xl w-full shadow-xl border-slate-200">
                    <CardContent className="p-10">
                        {!isLoading ? (<>
                            <div className="text-center mb-8">
                                <GitBranch className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{template.name}</h2>
                                <p className="text-slate-500">Upload two protocol versions to detect changes and assess downstream impact.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${originalFile ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                    onClick={() => setOriginalFile('uploaded_protocol_original.pdf')}
                                >
                                    {originalFile ? (
                                        <>
                                            <FileCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-emerald-700 truncate">{originalFile}</p>
                                            <p className="text-[10px] text-emerald-600 mt-1">Original loaded</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs font-semibold text-slate-600">Original Protocol</p>
                                            <p className="text-[10px] text-slate-400 mt-1">v3.0 or current version</p>
                                        </>
                                    )}
                                </div>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${amendedFile ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                    onClick={() => setAmendedFile('uploaded_protocol_amended.pdf')}
                                >
                                    {amendedFile ? (
                                        <>
                                            <FileCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-emerald-700 truncate">{amendedFile}</p>
                                            <p className="text-[10px] text-emerald-600 mt-1">Amendment loaded</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs font-semibold text-slate-600">Amended Protocol</p>
                                            <p className="text-[10px] text-slate-400 mt-1">New version with changes</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    className="flex-1 bg-florence-indigo hover:bg-florence-indigo/90 text-white font-semibold"
                                    disabled={!originalFile || !amendedFile}
                                    onClick={handleRunAssessment}
                                >
                                    <GitBranch className="w-4 h-4 mr-2" /> Run Impact Assessment
                                </Button>
                                <Button variant="outline" className="text-xs" onClick={handleLoadSample}>
                                    Load Sample
                                </Button>
                            </div>
                            {(!originalFile || !amendedFile) && (
                                <p className="text-[10px] text-slate-400 text-center mt-3">Upload both documents or click "Load Sample" to use PHOENIX-301 Amendment #2</p>
                            )}
                        </>) : (<>
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-florence-indigo animate-spin mx-auto mb-6" />
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing Amendment Impact...</h2>
                                <p className="text-slate-500 text-sm mb-6">Comparing {originalFile} → {amendedFile}</p>
                                <div className="space-y-2 text-left text-sm">
                                    {[
                                        'Extracting text and structure from both documents...',
                                        'Running section-by-section diff analysis...',
                                        'Classifying changes by severity (Critical / Major / Minor)...',
                                        'Mapping downstream cascade impacts...',
                                        'Calculating implementation timeline...',
                                        'Identifying re-consent requirements...',
                                    ].map((step, i) => (
                                        <p key={i} className="text-slate-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>▸ {step}</p>
                                    ))}
                                </div>
                            </div>
                        </>)}
                    </CardContent>
                </Card>
                <Button variant="ghost" onClick={onBack} className="mt-6 text-slate-400"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Store</Button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amendment #2 — PHOENIX-301</p>
                        <h2 className="text-lg font-bold text-slate-800">{template.name}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">{changes.filter(c => c.severity === 'Critical').length} Critical</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">{changes.filter(c => c.severity === 'Major').length} Major</span>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-6 flex-1">
                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-lg p-1 w-fit shadow-sm">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === t.id ? 'bg-florence-indigo text-white' : 'text-slate-600 hover:text-slate-800'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Changes Tab */}
                {activeTab === 'changes' && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-4">{changes.length} changes detected across {new Set(changes.map(c => c.section)).size} protocol sections.</p>
                        {changes.map(c => (
                            <Card key={c.id} className="border-slate-200 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityColor(c.severity)}`}>{c.severity}</span>
                                                <span className="text-xs font-medium text-slate-500">{c.section}</span>
                                                <span className="text-xs text-slate-400">• {c.type}</span>
                                            </div>
                                            <p className="font-semibold text-slate-800">{c.desc}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                                            <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Original (v3.0)</p>
                                            <p className="text-slate-700 line-through decoration-red-300">{c.original}</p>
                                        </div>
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Amended (v4.0)</p>
                                            <p className="text-slate-700">{c.amended}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Cascade Tab */}
                {activeTab === 'cascade' && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold flex items-center gap-2"><GitBranch className="w-4 h-4 text-florence-indigo" /> Impact Cascade — {cascadeData.length} downstream actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100 text-sm">
                                    <thead className="bg-slate-50"><tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Change</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Impact Area</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Action</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Owner</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Priority</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Effort</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {cascadeData.map((row, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{row.change}</td>
                                                <td className="px-4 py-3 text-slate-600">{row.area}</td>
                                                <td className="px-4 py-3 text-slate-600">{row.action}</td>
                                                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{row.owner}</td>
                                                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityColor(row.priority)}`}>{row.priority}</span></td>
                                                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{row.effort}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-florence-indigo" /> Affected Documents — {affectedDocs.length} require updates</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-2">
                                {affectedDocs.map((doc, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 ${docChecked[doc.doc] ? 'bg-emerald-50/50' : ''}`}
                                        onClick={() => setDocChecked(prev => ({ ...prev, [doc.doc]: !prev[doc.doc] }))}>
                                        {docChecked[doc.doc]
                                            ? <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                                            : <Square className="w-5 h-5 text-slate-300 shrink-0" />}
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${docChecked[doc.doc] ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{doc.doc}</p>
                                        </div>
                                        {doc.from !== '—' && <span className="text-xs text-slate-400">{doc.from} → {doc.to}</span>}
                                        {doc.from === '—' && <span className="text-xs text-amber-600 font-medium">{doc.to}</span>}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-florence-indigo" /> Implementation Timeline — {totalDays} days to full implementation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {timelinePhases.map((p, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="w-40 text-xs font-medium text-slate-700 text-right shrink-0">{p.phase}</span>
                                        <div className="flex-1 relative h-7">
                                            <div className="absolute inset-0 bg-slate-100 rounded"></div>
                                            <div className={`absolute top-0 h-7 rounded flex items-center px-2 text-[10px] font-bold text-white ${p.critical ? 'bg-red-500' : 'bg-indigo-400'}`}
                                                style={{ left: `${(p.start / totalDays) * 100}%`, width: `${(p.duration / totalDays) * 100}%` }}>
                                                {p.duration}d
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Critical path</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-400 rounded"></span> Parallel tasks</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Re-consent Tab */}
                {activeTab === 'reconsent' && (
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2"><Users className="w-4 h-4 text-florence-indigo" /> Re-Consent Tracker</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-blue-900">16</p>
                                        <p className="text-xs text-blue-600 font-medium">Enrolled Subjects</p>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-emerald-900">14</p>
                                        <p className="text-xs text-emerald-600 font-medium">Re-consented</p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-extrabold text-amber-900">2</p>
                                        <p className="text-xs text-amber-600 font-medium">Pending</p>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '87.5%' }}></div>
                                </div>
                                <p className="text-xs text-slate-500 text-right">87.5% complete</p>
                                <div className="mt-4 space-y-2">
                                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-between">
                                        <div><p className="font-semibold text-sm text-slate-800">Patient 301-012</p><p className="text-xs text-slate-500">Next visit: March 4, 2025</p></div>
                                        <span className="text-xs font-bold text-amber-600">Pending</span>
                                    </div>
                                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-between">
                                        <div><p className="font-semibold text-sm text-slate-800">Patient 301-015</p><p className="text-xs text-slate-500">Next visit: March 11, 2025</p></div>
                                        <span className="text-xs font-bold text-amber-600">Pending</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
