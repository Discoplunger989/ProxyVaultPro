/**
 * ProxyVaultPro - Particle System
 * Canvas-based particle engine
 */

import { Storage } from '../core/storage.js';
import { EventBus, EVENTS } from '../core/eventBus.js';
import { CONFIG } from '../config.js';
import { PRESETS } from './particlePresets.js';

class ParticleSystemClass {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.running = false;
        this.animationId = null;
        this.settings = {
            enabled: true,
            preset: 'stars',
            count: 50,
            speed: 3,
            size: 3,
            opacity: 0.5
        };
    }

    init() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.loadSettings();
        this.resize();

        window.addEventListener('resize', () => this.resize());

        EventBus.on(EVENTS.PARTICLES_TOGGLED, (data) => {
            this.settings.enabled = data.enabled;
            this.saveSettings();
            data.enabled ? this.start() : this.stop();
        });

        EventBus.on(EVENTS.PARTICLES_PRESET_CHANGED, (data) => {
            this.settings.preset = data.preset;
            this.saveSettings();
            this.reset();
        });

        EventBus.on(EVENTS.PARTICLES_SETTINGS_CHANGED, (data) => {
            Object.assign(this.settings, data);
            this.saveSettings();
            this.reset();
        });

        if (this.settings.enabled) {
            this.start();
        }
    }

    loadSettings() {
        // Load from GLOBAL settings (applies to all users)
        const saved = Storage.get(CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS, CONFIG.DEFAULT_SETTINGS);
        this.settings = {
            enabled: saved.particlesEnabled ?? true,
            preset: saved.particlePreset || 'stars',
            count: saved.particleCount || 50,
            speed: saved.particleSpeed || 3,
            size: saved.particleSize || 3,
            opacity: saved.particleOpacity || 0.5
        };
    }

    saveSettings() {
        // Save to GLOBAL settings (so all users see these particles)
        const saved = Storage.get(CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS, {});
        saved.particlesEnabled = this.settings.enabled;
        saved.particlePreset = this.settings.preset;
        saved.particleCount = this.settings.count;
        saved.particleSpeed = this.settings.speed;
        saved.particleSize = this.settings.size;
        saved.particleOpacity = this.settings.opacity;
        Storage.set(CONFIG.STORAGE_KEYS.GLOBAL_SETTINGS, saved);
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        const preset = PRESETS[this.settings.preset] || PRESETS.stars;
        return preset.create(this.canvas.width, this.canvas.height, this.settings);
    }

    start() {
        if (this.running) return;
        this.running = true;

        // Initialize particles
        this.particles = [];
        for (let i = 0; i < this.settings.count; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();
    }

    stop() {
        this.running = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.clear();
    }

    reset() {
        this.stop();
        if (this.settings.enabled) {
            this.start();
        }
    }

    clear() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    animate() {
        if (!this.running) return;

        this.clear();

        const preset = PRESETS[this.settings.preset] || PRESETS.stars;

        this.particles.forEach((p, i) => {
            preset.update(p, this.canvas.width, this.canvas.height, this.settings);
            preset.draw(this.ctx, p, this.settings);

            // Reset if needed
            if (preset.shouldReset?.(p, this.canvas.width, this.canvas.height)) {
                this.particles[i] = this.createParticle();
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    getSettings() {
        return { ...this.settings };
    }
}

export const ParticleSystem = new ParticleSystemClass();
export default ParticleSystem;
