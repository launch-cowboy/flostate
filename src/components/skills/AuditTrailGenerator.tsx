import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, Shield, CheckCircle2, Edit3, XCircle, Download, Filter, Clock, User, Cpu, FileText } from 'lucide-react';

type ViewId = 'log' | 'summary' | 'compliance';

const auditEntries = [
    { id: 1, ts: '2025-02-24T08:02:14-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Virtual SMO — Morning Briefing', actionType: 'Generated', inputSummary: 'Request: Daily priority briefing for 7 active studies', outputSummary: 'Briefing generated: 3 priority items, 7 study status cards, 2 scheduling conflicts', decision: 'Approved', confidence: 0.94, study: 'Multi-study', docAffected: 'N/A', gxp: 'Non-GxP' },
    { id: 2, ts: '2025-02-24T08:15:32-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Virtual SMO — Query Response', actionType: 'Generated', inputSummary: 'Draft query response for PD-001 (missed visit window, Patient 301-008)', outputSummary: 'AI drafted explanation including documentation of alternative visit date and reason for deviation', decision: 'Edited', confidence: 0.87, study: 'ONK-301', docAffected: 'Query Response Form', gxp: 'GxP-critical' },
    { id: 3, ts: '2025-02-24T08:18:45-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Regulatory Calendar', actionType: 'Reviewed', inputSummary: 'Check credential expiry alerts', outputSummary: 'Identified: Dr. Patel GCP expiry in 14 days, Dr. Rodriguez financial disclosure update in 18 days', decision: 'Approved', confidence: 0.99, study: 'Multi-study', docAffected: 'Credential Tracker', gxp: 'GxP-relevant' },
    { id: 4, ts: '2025-02-24T09:30:11-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Reconciliation Bot', actionType: 'Generated', inputSummary: 'Run eISF-eTMF reconciliation for ONK-301', outputSummary: '247 documents compared: 231 matched, 4 critical findings (ICF version mismatch, expired credential, missing financial disclosure, incomplete delegation log)', decision: 'Approved', confidence: 0.96, study: 'ONK-301', docAffected: 'eISF/eTMF Records', gxp: 'GxP-critical' },
    { id: 5, ts: '2025-02-24T10:05:23-05:00', user: 'Dr. Sarah Chen', role: 'PI', site: 'Site 4521', agent: 'Regulatory Document Factory — 1572 Agent', actionType: 'Generated', inputSummary: 'Generate updated Form 1572 with new Sub-I Dr. Patel', outputSummary: 'Form 1572 populated: 10/10 sections, Dr. Patel added to Section 6, facility info verified', decision: 'Edited', confidence: 0.91, study: 'ONK-301', docAffected: 'FDA Form 1572', gxp: 'GxP-critical' },
    { id: 6, ts: '2025-02-24T10:08:55-05:00', user: 'Dr. Sarah Chen', role: 'PI', site: 'Site 4521', agent: 'Regulatory Document Factory — CV Agent', actionType: 'Generated', inputSummary: 'Scan PI credentials and sub-investigators', outputSummary: 'Alert: Dr. Chen medical license expires in 45 days. Generated renewal reminder.', decision: 'Approved', confidence: 0.98, study: 'ONK-301', docAffected: 'CV & License Records', gxp: 'GxP-relevant' },
    { id: 7, ts: '2025-02-24T10:22:18-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Protocol Reader', actionType: 'Generated', inputSummary: 'Extract Schedule of Events from PHOENIX-301 Amendment #2', outputSummary: 'Extracted: 24 visits, 16 procedures, identified PK substudy at Visit 8, flagged CT scan frequency change', decision: 'Approved', confidence: 0.93, study: 'ONK-301', docAffected: 'Study Reference Card', gxp: 'Non-GxP' },
    { id: 8, ts: '2025-02-24T11:45:07-05:00', user: 'Jennifer Walsh', role: 'CRA', site: 'Site 4521', agent: 'CRA Monitor Visit Prep', actionType: 'Generated', inputSummary: 'Generate pre-visit checklist for routine monitoring visit', outputSummary: 'Checklist generated: 26 items across 6 sections, 7 items flagged (2 consent re-consent pending, 1 AE grading review)', decision: 'Approved', confidence: 0.92, study: 'ONK-301', docAffected: 'Monitoring Visit Report', gxp: 'GxP-critical' },
    { id: 9, ts: '2025-02-24T13:10:44-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Amendment Impact Assessment', actionType: 'Generated', inputSummary: 'Assess impact of Amendment #2 — PHOENIX-301', outputSummary: 'Detected 7 changes: 2 Critical, 3 Major, 2 Minor. 12 downstream cascade actions. 10 documents affected. Est. 47 days to full implementation.', decision: 'Approved', confidence: 0.89, study: 'ONK-301', docAffected: 'Amendment Impact Report', gxp: 'GxP-relevant' },
    { id: 10, ts: '2025-02-24T14:30:22-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Protocol Complexity Scorer', actionType: 'Generated', inputSummary: 'Score burden for new protocol CNS-405', outputSummary: 'Overall burden score: 6.8/10 (Moderate-High). Key drivers: Visit Frequency 7.2, Procedure Complexity 6.5, Patient Burden 7.8', decision: 'Approved', confidence: 0.95, study: 'CNS-405', docAffected: 'Complexity Scorecard', gxp: 'Non-GxP' },
    { id: 11, ts: '2025-02-24T15:05:33-05:00', user: 'Dr. Sarah Chen', role: 'PI', site: 'Site 4521', agent: 'Regulatory Document Factory — Delegation Agent', actionType: 'Generated', inputSummary: 'Validate delegation log against training records and credentials', outputSummary: 'Gap found: Dr. Patel has GCP training but missing protocol-specific training for ONK-301. Action item generated.', decision: 'Rejected', confidence: 0.88, study: 'ONK-301', docAffected: 'Delegation of Authority Log', gxp: 'GxP-critical' },
    { id: 12, ts: '2025-02-24T15:15:12-05:00', user: 'Maria Rodriguez', role: 'CRC', site: 'Site 4521', agent: 'Virtual SMO — Scheduling', actionType: 'Generated', inputSummary: 'Resolve scheduling conflict: two monitoring visits overlapping tomorrow at 2 PM', outputSummary: 'Suggested: Move IQVIA visit for CARD-112 to Wednesday 10:00 AM. CRA availability confirmed.', decision: 'Approved', confidence: 0.82, study: 'Multi-study', docAffected: 'Visit Calendar', gxp: 'Non-GxP' },
];

