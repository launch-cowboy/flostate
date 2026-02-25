import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ArrowLeft, Upload, FileText, Calendar, Target, BarChart3, Activity, Download, Loader2 } from 'lucide-react';

type TabId = 'overview' | 'schedule' | 'eligibility' | 'endpoints' | 'design' | 'complexity';

const studyOverview = {
    title: 'PHOENIX-301',
    fullTitle: 'A Randomized, Double-Blind, Placebo-Controlled Phase III Study of Drug X + Pembrolizumab vs Placebo + Pembrolizumab in First-Line Advanced NSCLC',
    sponsor: 'Axion Therapeutics',
    phase: 'Phase III',
    design: 'Randomized, double-blind, parallel-group',
    blinding: 'Double-blind',
    ratio: '1:1',
    arms: [
        { name: 'Arm A (Experimental)', desc: 'Drug X 200mg PO QD + Pembrolizumab 200mg IV Q3W' },
        { name: 'Arm B (Control)', desc: 'Placebo PO QD + Pembrolizumab 200mg IV Q3W' },
    ],
    enrollment: 450,
    duration: '104 weeks treatment + 2-year follow-up',
    countries: 'US, Canada, UK, Germany, France, Japan, South Korea, Australia',
};

const visits = ['Scr', 'BL', 'W3', 'W6', 'W9', 'W12', 'W15', 'W18', 'W21', 'W24', 'W30', 'W36', 'W48', 'W60', 'W72', 'W84', 'W96', 'W104', 'EOT', 'FU1', 'FU2', 'FU3', 'FU4', 'FU5'];
const procedures = [
    { name: 'Informed Consent', checks: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Vital Signs', checks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'Physical Exam', checks: [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'ECOG PS', checks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'Hematology', checks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'Chemistry Panel', checks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'Thyroid Function', checks: [1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'CT Scan (RECIST)', checks: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0] },
    { name: 'ECG (12-lead)', checks: [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
    { name: 'PK Sampling', checks: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], note: 'Cohort 1 only' },
    { name: 'Drug X / Placebo Admin', checks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0] },
    { name: 'Pembrolizumab IV', checks: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0] },
    { name: 'AE Assessment', checks: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { name: 'ConMed Review', checks: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'EORTC QLQ-C30', checks: [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0] },
    { name: 'Survival Follow-up', checks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
];

const inclusionCriteria = [
    { id: 1, text: 'Histologically or cytologically confirmed Stage IV NSCLC', plain: 'Biopsy-confirmed advanced lung cancer that has spread', restrictive: false },
    { id: 2, text: 'PD-L1 TPS ≥1% by Dako 22C3 pharmDx assay', plain: 'Tumor must express PD-L1 biomarker at ≥1% — requires specific lab test', restrictive: true },
    { id: 3, text: 'No prior systemic therapy for advanced/metastatic NSCLC', plain: 'First-line treatment only — no prior chemo or immunotherapy for advanced disease', restrictive: true },
    { id: 4, text: 'ECOG performance status 0-1', plain: 'Patient can perform daily activities with minor or no limitations', restrictive: false },
    { id: 5, text: 'Measurable disease per RECIST 1.1', plain: 'At least one tumor measurable on CT scan (≥10mm)', restrictive: false },
    { id: 6, text: 'Adequate organ function (ANC ≥1.5, Plt ≥100, Hgb ≥9.0, Tbili ≤1.5×ULN, AST/ALT ≤2.5×ULN, CrCl ≥50)', plain: 'Lab values must show organs are functioning well enough for treatment', restrictive: false },
];

const exclusionCriteria = [
    { id: 1, text: 'Known EGFR mutations or ALK rearrangements', plain: 'Patients with targetable mutations should receive targeted therapy instead', restrictive: true },
    { id: 2, text: 'Prior anti-PD-L1 therapy', plain: 'Previous treatment with similar immunotherapy drugs is not allowed', restrictive: true },
    { id: 3, text: 'Active autoimmune disease requiring systemic therapy within 2 years', plain: 'Immune conditions like lupus or rheumatoid arthritis on medication', restrictive: false },
    { id: 4, text: 'Known brain metastases unless treated and stable ≥4 weeks', plain: 'Cancer spread to brain must be treated and stable before enrolling', restrictive: false },
    { id: 5, text: 'Currently on >10 mg/day of prednisone equivalent', plain: 'Cannot be on high doses of steroids', restrictive: false },
];

const endpoints = [
    { type: 'Primary', name: 'Progression-Free Survival (PFS)', definition: 'Time from randomization to disease progression (RECIST 1.1) or death', timepoint: 'Throughout treatment', method: 'Stratified log-rank test; HR estimated by Cox model' },
    { type: 'Secondary', name: 'Overall Survival (OS)', definition: 'Time from randomization to death from any cause', timepoint: 'Through end of study', method: 'Stratified log-rank test' },
    { type: 'Secondary', name: 'Objective Response Rate (ORR)', definition: 'Proportion of subjects with CR or PR per RECIST 1.1', timepoint: 'Best response', method: 'Clopper-Pearson 95% CI; CMH test' },
    { type: 'Secondary', name: 'Duration of Response (DoR)', definition: 'Time from first response to progression or death', timepoint: 'Responders only', method: 'Kaplan-Meier estimate' },
    { type: 'Exploratory', name: 'Health-Related Quality of Life', definition: 'Change from baseline in EORTC QLQ-C30 global health score', timepoint: 'Baseline, Q12W', method: 'Mixed model repeated measures' },
];

const complexityMetrics = {
    totalVisits: 24, uniqueProcedures: 16, proceduresPerPatient: 263, dataPointsEstimate: '~3.1M',
    benchmarks: [
        { metric: 'Visits per subject', study: 24, benchmark: 18, area: 'Oncology Phase III' },
        { metric: 'Unique procedures', study: 16, benchmark: 13, area: 'Oncology Phase III' },
        { metric: 'Data points (est.)', study: '3.1M', benchmark: '2.4M', area: 'Phase III avg' },
        { metric: 'Screen failure rate (est.)', study: '35-40%', benchmark: '30%', area: 'NSCLC trials' },
        { metric: 'PRO burden (questionnaires)', study: 2, benchmark: 1.5, area: 'Oncology avg' },
    ]
};

export default function ProtocolReader({ skill: _skill, onBack }: { skill: any, onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLoad = () => {
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); setIsLoaded(true); }, 2500);
    };

    const tabs: { id: TabId; label: string; icon: any }[] = [
        { id: 'overview', label: 'Study Overview', icon: FileText },
        { id: 'schedule', label: 'Schedule of Events', icon: Calendar },
        { id: 'eligibility', label: 'Eligibility', icon: Target },
        { id: 'endpoints', label: 'Endpoints', icon: Activity },
        { id: 'design', label: 'Design Parameters', icon: BarChart3 },
        { id: 'complexity', label: 'Complexity', icon: BarChart3 },
    ];

    if (!isLoaded) {
        return (
            <div className="absolute inset-0 bg-slate-50 z-50 overflow-auto flex flex-col items-center justify-center p-8">
                <Card className="max-w-lg w-full shadow-xl border-slate-200">
                    <CardContent className="p-10 text-center">
                        {!isLoading ? (<>
                            <Upload className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Protocol Reader</h2>
                            <p className="text-slate-500 mb-8">Upload a protocol PDF to extract structured data, or load a sample.</p>
                            <div className="flex gap-3 justify-center">
                                <Button variant="outline" className="font-semibold">Upload Protocol PDF</Button>
                                <Button className="bg-florence-indigo hover:bg-florence-indigo/90 text-white font-semibold" onClick={handleLoad}>Load Sample Protocol</Button>
                            </div>
                        </>) : (<>
                            <Loader2 className="w-12 h-12 text-florence-indigo animate-spin mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Extracting Protocol Data...</h2>
                            <p className="text-slate-500 text-sm mb-6">Parsing PHOENIX-301 Phase III NSCLC protocol (287 pages)</p>
                            <div className="space-y-2 text-left text-sm">
                                {['Identifying study design...', 'Extracting visit schedule...', 'Parsing eligibility criteria...', 'Mapping endpoints...', 'Calculating complexity metrics...'].map((step, i) => (
                                    <p key={i} className="text-slate-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>▸ {step}</p>
                                ))}
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
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Protocol Reader — Extraction Complete</p>
                        <h2 className="text-lg font-bold text-slate-800">PHOENIX-301</h2>
                    </div>
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export All</Button>
            </header>

            <div className="max-w-[1300px] mx-auto w-full px-4 md:px-8 py-6 flex-1">
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-florence-indigo text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
                            <t.icon className="w-4 h-4" /> {t.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{studyOverview.title}</h3>
                                <p className="text-sm text-slate-500 mb-6">{studyOverview.fullTitle}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {[
                                        ['Sponsor', studyOverview.sponsor], ['Phase', studyOverview.phase],
                                        ['Design', studyOverview.design], ['Blinding', studyOverview.blinding],
                                        ['Randomization', studyOverview.ratio], ['Target Enrollment', `${studyOverview.enrollment} subjects`],
                                        ['Duration', studyOverview.duration], ['Countries', studyOverview.countries],
                                    ].map(([label, value], i) => (
                                        <div key={i}><p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p><p className="font-semibold text-slate-800">{value}</p></div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader><CardTitle className="text-base font-bold">Study Arms</CardTitle></CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                {studyOverview.arms.map((arm, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                                        <p className="font-bold text-sm text-slate-800 mb-1">{arm.name}</p>
                                        <p className="text-xs text-slate-600">{arm.desc}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3">
                            <CardTitle className="text-base font-bold">Schedule of Events — {visits.length} visits × {procedures.length} procedures</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="text-[11px]">
                                <thead><tr className="bg-slate-50">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10 min-w-[140px]">Procedure</th>
                                    {visits.map(v => <th key={v} className="px-2 py-2 text-center font-semibold text-slate-600 min-w-[36px]">{v}</th>)}
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {procedures.map((proc, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-3 py-1.5 font-medium text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-100">
                                                {proc.name}
                                                {proc.note && <span className="text-[9px] text-amber-600 ml-1">({proc.note})</span>}
                                            </td>
                                            {proc.checks.map((c, j) => (
                                                <td key={j} className="px-2 py-1.5 text-center">
                                                    {c ? <span className="text-indigo-600 font-bold">✓</span> : <span className="text-slate-200">·</span>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'eligibility' && (
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-3"><CardTitle className="text-base font-bold text-emerald-700">Inclusion Criteria ({inclusionCriteria.length})</CardTitle></CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                {inclusionCriteria.map(c => (
                                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 mt-0.5">I{c.id}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800">{c.text}</p>
                                            <p className="text-xs text-slate-500 mt-1">→ {c.plain}</p>
                                        </div>
                                        {c.restrictive && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">Restrictive</span>}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-3"><CardTitle className="text-base font-bold text-red-700">Exclusion Criteria ({exclusionCriteria.length})</CardTitle></CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                {exclusionCriteria.map(c => (
                                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 mt-0.5">E{c.id}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800">{c.text}</p>
                                            <p className="text-xs text-slate-500 mt-1">→ {c.plain}</p>
                                        </div>
                                        {c.restrictive && <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">Screen Failure Risk</span>}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'endpoints' && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3"><CardTitle className="text-base font-bold">Endpoints</CardTitle></CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {endpoints.map((ep, i) => (
                                <div key={i} className={`p-4 rounded-lg border ${ep.type === 'Primary' ? 'bg-indigo-50/50 border-indigo-200' : ep.type === 'Secondary' ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ep.type === 'Primary' ? 'bg-indigo-100 text-indigo-700' : ep.type === 'Secondary' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>{ep.type}</span>
                                        <span className="font-bold text-sm text-slate-800">{ep.name}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2">{ep.definition}</p>
                                    <div className="flex gap-4 text-xs text-slate-500">
                                        <span>Timepoint: <strong>{ep.timepoint}</strong></span>
                                        <span>Method: <strong>{ep.method}</strong></span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'design' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Sample Size', items: ['Total: 450 subjects (225 per arm)', 'Power: 90% to detect HR 0.70', 'Alpha: 0.05 (two-sided)', 'Target PFS events: 360'] },
                            { title: 'Interim Analyses', items: ['IA at 50% of target PFS events (N=180)', 'O\'Brien-Fleming alpha spending function', 'Futility boundary: HR > 1.0'] },
                            { title: 'Stratification', items: ['PD-L1 TPS (≥50% vs <50%)', 'Geographic region (East Asia vs Rest of World)', 'Histology (squamous vs non-squamous)'] },
                            { title: 'DSMB', items: ['Independent DSMB with 5 members', 'Reviews unblinded safety data Q6M', 'Formal interim efficacy review at IA1', 'Charter requires disclosure rules'] },
                        ].map((card, i) => (
                            <Card key={i} className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-2"><CardTitle className="text-base font-bold">{card.title}</CardTitle></CardHeader>
                                <CardContent className="pt-0">
                                    <ul className="space-y-2">
                                        {card.items.map((item, j) => <li key={j} className="text-sm text-slate-600 flex items-start gap-2"><span className="text-indigo-400 mt-1">•</span>{item}</li>)}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'complexity' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Visits', value: complexityMetrics.totalVisits },
                                { label: 'Unique Procedures', value: complexityMetrics.uniqueProcedures },
                                { label: 'Procedures/Patient', value: complexityMetrics.proceduresPerPatient },
                                { label: 'Data Points (est.)', value: complexityMetrics.dataPointsEstimate },
                            ].map((kpi, i) => (
                                <div key={i} className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600/70 mb-1">{kpi.label}</p>
                                    <p className="text-2xl font-extrabold text-indigo-950">{kpi.value}</p>
                                </div>
                            ))}
                        </div>
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-3"><CardTitle className="text-base font-bold">Therapeutic Area Benchmarks</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <table className="min-w-full divide-y divide-slate-100 text-sm">
                                    <thead className="bg-slate-50"><tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Metric</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">This Study</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Benchmark</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Reference</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {complexityMetrics.benchmarks.map((b, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-800">{b.metric}</td>
                                                <td className="px-4 py-3 text-right font-bold text-indigo-600">{b.study}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">{b.benchmark}</td>
                                                <td className="px-4 py-3 text-right text-xs text-slate-400">{b.area}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
