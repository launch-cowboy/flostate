// Cash Flo Analytics Data - Tier 1-5 Insights
// Based on Cash-Flo-Dashboard-Analytics-Plan.md

// Tier 1: Operational Velocity
export const docCycleTimeData = [
    { week: 'W1', aiAssisted: 1.8, nonAI: 8.2 },
    { week: 'W2', aiAssisted: 1.6, nonAI: 7.9 },
    { week: 'W3', aiAssisted: 1.5, nonAI: 7.5 },
    { week: 'W4', aiAssisted: 1.3, nonAI: 8.1 },
    { week: 'W5', aiAssisted: 1.2, nonAI: 7.8 },
    { week: 'W6', aiAssisted: 1.1, nonAI: 7.6 },
    { week: 'W7', aiAssisted: 1.0, nonAI: 7.4 },
];

export const docCycleKPIs = {
    speedMultiplier: '5.8x',
    meanCycleTime: '1.2 days',
    firstPassApproval: '91%',
    velocityScore: '52/wk',
};

export const eisfActivationData = [
    { phase: 'Contract', planned: 54, actual: 32, aiSaved: 22 },
    { phase: 'IRB', planned: 45, actual: 38, aiSaved: 7 },
    { phase: 'Reg Docs', planned: 30, actual: 8, aiSaved: 22 },
    { phase: 'Training', planned: 14, actual: 5, aiSaved: 9 },
    { phase: 'eISF Setup', planned: 14, actual: 2, aiSaved: 12 },
];

export const eisfKPIs = {
    avgActivation: '3.2 days',
    industryBaseline: '14-30 days',
    prePopulationRate: '78%',
    zeroTouchScore: '72%',
    daysSavedThisPeriod: 847,
    siteActivations: 42,
};

export const tmfReadinessData = [
    { study: 'ONK-301', score: 97, enrolled: 145, target: 200, status: 'green' },
    { study: 'CNS-205', score: 94, enrolled: 82, target: 120, status: 'green' },
    { study: 'CARD-112', score: 88, enrolled: 56, target: 100, status: 'yellow' },
    { study: 'DERM-110', score: 92, enrolled: 38, target: 60, status: 'green' },
    { study: 'LUNG-812', score: 78, enrolled: 22, target: 80, status: 'yellow' },
    { study: 'ENDO-445', score: 65, enrolled: 8, target: 40, status: 'red' },
];

export const tmfKPIs = {
    enterpriseIndex: 89,
    completeness: '96.2%',
    qualityScore: '94.1%',
    daysSinceGap: 12,
    autoResolved: 1247,
};

// Tier 2: Site & Stakeholder Performance
export const siteEngagementData = [
    { name: 'Metro Clinical Grp', engagement: 92, enrollment: 4.2, adoption: 'high', size: 145 },
    { name: 'Pacific Research', engagement: 87, enrollment: 3.8, adoption: 'high', size: 82 },
    { name: 'University Med Ctr', engagement: 74, enrollment: 2.1, adoption: 'medium', size: 120 },
    { name: 'Midwest CRN', engagement: 68, enrollment: 1.9, adoption: 'medium', size: 56 },
    { name: 'Southeast Clinical', engagement: 45, enrollment: 0.8, adoption: 'low', size: 38 },
    { name: 'Atlantic Health Sys', engagement: 82, enrollment: 3.1, adoption: 'high', size: 95 },
    { name: 'Western Trials Inc', engagement: 55, enrollment: 1.2, adoption: 'low', size: 44 },
    { name: 'Northeast Med Res', engagement: 79, enrollment: 2.8, adoption: 'medium', size: 72 },
];

export const adoptionFunnel = [
    { stage: 'Licensed', count: 65000, pct: 100 },
    { stage: 'Active', count: 48750, pct: 75 },
    { stage: 'AI-Engaged', count: 29250, pct: 45 },
    { stage: 'Power User', count: 9750, pct: 15 },
];

export const milestoneData = [
    { milestone: 'Site Activation', target: 90, actual: 78, status: 'ahead' },
    { milestone: 'Monitoring Cadence', target: 95, actual: 96, status: 'ahead' },
    { milestone: 'Issue Resolution', target: 15, actual: 12, status: 'ahead' },
    { milestone: 'Query Response', target: 2, actual: 1.8, status: 'ahead' },
    { milestone: 'Deviation Rate', target: 1, actual: 0.7, status: 'ahead' },
    { milestone: 'Amendment Impl.', target: 90, actual: 94, status: 'at-risk' },
];

// Tier 3: Financial & Strategic Impact
export const revenueData = [
    { quarter: 'Q1 \'25', baseline: 28, aiAccelerated: 42 },
    { quarter: 'Q2 \'25', baseline: 31, aiAccelerated: 52 },
    { quarter: 'Q3 \'25', baseline: 33, aiAccelerated: 61 },
    { quarter: 'Q4 \'25', baseline: 35, aiAccelerated: 74 },
    { quarter: 'Q1 \'26', baseline: 36, aiAccelerated: 88 },
];

export const financialKPIs = {
    revenueAccelerated: '$4.2M',
    laborEfficiency: '2.1x',
    costPerSite: '-34%',
    reworkAvoided: '$1.8M',
    marginImpact: '+180 bps',
    craCapacityMultiplier: '2.0x',
    headcountSavings: '$12.4M',
};

export const churnData = {
    logoRetention: '97.2%',
    nrr: '124%',
    aiEngagedRetention: '99.1%',
    nonAiRetention: '91.4%',
    timeToValue: '4.2 days',
};

// Tier 4: Predictive Intelligence
export const riskRadarData = [
    { category: 'Enrollment', level: 32 },
    { category: 'Regulatory', level: 18 },
    { category: 'Quality', level: 25 },
    { category: 'Engagement', level: 15 },
    { category: 'Amendment', level: 42 },
];

export const siteHealthScores = [
    { site: 'Site 101 — Metro Clinical', score: 94, trend: 'up', alert: null },
    { site: 'Site 205 — Pacific Research', score: 87, trend: 'stable', alert: null },
    { site: 'Site 312 — University Med', score: 72, trend: 'down', alert: 'Doc velocity -40%' },
    { site: 'Site 118 — Midwest CRN', score: 68, trend: 'down', alert: 'CRA query response lag' },
    { site: 'Site 247 — Southeast Clin', score: 45, trend: 'down', alert: 'Disengagement risk' },
];

export const predictiveAccuracy = {
    enrollment: '84%',
    regulatory: '92%',
    quality: '78%',
    overall: '86%',
};

// Tier 5: Token Economics
export const tokenEfficiency = [
    { agent: 'Virtual SMO', valuePerToken: 8.4, tokensUsed: '34.2M', valueDelivered: '$287k' },
    { agent: 'Recon Bot', valuePerToken: 7.1, tokensUsed: '11.2M', valueDelivered: '$79k' },
    { agent: 'Protocol Scorer', valuePerToken: 6.8, tokensUsed: '12.5M', valueDelivered: '$85k' },
    { agent: 'Reg. Factory', valuePerToken: 6.2, tokensUsed: '8.7M', valueDelivered: '$54k' },
    { agent: 'Audit Trail', valuePerToken: 5.9, tokensUsed: '9.3M', valueDelivered: '$55k' },
    { agent: 'CRA Visit Prep', valuePerToken: 5.5, tokensUsed: '15.4M', valueDelivered: '$85k' },
];

export const tokenKPIs = {
    valuePerToken: '$7.82',
    tokenCostPerOutcome: '1.2k',
    marginalValueTrend: 'increasing',
    budgetUtilization: '78%',
};
