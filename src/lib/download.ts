/**
 * Centralized download utility using fetch + Blob pattern.
 *
 * Why this works when <a download> doesn't:
 * - fetch() bypasses SPA fallback (connect-history-api-fallback doesn't rewrite XHR)
 * - Blob URLs are always same-origin, so the download attribute always works
 * - We can detect if server returned HTML instead of the expected file
 * - Works identically in dev (Vite) and production (static hosting)
 */
export async function downloadFile(path: string, filename: string): Promise<void> {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        // Guard: if we got HTML back, the SPA fallback intercepted the request
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
            throw new Error(`Expected file but received HTML — check that ${path} exists in public/downloads/`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Delay revocation so the browser has time to initiate the download
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
        console.error(`[downloadFile] Failed to download ${filename}:`, err);
    }
}
