/**
 * Application URL and Platform Configuration
 *
 * Provides resilient, production-ready URL resolution for both local development
 * and cloud hosting environments (Vercel, Netlify, Custom Domains).
 */

/**
 * Returns the canonical base URL for the deployed web application.
 *
 * Resolution priority:
 * 1. `VITE_APP_URL` or `VITE_PUBLIC_URL` explicitly configured in environment
 * 2. `window.location.origin` (dynamically resolves to whatever domain/port the user is on, e.g. https://collectly.vercel.app)
 * 3. Fallback placeholder for safe SSR/pre-rendering environments
 */
export const getAppBaseUrl = (): string => {
    // 1. Explicit environment variable override (useful for CI/CD or custom domain setups)
    const envUrl = (import.meta.env.VITE_APP_URL || import.meta.env.VITE_PUBLIC_URL) as string | undefined;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
        return envUrl.trim().replace(/\/+$/, '');
    }

    // 2. Client-side browser runtime origin (e.g., https://my-collectly.vercel.app or https://collectly.netlify.app)
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return window.location.origin.replace(/\/+$/, '');
    }

    // 3. Fallback default
    return 'https://collectly.app';
};

/**
 * Generates the public shareable link for a given form ID.
 * Automatically adapts between local development, Vercel preview/production, and custom domains.
 */
export const getPublicFormUrl = (formId: string): string => {
    const base = getAppBaseUrl();
    return `${base}/#/form/${formId}`;
};

/**
 * Returns the OAuth or Email authentication redirect target.
 */
export const getAuthRedirectUrl = (): string => {
    const base = getAppBaseUrl();
    if (typeof window !== 'undefined' && window.location && window.location.pathname) {
        return `${base}${window.location.pathname}`;
    }
    return base;
};
