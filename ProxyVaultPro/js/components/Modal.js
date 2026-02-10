/**
 * ProxyVaultPro - Modal Component
 * Reusable modal dialog
 */

class ModalClass {
    constructor() {
        this.container = null;
        this.activeModal = null;
    }

    init() {
        this.container = document.getElementById('modal-container');
    }

    show(options = {}) {
        const { title, content, footer, onClose, size = 'md' } = options;

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
      <div class="modal modal-${size}">
        <div class="modal-header">
          <h3 class="modal-title">${title || ''}</h3>
          <button class="close-btn modal-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">${content || ''}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;

        modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        if (this.container) {
            this.container.appendChild(modal);
        } else {
            document.body.appendChild(modal);
        }

        this.activeModal = modal;
        this.onClose = onClose;

        return modal;
    }

    close() {
        if (this.activeModal) {
            this.activeModal.style.animation = 'fadeOut 0.2s ease forwards';
            setTimeout(() => {
                this.activeModal?.remove();
                this.activeModal = null;
                if (this.onClose) this.onClose();
            }, 200);
        }
    }

    confirm(options = {}) {
        return new Promise((resolve) => {
            const { title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false } = options;

            const modal = this.show({
                title,
                content: `<p>${message}</p>`,
                footer: `
          <button class="btn btn-ghost modal-cancel">${cancelText}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} modal-confirm">${confirmText}</button>
        `
            });

            modal.querySelector('.modal-cancel').addEventListener('click', () => {
                this.close();
                resolve(false);
            });

            modal.querySelector('.modal-confirm').addEventListener('click', () => {
                this.close();
                resolve(true);
            });
        });
    }

    prompt(options = {}) {
        return new Promise((resolve) => {
            const { title, placeholder = '', defaultValue = '', submitText = 'Submit' } = options;

            const modal = this.show({
                title,
                content: `<input type="text" class="modal-input" placeholder="${placeholder}" value="${defaultValue}" style="width:100%;padding:var(--space-3);background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:var(--radius-lg);color:var(--text-primary);">`,
                footer: `
          <button class="btn btn-ghost modal-cancel">Cancel</button>
          <button class="btn btn-primary modal-submit">${submitText}</button>
        `
            });

            const input = modal.querySelector('.modal-input');
            input.focus();

            modal.querySelector('.modal-cancel').addEventListener('click', () => {
                this.close();
                resolve(null);
            });

            modal.querySelector('.modal-submit').addEventListener('click', () => {
                this.close();
                resolve(input.value);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.close();
                    resolve(input.value);
                }
            });
        });
    }
}

export const Modal = new ModalClass();
export default Modal;
