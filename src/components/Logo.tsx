import React from 'react';

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LogoVariant = 'full' | 'mark' | 'text' | 'badge';

export interface LogoProps {
    variant?: LogoVariant;
    size?: LogoSize;
    showTagline?: boolean;
    tagline?: string;
    className?: string;
    onClick?: () => void;
    href?: string;
    animated?: boolean;
    lightOnly?: boolean;
    idPrefix?: string;
}

/**
 * Pure SVG Mark of the Collectly Brand.
 * Represents:
 * 1. Layered Form cards & intelligent data collection
 * 2. Dynamic 'C' geometric contour
 * 3. Radiant AI spark node in the upper apex
 */
export const LogoMark: React.FC<{
    size?: LogoSize;
    className?: string;
    animated?: boolean;
    idPrefix?: string;
    onClick?: () => void;
}> = ({ size = 'md', className = '', animated = false, idPrefix = 'col', onClick }) => {
    // Pixel dimensions for mark
    const sizeMap: Record<LogoSize, { px: number; rx: number }> = {
        xs: { px: 20, rx: 6 },
        sm: { px: 28, rx: 8 },
        md: { px: 38, rx: 11 },
        lg: { px: 48, rx: 14 },
        xl: { px: 60, rx: 17 },
    };

    const { px, rx } = sizeMap[size];
    const bgGradId = `${idPrefix}-bg-grad`;
    const cardGradId = `${idPrefix}-card-grad`;
    const sparkGradId = `${idPrefix}-spark-grad`;
    const ribbonGradId = `${idPrefix}-ribbon-grad`;
    const glowFilterId = `${idPrefix}-glow`;

    return (
        <div
            className={`relative inline-flex items-center justify-center shrink-0 select-none ${
                animated ? 'group-hover:scale-105 group-hover:rotate-1 transition-all duration-300' : ''
            } ${onClick ? 'cursor-pointer' : ''} ${className}`}
            style={{ width: px, height: px }}
            onClick={onClick}
        >
            <svg
                width={px}
                height={px}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-sm"
                aria-hidden="true"
            >
                <defs>
                    {/* Rich Outer Blue -> Cyan Brand Gradient */}
                    <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E3A8A" />
                        <stop offset="45%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>

                    {/* Foreground Card Surface Gradient */}
                    <linearGradient id={cardGradId} x1="12" y1="14" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                        <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Dynamic 'C' Ribbon Gradient */}
                    <linearGradient id={ribbonGradId} x1="26" y1="16" x2="38" y2="34" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>

                    {/* AI Golden Spark Gradient */}
                    <linearGradient id={sparkGradId} x1="30" y1="8" x2="42" y2="20" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="60%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>

                    {/* Soft Ambient Glow */}
                    <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563EB" floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* Outer Glass Squircle Base */}
                <rect
                    width="48"
                    height="48"
                    rx={rx}
                    fill={`url(#${bgGradId})`}
                    filter={`url(#${glowFilterId})`}
                />
                <rect
                    x="1"
                    y="1"
                    width="46"
                    height="46"
                    rx={rx - 1}
                    stroke="white"
                    strokeOpacity="0.28"
                    strokeWidth="1.2"
                />

                {/* Layer 1: Back Card / Form Layer (depth stack) */}
                <path
                    d="M13 14.5C13 12.5 14.5 11 16.5 11H30C31.5 11 32.5 12 32.5 13.5V15.5H15C13.9 15.5 13 14.6 13 13.5V14.5Z"
                    fill="white"
                    fillOpacity="0.35"
                />

                {/* Layer 2: Main Collectly Form Card Body */}
                <rect
                    x="11"
                    y="15.5"
                    width="26"
                    height="22"
                    rx="5"
                    fill={`url(#${cardGradId})`}
                />

                {/* Card Title Banner Pill */}
                <rect
                    x="14.5"
                    y="18.5"
                    width="9"
                    height="2.5"
                    rx="1.25"
                    fill="#2563EB"
                />

                {/* Form Row 1: Checkbox Node + Label Line */}
                <circle cx="16" cy="24.5" r="1.5" fill="#06B6D4" />
                <rect x="19.5" y="23.5" width="13" height="2" rx="1" fill="#94A3B8" />

                {/* Form Row 2: Radio Node + Label Line */}
                <circle cx="16" cy="30" r="1.5" fill="#3B82F6" />
                <rect x="19.5" y="29" width="9.5" height="2" rx="1" fill="#CBD5E1" />

                {/* Dynamic Stylized 'C' Ribbon Contour embracing the card */}
                <path
                    d="M32.5 18C34.8 18 36.5 19.8 36.5 22.2V29.5C36.5 32 34.6 34 32.2 34H28.5"
                    stroke={`url(#${ribbonGradId})`}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                />

                {/* Radiant AI Spark Star on Apex */}
                <path
                    d="M36 9C36 12 37.4 13.5 40.5 13.5C37.4 13.5 36 15 36 18C36 15 34.6 13.5 31.5 13.5C34.6 13.5 36 12 36 9Z"
                    fill={`url(#${sparkGradId})`}
                />
                <circle cx="36" cy="13.5" r="1" fill="#FFFFFF" />
            </svg>
        </div>
    );
};

