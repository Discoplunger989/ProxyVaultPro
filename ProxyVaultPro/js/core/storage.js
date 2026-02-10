/**
 * ProxyVaultPro - Storage Layer
 * LocalStorage abstraction with JSON serialization
 */

class StorageClass {
    constructor() {
        this.prefix = 'pvp_';
        this.available = this.checkAvailability();
    }

    /**
     * Check if localStorage is available
     */
    checkAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return false;
        }
    }

    /**
     * Get item from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
        if (!this.available) return defaultValue;

        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.error(`Storage get error for ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Set item in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        if (!this.available) return false;

        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage set error for ${key}:`, error);
            // Handle quota exceeded
            if (error.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            return false;
        }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     */
    remove(key) {
        if (!this.available) return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Storage remove error for ${key}:`, error);
        }
    }

    /**
     * Clear all app storage
     */
    clear() {
        if (!this.available) return;

        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    }

    /**
     * Get all keys with prefix
     * @returns {string[]} Array of keys
     */
    keys() {
        if (!this.available) return [];

        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keys.push(key);
            }
        }
        return keys;
    }

    /**
     * Get storage usage info
     * @returns {Object} Usage info
     */
    getUsage() {
        if (!this.available) return { used: 0, limit: 0, percentage: 0 };

        let used = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                used += localStorage.getItem(key)?.length || 0;
            }
        }

        // Estimate 5MB limit
        const limit = 5 * 1024 * 1024;

        return {
            used,
            limit,
            percentage: Math.round((used / limit) * 100)
        };
    }

    /**
     * Handle quota exceeded error
     */
    handleQuotaExceeded() {
        console.warn('Storage quota exceeded, attempting cleanup...');
        // Could implement cleanup logic here
    }

    /**
     * Export all data
     * @returns {Object} All storage data
     */
    exportAll() {
        const data = {};
        this.keys().forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    /**
     * Import data
     * @param {Object} data - Data to import
     */
    importAll(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
}

// Singleton instance
export const Storage = new StorageClass();
export default Storage;
