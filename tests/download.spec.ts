import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const BASE_URL = 'http://localhost:5173';

test.describe('File Download QA', () => {
    test('Export Operations Bundle downloads with correct name and CSV content', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/protocol-to-ops`);
        await page.waitForLoadState('networkidle');

        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        const generateBtn = page.getByRole('button', { name: /generate ops package/i });
        await expect(generateBtn).toBeVisible({ timeout: 5000 });
        await generateBtn.click();

        const exportBtn = page.getByRole('button', { name: /export operations bundle/i });
        await expect(exportBtn).toBeVisible({ timeout: 15000 });

        const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
        await exportBtn.click();
        const download = await downloadPromise;

        const suggestedName = download.suggestedFilename();
        console.log('Suggested filename:', suggestedName);
        console.log('Download URL:', download.url());

        expect(suggestedName).toBe('DERM110_Operations_Bundle.csv');

        const tmpPath = path.join(os.tmpdir(), 'test_bundle_' + Date.now() + '.csv');
        await download.saveAs(tmpPath);
        const content = fs.readFileSync(tmpPath, 'utf8');

        expect(content).toContain('Visit_Name');
        expect(content.length).toBeGreaterThan(100);
        console.log('✅ CSV downloaded correctly:', content.length, 'bytes');
    });

    test('Source Docs download with correct name and text content', async ({ page }) => {
        await page.goto(`${BASE_URL}/agents/protocol-to-ops`);
        await page.waitForLoadState('networkidle');

        await page.getByRole('button', { name: /activate agent/i }).click();
        await page.waitForTimeout(500);

        const generateBtn = page.getByRole('button', { name: /generate ops package/i });
        await expect(generateBtn).toBeVisible({ timeout: 5000 });
        await generateBtn.click();

        const sourceDocsTab = page.getByRole('button', { name: /source docs/i });
        await expect(sourceDocsTab).toBeVisible({ timeout: 15000 });
        await sourceDocsTab.click();

        const firstDoc = page.getByRole('button', { name: /inpatient screening checklist/i });
        await expect(firstDoc).toBeVisible({ timeout: 5000 });

        const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
        await firstDoc.click();
        const download = await downloadPromise;

        const suggestedName = download.suggestedFilename();
        console.log('Suggested filename:', suggestedName);
        expect(suggestedName).toBe('Inpatient_Screening_Checklist.txt');

        const tmpPath = path.join(os.tmpdir(), 'test_sourcedoc_' + Date.now() + '.txt');
        await download.saveAs(tmpPath);
        const content = fs.readFileSync(tmpPath, 'utf8');

        expect(content.length).toBeGreaterThan(50);
        console.log('✅ Source doc downloaded correctly:', content.length, 'bytes');
    });
});
