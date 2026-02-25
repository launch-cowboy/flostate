import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, CheckSquare, Square, ClipboardCheck, FileText, Shield, Pill, AlertTriangle, HeartPulse, ChevronDown, ChevronRight, Download } from 'lucide-react';

const checklistSections = [
    {
        id: 'regulatory', title: 'Section A: Regulatory / ISF Review', icon: Shield,
        items: [
            { id: 'a1', text: 'Form 1572 current and accurate', status: 'pass', note: 'Last updated 2024-12-15' },
            { id: 'a2', text: 'All sub-investigators listed and qualified', status: 'flag', note: 'Dr. Patel added — verify qualifications' },
            { id: 'a3', text: 'Delegation log complete and signed', status: 'pass', note: '8 delegates, all current' },
            { id: 'a4', text: 'IRB approval current', status: 'pass', note: 'Expiry: 2025-06-30 (127 days)' },
            { id: 'a5', text: 'Current protocol version at site matches sponsor', status: 'pass', note: 'v4.0 — Amendment #2, both matching' },
            { id: 'a6', text: 'Financial disclosures on file for all investigators', status: 'flag', note: 'Dr. Rodriguez annual update due in 18 days' },
            { id: 'a7', text: 'Lab certifications current (CLIA/CAP)', status: 'pass', note: 'CLIA valid through 2026-03-15' },
        ]
    },
    {
        id: 'consent', title: 'Section B: Informed Consent', icon: FileText,
        items: [
            { id: 'b1', text: 'Current ICF version in use (v3.0)', status: 'pass', note: 'Approved by IRB 2024-11-20' },
            { id: 'b2', text: 'All enrolled subjects have signed current version', status: 'flag', note: '14 of 16 re-consented — 2 pending (Patients 301-012, 301-015)' },
            { id: 'b3', text: 'Re-consent completed for Amendment #2', status: 'flag', note: '87.5% complete — 2 subjects require re-consent' },
            { id: 'b4', text: 'Consent process documentation adequate', status: 'pass', note: 'Compliant per 21 CFR Part 50' },
        ]
    },
    {
        id: 'sdv', title: 'Section C: Source Data Verification', icon: ClipboardCheck,
        items: [
            { id: 'c1', text: 'SDV subjects selected (risk-based): 301-003, 301-008, 301-011, 301-016', status: 'pending', note: '4 subjects selected per RBM plan' },
            { id: 'c2', text: 'Verify primary efficacy endpoint data (RECIST 1.1 assessments)', status: 'pending', note: 'CT scans at Week 18 for 301-003, 301-008' },
            { id: 'c3', text: 'Centralized monitoring flags: 3 queries open for 301-008', status: 'flag', note: 'Visit window deviation + AE timing discrepancy' },
            { id: 'c4', text: 'Verify key safety data: AE onset dates, concomitant medications', status: 'pending', note: '' },
        ]
    },
    {
        id: 'ip', title: 'Section D: Investigational Product', icon: Pill,
        items: [
            { id: 'd1', text: 'IP accountability log reconciled', status: 'pending', note: '24 vials received, 18 dispensed, 4 returned, 2 in stock' },
            { id: 'd2', text: 'Storage conditions documented (temperature log)', status: 'pass', note: 'Continuous monitor — no excursions' },
            { id: 'd3', text: 'Expiry dates verified', status: 'pass', note: 'Earliest expiry: 2025-09-30' },
            { id: 'd4', text: 'Dispensing matches randomization (IRT reconciliation)', status: 'pending', note: '' },
        ]
    },
    {
        id: 'safety', title: 'Section E: Safety Review', icon: HeartPulse,
        items: [
            { id: 'e1', text: 'All AEs reported and graded correctly (CTCAE v5.0)', status: 'flag', note: '1 AE potentially misgraded: rash Grade 1 vs Grade 2 for 301-011' },
            { id: 'e2', text: 'SAE reporting timelines met', status: 'pass', note: '2 SAEs reported, both within 24-hour window' },
            { id: 'e3', text: 'Follow-up on previously reported events documented', status: 'pass', note: 'SAE-001 resolved, SAE-002 ongoing — follow-up current' },
        ]
    },
    {
        id: 'risk', title: 'Section F: Site-Specific Risk Flags', icon: AlertTriangle,
        items: [
            { id: 'f1', text: 'Open action items from previous visit: 2', status: 'flag', note: 'Delegation log update (resolved), source doc template update (pending)' },
            { id: 'f2', text: 'KRI signal: Screen failure rate 42% (threshold: 40%)', status: 'flag', note: 'Marginally above threshold — monitor next 3 subjects' },
            { id: 'f3', text: 'Centralized monitoring: Protocol deviation rate within limits', status: 'pass', note: '0.5 per subject — below 1.0 threshold' },
        ]
    },
];

