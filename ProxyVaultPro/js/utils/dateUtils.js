/**
 * ProxyVaultPro - Date Utilities
 */

export function isToday(timestamp) {
    const today = new Date();
    const date = new Date(timestamp);
    return date.toDateString() === today.toDateString();
}

export function isThisWeek(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return date >= weekStart;
}

export function daysAgo(days) {
    return Date.now() - (days * 24 * 60 * 60 * 1000);
}

export function getDateRange(range) {
    const now = Date.now();
    switch (range) {
        case 'today': return daysAgo(1);
        case 'week': return daysAgo(7);
        case 'month': return daysAgo(30);
        case 'year': return daysAgo(365);
        default: return 0;
    }
}
