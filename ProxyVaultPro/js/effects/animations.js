/**
 * ProxyVaultPro - Animations Controller
 * UI animation utilities
 */

export function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = '';

    let start = null;
    const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.style.opacity = progress;
        if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

export function fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);

    const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        element.style.opacity = initialOpacity * (1 - progress);
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    };
    requestAnimationFrame(animate);
}

export function slideUp(element, duration = 300) {
    element.style.transform = 'translateY(20px)';
    element.style.opacity = '0';
    element.style.display = '';

    let start = null;
    const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.style.transform = `translateY(${20 * (1 - eased)}px)`;
        element.style.opacity = eased;
        if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

export function scaleIn(element, duration = 200) {
    element.style.transform = 'scale(0.95)';
    element.style.opacity = '0';
    element.style.display = '';

    let start = null;
    const animate = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.style.transform = `scale(${0.95 + 0.05 * eased})`;
        element.style.opacity = eased;
        if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

export default { fadeIn, fadeOut, slideUp, scaleIn };
