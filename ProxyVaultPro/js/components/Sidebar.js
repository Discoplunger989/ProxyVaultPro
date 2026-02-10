/**
 * ProxyVaultPro - Sidebar Component
 */

export class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('admin-sidebar');
        this.toggle = document.getElementById('sidebar-toggle');
        this.closeBtn = document.getElementById('sidebar-close');
        this.links = document.querySelectorAll('.sidebar-link[data-panel]');
        this.panels = document.querySelectorAll('.admin-panel');
        this.panelTitle = document.getElementById('admin-panel-title');
    }

    init(options = {}) {
        const { onBack } = options;

        // Toggle sidebar on mobile
        this.toggle?.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());

        // Panel navigation
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const panel = link.dataset.panel;
                this.showPanel(panel);
            });
        });

        // Back button
        document.getElementById('back-to-dashboard')?.addEventListener('click', (e) => {
            e.preventDefault();
            onBack?.();
        });
    }

    open() {
        this.sidebar?.classList.add('open');
    }

    close() {
        this.sidebar?.classList.remove('open');
    }

    showPanel(panelId) {
        // Update active link
        this.links.forEach(link => {
            link.classList.toggle('active', link.dataset.panel === panelId);
        });

        // Update active panel
        this.panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `${panelId}-panel`);
        });

        // Update title
        const activeLink = document.querySelector(`.sidebar-link[data-panel="${panelId}"]`);
        if (this.panelTitle && activeLink) {
            this.panelTitle.textContent = activeLink.querySelector('span')?.textContent || '';
        }

        // Close sidebar on mobile
        this.close();
    }
}

export default Sidebar;
