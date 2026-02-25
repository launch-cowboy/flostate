// simulation-engine.ts — Pre-seeded Monte Carlo simulation engine for Digital Trial Rehearsal
// Uses deterministic results for demo consistency while maintaining statistical credibility

export interface PhaseResult {
    phase: string;
    medianDays: number;
    p10Days: number;
    p90Days: number;
    delayProbability: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    criticalPathProbability: number;
}

export interface EnrollmentForecast {
    milestone: string;
    optimistic: number;
    median: number;
    pessimistic: number;
}

export interface Bottleneck {
    rank: number;
    title: string;
    probability: number;
    impactDays: number;
    mitigation: string;
}

export interface SiteComparison {
    rank: number;
    siteName: string;
    siteType: string;
    medianActivation: number;
    enrollmentRate: number;
    risk: string;
    wave: string;
    rationale: string;
}

export interface ScheduleConflict {
    id: string;
    type: string;
    studies: string;
    date: string;
    description: string;
    resolution: string;
}

export interface SimulationResult {
    protocolId: string;
    iterations: number;
    complexityScore: number;
    complexityMultiplier: number;
    siteType: string;
    phases: PhaseResult[];
    totalActivation: { median: number; p10: number; p90: number };
    enrollment: EnrollmentForecast[];
    criticalPath: { phase: string; probability: number; notes: string }[];
    bottlenecks: Bottleneck[];
    siteComparisons: SiteComparison[];
    costOfDelay: { dailyCost: string; monthlyCost: string; savingsEstimate: string };
    conflicts: ScheduleConflict[];
    distributionData: { days: string; frequency: number }[];
}

// Complexity multipliers from prompt spec
export const complexityMultipliers: Record<string, number> = {
    'low': 1.0,       // Score 1-3
    'moderate': 1.15,  // Score 3.1-5
    'high': 1.35,      // Score 5.1-7
    'very-high': 1.6,  // Score 7.1-10
};

export function getComplexityBand(score: number): string {
    if (score <= 3) return 'low';
    if (score <= 5) return 'moderate';
    if (score <= 7) return 'high';
    return 'very-high';
}

