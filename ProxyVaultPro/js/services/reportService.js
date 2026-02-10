/**
 * ProxyVaultPro - Report Service
 * Handles reporting of blocked sites
 */

import { Storage } from '../core/storage.js';
import { EventBus } from '../core/eventBus.js';
import { CONFIG } from '../config.js';

class ReportServiceClass {
    constructor() {
        this.STORAGE_KEY = 'pvp_reports';
        this.reports = [];
    }

    /**
     * Initialize reports
     */
    init() {
        this.reports = Storage.get(this.STORAGE_KEY, []);
    }

    /**
     * Submit a new report
     * @param {Object} data - { url, reason, description }
     */
    submitReport(data) {
        const report = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            timestamp: new Date().toISOString(),
            status: 'pending',
            ...data
        };

        this.reports.unshift(report);
        this.save();

        return { success: true, report };
    }

    /**
     * Get all reports
     */
    getReports() {
        return [...this.reports];
    }

    /**
     * Save reports to storage
     */
    save() {
        Storage.set(this.STORAGE_KEY, this.reports);
    }
}

export const ReportService = new ReportServiceClass();
export default ReportService;
