/**
 * ProxyVaultPro - Theme Service
 * Theme switching and persistence
 */

import { Storage } from '../core/storage.js';
import { EventBus, EVENTS } from '../core/eventBus.js';
import { CONFIG } from '../config.js';

class ThemeServiceClass {
    constructor() {
        this.currentTheme = 'dark';
        this.themeStylesheet = null;
    }

    /**
     * Initialize theme service
     */
    init() {
        this.themeStylesheet = document.getElementById('theme-stylesheet');
        this.loadSavedTheme();
    }

    /**
     * Load saved theme from global storage (applies to all users)
     */
    loadSavedTheme() {
        const globalSettings = Storage.get(CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS, CONFIG.DEFAULT_SETTINGS);
        this.setTheme(globalSettings.theme || 'dark', false);
    }

    /**
     * Set active theme
     * @param {string} themeId - Theme to set
     * @param {boolean} save - Whether to save to global storage (admin only)
     */
    setTheme(themeId, save = true) {
        const theme = CONFIG.THEMES.find(t => t.id === themeId);
        if (!theme) return false;

        this.currentTheme = themeId;

        // Update data attribute
        document.documentElement.setAttribute('data-theme', themeId);

        // Update stylesheet
        if (this.themeStylesheet) {
            this.themeStylesheet.href = `css/themes/${themeId}.css`;
        }

        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme.preview);
        }

        // Save to GLOBAL settings (so all users see this theme)
        if (save) {
            const globalSettings = Storage.get(CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS, CONFIG.DEFAULT_SETTINGS);
            globalSettings.theme = themeId;
            Storage.set(CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS, globalSettings);
        }

        EventBus.emit(EVENTS.THEME_CHANGED, { theme: themeId });

        return true;
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Get all available themes
     */
    getThemes() {
        return CONFIG.THEMES;
    }

    /**
     * Check if theme is current
     */
    isActive(themeId) {
        return this.currentTheme === themeId;
    }
}

export const ThemeService = new ThemeServiceClass();
export default ThemeService;