// Pre-seeded simulation results per site archetype
const siteArchetypeResults: Record<string, SimulationResult> = {
    'Academic Medical Center': {
        protocolId: 'ONK-301-2025',
        iterations: 1000,
        complexityScore: 7.3,
        complexityMultiplier: 1.6,
        siteType: 'Academic Medical Center',
        phases: [
            { phase: 'Contract Negotiation', medianDays: 88, p10Days: 52, p90Days: 142, delayProbability: 42, riskLevel: 'High', criticalPathProbability: 62 },
            { phase: 'IRB/Ethics Approval', medianDays: 40, p10Days: 25, p90Days: 62, delayProbability: 18, riskLevel: 'Medium', criticalPathProbability: 28 },
            { phase: 'Regulatory Preparation', medianDays: 28, p10Days: 16, p90Days: 48, delayProbability: 22, riskLevel: 'Medium', criticalPathProbability: 5 },
            { phase: 'Staff Training (7 roles)', medianDays: 18, p10Days: 10, p90Days: 30, delayProbability: 15, riskLevel: 'Low', criticalPathProbability: 8 },
            { phase: 'SIV Scheduling', medianDays: 16, p10Days: 9, p90Days: 25, delayProbability: 8, riskLevel: 'Low', criticalPathProbability: 2 },
        ],
        totalActivation: { median: 142, p10: 98, p90: 198 },
        enrollment: [
            { milestone: 'First Patient First Visit (FPFV)', optimistic: 82, median: 108, pessimistic: 156 },
            { milestone: '25% Enrollment (113 pts)', optimistic: 145, median: 198, pessimistic: 278 },
            { milestone: '50% Enrollment (225 pts)', optimistic: 218, median: 295, pessimistic: 402 },
            { milestone: '75% Enrollment (338 pts)', optimistic: 285, median: 378, pessimistic: 498 },
            { milestone: 'Full Enrollment (450 pts)', optimistic: 342, median: 448, pessimistic: 582 },
        ],
        criticalPath: [
            { phase: 'Contract Negotiation', probability: 62, notes: 'Institutional legal review, budget committees, indemnification negotiations' },
            { phase: 'IRB/Ethics Approval', probability: 28, notes: 'Central IRB reduces variability, but backlog risk exists' },
            { phase: 'Staff Training', probability: 8, notes: '7-role certification requirement extends timeline when contract/IRB overlap' },
        ],
        bottlenecks: [
            { rank: 1, title: 'Contract Negotiation at Academic Sites', probability: 62, impactDays: 35, mitigation: 'Pre-negotiate master CTA with institutional template. Engage legal 4 weeks before site selection. Historical data shows pre-negotiated CTAs reduce median from 88 to 25 days.' },
            { rank: 2, title: 'Screen Failure Rate Exceeding 70%', probability: 38, impactDays: 52, mitigation: 'Implement EHR-based pre-screening protocol. Target sites with established NSCLC patient populations. Consider expanding PD-L1 stratification.' },
            { rank: 3, title: 'Coordinator Capacity Constraints', probability: 25, impactDays: 18, mitigation: 'Assign dedicated coordinator at high-enrollment sites. Maria Rodriguez at 22/30 patient threshold. Plan backup assignment at milestone 15.' },
        ],
        siteComparisons: [
            { rank: 1, siteName: 'Metro Clinical Site 2198', siteType: 'Dedicated Research', medianActivation: 74, enrollmentRate: 2.8, risk: 'Low', wave: 'Wave 1', rationale: 'Pre-negotiated CTA, 5 active studies' },
            { rank: 2, siteName: 'Central Research Partners', siteType: 'Dedicated Research', medianActivation: 78, enrollmentRate: 2.5, risk: 'Low', wave: 'Wave 1', rationale: 'Strong lung cancer registry, 3 IO trials' },
            { rank: 3, siteName: 'Metro Clinical Research Ctr', siteType: 'Academic', medianActivation: 142, enrollmentRate: 3.2, risk: 'Medium', wave: 'Wave 1', rationale: 'Highest enrollment ceiling, PI: Dr. Chen (47 trials)' },
            { rank: 4, siteName: 'Community Oncology #4521', siteType: 'Community', medianActivation: 105, enrollmentRate: 1.8, risk: 'Medium', wave: 'Wave 2', rationale: 'Good catchment, 35% contract >60 day risk' },
            { rank: 5, siteName: 'Regional Cancer Ctr #1847', siteType: 'Community', medianActivation: 112, enrollmentRate: 1.5, risk: 'Medium', wave: 'Wave 2', rationale: 'Needs coordinator training' },
        ],
        costOfDelay: {
            dailyCost: '$47,500',
            monthlyCost: '$1,425,000',
            savingsEstimate: '$3,562,500 (2.5 months saved)',
        },
        conflicts: [
            { id: 'SC-001', type: 'Overlapping Monitoring Visits', studies: 'ONK-301 + CNS-205', date: '2026-03-15', description: 'Pfizer CRA and Florence CRA both scheduled 2:00 PM', resolution: 'Reschedule CNS-205 to 2026-03-16 10:00 AM' },
            { id: 'SC-002', type: 'Coordinator Capacity', studies: 'DERM-110 + LUNG-812', date: '2026-03-22', description: 'Maria Rodriguez: 4 patient visits + monitoring prep same day', resolution: 'Reassign 2 LUNG-812 follow-ups to James O\'Connor' },
        ],
        distributionData: [
            { days: '60-75', frequency: 5 },
            { days: '76-90', frequency: 12 },
            { days: '91-105', frequency: 28 },
            { days: '106-120', frequency: 52 },
            { days: '121-135', frequency: 78 },
            { days: '136-150', frequency: 95 },
            { days: '151-165', frequency: 68 },
            { days: '166-180', frequency: 42 },
            { days: '181-195', frequency: 18 },
            { days: '196+', frequency: 8 },
        ],
    },
    'Dedicated Research Site': {
        protocolId: 'ONK-301-2025',
        iterations: 1000,
        complexityScore: 7.3,
        complexityMultiplier: 1.6,
        siteType: 'Dedicated Research Site',
        phases: [
            { phase: 'Contract Negotiation', medianDays: 22, p10Days: 12, p90Days: 38, delayProbability: 10, riskLevel: 'Low', criticalPathProbability: 35 },
            { phase: 'IRB/Ethics Approval', medianDays: 35, p10Days: 20, p90Days: 55, delayProbability: 12, riskLevel: 'Low', criticalPathProbability: 45 },
            { phase: 'Regulatory Preparation', medianDays: 14, p10Days: 8, p90Days: 24, delayProbability: 8, riskLevel: 'Low', criticalPathProbability: 10 },
            { phase: 'Staff Training (7 roles)', medianDays: 12, p10Days: 7, p90Days: 20, delayProbability: 5, riskLevel: 'Low', criticalPathProbability: 6 },
            { phase: 'SIV Scheduling', medianDays: 10, p10Days: 5, p90Days: 16, delayProbability: 3, riskLevel: 'Low', criticalPathProbability: 4 },
        ],
        totalActivation: { median: 74, p10: 48, p90: 110 },
        enrollment: [
            { milestone: 'First Patient First Visit', optimistic: 52, median: 68, pessimistic: 98 },
            { milestone: '25% Enrollment (113 pts)', optimistic: 105, median: 142, pessimistic: 195 },
            { milestone: '50% Enrollment (225 pts)', optimistic: 168, median: 225, pessimistic: 312 },
            { milestone: '75% Enrollment (338 pts)', optimistic: 225, median: 298, pessimistic: 405 },
            { milestone: 'Full Enrollment (450 pts)', optimistic: 278, median: 365, pessimistic: 488 },
        ],
        criticalPath: [
            { phase: 'IRB/Ethics Approval', probability: 45, notes: 'Even with central IRB, review timelines drive critical path at efficient sites' },
            { phase: 'Contract Negotiation', probability: 35, notes: 'Pre-negotiated CTAs reduce but don\'t eliminate' },
            { phase: 'Regulatory Preparation', probability: 10, notes: 'Rarely on critical path' },
        ],
        bottlenecks: [
            { rank: 1, title: 'IRB Review Backlog', probability: 22, impactDays: 15, mitigation: 'Submit to central IRB during contract negotiation (parallel processing). Expected reduction: 10-15 days.' },
            { rank: 2, title: 'Staff Training Volume (7 roles)', probability: 15, impactDays: 8, mitigation: 'Pre-schedule vendor training sessions before CTA execution. Bundle certifications into 2-day training block.' },
            { rank: 3, title: 'Enrollment Competition', probability: 18, impactDays: 22, mitigation: 'Dedicated research sites often run competing oncology trials. Ensure non-compete with existing sponsor studies.' },
        ],
        siteComparisons: [],
        costOfDelay: { dailyCost: '$47,500', monthlyCost: '$1,425,000', savingsEstimate: '$1,425,000 (1 month saved)' },
        conflicts: [],
        distributionData: [
            { days: '30-45', frequency: 8 },
            { days: '46-60', frequency: 35 },
            { days: '61-75', frequency: 85 },
            { days: '76-90', frequency: 62 },
            { days: '91-105', frequency: 28 },
            { days: '106-120', frequency: 12 },
            { days: '120+', frequency: 5 },
        ],
    },
    'Community Hospital': {
        protocolId: 'ONK-301-2025',
        iterations: 1000,
        complexityScore: 7.3,
        complexityMultiplier: 1.6,
        siteType: 'Community Hospital',
        phases: [
            { phase: 'Contract Negotiation', medianDays: 45, p10Days: 25, p90Days: 78, delayProbability: 28, riskLevel: 'Medium', criticalPathProbability: 48 },
            { phase: 'IRB/Ethics Approval', medianDays: 38, p10Days: 22, p90Days: 60, delayProbability: 15, riskLevel: 'Medium', criticalPathProbability: 35 },
            { phase: 'Regulatory Preparation', medianDays: 22, p10Days: 12, p90Days: 38, delayProbability: 18, riskLevel: 'Medium', criticalPathProbability: 8 },
            { phase: 'Staff Training (7 roles)', medianDays: 15, p10Days: 8, p90Days: 25, delayProbability: 12, riskLevel: 'Low', criticalPathProbability: 5 },
            { phase: 'SIV Scheduling', medianDays: 12, p10Days: 7, p90Days: 20, delayProbability: 5, riskLevel: 'Low', criticalPathProbability: 4 },
        ],
        totalActivation: { median: 105, p10: 68, p90: 165 },
        enrollment: [
            { milestone: 'First Patient First Visit', optimistic: 68, median: 92, pessimistic: 138 },
            { milestone: '25% Enrollment (113 pts)', optimistic: 128, median: 172, pessimistic: 242 },
            { milestone: '50% Enrollment (225 pts)', optimistic: 195, median: 262, pessimistic: 365 },
            { milestone: '75% Enrollment (338 pts)', optimistic: 258, median: 342, pessimistic: 462 },
            { milestone: 'Full Enrollment (450 pts)', optimistic: 315, median: 412, pessimistic: 545 },
        ],
        criticalPath: [
            { phase: 'Contract Negotiation', probability: 48, notes: 'Community hospital legal departments less experienced with CTAs' },
            { phase: 'IRB/Ethics Approval', probability: 35, notes: 'Mix of central and local IRB creates variability' },
            { phase: 'Regulatory Preparation', probability: 8, notes: 'Moderate regulatory experience' },
        ],
        bottlenecks: [
            { rank: 1, title: 'CTA Legal Review Inexperience', probability: 35, impactDays: 22, mitigation: 'Provide sponsor-prepared CTA template with pre-approved budget framework. Offer legal office hours for site questions.' },
            { rank: 2, title: 'Staff Certification Gaps', probability: 28, impactDays: 12, mitigation: 'Pre-identify certification requirements and send vendor training invitations during feasibility. Start training before CTA is executed.' },
            { rank: 3, title: 'Competing Research Priorities', probability: 20, impactDays: 15, mitigation: 'Confirm dedicated research coordinator FTE allocation. Community hospitals often share staff with clinical operations.' },
        ],
        siteComparisons: [],
        costOfDelay: { dailyCost: '$47,500', monthlyCost: '$1,425,000', savingsEstimate: '$2,137,500 (1.5 months saved)' },
        conflicts: [],
        distributionData: [
            { days: '45-60', frequency: 5 },
            { days: '61-75', frequency: 18 },
            { days: '76-90', frequency: 42 },
            { days: '91-105', frequency: 72 },
            { days: '106-120', frequency: 55 },
            { days: '121-135', frequency: 32 },
            { days: '136-150', frequency: 18 },
            { days: '150+', frequency: 8 },
        ],
    },
};

export function runSimulation(siteType: string): SimulationResult {
    return siteArchetypeResults[siteType] || siteArchetypeResults['Academic Medical Center'];
}

export function getSiteTypes(): string[] {
    return Object.keys(siteArchetypeResults);
}