/**
 * Main Collectly Logo Component.
 * Supports Header, Footer, Navbar, MobileNav, and Auth modal usages.
 */
export const Logo: React.FC<LogoProps> = ({
    variant = 'full',
    size = 'md',
    showTagline = false,
    tagline = 'AI-Powered Forms & Quizzes',
    className = '',
    onClick,
    href,
    animated = true,
    lightOnly = false,
    idPrefix,
}) => {
    // Typography scaling
    const typographyClasses: Record<LogoSize, { title: string; tagline: string; spacing: string }> = {
        xs: {
            title: 'text-sm font-extrabold tracking-tight leading-none',
            tagline: 'text-[9px] font-medium tracking-wide leading-none mt-0.5',
            spacing: 'space-x-1.5',
        },
        sm: {
            title: 'text-base font-extrabold tracking-tight leading-tight',
            tagline: 'text-[10px] font-medium tracking-wide leading-tight mt-0.5',
            spacing: 'space-x-2',
        },
        md: {
            title: 'text-xl font-black tracking-tight leading-none',
            tagline: 'text-[11px] font-semibold tracking-wide leading-none mt-1',
            spacing: 'space-x-2.5',
        },
        lg: {
            title: 'text-2xl font-black tracking-tight leading-none',
            tagline: 'text-xs font-semibold tracking-wider leading-none mt-1.5',
            spacing: 'space-x-3',
        },
        xl: {
            title: 'text-3xl font-black tracking-tight leading-none',
            tagline: 'text-sm font-semibold tracking-wider leading-none mt-2',
            spacing: 'space-x-3.5',
        },
    };

    const typo = typographyClasses[size];

    // Badge / "Powered by" variant
    if (variant === 'badge') {
        const content = (
            <div
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-surface/90 border border-brand-border/80 shadow-sm backdrop-blur-sm transition-all hover:border-brand-primary/40 hover:shadow-glow group ${className}`}
                onClick={onClick}
            >
                <span className="text-[11px] font-medium text-brand-muted">Powered by</span>
                <LogoMark size="xs" idPrefix={idPrefix || 'badge'} />
                <span className="text-xs font-black text-brand-text group-hover:text-brand-primary transition-colors">
                    Collect<span className="text-brand-accent">ly</span>
                </span>
            </div>
        );

        if (href) {
            return (
                <a href={href} className="inline-block focus:outline-none">
                    {content}
                </a>
            );
        }
        return content;
    }

    // Wordmark only variant
    if (variant === 'text') {
        const textContent = (
            <div className={`inline-flex flex-col ${className}`} onClick={onClick}>
                <span className={`${typo.title} ${lightOnly ? 'text-slate-900' : 'text-brand-text'}`}>
                    Collect<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">ly</span>
                </span>
                {showTagline && (
                    <span className={`${typo.tagline} ${lightOnly ? 'text-slate-500' : 'text-brand-muted'}`}>
                        {tagline}
                    </span>
                )}
            </div>
        );

        if (href) {
            return (
                <a href={href} className="inline-block focus:outline-none">
                    {textContent}
                </a>
            );
        }
        return textContent;
    }

    // Mark only variant
    if (variant === 'mark') {
        const markContent = (
            <LogoMark
                size={size}
                className={className}
                animated={animated}
                idPrefix={idPrefix || `mark-${size}`}
            />
        );

        if (href || onClick) {
            return (
                <button
                    type="button"
                    onClick={onClick}
                    className="inline-flex items-center justify-center p-0.5 rounded-xl focus:outline-none transition-transform active:scale-95"
                    aria-label="Collectly Home"
                >
                    {markContent}
                </button>
            );
        }
        return markContent;
    }

    // Full variant (Icon Mark + Typography + Tagline)
    const fullContent = (
        <div
            className={`group inline-flex items-center ${typo.spacing} cursor-pointer select-none transition-transform active:scale-[0.99] ${className}`}
            onClick={onClick}
        >
            <LogoMark
                size={size}
                animated={animated}
                idPrefix={idPrefix || `full-${size}`}
            />
            <div className="flex flex-col text-left">
                <div className="flex items-center">
                    <span className={`${typo.title} ${lightOnly ? 'text-white' : 'text-brand-text'} transition-colors`}>
                        Collect<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">ly</span>
                    </span>
                </div>
                {showTagline && (
                    <span className={`${typo.tagline} ${lightOnly ? 'text-slate-300' : 'text-brand-muted'} hidden sm:block`}>
                        {tagline}
                    </span>
                )}
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} className="inline-flex items-center focus:outline-none" aria-label="Collectly Home">
                {fullContent}
            </a>
        );
    }

    return fullContent;
};

export default Logo;
