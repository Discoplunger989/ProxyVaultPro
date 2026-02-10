/**
 * ProxyVaultPro - Navbar Component
 */

export class Navbar {
    constructor() {
        this.userMenuBtn = document.getElementById('user-menu-btn');
        this.userDropdown = document.getElementById('user-dropdown');
        this.userAvatar = document.getElementById('user-avatar');
        this.userName = document.getElementById('user-name');
        this.adminLink = document.getElementById('admin-link');
    }

    init(options = {}) {
        const { onLogout, onAdmin, onExport, onThemeToggle, onReport } = options;

        // User menu toggle
        this.userMenuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.userDropdown?.classList.toggle('show');
        });

        // Close on outside click
        document.addEventListener('click', () => {
            this.userDropdown?.classList.remove('show');
        });

        // Admin link
        this.adminLink?.addEventListener('click', (e) => {
            e.preventDefault();
            onAdmin?.();
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            onLogout?.();
        });

        // Export
        document.getElementById('export-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            onExport?.();
        });

        // Theme toggle
        document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
            onThemeToggle?.();
        });

        // Report button
        document.getElementById('report-btn')?.addEventListener('click', () => {
            onReport?.();
        });
    }

    setUser(user) {
        if (this.userName) {
            this.userName.textContent = user.username;
        }
        if (this.userAvatar) {
            this.userAvatar.textContent = user.username.charAt(0).toUpperCase();
        }
        if (this.adminLink) {
            this.adminLink.style.display = user.role === 'admin' ? 'flex' : 'none';
        }
    }
}

export default Navbar;
