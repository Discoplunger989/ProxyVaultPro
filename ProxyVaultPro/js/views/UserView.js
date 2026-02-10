/**
 * ProxyVaultPro - User View (Dashboard)
 */

import { ProxyService } from '../services/proxyService.js';
import { SearchService } from '../services/searchService.js';
import { ReportService } from '../services/reportService.js';
import { ProxyList } from '../components/ProxyList.js';
import { SearchBar } from '../components/SearchBar.js';
import { Navbar } from '../components/Navbar.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { openInNewTab } from '../utils/helpers.js';
import { Toast } from '../components/Toast.js';
import { Modal } from '../components/Modal.js';

export class UserView {
    constructor() {
        this.view = document.getElementById('user-view');
        this.proxyList = new ProxyList('proxy-container');
        this.searchBar = new SearchBar('search-input');
        this.navbar = new Navbar();
        this.viewMode = 'grid';
    }

    init(options = {}) {
        const { user, onLogout, onAdmin, onExport, onThemeToggle } = options;

        // Setup navbar
        this.navbar.init({
            onLogout,
            onAdmin,
            onExport,
            onThemeToggle,
            onReport: () => this.handleReport()
        });
        this.navbar.setUser(user);

        // Setup proxy list handlers
        this.proxyList.setHandlers({
            onOpen: (proxy) => {
                ProxyService.incrementAccess(proxy.id);
                openInNewTab(proxy.url);
            },
            onFavorite: (proxy) => {
                ProxyService.toggleFavorite(proxy.id);
                this.refresh();
            },
            onCopy: async (proxy) => {
                await copyToClipboard(proxy.url);
                Toast.success('URL copied to clipboard');
            }
        });

        // Setup search
        this.searchBar.init((query) => {
            SearchService.setQuery(query);
            this.refresh();
        });

        // View toggle
        document.getElementById('grid-view-btn')?.addEventListener('click', () => this.setViewMode('grid'));
        document.getElementById('list-view-btn')?.addEventListener('click', () => this.setViewMode('list'));

        // Filter panel
        document.getElementById('filter-btn')?.addEventListener('click', () => this.toggleFilterPanel());
        document.getElementById('close-filter')?.addEventListener('click', () => this.hideFilterPanel());
        document.getElementById('apply-filters')?.addEventListener('click', () => this.applyFilters());
        document.getElementById('clear-filters')?.addEventListener('click', () => this.clearFilters());

        // Initial render
        this.refresh();
        this.renderTagFilters();
    }

    refresh() {
        const proxies = SearchService.search();
        this.proxyList.render(proxies);
    }

    setViewMode(mode) {
        this.viewMode = mode;
        this.proxyList.setViewMode(mode);

        document.getElementById('grid-view-btn')?.classList.toggle('active', mode === 'grid');
        document.getElementById('list-view-btn')?.classList.toggle('active', mode === 'list');

        this.refresh();
    }

    toggleFilterPanel() {
        document.getElementById('filter-panel')?.classList.toggle('hidden');
    }

    hideFilterPanel() {
        document.getElementById('filter-panel')?.classList.add('hidden');
    }

    renderTagFilters() {
        const container = document.getElementById('tag-filters');
        if (!container) return;

        const tags = ProxyService.getAllTags();
        const filters = SearchService.getFilters();

        container.innerHTML = tags.length ? tags.map(tag => `
      <button class="tag-filter ${filters.tags.includes(tag) ? 'active' : ''}" data-tag="${tag}">
        ${tag}
      </button>
    `).join('') : '<span style="color:var(--text-tertiary)">No tags yet</span>';

        container.querySelectorAll('.tag-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
            });
        });
    }

    applyFilters() {
        const sortSelect = document.getElementById('sort-select');
        const favoritesOnly = document.getElementById('favorites-only');
        const tagButtons = document.querySelectorAll('.tag-filter.active');

        SearchService.setSortBy(sortSelect?.value || 'date-newest');
        SearchService.setFavoritesOnly(favoritesOnly?.checked || false);
        SearchService.setTags([...tagButtons].map(btn => btn.dataset.tag));

        this.refresh();
        this.hideFilterPanel();
    }

    clearFilters() {
        SearchService.clearFilters();
        document.getElementById('sort-select').value = 'date-newest';
        document.getElementById('favorites-only').checked = false;
        document.querySelectorAll('.tag-filter').forEach(btn => btn.classList.remove('active'));
        this.searchBar.clear();
        this.refresh();
    }

    show() {
        this.view?.classList.remove('hidden');
        this.refresh();
    }

    hide() {
        this.view?.classList.add('hidden');
    }

    async handleReport() {
        const modal = Modal.show({
            title: 'Report Blocked Site',
            content: `
                <form id="report-form" class="settings-form">
                    <div class="form-group">
                        <label for="report-url">Blocked URL</label>
                        <input type="url" id="report-url" placeholder="https://example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="report-reason">Reason</label>
                        <select id="report-reason" class="form-select" required>
                            <option value="blocked">Site is blocked</option>
                            <option value="broken">Site is broken/not loading</option>
                            <option value="slow">Site is too slow</option>
                            <option value="ads">Too many ads/popups</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="report-desc">Description (Optional)</label>
                        <textarea id="report-desc" rows="3" placeholder="Please provide more details..."></textarea>
                    </div>
                </form>
            `,
            footer: `
                <button class="btn btn-ghost" id="cancel-report">Cancel</button>
                <button class="btn btn-primary" id="submit-report">Submit Report</button>
            `
        });

        modal.querySelector('#cancel-report').addEventListener('click', () => Modal.close());

        modal.querySelector('#submit-report').addEventListener('click', () => {
            const url = modal.querySelector('#report-url').value;
            const reason = modal.querySelector('#report-reason').value;
            const desc = modal.querySelector('#report-desc').value;

            if (!url) {
                Toast.error('Please enter the URL');
                return;
            }

            ReportService.submitReport({ url, reason, description: desc });
            Toast.success('Report submitted successfully');
            Modal.close();
        });
    }
}

export default UserView;
