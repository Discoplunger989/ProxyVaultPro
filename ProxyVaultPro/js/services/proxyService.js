/**
 * ProxyVaultPro - Proxy Service
 * CRUD operations for proxies
 */

import { Storage } from '../core/storage.js';
import { EventBus, EVENTS } from '../core/eventBus.js';
import { CONFIG } from '../config.js';
import { Proxy } from '../models/Proxy.js';

class ProxyServiceClass {
    constructor() {
        this.proxies = [];
    }

    /**
     * Initialize and load proxies
     */
    init() {
        this.load();
    }

    /**
     * Load proxies from storage
     */
    load() {
        const data = Storage.get(CONFIG.STORAGE_KEYS.PROXIES, []);
        this.proxies = data.map(p => Proxy.fromJSON(p));
        EventBus.emit(EVENTS.PROXIES_LOADED, this.proxies);
        return this.proxies;
    }

    /**
     * Save proxies to storage
     */
    save() {
        Storage.set(CONFIG.STORAGE_KEYS.PROXIES, this.proxies.map(p => p.toJSON()));
    }

    /**
     * Get all proxies
     */
    getAll() {
        return [...this.proxies];
    }

    /**
     * Get proxy by ID
     */
    getById(id) {
        return this.proxies.find(p => p.id === id);
    }

    /**
     * Add new proxy
     */
    add(data) {
        const proxy = new Proxy(data);
        const validation = proxy.validate();
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        this.proxies.unshift(proxy);
        this.save();
        EventBus.emit(EVENTS.PROXY_ADDED, proxy);
        return { success: true, proxy };
    }

    /**
     * Update proxy
     */
    update(id, data) {
        const proxy = this.getById(id);
        if (!proxy) {
            return { success: false, errors: ['Proxy not found'] };
        }

        proxy.update(data);
        const validation = proxy.validate();
        if (!validation.valid) {
            return { success: false, errors: validation.errors };
        }

        this.save();
        EventBus.emit(EVENTS.PROXY_UPDATED, proxy);
        return { success: true, proxy };
    }

    /**
     * Delete proxy
     */
    delete(id) {
        const index = this.proxies.findIndex(p => p.id === id);
        if (index === -1) {
            return { success: false, errors: ['Proxy not found'] };
        }

        const [deleted] = this.proxies.splice(index, 1);
        this.save();
        EventBus.emit(EVENTS.PROXY_DELETED, deleted);
        return { success: true, proxy: deleted };
    }

    /**
     * Toggle favorite
     */
    toggleFavorite(id) {
        const proxy = this.getById(id);
        if (!proxy) return { success: false };

        proxy.toggleFavorite();
        this.save();
        EventBus.emit(EVENTS.PROXY_UPDATED, proxy);
        return { success: true, proxy };
    }

    /**
     * Increment access count
     */
    incrementAccess(id) {
        const proxy = this.getById(id);
        if (!proxy) return;

        proxy.incrementAccess();
        this.save();
    }

    /**
     * Get all unique tags
     */
    getAllTags() {
        const tags = new Set();
        this.proxies.forEach(p => p.tags.forEach(t => tags.add(t)));
        return [...tags].sort();
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            total: this.proxies.length,
            favorites: this.proxies.filter(p => p.favorite).length,
            totalAccess: this.proxies.reduce((sum, p) => sum + p.accessCount, 0)
        };
    }

    /**
     * Bulk delete
     */
    bulkDelete(ids) {
        this.proxies = this.proxies.filter(p => !ids.includes(p.id));
        this.save();
        EventBus.emit(EVENTS.PROXIES_LOADED, this.proxies);
    }

    /**
     * Clear all proxies
     */
    clearAll() {
        this.proxies = [];
        this.save();
        EventBus.emit(EVENTS.PROXIES_LOADED, this.proxies);
    }

    /**
     * Import proxies
     */
    import(data, merge = true) {
        const imported = data.map(p => new Proxy(p));

        if (merge) {
            imported.forEach(p => {
                const existing = this.getById(p.id);
                if (!existing) {
                    this.proxies.push(p);
                }
            });
        } else {
            this.proxies = imported;
        }

        this.save();
        EventBus.emit(EVENTS.PROXIES_LOADED, this.proxies);
        return { success: true, count: imported.length };
    }
}

export const ProxyService = new ProxyServiceClass();
export default ProxyService;
