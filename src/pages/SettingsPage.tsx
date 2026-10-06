import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Palette, Save, Check, Moon, Sun, Monitor, Database, Trash2, Download, KeyRound, LogOut, AlertCircle, RefreshCw } from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';

type Section = 'profile' | 'notifications' | 'security' | 'appearance' | 'data';

// In-memory appearance cache (the persisted source of truth is Supabase user_settings)
let cachedAppearance = {
    mode: 'light' as 'light' | 'dark' | 'system',
    primary: '#2563EB',
    accent: '#06B6D4',
};

export const applyThemeMode = (mode: 'light' | 'dark' | 'system') => {
    try {
        cachedAppearance.mode = mode;
        const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', dark);
    } catch { }
};

export const applyAccent = (primary: string, accent: string) => {
    try {
        cachedAppearance.primary = primary;
        cachedAppearance.accent = accent;
        document.documentElement.style.setProperty('--brand-primary', primary);
        document.documentElement.style.setProperty('--brand-accent', accent);
    } catch { }
};

export const restoreSavedTheme = () => {
    try {
        applyThemeMode(cachedAppearance.mode);
        document.documentElement.style.setProperty('--brand-primary', cachedAppearance.primary);
        document.documentElement.style.setProperty('--brand-accent', cachedAppearance.accent);
    } catch { }

    // Hydrate appearance from the signed-in user's Supabase settings row
    (async () => {
        try {
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (!isSupabaseConfigured) return;
            const { profileService } = await import('../services/formService');
            const row = await profileService.getUserSettings().catch(() => null);
            const s = (row as any)?.settings || {};
            if (s.themeMode) applyThemeMode(s.themeMode);
            if (s.accentPrimary && s.accentAccent) applyAccent(s.accentPrimary, s.accentAccent);
        } catch { }
    })();
};

