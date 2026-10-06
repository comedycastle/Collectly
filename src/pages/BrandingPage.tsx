import React, { useState, useMemo } from 'react';
import { Palette, Check, Save, Download, Upload, RotateCcw, Eye, Contrast, Copy, Trash2, Plus } from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { FormTheme } from '../types';
import { Logo } from '../components/Logo';

const BRAND_DEFAULTS: Required<Omit<FormTheme, 'logoUrl' | 'customCss'>> = {
    primaryColor: '#2563EB',
    secondaryColor: '#64748B',
    accentColor: '#06B6D4',
    backgroundColor: '#F8FAFC',
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A',
    gradientStart: '#60A5FA',
    gradientEnd: '#22D3EE',
    fontFamily: 'Poppins',
    borderRadius: '8px',
};

const PRESETS: Array<{ name: string; desc: string; theme: Partial<FormTheme> }> = [
    { name: 'Collectly Default', desc: 'Spec tokens #2563EB / #06B6D4', theme: { ...BRAND_DEFAULTS } },
    { name: 'Ocean Breeze', desc: 'Deep blue + teal', theme: { primaryColor: '#0EA5E9', secondaryColor: '#475569', accentColor: '#14B8A6', backgroundColor: '#F0FDFA', surfaceColor: '#FFFFFF', textColor: '#0F172A', gradientStart: '#38BDF8', gradientEnd: '#2DD4BF' } },
    { name: 'Sunset Glow', desc: 'Warm orange + pink', theme: { primaryColor: '#F97316', secondaryColor: '#78716C', accentColor: '#EC4899', backgroundColor: '#FFF7ED', surfaceColor: '#FFFFFF', textColor: '#1C1917', gradientStart: '#FB923C', gradientEnd: '#F472B6' } },
    { name: 'Forest', desc: 'Green + earth', theme: { primaryColor: '#16A34A', secondaryColor: '#57534E', accentColor: '#84CC16', backgroundColor: '#F7FEE7', surfaceColor: '#FFFFFF', textColor: '#1A2E05', gradientStart: '#4ADE80', gradientEnd: '#A3E635' } },
    { name: 'Midnight', desc: 'Dark mode form', theme: { primaryColor: '#60A5FA', secondaryColor: '#94A3B8', accentColor: '#22D3EE', backgroundColor: '#0F172A', surfaceColor: '#1E293B', textColor: '#F8FAFC', gradientStart: '#60A5FA', gradientEnd: '#22D3EE' } },
    { name: 'Royal', desc: 'Purple + gold', theme: { primaryColor: '#7C3AED', secondaryColor: '#64748B', accentColor: '#F59E0B', backgroundColor: '#FAF5FF', surfaceColor: '#FFFFFF', textColor: '#1E1B4B', gradientStart: '#A78BFA', gradientEnd: '#FBBF24' } },
];

