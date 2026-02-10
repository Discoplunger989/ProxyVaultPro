/**
 * ProxyVaultPro - Theme Model
 * Theme configuration model
 */

export class Theme {
    constructor(data = {}) {
        this.id = data.id || 'dark';
        this.name = data.name || 'Dark';
        this.preview = data.preview || '#0f0f23';
        this.custom = data.custom || false;
        this.colors = data.colors || {};
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            preview: this.preview,
            custom: this.custom,
            colors: this.colors
        };
    }

    static fromJSON(json) {
        return new Theme(json);
    }
}

export default Theme;
