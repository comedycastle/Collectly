import React from 'react';
import { LayoutDashboard, PenTool, Inbox, BarChart3, HelpCircle, Sparkles, Palette, Bot, Settings, LayoutTemplate } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'builder' | 'responses' | 'analytics' | 'quizzes' | 'ai' | 'branding' | 'templates' | 'settings';

export interface MenuItemConfig {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: 'forms' | 'responses';
    tag?: string;
}

export const MENU_ITEMS: MenuItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'forms' },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'builder', label: 'Form Builder', icon: PenTool },
    { id: 'responses', label: 'Responses Feed', icon: Inbox, badge: 'responses' },
    { id: 'analytics', label: 'Analytics & Funnels', icon: BarChart3 },
    { id: 'quizzes', label: 'Quiz Hub', icon: HelpCircle, tag: 'Anti-Cheat' },
    { id: 'ai', label: 'AI Form Studio', icon: Sparkles, tag: 'Gemini/Groq' },
    { id: 'branding', label: 'Branding & Theme', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
];

interface Props {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    formCount: number;
    responseCount: number;
}

export const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab, formCount, responseCount }) => {
    const menuItems = MENU_ITEMS.map((item) => ({
        ...item,
        badgeCount: item.badge === 'forms' ? formCount : item.badge === 'responses' ? responseCount : undefined,
    }));

    return (
        <aside className="w-64 border-r border-brand-border bg-brand-surface backdrop-blur-md hidden md:flex flex-col justify-between py-6 px-4 shrink-0 shadow-sm">
            {/* Navigation Links */}
            <div className="space-y-6">
                <div>
                    <div className="px-3 mb-3 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                        Main Navigation
                    </div>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as ActiveTab)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                                            ? 'bg-brand-primary text-white shadow-glow'
                                            : 'text-brand-text hover:bg-brand-surfaceLight'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-secondary'}`} />
                                        <span>{item.label}</span>
                                    </div>

                                    {item.badgeCount !== undefined && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-brand-bg border border-brand-border text-brand-text'
                                            }`}>
                                            {item.badgeCount}
                                        </span>
                                    )}

                                    {item.tag && (
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-600 border border-purple-200'
                                            }`}>
                                            {item.tag}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Footer Banner */}
            <div className="p-4 rounded-xl bg-brand-bg border border-brand-border text-center space-y-2">
                <div className="flex items-center justify-center space-x-1.5 text-brand-accent">
                    <Bot className="w-4 h-4 text-brand-primary" />
                    <span className="text-xs font-bold text-brand-text">Collectly AI Engine</span>
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                    Multi-provider AI active with auto-fallback engine enabled.
                </p>
            </div>
        </aside>
    );
};
