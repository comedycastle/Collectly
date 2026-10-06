import { hexToRgb, isDarkMode, prefersDarkScheme, readableAccent, rgbToChannels } from './color';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Runtime appearance state.
 *
 * The persisted source of truth is the signed-in user's Supabase user_settings
 * row; this is only the synchronous cache the UI reads while that loads.
 */
export const cachedAppearance = {
    mode: 'light' as ThemeMode,
    primary: '#2563EB',
    accent: '#0E7490',
};

const setVar = (name: string, value: string) => {
    try {
        document.documentElement.style.setProperty(name, value);
    } catch { }
};

// CSS custom properties hold space-separated RGB channels so Tailwind's
// rgb(var(--x) / <alpha-value>) colours keep their opacity modifiers.
const channels = (hex: string, fallback: string): string => {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToChannels(rgb) : fallback;
};

const readableChannels = (hex: string, dark: boolean): string => {
    const rgb = hexToRgb(readableAccent(hex, dark)) || hexToRgb(hex);
    return rgb ? rgbToChannels(rgb) : '14 116 144';
};

// 'system' must consult the OS preference directly. Reading isDarkMode() here
// would consult the stale `dark` class, so switching dark -> system while the OS
// is light would leave the app dark.
const resolveDark = (mode: ThemeMode): boolean =>
    mode === 'dark' || (mode === 'system' && prefersDarkScheme());

/** Readable ink version of primary for text/badges on tinted backgrounds. */
const primaryInk = (primaryHex: string, dark: boolean): string => {
    const rgb = hexToRgb(primaryHex);
    if (!rgb) return channels(primaryHex, '37 99 235');
    // In dark mode the raw primary is too dark for text — lighten toward white
    // until it clears AA against the dark surface.
    if (dark) {
        const lightened = {
            r: rgb.r + (255 - rgb.r) * 0.45,
            g: rgb.g + (255 - rgb.g) * 0.45,
            b: rgb.b + (255 - rgb.b) * 0.45,
        };
        return rgbToChannels(lightened);
    }
    return rgbToChannels(rgb);
};

export const applyThemeMode = (mode: ThemeMode) => {
    try {
        cachedAppearance.mode = mode;
        const dark = resolveDark(mode);
        document.documentElement.classList.toggle('dark', dark);
        // Accent + primary-ink readability depends on the surface they sit on.
        setVar('--brand-accent', readableAccent(cachedAppearance.accent, dark));
        setVar('--brand-accent-rgb', readableChannels(cachedAppearance.accent, dark));
        setVar('--brand-primary-ink-rgb', primaryInk(cachedAppearance.primary, dark));
    } catch { }
};

export const applyAccent = (primary: string, accent: string) => {
    try {
        cachedAppearance.primary = primary;
        cachedAppearance.accent = accent;
        const dark = isDarkMode();
        const readable = readableAccent(accent, dark);
        setVar('--brand-primary', primary);
        setVar('--brand-primary-rgb', channels(primary, '37 99 235'));
        setVar('--brand-primary-ink-rgb', primaryInk(primary, dark));
        setVar('--brand-accent', readable);
        setVar('--brand-accent-rgb', readableChannels(accent, dark));
    } catch { }
};

/** Applies the cached theme immediately, then hydrates from Supabase. */
export const restoreSavedTheme = () => {
    applyThemeMode(cachedAppearance.mode);
    applyAccent(cachedAppearance.primary, cachedAppearance.accent);

    (async () => {
        try {
            const { isSupabaseConfigured } = await import('./supabaseClient');
            if (!isSupabaseConfigured) return;
            const { profileService } = await import('../services/formService');
            const row = await profileService.getUserSettings().catch(() => null);
            const s = (row as any)?.settings || {};
            if (s.themeMode) applyThemeMode(s.themeMode);
            if (s.accentPrimary || s.accentAccent) {
                applyAccent(s.accentPrimary || cachedAppearance.primary, s.accentAccent || cachedAppearance.accent);
            }
        } catch { }
    })();
};
