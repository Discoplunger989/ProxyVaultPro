/**
 * ProxyVaultPro - Authentication
 * Login, logout, session management
 */

import { Storage } from './storage.js';
import { EventBus, EVENTS } from './eventBus.js';
import { CONFIG } from '../config.js';
import { hashPassword, verifyPassword } from '../utils/crypto.js';

class AuthClass {
    constructor() {
        this.currentSession = null;
        this.sessionCheckInterval = null;
    }

    /**
     * Initialize auth system
     */
    async init() {
        await this.ensureDefaultUsers();
        this.loadSession();
        this.startSessionCheck();
    }

    /**
     * Ensure default users exist
     */
    async ensureDefaultUsers() {
        let users = Storage.get(CONFIG.STORAGE_KEYS.USERS, null);

        if (!users) {
            users = {};
            for (const [key, userData] of Object.entries(CONFIG.DEFAULT_USERS)) {
                users[userData.username] = {
                    username: userData.username,
                    passwordHash: await hashPassword(userData.password),
                    role: userData.role,
                    createdAt: Date.now()
                };
            }
            Storage.set(CONFIG.STORAGE_KEYS.USERS, users);
        }
    }

    /**
     * Login user
     * @param {string} username 
     * @param {string} password 
     * @param {boolean} remember 
     * @returns {Object} Result with success and message
     */
    async login(username, password, remember = false) {
        const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, {});
        const user = users[username];

        if (!user) {
            return { success: false, message: 'Invalid username or password' };
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return { success: false, message: 'Invalid username or password' };
        }

        // Create session
        const session = {
            username: user.username,
            role: user.role,
            loginAt: Date.now(),
            remember
        };

        this.currentSession = session;
        Storage.set(CONFIG.STORAGE_KEYS.SESSION, session);

        EventBus.emit(EVENTS.LOGIN, { user: session });

        return { success: true, message: 'Login successful', user: session };
    }

    /**
     * Logout current user
     */
    logout() {
        this.currentSession = null;
        Storage.remove(CONFIG.STORAGE_KEYS.SESSION);
        EventBus.emit(EVENTS.LOGOUT);
    }

    /**
     * Load existing session
     */
    loadSession() {
        const session = Storage.get(CONFIG.STORAGE_KEYS.SESSION, null);

        if (session) {
            // Check if session is expired
            const settings = Storage.get(CONFIG.STORAGE_KEYS.SETTINGS, CONFIG.DEFAULT_SETTINGS);
            const timeout = settings.sessionTimeout;

            if (timeout > 0) {
                const elapsed = Date.now() - session.loginAt;
                const timeoutMs = timeout * 60 * 1000;

                if (elapsed > timeoutMs && !session.remember) {
                    this.logout();
                    EventBus.emit(EVENTS.SESSION_EXPIRED);
                    return null;
                }
            }

            this.currentSession = session;
        }

        return this.currentSession;
    }

    /**
     * Get current session
     * @returns {Object|null} Current session
     */
    getSession() {
        return this.currentSession;
    }

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.currentSession !== null;
    }

    /**
     * Check if current user is admin
     * @returns {boolean}
     */
    isAdmin() {
        return this.currentSession?.role === 'admin';
    }

    /**
     * Change password
     * @param {string} username 
     * @param {string} currentPassword 
     * @param {string} newPassword 
     * @returns {Object} Result
     */
    async changePassword(username, currentPassword, newPassword) {
        const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, {});
        const user = users[username];

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Admin can change any password without current
        if (!this.isAdmin() || username === this.currentSession?.username) {
            const isValid = await verifyPassword(currentPassword, user.passwordHash);
            if (!isValid) {
                return { success: false, message: 'Current password is incorrect' };
            }
        }

        user.passwordHash = await hashPassword(newPassword);
        user.modifiedAt = Date.now();
        users[username] = user;

        Storage.set(CONFIG.STORAGE_KEYS.USERS, users);

        return { success: true, message: 'Password changed successfully' };
    }

    /**
     * Admin: Set user password directly
     * @param {string} username 
     * @param {string} newPassword 
     * @returns {Object} Result
     */
    async setUserPassword(username, newPassword) {
        if (!this.isAdmin()) {
            return { success: false, message: 'Admin access required' };
        }

        const users = Storage.get(CONFIG.STORAGE_KEYS.USERS, {});
        const user = users[username];

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        user.passwordHash = await hashPassword(newPassword);
        user.modifiedAt = Date.now();
        users[username] = user;

        Storage.set(CONFIG.STORAGE_KEYS.USERS, users);

        return { success: true, message: 'Password updated successfully' };
    }

    /**
     * Start session timeout check
     */
    startSessionCheck() {
        // Check every minute
        this.sessionCheckInterval = setInterval(() => {
            if (this.currentSession && !this.currentSession.remember) {
                const settings = Storage.get(CONFIG.STORAGE_KEYS.SETTINGS, CONFIG.DEFAULT_SETTINGS);
                const timeout = settings.sessionTimeout;

                if (timeout > 0) {
                    const elapsed = Date.now() - this.currentSession.loginAt;
                    const timeoutMs = timeout * 60 * 1000;

                    if (elapsed > timeoutMs) {
                        this.logout();
                        EventBus.emit(EVENTS.SESSION_EXPIRED);
                    }
                }
            }
        }, 60000);
    }

    /**
     * Stop session check
     */
    stopSessionCheck() {
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
        }
    }
}

// Singleton instance
export const Auth = new AuthClass();
export default Auth;
