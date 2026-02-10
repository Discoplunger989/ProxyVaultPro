/**
 * ProxyVaultPro - Proxy List Component
 * Renders the proxy grid/list
 */

import { createProxyCard } from './ProxyCard.js';

export class ProxyList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.emptyState = document.getElementById('empty-state');
        this.proxyCount = document.getElementById('proxy-count');
        this.viewMode = 'grid';
        this.handlers = {};
    }

    setHandlers(handlers) {
        this.handlers = handlers;
    }

    setViewMode(mode) {
        this.viewMode = mode;
        if (this.container) {
            this.container.className = mode === 'grid' ? 'proxy-grid' : 'proxy-list';
        }
    }

    render(proxies) {
        if (!this.container) return;

        this.container.innerHTML = '';

        if (proxies.length === 0) {
            this.emptyState?.classList.remove('hidden');
            this.proxyCount && (this.proxyCount.textContent = '0 proxies');
            return;
        }

        this.emptyState?.classList.add('hidden');
        this.proxyCount && (this.proxyCount.textContent = `${proxies.length} prox${proxies.length === 1 ? 'y' : 'ies'}`);

        const fragment = document.createDocumentFragment();

        proxies.forEach(proxy => {
            const card = createProxyCard(proxy, this.handlers);
            fragment.appendChild(card);
        });

        this.container.appendChild(fragment);
    }
}

export default ProxyList;
