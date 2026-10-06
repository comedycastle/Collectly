import { useEffect, useMemo, useState } from 'react';

/**
 * Chart palette derived from the live CSS custom properties, so Recharts output
 * follows the active theme (and the user's accent choice) instead of hardcoded
 * hex values that only work on a white background.
 */
export interface ChartPalette {
    primary: string;
    accent: string;
    violet: string;
    success: string;
    warning: string;
    danger: string;
    neutral: string;
    grid: string;
    axis: string;
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;
    tick: string;
}

const channelToHex = (value: string, fallback: string): string => {
    const parts = value.trim().split(/\s+/).map((n) => Number(n));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return fallback;
    return `#${parts.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')).join('')}`;
};

const cssVar = (name: string): string => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return '';
    try {
        return getComputedStyle(document.documentElement).getPropertyValue(name);
    } catch {
        return '';
    }
};

/** Prefer the -rgb channels var, fall back to the hex var, then the default. */
const readColor = (rgbName: string, hexName: string, fallback: string): string => {
    const channels = cssVar(rgbName);
    if (channels && channels.trim()) return channelToHex(channels, fallback);
    const hex = cssVar(hexName);
    if (hex && hex.trim()) return hex.trim();
    return fallback;
};

const isDark = (): boolean => {
    try {
        return document.documentElement.classList.contains('dark');
    } catch {
        return false;
    }
};

export const readChartPalette = (): ChartPalette => {
    const dark = isDark();
    return {
        primary: readColor('--brand-primary-rgb', '--brand-primary', dark ? '#3B82F6' : '#2563EB'),
        accent: readColor('--brand-accent-rgb', '--brand-accent', dark ? '#22D3EE' : '#0E7490'),
        violet: readColor('--brand-violet-rgb', '--brand-violet', dark ? '#A78BFA' : '#7C3AED'),
        success: readColor('--brand-success-rgb', '--brand-success', dark ? '#34D399' : '#047857'),
        warning: readColor('--brand-warning-rgb', '--brand-warning', dark ? '#FBBF24' : '#B05109'),
        danger: readColor('--brand-danger-rgb', '--brand-danger', dark ? '#F87171' : '#C81E1E'),
        neutral: readColor('--brand-neutral-rgb', '--brand-neutral', dark ? '#94A3B8' : '#475569'),
        grid: readColor('--brand-border-rgb', '--brand-border', dark ? '#334155' : '#CBD5E1'),
        axis: readColor('--brand-border-rgb', '--brand-border', dark ? '#334155' : '#CBD5E1'),
        tooltipBg: readColor('--brand-surface-rgb', '--brand-surface', dark ? '#1E293B' : '#FFFFFF'),
        tooltipBorder: readColor('--brand-border-rgb', '--brand-border', dark ? '#334155' : '#E2E8F0'),
        tooltipText: readColor('--brand-text-rgb', '--brand-text', dark ? '#F8FAFC' : '#0F172A'),
        tick: readColor('--brand-muted-rgb', '--brand-muted', dark ? '#94A3B8' : '#617187'),
    };
};

/** Re-renders the caller whenever the theme class or accent vars change. */
export const useChartPalette = (): ChartPalette => {
    const [version, setVersion] = useState(0);

    useEffect(() => {
        if (typeof MutationObserver === 'undefined') return;
        const observer = new MutationObserver(() => setVersion((v) => v + 1));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
        return () => observer.disconnect();
    }, []);

    return useMemo(() => readChartPalette(), [version]);
};
