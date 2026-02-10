/**
 * ProxyVaultPro - Admin View
 */

import { Sidebar } from '../components/Sidebar.js';
import { ProxyService } from '../services/proxyService.js';
import { ThemeService } from '../services/themeService.js';
import { ImportExport } from '../services/importExport.js';
import { Auth } from '../core/auth.js';
import { Storage } from '../core/storage.js';
import { EventBus, EVENTS } from '../core/eventBus.js';
import { Modal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';
import { createAdminProxyItem } from '../components/ProxyCard.js';
import { CONFIG } from '../config.js';

export class AdminView {
    constructor() {
        this.view = document.getElementById('admin-view');
        this.sidebar = new Sidebar();
    }

    init(options = {}) {
        const { onBack } = options;
        this.onBack = onBack;

        this.sidebar.init({ onBack });

        this.initProxyManager();
        this.initSecurityPanel();
        this.initThemePanel();
        this.initParticlePanel();
        this.initSystemPanel();
    }

    initProxyManager() {
        document.getElementById('add-proxy-btn')?.addEventListener('click', () => this.showProxyModal());
        document.getElementById('import-proxies-btn')?.addEventListener('click', () => this.handleImport());
        this.renderProxyList();
    }

    renderProxyList() {
        const container = document.getElementById('admin-proxy-list');
        if (!container) return;

        const proxies = ProxyService.getAll();
        container.innerHTML = '';

        if (proxies.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);padding:var(--space-8)">No proxies yet. Add your first one!</p>';
            return;
        }

        proxies.forEach(proxy => {
            const item = createAdminProxyItem(proxy, {
                onEdit: (p) => this.showProxyModal(p),
                onDelete: (p) => this.deleteProxy(p)
            });
            container.appendChild(item);
        });
    }

    async showProxyModal(proxy = null) {
        const isEdit = !!proxy;
        const modal = Modal.show({
            title: isEdit ? 'Edit Proxy' : 'Add Proxy',
            content: `
        <form id="proxy-form" class="settings-form">
          <div class="form-group">
            <label for="proxy-name">Name</label>
            <input type="text" id="proxy-name" value="${proxy?.name || ''}" required>
          </div>
          <div class="form-group">
            <label for="proxy-url">URL</label>
            <input type="url" id="proxy-url" value="${proxy?.url || ''}" required>
          </div>
          <div class="form-group">
            <label for="proxy-desc">Description</label>
            <input type="text" id="proxy-desc" value="${proxy?.description || ''}">
          </div>
          <div class="form-group">
            <label for="proxy-tags">Tags (comma separated)</label>
            <input type="text" id="proxy-tags" value="${proxy?.tags?.join(', ') || ''}">
          </div>
        </form>
      `,
            footer: `
        <button class="btn btn-ghost" id="cancel-proxy">Cancel</button>
        <button class="btn btn-primary" id="save-proxy">${isEdit ? 'Update' : 'Add'}</button>
      `
        });

        modal.querySelector('#cancel-proxy').addEventListener('click', () => Modal.close());
        modal.querySelector('#save-proxy').addEventListener('click', () => {
            const data = {
                name: modal.querySelector('#proxy-name').value,
                url: modal.querySelector('#proxy-url').value,
                description: modal.querySelector('#proxy-desc').value,
                tags: modal.querySelector('#proxy-tags').value.split(',').map(t => t.trim()).filter(Boolean)
            };

            const result = isEdit ? ProxyService.update(proxy.id, data) : ProxyService.add(data);

            if (result.success) {
                Toast.success(isEdit ? 'Proxy updated' : 'Proxy added');
                Modal.close();
                this.renderProxyList();
            } else {
                Toast.error(result.errors[0]);
            }
        });
    }

    async deleteProxy(proxy) {
        const confirmed = await Modal.confirm({
            title: 'Delete Proxy',
            message: `Are you sure you want to delete "${proxy.name}"?`,
            danger: true
        });

        if (confirmed) {
            ProxyService.delete(proxy.id);
            Toast.success('Proxy deleted');
            this.renderProxyList();
        }
    }

    handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const result = await ImportExport.importProxies(file);
                if (result.success) {
                    Toast.success(`Imported ${result.count} proxies`);
                    this.renderProxyList();
                } else {
                    Toast.error(result.error);
                }
            }
        };
        input.click();
    }

    initSecurityPanel() {
        document.getElementById('admin-password-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const current = document.getElementById('current-admin-password').value;
            const newPass = document.getElementById('new-admin-password').value;
            const confirm = document.getElementById('confirm-admin-password').value;

            if (newPass !== confirm) {
                Toast.error('Passwords do not match');
                return;
            }

            const result = await Auth.changePassword('admin', current, newPass);
            Toast[result.success ? 'success' : 'error'](result.message);
            if (result.success) e.target.reset();
        });

        document.getElementById('user-password-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPass = document.getElementById('new-user-password').value;
            const confirm = document.getElementById('confirm-user-password').value;

            if (newPass !== confirm) {
                Toast.error('Passwords do not match');
                return;
            }

            const result = await Auth.setUserPassword('user', newPass);
            Toast[result.success ? 'success' : 'error'](result.message);
            if (result.success) e.target.reset();
        });

        const settings = Storage.get(CONFIG.STORAGE_KEYS.SETTINGS, CONFIG.DEFAULT_SETTINGS);
        document.getElementById('session-timeout').value = settings.sessionTimeout || 0;

        document.getElementById('session-timeout')?.addEventListener('change', (e) => {
            const settings = Storage.get(CONFIG.STORAGE_KEYS.SETTINGS, {});
            settings.sessionTimeout = parseInt(e.target.value);
            Storage.set(CONFIG.STORAGE_KEYS.SETTINGS, settings);
            Toast.success('Session timeout updated');
        });
    }

    initThemePanel() {
        const grid = document.getElementById('theme-grid');
        if (!grid) return;

        const themes = ThemeService.getThemes();
        const current = ThemeService.getTheme();

        grid.innerHTML = themes.map(t => `
      <div class="theme-card ${t.id === current ? 'active' : ''}" data-theme="${t.id}">
        <div class="theme-preview" style="background:${t.preview}"></div>
        <div class="theme-name">${t.name}</div>
      </div>
    `).join('');

        grid.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                ThemeService.setTheme(card.dataset.theme);
                grid.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                Toast.success(`Theme changed to ${card.querySelector('.theme-name').textContent}`);
            });
        });
    }

    initParticlePanel() {
        // Read from GLOBAL settings (applies to all users)
        const settings = Storage.get(CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS, CONFIG.DEFAULT_SETTINGS);

        const enabled = document.getElementById('particles-enabled');
        if (enabled) {
            enabled.checked = settings.particlesEnabled;
            enabled.addEventListener('change', () => {
                EventBus.emit(EVENTS.PARTICLES_TOGGLED, { enabled: enabled.checked });
                document.getElementById('particle-options')?.classList.toggle('hidden', !enabled.checked);
            });
        }

        document.getElementById('particle-options')?.classList.toggle('hidden', !settings.particlesEnabled);

        // Presets
        const presetsGrid = document.getElementById('particle-presets');
        if (presetsGrid) {
            presetsGrid.innerHTML = CONFIG.PARTICLE_PRESETS.map(p => `
        <div class="preset-card ${p.id === settings.particlePreset ? 'active' : ''}" data-preset="${p.id}">
          <div class="preset-icon">${p.icon}</div>
          <div class="preset-name">${p.name}</div>
        </div>
      `).join('');

            presetsGrid.querySelectorAll('.preset-card').forEach(card => {
                card.addEventListener('click', () => {
                    EventBus.emit(EVENTS.PARTICLES_PRESET_CHANGED, { preset: card.dataset.preset });
                    presetsGrid.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                });
            });
        }

        // Sliders
        this.initSlider('particle-count', settings.particleCount, v => v);
        this.initSlider('particle-speed', settings.particleSpeed, v => v);
        this.initSlider('particle-size', settings.particleSize, v => v);
        this.initSlider('particle-opacity', settings.particleOpacity * 10, v => (v / 10).toFixed(1));
    }

    initSlider(id, value, format) {
        const slider = document.getElementById(id);
        const display = document.getElementById(`${id}-value`);
        if (!slider) return;

        slider.value = value;
        if (display) display.textContent = format(value);

        slider.addEventListener('input', () => {
            if (display) display.textContent = format(slider.value);
        });

        slider.addEventListener('change', () => {
            const settings = {};
            settings[id.replace('particle-', '').replace('-', '')] =
                id === 'particle-opacity' ? slider.value / 10 : parseInt(slider.value);
            EventBus.emit(EVENTS.PARTICLES_SETTINGS_CHANGED, settings);
        });
    }

    initSystemPanel() {
        document.getElementById('backup-btn')?.addEventListener('click', () => {
            ImportExport.exportBackup();
            Toast.success('Backup created');
        });

        document.getElementById('restore-btn')?.addEventListener('click', () => {
            document.getElementById('restore-file')?.click();
        });

        document.getElementById('restore-file')?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const result = await ImportExport.restoreBackup(file);
                Toast[result.success ? 'success' : 'error'](result.success ? 'Backup restored' : result.error);
                if (result.success) location.reload();
            }
        });

        document.getElementById('reset-all-btn')?.addEventListener('click', async () => {
            const confirmed = await Modal.confirm({
                title: 'Reset All Data',
                message: 'This will delete ALL proxies and reset settings. This cannot be undone!',
                danger: true,
                confirmText: 'Reset Everything'
            });

            if (confirmed) {
                Storage.clear();
                Toast.success('All data reset');
                setTimeout(() => location.reload(), 1000);
            }
        });
    }

    show() {
        this.view?.classList.remove('hidden');
        this.renderProxyList();
    }

    hide() {
        this.view?.classList.add('hidden');
    }
}

export default AdminView;
