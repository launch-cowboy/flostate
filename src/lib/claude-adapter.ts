// claude-adapter.ts - Hexagonal Architecture approach for LLM integration
// Tech Stack: Claude Opus 4.6 + Gemini 3.1 Pro + Google Antigravity

export interface DomainScore {
    domain: string;
    weight: number;
    score: number;
    rating: 'Low' | 'Moderate' | 'High' | 'Very High';
    keyDrivers: string[];
    benchmark: number;
    comparison: string;
}

export interface BurdenFlag {
    element: string;
    protocolValue: string;
    benchmarkValue: string;
    impact: string;
}

export interface SiteHoursBreakdown {
    screening: number;
    treatment: number;
    endOfTreatment: number;
    followUp: number;
    totalPerPatient: number;
}

export interface ProtocolScoringOutput {
    protocolId: string;
    phase: string;
    therapeuticArea: string;
    indication: string;
    sponsor: string;
    overallScore: number;
    overallRating: 'Low' | 'Moderate' | 'High' | 'Very High';
    domainScores: DomainScore[];
    burdenEstimate: {
        siteHours: SiteHoursBreakdown;
        trainingRoles: number;
        screenFailRiskPct: number;
        totalVisits: number;
        totalProcedures: number;
    };
    burdenFlags: BurdenFlag[];
    amendmentRisk: {
        probability: number;
        baselineProbability: number;
        riskDrivers: string[];
        estimatedCostPerAmendment: string;
        estimatedDaysPerAmendment: number;
    };
    recommendations: { rank: number; recommendation: string; expectedReduction: string; domainImpact: string }[];
    therapeuticAreaMultiplier: number;
}

export function getRating(score: number): 'Low' | 'Moderate' | 'High' | 'Very High' {
    if (score <= 3.0) return 'Low';
    if (score <= 5.0) return 'Moderate';
    if (score <= 7.0) return 'High';
    return 'Very High';
}

// Therapeutic area multipliers from prompt spec
const therapeuticMultipliers: Record<string, number> = {
    'Oncology': 1.3,
    'CNS/Neuroscience': 1.2,
    'Cardiovascular': 1.0,
    'Infectious Disease': 0.9,
    'Dermatology': 0.8,
    'Rare Disease': 1.25,
};

