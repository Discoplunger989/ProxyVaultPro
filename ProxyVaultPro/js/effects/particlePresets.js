/**
 * ProxyVaultPro - Particle Presets
 * Configuration for different particle effects
 */

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export const PRESETS = {
    stars: {
        create(w, h, settings) {
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                size: randomRange(1, settings.size),
                alpha: randomRange(0.2, settings.opacity),
                twinkleSpeed: randomRange(0.01, 0.03)
            };
        },
        update(p, w, h, settings) {
            p.alpha += Math.sin(Date.now() * p.twinkleSpeed) * 0.01;
            p.alpha = Math.max(0.1, Math.min(settings.opacity, p.alpha));
        },
        draw(ctx, p, settings) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        }
    },

    rain: {
        create(w, h, settings) {
            return {
                x: Math.random() * w,
                y: Math.random() * h - h,
                length: randomRange(10, 20),
                speed: randomRange(settings.speed * 3, settings.speed * 6),
                alpha: randomRange(0.1, settings.opacity * 0.5)
            };
        },
        update(p, w, h, settings) {
            p.y += p.speed;
            p.x += settings.speed * 0.2;
        },
        draw(ctx, p) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 2, p.y + p.length);
            ctx.strokeStyle = `rgba(150, 200, 255, ${p.alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        },
        shouldReset(p, w, h) {
            return p.y > h;
        }
    },

    snow: {
        create(w, h, settings) {
            return {
                x: Math.random() * w,
                y: Math.random() * h - h,
                size: randomRange(2, settings.size * 1.5),
                speed: randomRange(settings.speed * 0.3, settings.speed * 0.8),
                wobble: randomRange(0.5, 2),
                wobbleOffset: Math.random() * Math.PI * 2
            };
        },
        update(p, w, h, settings) {
            p.y += p.speed;
            p.x += Math.sin(Date.now() * 0.001 + p.wobbleOffset) * p.wobble;
        },
        draw(ctx, p, settings) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${settings.opacity})`;
            ctx.fill();
        },
        shouldReset(p, w, h) {
            return p.y > h;
        }
    },

    matrix: {
        create(w, h, settings) {
            const chars = '01アイウエオカキクケコ';
            return {
                x: Math.floor(Math.random() * (w / 14)) * 14,
                y: Math.random() * h - h,
                char: chars[Math.floor(Math.random() * chars.length)],
                speed: randomRange(settings.speed * 2, settings.speed * 5),
                alpha: randomRange(0.5, 1)
            };
        },
        update(p, w, h, settings) {
            p.y += p.speed;
            if (Math.random() < 0.05) {
                const chars = '01アイウエオカキクケコ';
                p.char = chars[Math.floor(Math.random() * chars.length)];
            }
        },
        draw(ctx, p, settings) {
            ctx.font = '14px monospace';
            ctx.fillStyle = `rgba(0, 255, 100, ${p.alpha * settings.opacity})`;
            ctx.fillText(p.char, p.x, p.y);
        },
        shouldReset(p, w, h) {
            return p.y > h;
        }
    },

    bubbles: {
        create(w, h, settings) {
            return {
                x: Math.random() * w,
                y: h + Math.random() * 100,
                size: randomRange(settings.size, settings.size * 3),
                speed: randomRange(settings.speed * 0.3, settings.speed * 0.8),
                wobble: randomRange(0.5, 1.5)
            };
        },
        update(p, w, h, settings) {
            p.y -= p.speed;
            p.x += Math.sin(Date.now() * 0.002 + p.x) * p.wobble;
        },
        draw(ctx, p, settings) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(150, 200, 255, ${settings.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        },
        shouldReset(p, w, h) {
            return p.y < -p.size;
        }
    },

    confetti: {
        create(w, h, settings) {
            const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
            return {
                x: Math.random() * w,
                y: Math.random() * h - h,
                size: randomRange(4, settings.size * 2),
                speed: randomRange(settings.speed * 0.5, settings.speed * 1.5),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: randomRange(-0.1, 0.1)
            };
        },
        update(p, w, h, settings) {
            p.y += p.speed;
            p.x += Math.sin(p.y * 0.05) * 2;
            p.rotation += p.rotationSpeed;
        },
        draw(ctx, p, settings) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = settings.opacity;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        },
        shouldReset(p, w, h) {
            return p.y > h;
        }
    }
};

export default PRESETS;
