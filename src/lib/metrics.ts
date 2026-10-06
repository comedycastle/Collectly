import { FormResponse } from '../types';

const DAY_MS = 86400000;

// Placeholder for any metric that cannot be derived from real data.
// The dashboard used to print a hardcoded "0%" / "2m 15s" here, which read as
// "no data" even when every submission was already in the store.
export const NO_DATA = '—';

export const formatDuration = (seconds: number | null | undefined): string => {
    if (seconds === null || seconds === undefined) return NO_DATA;
    if (!Number.isFinite(seconds) || seconds <= 0) return NO_DATA;
    const total = Math.round(seconds);
    if (total < 60) return `${total}s`;
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    if (minutes < 60) return secs ? `${minutes}m ${secs}s` : `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
};

/**
 * Completion rate = submissions / tracked views.
 * Returns null when no views have been tracked, because a rate without a
 * denominator is not 0% — it is simply unknown.
 */
export const completionRateFor = (submissions: number, views: number): number | null => {
    if (!views || views <= 0) return null;
    return Math.min(100, Math.round((submissions / views) * 100));
};

/** Mean of a numeric list, or null when the list is empty. */
export const average = (values: number[]): number | null => {
    const usable = values.filter((n) => Number.isFinite(n));
    if (usable.length === 0) return null;
    return usable.reduce((a, b) => a + b, 0) / usable.length;
};

export interface Trend {
    current: number;
    previous: number;
    deltaPct: number | null;
}

/** Submissions in the last 7 days vs the 7 days before that. */
export const weekOverWeek = (responses: FormResponse[]): Trend => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const currentStart = midnight.getTime() - 6 * DAY_MS;
    const previousStart = currentStart - 7 * DAY_MS;

    let current = 0;
    let previous = 0;
    for (const r of responses) {
        const t = new Date(r.submittedAt).getTime();
        if (Number.isNaN(t)) continue;
        if (t >= currentStart) current += 1;
        else if (t >= previousStart) previous += 1;
    }

    return {
        current,
        previous,
        deltaPct: previous > 0 ? Math.round(((current - previous) / previous) * 100) : null,
    };
};

export const formatTrend = (trend: Trend): string => {
    if (trend.current === 0 && trend.previous === 0) return 'No submissions yet';
    if (trend.deltaPct === null) return `${trend.current} in the last 7 days`;
    const sign = trend.deltaPct > 0 ? '+' : '';
    return `${sign}${trend.deltaPct}% vs previous 7 days`;
};