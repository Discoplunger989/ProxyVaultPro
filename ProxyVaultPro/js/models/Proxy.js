/**
 * ProxyVaultPro - Proxy Model
 * Data model for proxy links
 */

export class Proxy {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.name = data.name || '';
        this.url = data.url || '';
        this.description = data.description || '';
        this.tags = data.tags || [];
        this.addedAt = data.addedAt || Date.now();
        this.lastModified = data.lastModified || Date.now();
        this.accessCount = data.accessCount || 0;
        this.favorite = data.favorite || false;
    }

    generateId() {
        return `proxy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    validate() {
        const errors = [];
        if (!this.name?.trim()) errors.push('Name is required');
        if (!this.url?.trim()) errors.push('URL is required');
        if (this.url && !this.isValidUrl(this.url)) errors.push('Invalid URL format');
        return { valid: errors.length === 0, errors };
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }

    incrementAccess() {
        this.accessCount++;
        return this;
    }

    toggleFavorite() {
        this.favorite = !this.favorite;
        this.lastModified = Date.now();
        return this;
    }

    update(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.url !== undefined) this.url = data.url;
        if (data.description !== undefined) this.description = data.description;
        if (data.tags !== undefined) this.tags = data.tags;
        if (data.favorite !== undefined) this.favorite = data.favorite;
        this.lastModified = Date.now();
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            url: this.url,
            description: this.description,
            tags: this.tags,
            addedAt: this.addedAt,
            lastModified: this.lastModified,
            accessCount: this.accessCount,
            favorite: this.favorite
        };
    }

    static fromJSON(json) {
        return new Proxy(json);
    }
}

export default Proxy;
