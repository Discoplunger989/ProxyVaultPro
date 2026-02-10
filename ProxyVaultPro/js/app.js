/**
 * ProxyVaultPro - Main Application
 * Entry point and initialization
 */

import { CONFIG } from './config.js';
import { Storage } from './core/storage.js';
import { Auth } from './core/auth.js';
import { EventBus, EVENTS } from './core/eventBus.js';
import { ProxyService } from './services/proxyService.js';
import { ThemeService } from './services/themeService.js';
import { ImportExport } from './services/importExport.js';
import { Toast } from './components/Toast.js';
import { Modal } from './components/Modal.js';
import { ParticleSystem } from './effects/ParticleSystem.js';
import { LoginView } from './views/LoginView.js';
import { UserView } from './views/UserView.js';
import { AdminView } from './views/AdminView.js';

class App {
    constructor() {
        this.currentView = null;
        this.loginView = new LoginView();
        this.userView = new UserView();
        this.adminView = new AdminView();
    }

    async init() {
        console.log(`[${CONFIG.APP_NAME}] Initializing v${CONFIG.VERSION}`);

        try {
            // Initialize core systems
            await Auth.init();
            ProxyService.init();
            ThemeService.init();
            Toast.init();
            Modal.init();
            ParticleSystem.init();

            // Load default proxies if none exist
            await this.loadDefaultProxies();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize views
            this.loginView.init((user) => this.onLoginSuccess(user));

            // Check for existing session
            const session = Auth.getSession();
            if (session) {
                this.showUserView(session);
            } else {
                this.showLoginView();
            }

            console.log(`[${CONFIG.APP_NAME}] Ready!`);
        } catch (error) {
            console.error(`[${CONFIG.APP_NAME}] Initialization error:`, error);
            // Show login view as fallback
            this.showLoginView();
        } finally {
            // Always hide loading screen
            this.hideLoadingScreen();
        }

        // Register service worker (non-blocking)
        this.registerServiceWorker();
    }

    async loadDefaultProxies() {
        const existing = Storage.get(CONFIG.STORAGE_KEYS.PROXIES, null);
        if (existing === null) {
            try {
                const response = await fetch('data/defaultProxies.json');
                if (response.ok) {
                    const proxies = await response.json();
                    ProxyService.import(proxies, false);
                }
            } catch (e) {
                console.log('No default proxies loaded');
            }
        }
    }

    setupEventListeners() {
        // Session expired
        EventBus.on(EVENTS.SESSION_EXPIRED, () => {
            Toast.warning('Session expired. Please log in again.');
            this.showLoginView();
        });

        // Logout
        EventBus.on(EVENTS.LOGOUT, () => {
            this.showLoginView();
        });

        // Theme picker popup
        this.setupThemePicker();

        // Listen for storage changes from other tabs (for global settings sync)
        window.addEventListener('storage', (e) => {
            if (e.key === CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS) {
                console.log('[Sync] Global settings changed in another tab');
                const newSettings = JSON.parse(e.newValue || '{}');

                // Sync theme
                if (newSettings.theme) {
                    ThemeService.setTheme(newSettings.theme, false); // Don't re-save
                }

                // Sync particles
                ParticleSystem.loadSettings();
                ParticleSystem.reset();
            }
        });
    }

    setupThemePicker() {
        const picker = document.getElementById('theme-picker');
        const grid = document.getElementById('theme-picker-grid');
        const closeBtn = document.getElementById('close-theme-picker');

        if (!picker || !grid) return;

        // Render themes
        const themes = ThemeService.getThemes();
        grid.innerHTML = themes.map(t => `
      <div class="theme-card ${ThemeService.isActive(t.id) ? 'active' : ''}" data-theme="${t.id}">
        <div class="theme-preview" style="background:${t.preview}"></div>
        <div class="theme-name">${t.name}</div>
      </div>
    `).join('');

        // Theme selection
        grid.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                ThemeService.setTheme(card.dataset.theme);
                grid.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                setTimeout(() => picker.classList.add('hidden'), 300);
            });
        });

        // Close picker
        closeBtn?.addEventListener('click', () => picker.classList.add('hidden'));
        picker.addEventListener('click', (e) => {
            if (e.target === picker) picker.classList.add('hidden');
        });
    }

    onLoginSuccess(user) {
        Toast.success(`Welcome back, ${user.username}!`);
        this.showUserView(user);
    }

    showLoginView() {
        this.hideAllViews();
        this.loginView.show();
        this.currentView = 'login';
    }

    showUserView(user) {
        this.hideAllViews();

        this.userView.init({
            user,
            onLogout: () => {
                Auth.logout();
                Toast.info('Logged out successfully');
            },
            onAdmin: () => {
                if (Auth.isAdmin()) {
                    this.showAdminView();
                } else {
                    Toast.error('Admin access required');
                }
            },
            onExport: () => {
                ImportExport.exportProxies();
                Toast.success('Proxies exported');
            },
            onThemeToggle: () => {
                document.getElementById('theme-picker')?.classList.remove('hidden');
            }
        });

        this.userView.show();
        this.currentView = 'user';
    }

    showAdminView() {
        this.hideAllViews();

        this.adminView.init({
            onBack: () => {
                const session = Auth.getSession();
                if (session) {
                    this.showUserView(session);
                }
            }
        });

        this.adminView.show();
        this.currentView = 'admin';
    }

    hideAllViews() {
        this.loginView.hide();
        this.userView.hide();
        this.adminView.hide();
    }

    hideLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        if (loading) {
            loading.classList.add('fade-out');
            setTimeout(() => loading.remove(), 500);
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./service-worker.js');
                console.log('[SW] Registered:', registration.scope);
            } catch (error) {
                console.log('[SW] Registration failed:', error);
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init().catch(console.error);
});

export default App;