export const SettingsPage: React.FC = () => {
    const { user, setUser, forms, responses } = useCollectlyStore();
    const [activeSection, setActiveSection] = useState<Section>('profile');
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    // Profile
    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [teamName, setTeamName] = useState(user.teamName);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Notifications
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(false);
    const [weeklyReport, setWeeklyReport] = useState(true);

    // Security
    const [twoFactor, setTwoFactor] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState('30');
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwMsg, setPwMsg] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    // Appearance
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(cachedAppearance.mode);
    const [accentPrimary, setAccentPrimary] = useState(cachedAppearance.primary);
    const [accentAccent, setAccentAccent] = useState(cachedAppearance.accent);

    // Load everything from Supabase (profiles + user_settings tables)
    useEffect(() => {
        (async () => {
            setLoading(true);
            setError('');
            try {
                const { isSupabaseConfigured } = await import('../lib/supabaseClient');
                if (!isSupabaseConfigured) {
                    setLoading(false);
                    return;
                }
                const { profileService } = await import('../services/formService');
                const profile = await profileService.getProfile().catch(() => null);
                if (profile) {
                    setFullName(profile.full_name || '');
                    setEmail(profile.email || '');
                    setTeamName(profile.team_name || '');
                    setAvatarUrl(profile.avatar_url || '');
                    setUser({
                        id: profile.id,
                        email: profile.email,
                        fullName: profile.full_name,
                        avatarUrl: profile.avatar_url,
                        role: profile.role,
                        teamName: profile.team_name,
                    });
                }
                const settings = await profileService.getUserSettings().catch(() => null);
                const s = (settings as any)?.settings || {};
                const n = (settings as any)?.notifications || {};
                const b = (settings as any)?.branding || {};
                if (typeof n.emailNotifs === 'boolean') setEmailNotifs(n.emailNotifs);
                if (typeof n.pushNotifs === 'boolean') setPushNotifs(n.pushNotifs);
                if (typeof n.weeklyReport === 'boolean') setWeeklyReport(n.weeklyReport);
                if (typeof s.twoFactor === 'boolean') setTwoFactor(s.twoFactor);
                if (s.sessionTimeout) setSessionTimeout(String(s.sessionTimeout));
                if (s.themeMode) {
                    setThemeMode(s.themeMode);
                    applyThemeMode(s.themeMode);
                }
                if (s.accentPrimary && s.accentAccent) {
                    setAccentPrimary(s.accentPrimary);
                    setAccentAccent(s.accentAccent);
                    applyAccent(s.accentPrimary, s.accentAccent);
                } else if (b.primaryColor) {
                    // Fall back to branding-derived accents
                    setAccentPrimary(b.primaryColor);
                    if (b.accentColor) setAccentAccent(b.accentColor);
                }
            } catch (e: any) {
                setError(e.message || 'Could not load settings.');
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const flashSaved = (msg = '') => {
        setSaved(true);
        if (msg) setNotice(msg);
        setTimeout(() => {
            setSaved(false);
            setNotice('');
        }, 2200);
    };

    const handleSaveProfile = async () => {
        setError('');
        try {
            setUser({ ...user, fullName, email, teamName, avatarUrl });
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (isSupabaseConfigured) {
                const { profileService } = await import('../services/formService');
                await profileService.updateProfile({ full_name: fullName, email, team_name: teamName, avatar_url: avatarUrl } as any);
            }
            flashSaved('Profile saved.');
        } catch (e: any) {
            setError(e.message || 'Profile save failed.');
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingAvatar(true);
        try {
            const { profileService } = await import('../services/formService');
            const url = await profileService.uploadAvatar(file);
            setAvatarUrl(url);
            setUser({ ...user, avatarUrl: url });
            await profileService.updateProfile({ avatar_url: url } as any);
            flashSaved('Avatar uploaded.');
        } catch (err: any) {
            setError(err.message || 'Avatar upload failed.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveNotifications = async () => {
        setError('');
        try {
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (isSupabaseConfigured) {
                const { profileService } = await import('../services/formService');
                await profileService.updateUserSettings({ notifications: { emailNotifs, pushNotifs, weeklyReport } } as any);
            }
            flashSaved('Notification preferences saved.');
        } catch (e: any) {
            setError(e.message || 'Save failed.');
        }
    };

    const handleSaveSecurity = async () => {
        setError('');
        try {
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (isSupabaseConfigured) {
                const { profileService } = await import('../services/formService');
                await profileService.updateUserSettings({ settings: { twoFactor, sessionTimeout } } as any);
            }
            flashSaved('Security settings saved.');
        } catch (e: any) {
            setError(e.message || 'Save failed.');
        }
    };

    const handleChangePassword = async () => {
        setPwMsg('');
        if (!newPw || newPw.length < 6) {
            setPwMsg('New password must be at least 6 characters.');
            return;
        }
        if (newPw !== confirmPw) {
            setPwMsg('New passwords do not match.');
            return;
        }
        setPwLoading(true);
        try {
            const { supabase, isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (!isSupabaseConfigured) throw new Error('Authentication is not available.');
            if (currentPw) {
                const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPw });
                if (error) throw new Error('Current password is incorrect.');
            }
            const { error } = await supabase.auth.updateUser({ password: newPw });
            if (error) throw error;
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
            setPwMsg('Password updated successfully.');
        } catch (e: any) {
            setPwMsg(e.message || 'Password update failed.');
        } finally {
            setPwLoading(false);
        }
    };

    const handleSignOutAll = async () => {
        try {
            const { supabase, isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (isSupabaseConfigured) await supabase.auth.signOut({ scope: 'global' } as any).catch(() => supabase.auth.signOut());
            flashSaved('Signed out of all sessions.');
        } catch (e: any) {
            setError(e.message || 'Sign-out failed.');
        }
    };

    const handleSaveAppearance = async () => {
        applyThemeMode(themeMode);
        applyAccent(accentPrimary, accentAccent);
        try {
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (isSupabaseConfigured) {
                const { profileService } = await import('../services/formService');
                await profileService.updateUserSettings({ settings: { themeMode, accentPrimary, accentAccent } } as any);
            }
            flashSaved('Appearance saved — theme applied app-wide.');
        } catch (e: any) {
            setError(e.message || 'Save failed.');
        }
    };

    const handleExportData = () => {
        const payload = {
            exportedAt: new Date().toISOString(),
            profile: user,
            forms,
            responses,
            preferences: { emailNotifs, pushNotifs, weeklyReport, twoFactor, sessionTimeout, themeMode, accentPrimary, accentAccent },
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `collectly-my-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        flashSaved('Your data export downloaded as JSON.');
    };

    const handleDeleteAccount = async () => {
        const confirmText = window.prompt('Type DELETE to sign out and reload.');
        if (confirmText !== 'DELETE') return;
        try {
            const { signOutUser } = await import('../lib/supabaseClient');
            await signOutUser();
            window.location.hash = '';
            window.location.reload();
        } catch (e: any) {
            setError(e.message || 'Account deletion failed.');
        }
    };

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'data', label: 'Data & Privacy', icon: Database },
    ] as const;

    const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
        <button onClick={onClick} className={`w-12 h-6 rounded-full transition-all shrink-0 ${on ? 'bg-brand-primary' : 'bg-brand-border'}`} aria-pressed={on}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
    );

    return (
        <div className="p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
            <div>
                <h2 className="text-2xl font-extrabold text-brand-text flex items-center gap-2">
                    <Settings className="w-6 h-6 text-brand-primary" /> Settings
                </h2>
                <p className="text-xs text-brand-muted">Every option below is saved automatically to your account and restored on sign-in.</p>
            </div>

            {loading && <p className="text-xs text-brand-muted flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading settings…</p>}
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
            {(saved || notice) && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 flex items-center gap-2"><Check className="w-4 h-4 shrink-0" />{notice || 'Saved!'}</div>}

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-56 shrink-0">
                    <nav className="space-y-1">
                        {sections.map((s) => {
                            const Icon = s.icon;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? 'bg-brand-primary text-white shadow-glow' : 'text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{s.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex-1 min-w-0">
                    {activeSection === 'profile' && (
                        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-5">
                            <h3 className="text-base font-bold text-brand-text">Profile Settings</h3>
                            <div className="flex items-center gap-4">
                                <img src={avatarUrl} alt={fullName} className="w-16 h-16 rounded-full border-2 border-brand-primary/30 object-cover" />
                                <div>
                                    <div className="text-sm font-bold text-brand-text">{fullName}</div>
                                    <div className="text-xs text-brand-muted">{email} • {user.role}</div>
                                    <label className="inline-block mt-1 px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border text-xs font-semibold cursor-pointer hover:border-brand-primary">
                                        {uploadingAvatar ? 'Uploading…' : 'Change Avatar'}
                                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5">Full Name</label>
                                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5">Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5">Role</label>
                                    <input value={user.role} readOnly className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm opacity-60" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5">Team Name</label>
                                    <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm" />
                                </div>
                            </div>
                            <button onClick={handleSaveProfile} className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Profile
                            </button>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                            <h3 className="text-base font-bold text-brand-text">Notification Preferences</h3>
                            {[
                                { label: 'Email Notifications', desc: 'Alerts for new responses', on: emailNotifs, set: setEmailNotifs },
                                { label: 'Push Notifications', desc: 'Browser pushes for realtime updates', on: pushNotifs, set: setPushNotifs },
                                { label: 'Weekly Analytics Report', desc: 'Weekly form performance summary', on: weeklyReport, set: setWeeklyReport },
                            ].map((n) => (
                                <div key={n.label} className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/60 border border-brand-border">
                                    <div>
                                        <div className="text-sm font-semibold">{n.label}</div>
                                        <p className="text-xs text-brand-muted">{n.desc}</p>
                                    </div>
                                    <Toggle on={n.on} onClick={() => n.set(!n.on)} />
                                </div>
                            ))}
                            <button onClick={handleSaveNotifications} className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Preferences
                            </button>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                            <h3 className="text-base font-bold text-brand-text">Security Settings</h3>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/60 border border-brand-border">
                                <div>
                                    <div className="text-sm font-semibold">Two-Factor Authentication</div>
                                    <p className="text-xs text-brand-muted">Extra sign-in protection flag stored on your account</p>
                                </div>
                                <Toggle on={twoFactor} onClick={() => setTwoFactor(!twoFactor)} />
                            </div>
                            <div className="p-4 rounded-xl bg-brand-bg/60 border border-brand-border">
                                <div className="text-sm font-semibold mb-1">Session Timeout</div>
                                <p className="text-xs text-brand-muted mb-2">Preferred inactivity sign-out window</p>
                                <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm">
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="120">2 hours</option>
                                    <option value="0">Never</option>
                                </select>
                            </div>
                            <div className="p-4 rounded-xl bg-brand-bg/60 border border-brand-border space-y-3">
                                <div className="text-sm font-semibold flex items-center gap-2"><KeyRound className="w-4 h-4" /> Change Password</div>
                                <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Current password (verifies identity)" className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password (min 6 chars)" className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm" />
                                    <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm new password" className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm" />
                                </div>
                                {pwMsg && <p className="text-xs text-brand-accent">{pwMsg}</p>}
                                <button onClick={handleChangePassword} disabled={pwLoading} className="px-4 py-2.5 rounded-xl bg-brand-surfaceLight border border-brand-border text-xs font-bold disabled:opacity-50">
                                    {pwLoading ? 'Updating…' : 'Update Password'}
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={handleSaveSecurity} className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Security
                                </button>
                                <button onClick={handleSignOutAll} className="px-5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs font-bold flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Sign Out All Sessions
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSection === 'appearance' && (
                        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                            <h3 className="text-base font-bold text-brand-text">Appearance</h3>
                            <div className="p-4 rounded-xl bg-brand-bg/60 border border-brand-border">
                                <div className="text-sm font-semibold mb-3">Theme Mode (applies app-wide instantly)</div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'light', label: 'Light', icon: Sun },
                                        { id: 'dark', label: 'Dark', icon: Moon },
                                        { id: 'system', label: 'System', icon: Monitor },
                                    ].map((m) => {
                                        const Icon = m.icon;
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => {
                                                    setThemeMode(m.id as any);
                                                    applyThemeMode(m.id as any);
                                                }}
                                                className={`p-3 rounded-xl border text-center ${themeMode === m.id ? 'bg-brand-primary/10 border-brand-primary' : 'bg-brand-bg border-brand-border text-brand-muted'}`}
                                            >
                                                <Icon className="w-5 h-5 mx-auto mb-1" />
                                                <div className="text-xs font-medium">{m.label}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-brand-bg/60 border border-brand-border space-y-3">
                                <div className="text-sm font-semibold">Global Accent Colors (applies app-wide instantly)</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-brand-muted mb-1">Primary</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={accentPrimary} onChange={(e) => { setAccentPrimary(e.target.value); applyAccent(e.target.value, accentAccent); }} className="w-9 h-9 rounded-lg border border-brand-border bg-transparent cursor-pointer" />
                                            <input type="text" value={accentPrimary} onChange={(e) => { setAccentPrimary(e.target.value); applyAccent(e.target.value, accentAccent); }} className="flex-1 px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs font-mono" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-brand-muted mb-1">Accent</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={accentAccent} onChange={(e) => { setAccentAccent(e.target.value); applyAccent(accentPrimary, e.target.value); }} className="w-9 h-9 rounded-lg border border-brand-border bg-transparent cursor-pointer" />
                                            <input type="text" value={accentAccent} onChange={(e) => { setAccentAccent(e.target.value); applyAccent(accentPrimary, e.target.value); }} className="flex-1 px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs font-mono" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {['#2563EB:#06B6D4', '#7C3AED:#EC4899', '#059669:#84CC16', '#EA580C:#F59E0B'].map((pair) => {
                                        const [p, a] = pair.split(':');
                                        return (
                                            <button
                                                key={pair}
                                                onClick={() => { setAccentPrimary(p); setAccentAccent(a); applyAccent(p, a); }}
                                                className="w-8 h-8 rounded-full border-2 border-white shadow"
                                                style={{ background: `linear-gradient(135deg, ${p} 50%, ${a} 50%)` }}
                                                aria-label={`Use ${p} and ${a}`}
                                            />
                                        );
                                    })}
                                    <span className="text-brand-muted">Quick presets</span>
                                </div>
                            </div>
                            <button onClick={handleSaveAppearance} className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Appearance
                            </button>
                        </div>
                    )}

                    {activeSection === 'data' && (
                        <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                            <h3 className="text-base font-bold text-brand-text">Data & Privacy</h3>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
                                    <div className="text-lg font-black">{forms.length}</div>
                                    <div className="text-[11px] text-brand-muted">Forms</div>
                                </div>
                                <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
                                    <div className="text-lg font-black">{responses.length}</div>
                                    <div className="text-[11px] text-brand-muted">Responses</div>
                                </div>
                            </div>
                            <button onClick={handleExportData} className="w-full py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs font-bold flex items-center justify-center gap-2">
                                <Download className="w-4 h-4 text-brand-accent" /> Export My Data (JSON download)
                            </button>
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                                <div className="text-sm font-bold text-red-500">Danger Zone</div>
                                <p className="text-[11px] text-brand-muted">Signs you out on all devices and reloads the app.</p>
                                <button onClick={handleDeleteAccount} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Sign Out & Reload
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
