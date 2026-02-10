/**
 * ProxyVaultPro - Event Bus
 * Global pub/sub event system for component communication
 */

class EventBusClass {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`EventBus error in ${event}:`, error);
                }
            });
        }
    }

    /**
     * Clear all listeners for an event
     * @param {string} event - Event name (optional, clears all if not provided)
     */
    clear(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }
}

// Event Names
export const EVENTS = {
    // Auth Events
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
    SESSION_EXPIRED: 'auth:session_expired',

    // Proxy Events
    PROXIES_LOADED: 'proxy:loaded',
    PROXY_ADDED: 'proxy:added',
    PROXY_UPDATED: 'proxy:updated',
    PROXY_DELETED: 'proxy:deleted',

    // UI Events
    THEME_CHANGED: 'ui:theme_changed',
    VIEW_CHANGED: 'ui:view_changed',
    SEARCH_CHANGED: 'ui:search_changed',
    FILTER_CHANGED: 'ui:filter_changed',

    // Particle Events
    PARTICLES_TOGGLED: 'particles:toggled',
    PARTICLES_PRESET_CHANGED: 'particles:preset_changed',
    PARTICLES_SETTINGS_CHANGED: 'particles:settings_changed',

    // Toast Events
    TOAST: 'ui:toast'
};

// Singleton instance
export const EventBus = new EventBusClass();
export default EventBus;
