/**
 * ProxyVaultPro - Router (Optional)
 * Hash-based client-side routing
 */

import { EventBus, EVENTS } from './eventBus.js';

class RouterClass {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    /**
     * Initialize router
     */
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    /**
     * Register a route
     * @param {string} path - Route path
     * @param {Function} handler - Route handler
     */
    register(path, handler) {
        this.routes.set(path, handler);
    }

    /**
     * Navigate to a route
     * @param {string} path - Route path
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Handle route change
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const handler = this.routes.get(hash);

        if (handler) {
            this.currentRoute = hash;
            handler();
            EventBus.emit(EVENTS.VIEW_CHANGED, { route: hash });
        }
    }

    /**
     * Get current route
     * @returns {string} Current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
}

export const Router = new RouterClass();
export default Router;
