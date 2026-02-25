// claude-adapter.ts - Hexagonal Architecture approach for LLM integration

export interface ProtocolScoringOutput {
    protocolId: string;
    overallScore: number;
    dimensionScores: Record<string, number>;
    burdenEstimate: {
        siteHoursPerPatient: number;
        trainingHours: number;
        screenFailRiskPct: number;
    };
    recommendations: { category: string; suggestion: string; impact: string }[];
}

// Fallback Mock Data as described in OpenClaw execution plan
const mockScoreResult: ProtocolScoringOutput = {
    protocolId: "ONK-301-2025",
    overallScore: 8.2,
    dimensionScores: {
        "Eligibility": 9.1,
        "Visit Frequency": 8.5,
        "Procedure Intensity": 8.8,
        "Specialized Training": 7.5,
        "Endpoint Complexity": 8.0,
        "Data Burden": 7.3
    },
    burdenEstimate: {
        siteHoursPerPatient: 145,
        trainingHours: 12,
        screenFailRiskPct: 65
    },
    recommendations: [
        { category: "Eligibility", suggestion: "Broaden criteria for prior immunotherapy exposure to reduce screen failure rate by an estimated 15%.", impact: "High" },
        { category: "Visits", suggestion: "Consolidate Week 2 and Week 3 PK sampling visits if halflives permit.", impact: "Medium" },
        { category: "Procedures", suggestion: "Centralize imaging reads to eliminate duplicate local radiologist burden.", impact: "High" }
    ]
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
            // Example integration that would be used if API key was present.
            // Uses RISEN prompt framework as required by OpenClaw spec.
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerously-allow-browser': 'true' // Client side API calls for hackathons only
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 2000,
                    system: "Role: You are a clinical trial protocol complexity analyst.\nInstructions: Score across 6 dimensions using the provided rubric.\nSteps: 1) Extract key metrics, 2) Score each dimension with reasoning, 3) Calculate composite, 4) Generate benchmarks, 5) Produce recommendations.\nEnd Goal: Valid JSON matching the output schema.\nNarrowing: Never provide medical advice, always output valid JSON, use estimated operational burden not quality judgment.",
                    messages: [
                        { role: 'user', content: `Score this protocol mapped to the JSON schema: \n${pdfText.slice(0, 10000)}...` }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            // In a real application, Zod validation goes here.
            return JSON.parse(data.content[0].text);

        } catch (error) {
            this.failureCount++;
            console.warn(`Claude API Failed. Failure count: ${this.failureCount}`);
            if (this.failureCount >= this.MAX_FAILURES) {
                console.log("Circuit breaker tripped. Automatically routing to local mocked logic.");
            }
            return new Promise(resolve => setTimeout(() => resolve(mockScoreResult), 1000));
        }
    }
}

export const claudeAdapter = new ClaudeClient();