const decisionColor = (d: string) => {
    if (d === 'Approved') return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', Icon: CheckCircle2 };
    if (d === 'Edited') return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', Icon: Edit3 };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', Icon: XCircle };
};

const gxpColor = (g: string) => {
    if (g === 'GxP-critical') return 'bg-red-50 text-red-700 border-red-200';
    if (g === 'GxP-relevant') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
};

export default function AuditTrailGenerator({ skill: _skill, onBack }: { skill: any, onBack: () => void }) {
    const [activeView, setActiveView] = useState<ViewId>('log');
    const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
    const [filterGxp, setFilterGxp] = useState<string>('all');

    const filteredEntries = filterGxp === 'all' ? auditEntries : auditEntries.filter(e => e.gxp === filterGxp);

    const totalActions = auditEntries.length;
    const approved = auditEntries.filter(e => e.decision === 'Approved').length;
    const edited = auditEntries.filter(e => e.decision === 'Edited').length;
    const rejected = auditEntries.filter(e => e.decision === 'Rejected').length;

    const views: { id: ViewId; label: string }[] = [
        { id: 'log', label: 'Session Log' },
        { id: 'summary', label: 'Session Summary' },
        { id: 'compliance', label: 'Compliance Dashboard' },
    ];

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Audit Trail Generator</p>
                        <h2 className="text-lg font-bold text-slate-800">Session: February 24, 2025</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export for TMF</Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"><Shield className="w-4 h-4 mr-1" /> Inspector View</Button>
                </div>
            </header>

            <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-6 flex-1">
                <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-lg p-1 w-fit shadow-sm">
                    {views.map(v => (
                        <button key={v.id} onClick={() => setActiveView(v.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeView === v.id ? 'bg-florence-indigo text-white' : 'text-slate-600 hover:text-slate-800'}`}>
                            {v.label}
                        </button>
                    ))}
                </div>

                {/* Session Log */}
                {activeView === 'log' && (<>
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-4 h-4 text-slate-400" />
                        {['all', 'GxP-critical', 'GxP-relevant', 'Non-GxP'].map(f => (
                            <button key={f} onClick={() => setFilterGxp(f)}
                                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${filterGxp === f ? 'bg-florence-indigo text-white border-florence-indigo' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                                {f === 'all' ? 'All' : f}
                            </button>
                        ))}
                        <span className="text-xs text-slate-400 ml-2">{filteredEntries.length} entries</span>
                    </div>
                    <div className="space-y-2">
                        {filteredEntries.map(entry => {
                            const dc = decisionColor(entry.decision);
                            const isExpanded = expandedEntry === entry.id;
                            return (
                                <Card key={entry.id} className="border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${dc.bg}`}>
                                                <dc.Icon className={`w-4 h-4 ${dc.text}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="text-xs font-mono text-slate-400">{new Date(entry.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="text-xs font-semibold text-slate-700">{entry.user}</span>
                                                    <span className="text-xs text-slate-400">({entry.role})</span>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${gxpColor(entry.gxp)}`}>{entry.gxp}</span>
                                                </div>
                                                <p className="text-sm text-slate-800 truncate"><Cpu className="w-3 h-3 inline mr-1 text-indigo-400" />{entry.agent} — <span className="font-medium">{entry.actionType}</span></p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">{entry.outputSummary}</p>

                                                {isExpanded && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div><p className="font-bold text-slate-500 uppercase text-[10px]">Input</p><p className="text-slate-700">{entry.inputSummary}</p></div>
                                                            <div><p className="font-bold text-slate-500 uppercase text-[10px]">Output</p><p className="text-slate-700">{entry.outputSummary}</p></div>
                                                        </div>
                                                        <div className="flex gap-4 text-slate-500">
                                                            <span>Study: <strong>{entry.study}</strong></span>
                                                            <span>Document: <strong>{entry.docAffected}</strong></span>
                                                            <span>Confidence: <strong>{(entry.confidence * 100).toFixed(0)}%</strong></span>
                                                            <span>Decision: <strong className={dc.text}>{entry.decision}</strong></span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${dc.bg} ${dc.text} ${dc.border}`}>{entry.decision}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </>)}

                {/* Session Summary */}
                {activeView === 'summary' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600/70 mb-1">Total AI Actions</p>
                                <p className="text-2xl font-extrabold text-blue-950">{totalActions}</p>
                            </div>
                            <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70 mb-1">Approved As-Is</p>
                                <p className="text-2xl font-extrabold text-emerald-950">{approved} <span className="text-sm font-medium text-emerald-600">({Math.round(approved / totalActions * 100)}%)</span></p>
                            </div>
                            <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600/70 mb-1">Human Edits</p>
                                <p className="text-2xl font-extrabold text-amber-950">{edited} <span className="text-sm font-medium text-amber-600">({Math.round(edited / totalActions * 100)}%)</span></p>
                            </div>
                            <div className="bg-red-50/40 border border-red-100 rounded-xl p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600/70 mb-1">Rejections</p>
                                <p className="text-2xl font-extrabold text-red-950">{rejected} <span className="text-sm font-medium text-red-600">({Math.round(rejected / totalActions * 100)}%)</span></p>
                            </div>
                        </div>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-3"><CardTitle className="text-base font-bold">Session Details</CardTitle></CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span className="text-slate-600">Duration: <strong>7h 13m</strong></span></div>
                                    <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /><span className="text-slate-600">Users: <strong>2</strong> (Maria Rodriguez, Dr. Sarah Chen)</span></div>
                                    <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-slate-400" /><span className="text-slate-600">Agents used: <strong>7</strong></span></div>
                                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /><span className="text-slate-600">Documents affected: <strong>9</strong></span></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Studies Touched</p>
                                    <div className="flex gap-2">
                                        {['ONK-301', 'CNS-405', 'CARD-112'].map(s => <span key={s} className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-full">{s}</span>)}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">GxP Classification Breakdown</p>
                                    <div className="flex gap-4 text-sm">
                                        <span className="text-red-600 font-semibold">{auditEntries.filter(e => e.gxp === 'GxP-critical').length} GxP-critical</span>
                                        <span className="text-amber-600 font-semibold">{auditEntries.filter(e => e.gxp === 'GxP-relevant').length} GxP-relevant</span>
                                        <span className="text-slate-600 font-semibold">{auditEntries.filter(e => e.gxp === 'Non-GxP').length} Non-GxP</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Compliance Dashboard */}
                {activeView === 'compliance' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="border-b border-slate-100 pb-3"><CardTitle className="text-base font-bold">Human-in-the-Loop Metrics</CardTitle></CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-700">Human Override Rate</span><span className="font-bold text-emerald-600">25%</span></div>
                                        <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: '25%' }}></div></div>
                                        <p className="text-[10px] text-slate-400 mt-1">Healthy range: 15-40% — demonstrates meaningful human oversight</p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-700">AI Accuracy (Approved w/o edit)</span><span className="font-bold text-blue-600">75%</span></div>
                                        <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="font-medium text-slate-700">Average Confidence Score</span><span className="font-bold text-indigo-600">92%</span></div>
                                        <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{ width: '92%' }}></div></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="border-b border-slate-100 pb-3"><CardTitle className="text-base font-bold">ALCOA+ Compliance</CardTitle></CardHeader>
                                <CardContent className="pt-4 space-y-2">
                                    {[
                                        { label: 'Attributable', desc: 'Every action linked to user ID and role', status: true },
                                        { label: 'Legible', desc: 'All entries human-readable with structured format', status: true },
                                        { label: 'Contemporaneous', desc: 'ISO 8601 timestamps at time of action', status: true },
                                        { label: 'Original', desc: 'First entry preserved, edits tracked as separate events', status: true },
                                        { label: 'Accurate', desc: 'Input/output pairs captured verbatim', status: true },
                                        { label: 'Complete', desc: 'No gaps in session recording', status: true },
                                        { label: 'Consistent', desc: 'Uniform format across all entries', status: true },
                                        { label: 'Enduring', desc: 'Records stored in immutable audit log', status: true },
                                        { label: 'Available', desc: 'Exportable for TMF filing and inspector review', status: true },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{item.label}</p>
                                                <p className="text-[10px] text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="border-emerald-200 bg-emerald-50">
                            <CardContent className="p-6 text-center">
                                <Shield className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-emerald-800 mb-1">Regulatory Readiness: 100%</h3>
                                <p className="text-sm text-emerald-700">All ALCOA+ principles satisfied. FDA 21 CFR Part 11 §11.10(e) compliant. Ready for inspection.</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
