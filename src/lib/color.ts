/**
 * Colour helpers for the runtime theme (CSS custom properties hold
 * space-separated RGB channels, e.g. `--brand-primary: 37 99 235`).
 */

export interface Rgb {
    r: number;
    g: number;
    b: number;
}

const clamp = (n: number, min = 0, max = 255) => Math.min(max, Math.max(min, n));

export const hexToRgb = (hex: string): Rgb | null => {
    if (typeof hex !== 'string') return null;
    let h = hex.trim().replace(/^#/, '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
};

export const rgbToChannels = (rgb: Rgb): string =>
    `${clamp(Math.round(rgb.r))} ${clamp(Math.round(rgb.g))} ${clamp(Math.round(rgb.b))}`;

export const rgbToHex = (rgb: Rgb): string =>
    '#' + [rgb.r, rgb.g, rgb.b].map((v) => clamp(Math.round(v)).toString(16).padStart(2, '0')).join('').toUpperCase();

const toLinear = (channel: number) => {
    const c = clamp(channel) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

/** WCAG relative luminance. */
export const luminance = (rgb: Rgb): number =>
    0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);

/** WCAG contrast ratio between two colours (1 – 21). */
export const contrastRatio = (a: Rgb, b: Rgb): number => {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** True when the OS asks for a dark UI. Independent of the current class. */
export const prefersDarkScheme = (): boolean => {
    try {
        return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
        return false;
    }
};

/** True when dark mode is currently applied (class OR OS, whichever is set). */
export const isDarkMode = (): boolean => {
    try {
        if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) return true;
        return prefersDarkScheme();
    } catch {
        return false;
    }
};

/**
 * Nudge a colour toward black (light backgrounds) or white (dark backgrounds)
 * until it clears `minRatio` contrast against `against`.
 *
 * Guards the "Accent Colours" setting: users could previously pick a pale cyan
 * and make every accent label unreadable, because the old token was a raw hex.
 */
export const ensureContrast = (hex: string, against: Rgb, minRatio = 4.5): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    // Already compliant: hand back the exact colour the user picked.
    if (contrastRatio(rgb, against) >= minRatio) return rgbToHex(rgb);

    // Mix toward the contrast anchor in small steps; keeps the hue recognisable.
    const target = luminance(against) > 0.5 ? BLACK : WHITE;
    let best = rgb;

    for (let step = 1; step <= 20; step++) {
        const t = step / 20;
        const candidate: Rgb = {
            r: rgb.r + (target.r - rgb.r) * t,
            g: rgb.g + (target.g - rgb.g) * t,
            b: rgb.b + (target.b - rgb.b) * t,
        };
        if (contrastRatio(candidate, against) >= minRatio) return rgbToHex(candidate);
        best = candidate;
    }
    return rgbToHex(best);
};

/** Accent colour safe to use as text against the current theme surface. */
export const readableAccent = (hex: string, dark: boolean): string =>
    ensureContrast(hex, dark ? { r: 30, g: 41, b: 59 } : WHITE, 4.5);

/** `#2563EB` + 0.1 -> `rgba(37, 99, 235, 0.1)` (passes through invalid input). */
export const withAlpha = (hex: string, alpha: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const a = Math.max(0, Math.min(1, alpha));
    return `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${a})`;
};