// Fallback Mock Data per the 5-domain spec
const mockScoreResult: ProtocolScoringOutput = {
    protocolId: "ONK-301-2025",
    phase: "Phase III",
    therapeuticArea: "Oncology",
    indication: "Non-Small Cell Lung Cancer (NSCLC)",
    sponsor: "Florence Pharmaceuticals",
    overallScore: 7.3,
    overallRating: 'Very High',
    domainScores: [
        {
            domain: "Operational Execution",
            weight: 0.25,
            score: 7.8,
            rating: 'Very High',
            keyDrivers: ["31 planned visits (treatment + maintenance)", "14 distinct procedures at C1D1 (2× average)", "PK sampling at 4 timepoints on Day 1"],
            benchmark: 5.2,
            comparison: "Above Benchmark (+50%)"
        },
        {
            domain: "Regulatory Oversight",
            weight: 0.20,
            score: 6.4,
            rating: 'High',
            keyDrivers: ["Multi-country (4 geographic regions)", "Companion diagnostic (PD-L1 22C3)", "DSMB with Q6M review"],
            benchmark: 4.8,
            comparison: "Above Benchmark (+33%)"
        },
        {
            domain: "Patient Burden",
            weight: 0.20,
            score: 7.2,
            rating: 'Very High',
            keyDrivers: ["31 eligibility criteria (16 I + 15 E)", "Estimated screen failure rate: 68%", "Tumor biopsies + ctDNA at multiple timepoints"],
            benchmark: 5.5,
            comparison: "Above Benchmark (+31%)"
        },
        {
            domain: "Site Burden",
            weight: 0.20,
            score: 8.1,
            rating: 'Very High',
            keyDrivers: ["~4.2M data points per study", "7 role-specific training certifications", "Central imaging + BICR for all tumor assessments"],
            benchmark: 5.9,
            comparison: "Above Benchmark (+37%)"
        },
        {
            domain: "Study Design",
            weight: 0.15,
            score: 6.9,
            rating: 'High',
            keyDrivers: ["2:1 randomization, 4 stratification factors", "Open-ended maintenance phase", "Amendment risk: 82% probability"],
            benchmark: 4.5,
            comparison: "Above Benchmark (+53%)"
        }
    ],
    burdenEstimate: {
        siteHours: { screening: 4.5, treatment: 36, endOfTreatment: 5, followUp: 0.5, totalPerPatient: 45.5 },
        trainingRoles: 7,
        screenFailRiskPct: 68,
        totalVisits: 31,
        totalProcedures: 263
    },
    burdenFlags: [
        { element: "C1D1 Procedures", protocolValue: "14", benchmarkValue: "7 avg", impact: "2× burden — recommend consolidating pre-dose labs" },
        { element: "PK Sampling (Day 1)", protocolValue: "4 timepoints", benchmarkValue: "1-2 timepoints", impact: "2× sampling load — consider sparse PK design" },
        { element: "Training Certifications", protocolValue: "7 roles", benchmarkValue: "4-5 roles", impact: "40% more training — imaging tech + phlebotomist certs" },
        { element: "Imaging Frequency", protocolValue: "Q6W", benchmarkValue: "Q8-12W", impact: "33% more frequent + BICR adds 48hr upload req" },
        { element: "Non-Core Procedure Ratio", protocolValue: "22%", benchmarkValue: "16.2%", impact: "ctDNA + ADA + exploratory biomarkers driving excess" },
        { element: "Eligibility Criteria", protocolValue: "31 total", benchmarkValue: "30-50 avg", impact: "Within range but 68% predicted screen failure rate" }
    ],
    amendmentRisk: {
        probability: 82,
        baselineProbability: 76,
        riskDrivers: [
            "4 stratification factors (complex randomization)",
            "Companion diagnostic requirement (PD-L1 22C3)",
            "Open-ended maintenance phase duration",
            "Q6W imaging with central BICR coordination"
        ],
        estimatedCostPerAmendment: "$535,000",
        estimatedDaysPerAmendment: 260
    },
    recommendations: [
        { rank: 1, recommendation: "Consolidate C1D8 + C1D15 into single C1D15 visit", expectedReduction: "12 visit-hours/patient saved", domainImpact: "Operational Execution: −0.5 pts" },
        { rank: 2, recommendation: "Adopt sparse PK sampling: reduce Day 1 from 4 to 2 timepoints", expectedReduction: "2 hours/patient on C1D1, non-core ratio → 18%", domainImpact: "Site Burden: −0.3 pts" },
        { rank: 3, recommendation: "Move ctDNA to Baseline, Week 12, and EOT only", expectedReduction: "4-6 fewer blood draws per patient", domainImpact: "Patient Burden: −0.4 pts" },
        { rank: 4, recommendation: "Pre-negotiate master CTA with top 10 sites", expectedReduction: "20-35 days activation reduction per site", domainImpact: "Timeline impact (not scored)" },
        { rank: 5, recommendation: "Standardize irAE monitoring checklist across sites", expectedReduction: "Reduced Sub-I and nurse training burden", domainImpact: "Site Burden: −0.2 pts" }
    ],
    therapeuticAreaMultiplier: 1.3
};

class ClaudeClient {
    private failureCount = 0;
    private readonly MAX_FAILURES = 2; // Circuit Breaker limit

    async scoreProtocol(pdfText: string): Promise<ProtocolScoringOutput> {
        const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

        // Circuit Breaker / Offline Demo Mode
        if (!apiKey || this.failureCount >= this.MAX_FAILURES) {
            console.log("Using Cached Fallback Output (Circuit Breaker/Offline Demo active)");
            return new Promise(resolve => setTimeout(() => resolve(mockScoreResult), 2500)); // Simulate think time
        }

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-opus-4-6-20260101',
                    max_tokens: 4000,
                    system: `You are the Protocol Complexity Burden Scorer within Florence Flo State. Score across 5 weighted domains: Operational Execution (25%), Regulatory Oversight (20%), Patient Burden (20%), Site Burden (20%), Study Design (15%). Each domain 1.0-10.0. Apply therapeutic area multipliers. Output valid JSON matching the ProtocolScoringOutput schema.`,
                    messages: [
                        { role: 'user', content: `Score this protocol:\n${pdfText.slice(0, 15000)}` }
                    ]
                })
            });

            if (!response.ok) throw new Error(`API returned ${response.status}`);
            const data = await response.json();
            return JSON.parse(data.content[0].text);
        } catch (error) {
            this.failureCount++;
            console.warn(`Claude API Failed. Failure count: ${this.failureCount}`);
            if (this.failureCount >= this.MAX_FAILURES) {
                console.log("Circuit breaker tripped. Routing to local mocked logic.");
            }
            return new Promise(resolve => setTimeout(() => resolve(mockScoreResult), 1000));
        }
    }
}

export const claudeAdapter = new ClaudeClient();
export { therapeuticMultipliers };
