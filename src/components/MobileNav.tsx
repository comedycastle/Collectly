import React, { useEffect, useRef } from 'react';
import { X, Bot } from 'lucide-react';
import { MENU_ITEMS, MenuItemConfig, ActiveTab } from './Sidebar';
import { Logo } from './Logo';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    activeTab: ActiveTab;
    onSelect: (tab: ActiveTab) => void;
    formCount: number;
    responseCount: number;
}

/**
 * Mobile navigation drawer.
 *
 * The desktop Sidebar is `hidden md:flex`, so on phones and small tablets there
 * was previously no way to reach any section other than Dashboard — the app was
 * effectively unusable below 768px. This drawer exposes the same MENU_ITEMS.
 */
export const MobileNav: React.FC<Props> = ({ isOpen, onClose, activeTab, onSelect, formCount, responseCount }) => {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    // Escape to dismiss + scroll lock while open.
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        closeRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const items = MENU_ITEMS.map((item) => ({
        ...item,
        badge: item.badge === 'forms' ? formCount : item.badge === 'responses' ? responseCount : undefined,
    }));

    return (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation menu">
            {/* Scrim */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="relative w-[17rem] max-w-[85vw] h-full bg-brand-surface border-r border-brand-border shadow-glow flex flex-col animate-in fade-in duration-200"
            >
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-brand-border">
                    <Logo size="sm" showTagline tagline="AI Studio" />
                    <button
                        ref={closeRef}
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onSelect(item.id);
                                    onClose();
                                }}
                                aria-current={isActive ? 'page' : undefined}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-brand-primary text-white shadow-glow'
                                    : 'text-brand-text hover:bg-brand-surfaceLight'
                                    }`}
                            >
                                <span className="flex items-center space-x-3 min-w-0">
                                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-secondary'}`} />
                                    <span className="truncate">{item.label}</span>
                                </span>

                                {item.badge !== undefined && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-brand-bg border border-brand-border text-brand-text'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}

                                {item.tag && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${isActive ? 'bg-white/20 text-white border-transparent' : 'bg-brand-violet/10 text-brand-violet border-brand-violet/25'
                                        }`}>
                                        {item.tag}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-brand-border">
                    <div className="p-3 rounded-xl bg-brand-bg border border-brand-border text-center space-y-1">
                        <div className="flex items-center justify-center space-x-1.5 text-brand-accent">
                            <Bot className="w-4 h-4 text-brand-primary" />
                            <span className="text-xs font-bold text-brand-text">Collectly AI Engine</span>
                        </div>
                        <p className="text-[11px] text-brand-muted leading-tight">
                            Multi-provider AI with auto-fallback enabled.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};