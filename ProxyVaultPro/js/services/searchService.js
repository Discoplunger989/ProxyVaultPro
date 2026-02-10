/**
 * ProxyVaultPro - Search Service
 * Search, filter, and sort functionality
 */

import { ProxyService } from './proxyService.js';

class SearchServiceClass {
    constructor() {
        this.filters = {
            query: '',
            tags: [],
            favoritesOnly: false,
            sortBy: 'date-newest'
        };
    }

    /**
     * Set search query
     */
    setQuery(query) {
        this.filters.query = query.toLowerCase().trim();
        return this;
    }

    /**
     * Set tag filters
     */
    setTags(tags) {
        this.filters.tags = tags;
        return this;
    }

    /**
     * Toggle tag
     */
    toggleTag(tag) {
        const index = this.filters.tags.indexOf(tag);
        if (index === -1) {
            this.filters.tags.push(tag);
        } else {
            this.filters.tags.splice(index, 1);
        }
        return this;
    }

    /**
     * Set favorites only filter
     */
    setFavoritesOnly(value) {
        this.filters.favoritesOnly = value;
        return this;
    }

    /**
     * Set sort option
     */
    setSortBy(sortBy) {
        this.filters.sortBy = sortBy;
        return this;
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {
            query: '',
            tags: [],
            favoritesOnly: false,
            sortBy: 'date-newest'
        };
        return this;
    }

    /**
     * Get filtered and sorted proxies
     */
    search() {
        let results = ProxyService.getAll();

        // Filter by query
        if (this.filters.query) {
            results = results.filter(p =>
                p.name.toLowerCase().includes(this.filters.query) ||
                p.url.toLowerCase().includes(this.filters.query) ||
                p.description.toLowerCase().includes(this.filters.query) ||
                p.tags.some(t => t.toLowerCase().includes(this.filters.query))
            );
        }

        // Filter by tags
        if (this.filters.tags.length > 0) {
            results = results.filter(p =>
                this.filters.tags.some(tag => p.tags.includes(tag))
            );
        }

        // Filter favorites only
        if (this.filters.favoritesOnly) {
            results = results.filter(p => p.favorite);
        }

        // Sort
        results = this.sort(results);

        return results;
    }

    /**
     * Sort results
     */
    sort(proxies) {
        const sorted = [...proxies];

        switch (this.filters.sortBy) {
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'date-newest':
                sorted.sort((a, b) => b.addedAt - a.addedAt);
                break;
            case 'date-oldest':
                sorted.sort((a, b) => a.addedAt - b.addedAt);
                break;
            case 'access-most':
                sorted.sort((a, b) => b.accessCount - a.accessCount);
                break;
            case 'access-least':
                sorted.sort((a, b) => a.accessCount - b.accessCount);
                break;
        }

        return sorted;
    }

    /**
     * Get current filters
     */
    getFilters() {
        return { ...this.filters };
    }
}

export const SearchService = new SearchServiceClass();
export default SearchService;
