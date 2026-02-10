/**
 * ProxyVaultPro - Crypto Utilities
 * Password hashing with HTTPS fallback
 */

// Check if we're in a secure context (HTTPS or localhost)
const isSecureContext = window.isSecureContext ||
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1';

/**
 * Simple hash function for non-secure contexts (fallback)
 * WARNING: Less secure than PBKDF2, only use for development
 */
async function simpleHash(password, salt) {
    const combined = salt + password + salt;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return salt + ':' + Math.abs(hash).toString(36);
}

/**
 * Hash password using PBKDF2 (secure) or simple hash (fallback)
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Encoded hash
 */
export async function hashPassword(password) {
    // Try secure method first
    if (isSecureContext && crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const salt = crypto.getRandomValues(new Uint8Array(16));

            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveBits']
            );

            const derivedBits = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                256
            );

            const hashArray = new Uint8Array(derivedBits);
            const combined = new Uint8Array(salt.length + hashArray.length);
            combined.set(salt);
            combined.set(hashArray, salt.length);

            return 'pbkdf2:' + btoa(String.fromCharCode(...combined));
        } catch (e) {
            console.warn('[Crypto] PBKDF2 failed, using fallback:', e.message);
        }
    }

    // Fallback for non-secure contexts
    console.warn('[Crypto] Using simple hash (non-secure context)');
    const salt = Math.random().toString(36).substring(2, 18);
    return 'simple:' + await simpleHash(password, salt);
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} storedHash - Encoded hash
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, storedHash) {
    try {
        // Handle simple hash format
        if (storedHash.startsWith('simple:')) {
            const hashPart = storedHash.substring(7);
            const salt = hashPart.split(':')[0];
            const expectedHash = await simpleHash(password, salt);
            return hashPart === expectedHash.substring(0); // Compare without 'simple:' prefix
        }

        // Handle PBKDF2 format
        if (storedHash.startsWith('pbkdf2:')) {
            storedHash = storedHash.substring(7);
        }

        // Legacy or PBKDF2 format
        if (isSecureContext && crypto.subtle) {
            const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
            const salt = combined.slice(0, 16);
            const storedHashBytes = combined.slice(16);

            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveBits']
            );

            const derivedBits = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                256
            );

            const hashArray = new Uint8Array(derivedBits);

            if (hashArray.length !== storedHashBytes.length) return false;

            for (let i = 0; i < hashArray.length; i++) {
                if (hashArray[i] !== storedHashBytes[i]) return false;
            }

            return true;
        }

        // Can't verify PBKDF2 hash in non-secure context
        console.error('[Crypto] Cannot verify PBKDF2 hash in non-secure context');
        return false;
    } catch (e) {
        console.error('[Crypto] Verification error:', e);
        return false;
    }
}

/**
 * Generate a random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export function generateRandomString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    if (crypto.getRandomValues) {
        const values = crypto.getRandomValues(new Uint8Array(length));
        return Array.from(values, v => chars[v % chars.length]).join('');
    }

    // Fallback
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