const visitInfo = {
    study: 'ONK-301 — PHOENIX Phase III NSCLC',
    site: 'Metro Clinical Research Center (Site 4521)',
    visitType: 'Routine Monitoring Visit',
    date: 'February 26, 2025',
    cra: 'Jennifer Walsh (Syneos Health)',
    previousVisit: 'January 15, 2025',
    enrolledSubjects: 16,
    targetSubjects: 25,
};

export default function CRAMonitoringVisitPrep({ template, onBack }: { template: any, onBack: () => void }) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
        Object.fromEntries(checklistSections.map(s => [s.id, true]))
    );

    const toggleItem = (id: string) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleSection = (id: string) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

    const totalItems = checklistSections.reduce((acc, s) => acc + s.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const flagCount = checklistSections.reduce((acc, s) => acc + s.items.filter(i => i.status === 'flag').length, 0);
    const pct = Math.round((checkedCount / totalItems) * 100);

    return (
        <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Template Workspace</p>
                        <h2 className="text-lg font-bold text-slate-800">{template.name}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-500">{checkedCount} of {totalItems} reviewed</p>
                        <div className="w-32 bg-slate-200 rounded-full h-2 mt-1">
                            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export Report</Button>
                </div>
            </header>

            <div className="max-w-[1100px] mx-auto w-full px-4 md:px-8 py-6 flex-1">
                {/* Visit Info Banner */}
                <Card className="mb-6 border-indigo-100 bg-indigo-50/30">
                    <CardContent className="p-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Study</p><p className="font-semibold text-slate-800">{visitInfo.study}</p></div>
                            <div><p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Site</p><p className="font-semibold text-slate-800">{visitInfo.site}</p></div>
                            <div><p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Visit Date</p><p className="font-semibold text-slate-800">{visitInfo.date}</p></div>
                            <div><p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">CRA</p><p className="font-semibold text-slate-800">{visitInfo.cra}</p></div>
                        </div>
                        <div className="flex gap-6 mt-3 pt-3 border-t border-indigo-100 text-xs text-slate-600">
                            <span>Type: <strong>{visitInfo.visitType}</strong></span>
                            <span>Enrolled: <strong>{visitInfo.enrolledSubjects}/{visitInfo.targetSubjects}</strong></span>
                            <span>Previous Visit: <strong>{visitInfo.previousVisit}</strong></span>
                            <span className="text-amber-600 font-bold">⚠ {flagCount} items flagged</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Checklist Sections */}
                <div className="space-y-4">
                    {checklistSections.map(section => {
                        const SectionIcon = section.icon;
                        const sectionChecked = section.items.filter(i => checkedItems[i.id]).length;
                        const isExpanded = expandedSections[section.id];

                        return (
                            <Card key={section.id} className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-0 cursor-pointer" onClick={() => toggleSection(section.id)}>
                                    <CardTitle className="text-base font-bold flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <SectionIcon className="w-4 h-4 text-florence-indigo" />
                                            {section.title}
                                            <span className="text-xs font-medium text-slate-400 ml-2">{sectionChecked}/{section.items.length}</span>
                                        </div>
                                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                    </CardTitle>
                                </CardHeader>
                                {isExpanded && (
                                    <CardContent className="pt-3">
                                        <div className="space-y-2">
                                            {section.items.map(item => (
                                                <div key={item.id}
                                                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 ${checkedItems[item.id] ? 'bg-emerald-50/50' : ''}`}
                                                    onClick={() => toggleItem(item.id)}>
                                                    {checkedItems[item.id]
                                                        ? <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                        : <Square className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />}
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${checkedItems[item.id] ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{item.text}</p>
                                                        {item.note && <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>}
                                                    </div>
                                                    {item.status === 'flag' && !checkedItems[item.id] && (
                                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">FLAGGED</span>
                                                    )}
                                                    {item.status === 'pass' && !checkedItems[item.id] && (
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">PASS</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom Summary */}
                {checkedCount === totalItems && (
                    <Card className="mt-6 border-emerald-200 bg-emerald-50">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-bold text-emerald-800 mb-2">✓ Pre-Visit Checklist Complete</h3>
                            <p className="text-sm text-emerald-700 mb-4">All {totalItems} items reviewed. {flagCount} items flagged for on-site follow-up.</p>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Generate Visit Report</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
