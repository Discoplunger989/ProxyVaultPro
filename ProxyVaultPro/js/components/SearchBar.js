/**
 * ProxyVaultPro - Search Bar Component
 */

import { debounce } from '../utils/helpers.js';

export class SearchBar {
    constructor(inputId, clearId, debounceMs = 300) {
        this.input = document.getElementById(inputId);
        this.clearBtn = document.getElementById(clearId) || document.querySelector('.search-clear');
        this.onSearch = null;
        this.debounceMs = debounceMs;
    }

    init(onSearch) {
        this.onSearch = onSearch;
        if (!this.input) return;

        const debouncedSearch = debounce((value) => {
            this.onSearch?.(value);
        }, this.debounceMs);

        this.input.addEventListener('input', (e) => {
            const value = e.target.value;
            this.toggleClearButton(value.length > 0);
            debouncedSearch(value);
        });

        this.clearBtn?.addEventListener('click', () => {
            this.clear();
        });
    }

    toggleClearButton(show) {
        if (this.clearBtn) {
            this.clearBtn.classList.toggle('hidden', !show);
        }
    }

    clear() {
        if (this.input) {
            this.input.value = '';
            this.toggleClearButton(false);
            this.onSearch?.('');
        }
    }

    getValue() {
        return this.input?.value || '';
    }
}

export default SearchBar;
