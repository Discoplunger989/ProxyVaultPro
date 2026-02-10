/**
 * ProxyVaultPro - Offline View
 */

export class OfflineView {
    constructor() {
        this.view = document.getElementById('offline-view');
    }

    show() {
        if (!this.view) {
            this.createView();
        }
        this.view?.classList.remove('hidden');
    }

    hide() {
        this.view?.classList.add('hidden');
    }

    createView() {
        this.view = document.createElement('div');
        this.view.id = 'offline-view';
        this.view.className = 'view offline-view';
        this.view.innerHTML = `
      <div class="offline-content" style="text-align:center;padding:var(--space-12);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:64px;height:64px;margin:0 auto var(--space-4);opacity:0.5">
          <line x1="1" y1="1" x2="23" y2="23"/>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
          <line x1="12" y1="20" x2="12.01" y2="20"/>
        </svg>
        <h2>You're Offline</h2>
        <p style="color:var(--text-tertiary)">Check your connection and try again</p>
        <button class="btn btn-primary" onclick="location.reload()" style="margin-top:var(--space-4)">Retry</button>
      </div>
    `;
        document.getElementById('app')?.appendChild(this.view);
    }
}

export default OfflineView;
