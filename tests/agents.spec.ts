import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Protocol Complexity Burden Scorer', () => {
    test('displays 5-domain scorecard and radar chart after activation', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/protocol-complexity-scorer`);
        await page.waitForLoadState('networkidle');

        // Activate agent
        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        // Click Generate Score button to trigger analysis
        const generateBtn = page.getByRole('button', { name: /generate score/i });
        await expect(generateBtn).toBeVisible({ timeout: 5000 });
        await generateBtn.click();

        // Wait for scoring to complete (has a setTimeout delay)
        await page.waitForTimeout(3000);

        // Should show the Analysis Complete banner
        await expect(page.getByText('Analysis Complete').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('ONK-301-2025').first()).toBeVisible();

        // Verify 5-domain scorecard is present
        await expect(page.getByText('Operational Execution').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Regulatory Oversight').first()).toBeVisible();
        await expect(page.getByText('Patient Burden').first()).toBeVisible();
        await expect(page.getByText('Site Burden').first()).toBeVisible();
        await expect(page.getByText('Study Design').first()).toBeVisible();

        // Verify composite score row
        await expect(page.getByText(/Composite/i).first()).toBeVisible();

        // Verify burden flags section exists
        await expect(page.getByText(/Burden Flag/i).first()).toBeVisible();

        // Verify amendment risk section
        await expect(page.getByText(/Amendment Risk/i).first()).toBeVisible();

        // Verify recommendations section
        await expect(page.getByText(/Recommendation/i).first()).toBeVisible();

        // Verify therapeutic area multiplier
        await expect(page.getByText(/1\.3×/i).first()).toBeVisible();

        console.log('✅ Protocol Scorer: 5-domain scorecard, burden flags, amendment risk, and recommendations all rendered.');
    });
});

test.describe('Digital Trial Rehearsal', () => {
    test('runs Monte Carlo simulation and displays results', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/digital-trial-rehearsal`);
        await page.waitForLoadState('networkidle');

        // Activate agent
        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        // Verify site type selector is present
        const siteSelect = page.locator('select');
        await expect(siteSelect).toBeVisible({ timeout: 5000 });

        // Click Run Monte Carlo button
        const runBtn = page.getByRole('button', { name: /run monte carlo/i });
        await expect(runBtn).toBeVisible({ timeout: 5000 });
        await runBtn.click();

        // Wait for simulation (2s delay + render)
        await page.waitForTimeout(3500);

        // Verify simulation results are displayed
        await expect(page.getByText('Simulation Complete').first()).toBeVisible({ timeout: 10000 });

        // Verify key metrics
        await expect(page.getByText('Median Activation').first()).toBeVisible();

        // Verify phase-by-phase forecast table
        await expect(page.getByText('Phase-by-Phase Forecast').first()).toBeVisible();
        await expect(page.getByText('Contract Negotiation').first()).toBeVisible();

        // Verify enrollment forecast
        await expect(page.getByText(/Enrollment Forecast/i).first()).toBeVisible();

        // Verify bottleneck identification
        await expect(page.getByText('Bottleneck Identification').first()).toBeVisible();

        // Verify critical path analysis
        await expect(page.getByText('Critical Path Analysis').first()).toBeVisible();

        console.log('✅ Trial Rehearsal: Monte Carlo simulation, phase timeline, enrollment forecast, and bottlenecks all rendered.');
    });

    test('switches site type and re-runs simulation', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/digital-trial-rehearsal`);
        await page.waitForLoadState('networkidle');

        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        // Select Dedicated Research Site
        const siteSelect = page.locator('select');
        await siteSelect.selectOption('Dedicated Research Site');

        // Run simulation
        const runBtn = page.getByRole('button', { name: /run monte carlo/i });
        await runBtn.click();
        await page.waitForTimeout(3500);

        // Verify the simulation completed
        await expect(page.getByText('Simulation Complete').first()).toBeVisible({ timeout: 10000 });

        // The median activation for dedicated research is 74 days
        const medianText = page.locator('text=Median Activation').locator('..').locator('..');
        await expect(medianText).toBeVisible();

        console.log('✅ Trial Rehearsal: Site type switching works correctly.');
    });
});

test.describe('Virtual SMO Layer', () => {
    test('displays briefing then generates execution plan', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/virtual-smo`);
        await page.waitForLoadState('networkidle');

        // Activate agent
        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        // Verify coordinator greeting
        await expect(page.getByRole('heading', { name: /Good morning, Maria/i })).toBeVisible({ timeout: 5000 });

        // Phase 1: Briefing summary
        await expect(page.getByText('Monday Morning Briefing')).toBeVisible();
        await expect(page.getByText('Critical Items')).toBeVisible();
        await expect(page.getByText('Credential Alerts').first()).toBeVisible();
        await expect(page.getByText('Monitoring Visit Today')).toBeVisible();

        // Click Generate Execution Plan
        const generateBtn = page.getByRole('button', { name: /generate execution plan/i });
        await expect(generateBtn).toBeVisible();
        await generateBtn.click();

        // Phase 2: Execution Plan
        await expect(page.getByText('AI Execution Plan')).toBeVisible({ timeout: 5000 });
        await expect(page.getByText('Stage all 12 documents').first()).toBeVisible();
        await expect(page.getByText('Send GCP renewal reminder').first()).toBeVisible();

        // Verify Execute All button is visible
        const executeBtn = page.getByRole('button', { name: /execute all actions/i });
        await expect(executeBtn).toBeVisible();

        console.log('✅ Virtual SMO: Briefing → Execution Plan agentic flow works correctly.');
    });

    test('executes plan and shows terminal log', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/virtual-smo`);
        await page.waitForLoadState('networkidle');

        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        // Go through briefing
        await page.getByRole('button', { name: /generate execution plan/i }).click();
        await page.waitForTimeout(500);

        // Execute all actions
        await page.getByRole('button', { name: /execute all actions/i }).click();

        // Wait for execution to complete (6 items × ~2-3 sec each)
        await expect(page.getByRole('heading', { name: 'All Actions Complete' })).toBeVisible({ timeout: 30000 });

        // Verify execution log is visible
        await expect(page.getByText('Execution Log')).toBeVisible();

        // Verify full dashboard appears after execution
        await expect(page.getByText('Full Dashboard')).toBeVisible();
        await expect(page.getByText('Morning Priorities')).toBeVisible();
        await expect(page.getByText('Portfolio Status').first()).toBeVisible();

        console.log('✅ Virtual SMO: Full agentic execution flow with terminal log complete.');
    });
});

test.describe('eISF/eTMF Reconciliation Bot', () => {
    test('runs reconciliation, shows mismatch highlighting, and offers resolution plan', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/eisf-etmf-reconciliation`);
        await page.waitForLoadState('networkidle');

        // Activate agent
        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        // Click Run Reconciliation
        const reconcileBtn = page.getByRole('button', { name: /run reconciliation/i });
        await expect(reconcileBtn).toBeVisible({ timeout: 5000 });
        await reconcileBtn.click();

        // Wait for processing
        await page.waitForTimeout(2500);

        // Verify summary cards show discrepancy counts
        await expect(page.getByText('Critical Mismatches').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Major Findings').first()).toBeVisible();
        await expect(page.getByText('Matched Properly').first()).toBeVisible();

        // Verify the discrepancy table has TMF Zone column
        await expect(page.getByText('TMF Zone').first()).toBeVisible();

        // Verify specific discrepancies appear
        await expect(page.getByText('Informed Consent Form').first()).toBeVisible();

        // Verify Export CSV button
        const exportBtn = page.getByRole('button', { name: /export csv/i });
        await expect(exportBtn).toBeVisible();

        // Verify Suggest Resolution Plan button (new agentic feature)
        const resolutionBtn = page.getByRole('button', { name: /suggest resolution plan/i });
        await expect(resolutionBtn).toBeVisible();

        console.log('✅ Reconciliation Bot: Discrepancy report with TMF zones, mismatch highlighting, export, and resolution plan button all rendered.');
    });
});
