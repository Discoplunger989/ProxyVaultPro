/**
 * ProxyVaultPro - General Helpers
 */

export function debounce(fn, ms) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}

export function throttle(fn, ms) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= ms) {
            lastCall = now;
            fn(...args);
        }
    };
}

export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, t) {
    return start + (end - start) * t;
}

export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function openInNewTab(url) {
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.document.write(`
            <iframe style="position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;z-index:999999;" src="${url}"></iframe>
            <style>body{margin:0;padding:0;overflow:hidden;}</style>
        `);
        win.document.close();
    }
}
