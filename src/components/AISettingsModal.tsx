import React, { useState, useEffect } from 'react';
import { X, Bot, Sparkles, Key, Check, ShieldAlert, Cpu, Database } from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { AIProvider } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const AISettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { aiConfig, setAIConfig } = useCollectlyStore();
    const [geminiKey, setGeminiKey] = useState(aiConfig.geminiKey);
    const [openrouterKey, setOpenrouterKey] = useState(aiConfig.openrouterKey);
    const [groqKey, setGroqKey] = useState(aiConfig.groqKey);
    const [preferredProvider, setPreferredProvider] = useState<AIProvider>(aiConfig.preferredProvider);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(false);

    // Re-sync from the store every time the modal opens so we always show the
    // keys currently stored in Supabase (never stale values captured at mount).
    useEffect(() => {
        if (isOpen) {
            setGeminiKey(aiConfig.geminiKey);
            setOpenrouterKey(aiConfig.openrouterKey);
            setGroqKey(aiConfig.groqKey);
            setPreferredProvider(aiConfig.preferredProvider);
            setSavedSuccess(false);
            setSaveError(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(false);
        const ok = await setAIConfig({
            geminiKey: geminiKey.trim(),
            openrouterKey: openrouterKey.trim(),
            groqKey: groqKey.trim(),
            preferredProvider
        });
        setIsSaving(false);
        if (!ok) {
            setSaveError(true);
            return;
        }
        setSavedSuccess(true);
        setTimeout(() => {
            setSavedSuccess(false);
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-brand-surface border border-brand-border rounded-2xl shadow-glow overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-brand-border bg-gradient-to-r from-brand-surface via-brand-surface to-brand-bg">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                            <Bot className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-brand-text flex items-center gap-2">
                                Multi-Provider AI Settings
                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
                                    Fallback Engine
                                </span>
                            </h3>
                            <p className="text-xs text-brand-muted">Configure Gemini, OpenRouter, and Groq API keys with automated fallback</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    {/* Active Provider Selector */}
                    <div>
                        <label className="block text-sm font-medium text-brand-text mb-2 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-brand-accent" /> Preferred Primary AI Model
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'gemini', label: 'Google Gemini', desc: 'Gemini 1.5 Flash' },
                                { id: 'openrouter', label: 'OpenRouter', desc: 'Llama 3.1 & Claude' },
                                { id: 'groq', label: 'Groq Cloud', desc: 'Ultra-fast Llama 3' },
                            ].map((prov) => (
                                <button
                                    key={prov.id}
                                    type="button"
                                    onClick={() => setPreferredProvider(prov.id as AIProvider)}
                                    className={`p-3 rounded-xl border text-left transition-all ${preferredProvider === prov.id
                                            ? 'bg-brand-primary/10 border-brand-primary text-brand-text shadow-glow'
                                            : 'bg-brand-bg/50 border-brand-border text-brand-muted hover:border-brand-muted'
                                        }`}
                                >
                                    <div className="font-semibold text-sm">{prov.label}</div>
                                    <div className="text-[11px] opacity-70 mt-0.5">{prov.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* API Keys Inputs */}
                    <div className="space-y-4 pt-2">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-brand-text flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5 text-blue-400" /> Google Gemini API Key
                                </label>
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-brand-accent hover:underline"
                                >
                                    Get Key →
                                </a>
                            </div>
                            <input
                                type="password"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text placeholder-brand-muted/50 focus:border-brand-primary transition-colors font-mono text-xs"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-brand-text flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5 text-purple-400" /> OpenRouter API Key
                                </label>
                                <a
                                    href="https://openrouter.ai/keys"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-brand-accent hover:underline"
                                >
                                    Get Key →
                                </a>
                            </div>
                            <input
                                type="password"
                                value={openrouterKey}
                                onChange={(e) => setOpenrouterKey(e.target.value)}
                                placeholder="sk-or-v1-..."
                                className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text placeholder-brand-muted/50 focus:border-brand-primary transition-colors font-mono text-xs"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-brand-text flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5 text-emerald-400" /> Groq API Key
                                </label>
                                <a
                                    href="https://console.groq.com/keys"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-brand-accent hover:underline"
                                >
                                    Get Key →
                                </a>
                            </div>
                            <input
                                type="password"
                                value={groqKey}
                                onChange={(e) => setGroqKey(e.target.value)}
                                placeholder="gsk_..."
                                className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text placeholder-brand-muted/50 focus:border-brand-primary transition-colors font-mono text-xs"
                            />
                        </div>

                        {/* Storage note */}
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/20 text-[11px] text-brand-muted">
                            <Database className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                            <span>Keys are saved securely to your account and are only ever used from your session — never shared with other users.</span>
                        </div>
                    </div>

                    {/* Backup Guarantee Banner */}
                    <div className="p-4 rounded-xl bg-brand-bg/80 border border-brand-accent/20 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                        <div className="text-xs text-brand-muted">
                            <span className="font-semibold text-brand-text">Zero-Downtime Guarantee:</span> If an API key is missing or fails (rate limits/network issue), Collectly automatically falls back down the chain (<span className="text-brand-accent">Gemini → OpenRouter → Groq → Smart Local Engine</span>).
                        </div>
                    </div>
                </div>

                {/* Save error */}
                {saveError && (
                    <div className="px-4 py-2.5 bg-red-500/10 border-t border-red-500/20 text-xs text-red-500">
                        Failed to save your keys — check your connection and try again. Your keys were not persisted.
                    </div>
                )}

                {/* Footer */}
                <div className="p-4 border-t border-brand-border bg-brand-bg/50 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-medium text-sm shadow-glow flex items-center gap-2 transition-all disabled:opacity-60"
                    >
                        {isSaving ? (
                            <>
                                <Sparkles className="w-4 h-4 animate-pulse" /> Saving…
                            </>
                        ) : savedSuccess ? (
                            <>
                                <Check className="w-4 h-4" /> Saved!
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> Save AI Configuration
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
