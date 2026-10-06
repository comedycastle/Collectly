import React, { useState } from 'react';
import { Bot, Sparkles, Search, Settings, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { AISettingsModal } from './AISettingsModal';
import { signOutUser } from '../lib/supabaseClient';
import { Logo } from './Logo';

interface Props {
    onOpenAIGenerator?: () => void;
    onCreateNewForm?: () => void;
    onSignOut?: () => void;
    onToggleMobileMenu?: () => void;
    onLogoClick?: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenAIGenerator, onCreateNewForm, onSignOut, onToggleMobileMenu, onLogoClick }) => {
    const { user, setUser, searchQuery, setSearchQuery, aiConfig } = useCollectlyStore();
    const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const activeProviderLabel =
        aiConfig.preferredProvider === 'gemini' ? 'Google Gemini' :
            aiConfig.preferredProvider === 'openrouter' ? 'OpenRouter' :
                aiConfig.preferredProvider === 'groq' ? 'Groq AI' : 'Smart Engine';

    const handleSignOut = async () => {
        await signOutUser();
        setUser({
            id: 'usr-1',
            email: 'admin@collectly.app',
            fullName: 'Sahil Dev',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: 'Owner',
            teamName: 'Collectly Innovation Workspace'
        });
        setShowUserMenu(false);
        onSignOut?.();
    };

    return (
        <>
            <header className="h-16 border-b border-brand-border bg-brand-surface/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {onToggleMobileMenu && (
                        <button
                            onClick={onToggleMobileMenu}
                            className="p-2 -ml-1 rounded-xl text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight md:hidden transition-colors"
                            aria-label="Open mobile navigation"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                    <Logo
                        size="md"
                        showTagline
                        tagline="AI Forms, Surveys & Quizzes"
                        onClick={onLogoClick}
                    />
                </div>

                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search forms, quizzes, responses..."
                            className="w-full pl-10 pr-4 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted focus:border-brand-primary transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsAISettingsOpen(true)}
                        className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-muted hover:text-brand-text hover:border-brand-accent/50 transition-all"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>AI: <strong className="text-brand-accent">{activeProviderLabel}</strong></span>
                        <Settings className="w-3.5 h-3.5 text-brand-muted hover:text-brand-text" />
                    </button>

                    {onOpenAIGenerator && (
                        <button
                            onClick={onOpenAIGenerator}
                            className="px-4 py-2 rounded-xl bg-brand-gradient hover:opacity-90 text-white font-semibold text-xs shadow-glow flex items-center space-x-2 transition-all"
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                            <span>Generate with AI</span>
                        </button>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 pl-2 border-l border-brand-border hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={user.avatarUrl}
                                alt={user.fullName}
                                className="w-8 h-8 rounded-full border border-brand-primary/40 object-cover"
                            />
                            <div className="hidden xl:block text-left">
                                <div className="text-xs font-semibold text-brand-text leading-tight">{user.fullName}</div>
                                <div className="text-[10px] text-brand-accent font-medium">{user.role}</div>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-brand-surface border border-brand-border rounded-xl shadow-glow z-50 overflow-hidden">
                                <div className="p-4 border-b border-brand-border">
                                    <div className="text-sm font-bold text-brand-text">{user.fullName}</div>
                                    <div className="text-xs text-brand-muted">{user.email}</div>
                                    <div className="mt-2">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <AISettingsModal isOpen={isAISettingsOpen} onClose={() => setIsAISettingsOpen(false)} />
        </>
    );
};
