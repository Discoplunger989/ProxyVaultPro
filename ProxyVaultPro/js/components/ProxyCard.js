/**
 * ProxyVaultPro - Proxy Card Component
 * Renders individual proxy cards
 */

import { formatRelativeTime } from '../utils/formatters.js';
import { escapeHtml } from '../utils/helpers.js';

export function createProxyCard(proxy, options = {}) {
  const { onOpen, onEdit, onDelete, onFavorite, onCopy } = options;

  const card = document.createElement('div');
  card.className = 'proxy-card glass-card';
  card.dataset.id = proxy.id;

  card.innerHTML = `
    <div class="proxy-card-header">
      <h3 class="proxy-name">${escapeHtml(proxy.name)}</h3>
      <div class="proxy-actions">
        <button class="proxy-action-btn favorite ${proxy.favorite ? 'active' : ''}" title="Favorite">
          <svg viewBox="0 0 24 24" fill="${proxy.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
        <button class="proxy-action-btn copy" title="Copy URL">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      </div>
    </div>
    <a href="${escapeHtml(proxy.url)}" target="_blank" rel="noopener noreferrer" class="proxy-url">${escapeHtml(proxy.url)}</a>
    ${proxy.description ? `<p class="proxy-description">${escapeHtml(proxy.description)}</p>` : ''}
    ${proxy.tags.length > 0 ? `
      <div class="proxy-tags">
        ${proxy.tags.map(tag => `<span class="proxy-tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    ` : ''}
    <div class="proxy-footer">
      <span>Added ${formatRelativeTime(proxy.addedAt)}</span>
      <span>${proxy.accessCount} views</span>
    </div>
  `;

  // Event listeners
  card.querySelector('.favorite')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onFavorite?.(proxy);
  });

  card.querySelector('.copy')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onCopy?.(proxy);
  });

  card.querySelector('.proxy-url')?.addEventListener('click', (e) => {
    e.preventDefault();
    onOpen?.(proxy);
  });

  return card;
}

export function createAdminProxyItem(proxy, options = {}) {
  const { onEdit, onDelete } = options;

  const item = document.createElement('div');
  item.className = 'admin-proxy-item';
  item.dataset.id = proxy.id;

  item.innerHTML = `
    <div class="admin-proxy-info">
      <div class="admin-proxy-name">${escapeHtml(proxy.name)}</div>
      <div class="admin-proxy-url">${escapeHtml(proxy.url)}</div>
    </div>
    <div class="admin-proxy-actions">
      <button class="btn btn-ghost edit-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button class="btn btn-ghost delete-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `;

  item.querySelector('.edit-btn')?.addEventListener('click', () => onEdit?.(proxy));
  item.querySelector('.delete-btn')?.addEventListener('click', () => onDelete?.(proxy));

  return item;
}

export default { createProxyCard, createAdminProxyItem };
