/**
 * ProxyVaultPro - Import/Export Service
 */

import { ProxyService } from './proxyService.js';
import { Storage } from '../core/storage.js';
import { CONFIG } from '../config.js';

class ImportExportClass {
    /**
     * Export proxies to JSON
     */
    exportProxies() {
        const proxies = ProxyService.getAll().map(p => p.toJSON());
        const data = JSON.stringify(proxies, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `proxyvaultpro-proxies-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        return { success: true };
    }

    /**
     * Export full backup
     */
    exportBackup() {
        const backup = {
            version: CONFIG.VERSION,
            exportedAt: Date.now(),
            proxies: ProxyService.getAll().map(p => p.toJSON()),
            settings: Storage.get(CONFIG.STORAGE_KEYS.SETTINGS, CONFIG.DEFAULT_SETTINGS)
        };

        const data = JSON.stringify(backup, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `proxyvaultpro-backup-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        return { success: true };
    }

    /**
     * Import proxies from file
     */
    async importProxies(file, merge = true) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Handle backup format
            const proxies = Array.isArray(data) ? data : data.proxies;

            if (!Array.isArray(proxies)) {
                return { success: false, error: 'Invalid file format' };
            }

            const result = ProxyService.import(proxies, merge);
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Restore from backup
     */
    async restoreBackup(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.proxies || !data.settings) {
                return { success: false, error: 'Invalid backup format' };
            }

            ProxyService.import(data.proxies, false);
            Storage.set(CONFIG.STORAGE_KEYS.SETTINGS, data.settings);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Export to CSV
     */
    exportCSV() {
        const proxies = ProxyService.getAll();
        const headers = ['Name', 'URL', 'Description', 'Tags', 'Added At'];
        const rows = proxies.map(p => [
            p.name,
            p.url,
            p.description,
            p.tags.join('; '),
            new Date(p.addedAt).toISOString()
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `proxyvaultpro-export-${Date.now()}.csv`;
        a.click();

        URL.revokeObjectURL(url);
        return { success: true };
    }
}

export const ImportExport = new ImportExportClass();
export default ImportExport;