// WCAG relative luminance + contrast ratio
const luminance = (hex: string): number => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const rgb = [0, 2, 4].map((i) => {
        const v = parseInt(full.substr(i, 2), 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};
const contrastRatio = (a: string, b: string): number => {
    try {
        const l1 = luminance(a);
        const l2 = luminance(b);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    } catch {
        return 0;
    }
};

export const BrandingPage: React.FC = () => {
    const { forms, activeForm, setActiveForm, updateForm, createForm } = useCollectlyStore();
    const [selectedFormId, setSelectedFormId] = useState(activeForm?.id || forms[0]?.id || '');
    const formToCustomize = forms.find((f) => f.id === selectedFormId) || forms[0];
    const theme = { ...BRAND_DEFAULTS, ...(formToCustomize?.settings?.theme || {}) };

    const [saved, setSaved] = useState(false);
    const [customCss, setCustomCss] = useState(theme.customCss || '');
    const [importError, setImportError] = useState('');

    const setToken = (key: keyof FormTheme, value: string) => {
        if (!formToCustomize) return;
        updateForm(formToCustomize.id, {
            settings: { ...formToCustomize.settings, theme: { ...theme, [key]: value } },
        });
    };

    const applyPreset = (preset: (typeof PRESETS)[number]) => {
        if (!formToCustomize) return;
        updateForm(formToCustomize.id, {
            settings: { ...formToCustomize.settings, theme: { ...theme, ...preset.theme, logoUrl: theme.logoUrl, customCss } },
        });
    };

    const handleSave = async (applyAll = false) => {
        if (!formToCustomize) return;
        const finalTheme = { ...theme, customCss };
        if (applyAll) {
            forms.forEach((f) => updateForm(f.id, { settings: { ...f.settings, theme: { ...(f.settings?.theme || {}), ...finalTheme } } }));
        } else {
            updateForm(formToCustomize.id, { settings: { ...formToCustomize.settings, theme: finalTheme } });
        }
        try {
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (isSupabaseConfigured) {
                const { profileService } = await import('../services/formService');
                await profileService.updateProfile({ branding: finalTheme } as any);
                await profileService.updateUserSettings({ branding: finalTheme } as any);
            }
        } catch (e) {
            console.warn('Branding Supabase save failed:', e);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        if (!formToCustomize) return;
        updateForm(formToCustomize.id, { settings: { ...formToCustomize.settings, theme: { ...BRAND_DEFAULTS, logoUrl: theme.logoUrl } } });
        setCustomCss('');
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !formToCustomize) return;
        try {
            const { supabaseStorage } = await import('../services/supabaseStorage');
            const path = `branding/${Date.now()}_${file.name}`;
            const storagePath = await supabaseStorage.uploadFile('collectly-storage', path, file);
            const publicUrl = await supabaseStorage.getPublicUrl('collectly-storage', storagePath);
            setToken('logoUrl', publicUrl);
        } catch (err) {
            console.warn('Logo upload failed:', err);
        }
    };

    const handleExportTheme = () => {
        const blob = new Blob([JSON.stringify({ ...theme, customCss }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `collectly-theme-${formToCustomize?.title.replace(/\s+/g, '_') || 'default'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportTheme = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !formToCustomize) return;
        try {
            const parsed = JSON.parse(await file.text());
            updateForm(formToCustomize.id, { settings: { ...formToCustomize.settings, theme: { ...theme, ...parsed } } });
            if (parsed.customCss) setCustomCss(parsed.customCss);
            setImportError('');
        } catch {
            setImportError('Invalid theme JSON file.');
        }
    };

    const checks = useMemo(() => [
        { label: 'Body text on background', ratio: contrastRatio(theme.textColor, theme.backgroundColor) },
        { label: 'Text on card surface', ratio: contrastRatio(theme.textColor, theme.surfaceColor) },
        { label: 'White on primary CTA', ratio: contrastRatio('#FFFFFF', theme.primaryColor) },
        { label: 'White on accent', ratio: contrastRatio('#FFFFFF', theme.accentColor) },
    ], [theme]);

    const TokenRow = ({ label, tokenKey, fallback }: { label: string; tokenKey: keyof FormTheme; fallback: string }) => (
        <div>
            <label className="block text-xs font-semibold text-brand-text mb-1.5">{label} <span className="text-brand-muted font-mono font-normal">{fallback}</span></label>
            <div className="flex items-center gap-3">
                <input type="color" value={/^#[0-9a-f]{6}$/i.test(String(theme[tokenKey] || '')) ? String(theme[tokenKey]) : fallback} onChange={(e) => setToken(tokenKey, e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border border-brand-border bg-transparent" />
                <input type="text" value={String(theme[tokenKey] || '')} onChange={(e) => setToken(tokenKey, e.target.value)} className="flex-1 px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs font-mono" />
            </div>
        </div>
    );

    if (!formToCustomize) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[70vh]">
                <div className="max-w-md w-full text-center p-10 rounded-2xl bg-brand-surface border border-brand-border shadow-sm space-y-5">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                        <Palette className="w-7 h-7 text-brand-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-extrabold text-brand-text">Nothing to customize yet</h2>
                        <p className="text-sm text-brand-muted">
                            Branding and theme settings are applied to your forms. Create your first form to start customizing colors, logo, and typography.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const newForm = createForm({ title: 'Untitled Form', category: 'General' });
                            setActiveForm(newForm);
                            setSelectedFormId(newForm.id);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs shadow-glow transition-all"
                    >
                        <Plus className="w-4 h-4" /> Create blank form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-brand-text flex items-center gap-2">
                        <Palette className="w-6 h-6 text-brand-accent" /> Custom Branding & Design Tokens
                    </h2>
                    <p className="text-xs text-brand-muted">Full spec palette, gradient, typography, logo, custom CSS — with live preview and WCAG checks.</p>
                </div>
                <select value={formToCustomize.id} onChange={(e) => { setSelectedFormId(e.target.value); const f = forms.find((x) => x.id === e.target.value); if (f) setActiveForm(f); }} className="px-3 py-2 bg-brand-surface border border-brand-border rounded-xl text-xs font-medium">
                    {forms.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
                </select>
            </div>

            <div>
                <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Theme Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {PRESETS.map((p) => (
                        <button key={p.name} onClick={() => applyPreset(p)} className="p-3 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-primary text-left transition-all">
                            <div className="h-8 rounded-lg mb-2" style={{ background: `linear-gradient(135deg, ${p.theme.gradientStart}, ${p.theme.gradientEnd})` }} />
                            <div className="text-xs font-bold text-brand-text">{p.name}</div>
                            <div className="text-[10px] text-brand-muted">{p.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                        <h3 className="text-base font-bold text-brand-text">Brand Color Tokens</h3>
                        <TokenRow label="Primary — Main CTAs" tokenKey="primaryColor" fallback="#2563EB" />
                        <TokenRow label="Secondary — Labels / secondary" tokenKey="secondaryColor" fallback="#64748B" />
                        <TokenRow label="Accent — Highlights / progress" tokenKey="accentColor" fallback="#06B6D4" />
                        <TokenRow label="Background — App canvas" tokenKey="backgroundColor" fallback="#F8FAFC" />
                        <TokenRow label="Surface — Cards / modals" tokenKey="surfaceColor" fallback="#FFFFFF" />
                        <TokenRow label="Text — Primary reading" tokenKey="textColor" fallback="#0F172A" />
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                        <h3 className="text-base font-bold text-brand-text">Gradient + Shape + Type</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <TokenRow label="Gradient Start" tokenKey="gradientStart" fallback="#60A5FA" />
                            <TokenRow label="Gradient End" tokenKey="gradientEnd" fallback="#22D3EE" />
                        </div>
                        <div className="h-8 rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` }} />
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1.5">Font Family</label>
                                <select value={theme.fontFamily} onChange={(e) => setToken('fontFamily', e.target.value)} className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs">
                                    {['Poppins', 'Inter', 'Roboto', 'Outfit', 'DM Sans', 'Space Grotesk'].map((f) => <option key={f}>{f}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1.5">Corner Radius</label>
                                <select value={theme.borderRadius} onChange={(e) => setToken('borderRadius', e.target.value)} className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs">
                                    {['4px', '8px', '12px', '16px', '24px'].map((r) => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                        <h3 className="text-base font-bold text-brand-text">Logo + Custom CSS</h3>
                        <input type="text" value={theme.logoUrl || ''} onChange={(e) => setToken('logoUrl', e.target.value)} placeholder="https://... or upload below" className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs" />
                        <div className="flex items-center gap-2">
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="flex-1 text-xs file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-primary file:text-white file:text-xs" />
                            {theme.logoUrl && <button onClick={() => setToken('logoUrl', '')} className="p-2 text-brand-muted hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                        {theme.logoUrl ? (
                            <div className="flex items-center gap-3 p-2 bg-brand-bg rounded-xl border border-brand-border">
                                <img src={theme.logoUrl} alt="Logo" className="h-9 object-contain" />
                                <span className="text-xs text-brand-muted">Custom logo active</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border">
                                <Logo size="sm" />
                                <span className="text-xs text-brand-muted">Using default Collectly logo</span>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-semibold text-brand-text mb-1.5">Custom CSS Overrides (applied to public form)</label>
                            <textarea rows={4} value={customCss} onChange={(e) => setCustomCss(e.target.value)} placeholder="/* e.g. .collectly-title { letter-spacing: -0.02em; } */" className="w-full p-3 bg-brand-bg border border-brand-border rounded-xl text-xs font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleExportTheme} className="py-2 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold flex items-center justify-center gap-1"><Download className="w-3.5 h-3.5" /> Export JSON</button>
                            <label className="py-2 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"><Upload className="w-3.5 h-3.5" /> Import JSON<input type="file" accept=".json" onChange={handleImportTheme} className="hidden" /></label>
                        </div>
                        {importError && <p className="text-xs text-red-500">{importError}</p>}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border shadow-card" style={{ backgroundColor: theme.backgroundColor, borderColor: '#E2E8F0' }}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: theme.textColor }}><Eye className="w-4 h-4" /> Live Preview — {formToCustomize.title}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primaryColor + '15', color: theme.primaryColor, border: `1px solid ${theme.primaryColor}33` }}>AA CHECK</span>
                        </div>
                        <div className="rounded-2xl p-5 border space-y-3" style={{ backgroundColor: theme.surfaceColor, borderRadius: theme.borderRadius, borderColor: '#E2E8F0', fontFamily: theme.fontFamily }}>
                            {theme.logoUrl ? (
                                <img src={theme.logoUrl} alt="logo" className="h-8 object-contain" />
                            ) : (
                                <Logo size="sm" />
                            )}
                            <div className="font-extrabold text-lg" style={{ color: theme.textColor }}>{formToCustomize.title}</div>
                            <div className="h-2 w-28 rounded-full" style={{ background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` }} />
                            <div className="text-xs" style={{ color: theme.secondaryColor }}>Sample question: How satisfied are you?</div>
                            <div className="flex gap-1.5">{[1, 2, 3, 4, 5].map((s) => <div key={s} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: s <= 4 ? theme.primaryColor : theme.secondaryColor + '55', borderRadius: theme.borderRadius }}>{s}</div>)}</div>
                            <div className="h-2 rounded-full" style={{ backgroundColor: theme.secondaryColor + '22' }}><div className="h-full rounded-full" style={{ width: '72%', background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` }} /></div>
                            <div className="flex gap-2">
                                <div className="px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}>Primary CTA</div>
                                <div className="px-4 py-2 text-xs font-bold" style={{ backgroundColor: theme.secondaryColor + '18', color: theme.textColor, borderRadius: theme.borderRadius, border: `1px solid ${theme.secondaryColor}44` }}>Secondary</div>
                                <div className="px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: theme.accentColor, borderRadius: theme.borderRadius }}>Accent</div>
                            </div>
                            <style>{customCss}</style>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-3">
                        <h3 className="text-base font-bold text-brand-text flex items-center gap-2"><Contrast className="w-4 h-4 text-brand-accent" /> WCAG AA Contrast (≥ 4.5:1)</h3>
                        {checks.map((c) => (
                            <div key={c.label} className="flex items-center justify-between p-3 rounded-xl bg-brand-bg border border-brand-border text-xs">
                                <span className="font-medium">{c.label}</span>
                                <span className={`px-2 py-0.5 rounded-full font-bold ${c.ratio >= 4.5 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'}`}>
                                    {c.ratio.toFixed(2)}:1 {c.ratio >= 4.5 ? '✓' : '✗'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleSave(false)} className="py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow flex items-center justify-center gap-2"><Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save to This Form'}</button>
                        <button onClick={() => handleSave(true)} className="py-2.5 rounded-xl border border-brand-primary/30 text-brand-primary text-xs font-bold flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Apply to All Forms</button>
                    </div>
                    <button onClick={handleReset} className="w-full py-2 rounded-xl text-xs text-brand-muted hover:text-brand-text flex items-center justify-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Reset to Collectly defaults {saved && <Check className="w-3.5 h-3.5 text-emerald-500" />}</button>
                </div>
            </div>
        </div>
    );
};
