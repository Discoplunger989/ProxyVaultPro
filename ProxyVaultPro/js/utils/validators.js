/**
 * ProxyVaultPro - Validators
 * Input validation utilities
 */

export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}

export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function isValidPassword(password, minLength = 6) {
    return password && password.length >= minLength;
}

export function isNonEmpty(value) {
    return value && value.trim().length > 0;
}

export function sanitizeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function validateProxy(data) {
    const errors = [];
    if (!isNonEmpty(data.name)) errors.push('Name is required');
    if (!isNonEmpty(data.url)) errors.push('URL is required');
    if (data.url && !isValidUrl(data.url)) errors.push('Invalid URL format');
    return { valid: errors.length === 0, errors };
}
