/**
 * ProxyVaultPro - Configuration
 * Application constants and settings
 */

export const CONFIG = {
    APP_NAME: 'ProxyVaultPro',
    VERSION: '1.0.0',

    // Storage Keys
    STORAGE_KEYS: {
        PROXIES: 'pvp_proxies',
        USERS: 'pvp_users',
        SETTINGS: 'pvp_settings',
        GLOBAL_SETTINGS: 'pvp_global_settings', // Admin-controlled, applies to all users
        SESSION: 'pvp_session',
        THEME: 'pvp_theme',
        PARTICLES: 'pvp_particles'
    },

    // Default Users
    DEFAULT_USERS: {
        admin: { username: 'admin', password: 'admin123', role: 'admin' },
        user: { username: 'user', password: 'user123', role: 'user' }
    },

    // Default Settings
    DEFAULT_SETTINGS: {
        theme: 'dark',
        particlesEnabled: true,
        particlePreset: 'stars',
        particleCount: 50,
        particleSpeed: 3,
        particleSize: 3,
        particleOpacity: 0.5,
        sessionTimeout: 0,
        viewMode: 'grid'
    },

    // Available Themes
    THEMES: [
        { id: 'dark', name: 'Dark', preview: '#0f0f23' },
        { id: 'light', name: 'Light', preview: '#f8fafc' },
        { id: 'cyberpunk', name: 'Cyberpunk', preview: '#0a0a0f' },
        { id: 'ocean', name: 'Ocean', preview: '#0c1929' },
        { id: 'forest', name: 'Forest', preview: '#0f1a14' },
        { id: 'sunset', name: 'Sunset', preview: '#1a0f0a' },
        { id: 'midnight', name: 'Midnight', preview: '#0d0a1a' },
        { id: 'retro', name: 'Retro', preview: '#1a0a2e' },
        { id: 'neon', name: 'Neon', preview: '#050510' },
        { id: 'minimal', name: 'Minimal', preview: '#1a1a1a' }
    ],

    // Particle Presets
    PARTICLE_PRESETS: [
        { id: 'stars', name: 'Stars', icon: '✨' },
        { id: 'rain', name: 'Rain', icon: '🌧️' },
        { id: 'snow', name: 'Snow', icon: '❄️' },
        { id: 'matrix', name: 'Matrix', icon: '🔢' },
        { id: 'bubbles', name: 'Bubbles', icon: '🫧' },
        { id: 'confetti', name: 'Confetti', icon: '🎊' }
    ],

    // Search Debounce
    SEARCH_DEBOUNCE_MS: 300,

    // Toast Duration
    TOAST_DURATION: 4000,

    // Animation Durations
    ANIMATION: {
        FAST: 150,
        BASE: 200,
        SLOW: 300
    }
};

export default CONFIG;
