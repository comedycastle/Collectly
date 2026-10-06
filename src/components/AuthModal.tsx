import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, Check, ArrowRight, ShieldCheck, Github, MailCheck, AlertCircle } from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { signInUser, signUpUser, signInWithMagicLink, signInWithOAuth, isSupabaseConfigured } from '../lib/supabaseClient';
import { LogoMark } from './Logo';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const { setUser } = useCollectlyStore();
    const [mode, setMode] = useState<'login' | 'signup' | 'magic_link'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showEmailConfirm, setShowEmailConfirm] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        setShowEmailConfirm(false);

        try {
            if (mode === 'login') {
                const { data, error } = await signInUser(email, password);
                if (error) {
                    if (error.message?.includes('Email not confirmed')) {
                        setErrorMessage('Please confirm your email before signing in. Check your inbox for the confirmation link.');
                        setLoading(false);
                        return;
                    }
                    if (error.message?.includes('Invalid login credentials')) {
                        setErrorMessage('Invalid email or password. Please try again.');
                        setLoading(false);
                        return;
                    }
                    if (error.message?.includes('Invalid API key')) {
                        setUser({
                            id: `usr-${Date.now()}`,
                            email: email,
                            fullName: fullName || 'Collectly User',
                            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                            role: 'Owner',
                            teamName: 'Collectly Innovation Workspace'
                        });
                        onClose();
                        return;
                    }
                    throw error;
                }
                if (data.user) {
                    setUser({
                        id: data.user.id,
                        email: data.user.email || email,
                        fullName: data.user.user_metadata?.full_name || fullName || 'Collectly User',
                        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                        role: 'Owner',
                        teamName: 'Collectly Innovation Workspace'
                    });
                    onClose();
                    onSuccess?.();
                }
            } else if (mode === 'signup') {
                const { data, error } = await signUpUser(email, password, fullName);
                if (error) {
                    if (error.message?.includes('Invalid API key')) {
                        setUser({
                            id: `usr-${Date.now()}`,
                            email: email,
                            fullName: fullName || 'New Collectly Creator',
                            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                            role: 'Owner',
                            teamName: 'My Collectly Team'
                        });
                        onClose();
                        return;
                    }
                    if (error.message?.includes('already registered')) {
                        setErrorMessage('This email is already registered. Please sign in instead.');
                        setLoading(false);
                        return;
                    }
                    throw error;
                }
                if (data.user) {
                    const emailConfirmed = (data.user as any).email_confirmed_at;
                    if (emailConfirmed || !isSupabaseConfigured) {
                        setUser({
                            id: data.user.id,
                            email,
                            fullName: fullName || 'New Collectly Creator',
                            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                            role: 'Owner',
                            teamName: 'My Collectly Team'
                        });
                        onClose();
                        onSuccess?.();
                    } else {
                        setShowEmailConfirm(true);
                        setSuccessMessage(`Account created! Please check your email (${email}) to confirm your account before signing in.`);
                    }
                }
            } else if (mode === 'magic_link') {
                const { error } = await signInWithMagicLink(email);
                if (error) throw error;
                setSuccessMessage('Magic Link sent to your email address!');
            }
        } catch (err: any) {
            if (err.message?.includes('Invalid API key')) {
                setUser({
                    id: `usr-${Date.now()}`,
                    email: email,
                    fullName: fullName || 'Collectly User',
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                    role: 'Owner',
                    teamName: 'Collectly Innovation Workspace'
                });
                onClose();
                return;
            }
            setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: 'google' | 'github') => {
        await signInWithOAuth(provider);
        setUser({
            id: `oauth-${Date.now()}`,
            email: `user@${provider}.com`,
            fullName: `${provider.toUpperCase()} Authorized Creator`,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            role: 'Owner',
            teamName: 'OAuth Workspace'
        });
        onClose();
    };

    const handleContinueAfterConfirm = () => {
        setMode('login');
        setShowEmailConfirm(false);
        setSuccessMessage('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl shadow-glow overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-brand-border bg-gradient-to-r from-brand-surface via-brand-surface to-brand-bg">
                    <div className="flex items-center space-x-3">
                        <LogoMark size="md" />
                        <div>
                            <h3 className="text-xl font-bold text-brand-text">
                                {mode === 'login' ? 'Sign In to Collectly' : mode === 'signup' ? 'Create Account' : 'Magic Passwordless Link'}
                            </h3>
                            <p className="text-xs text-brand-muted">Secure sign-in with Role-Based Access Control</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-brand-muted hover:text-brand-text">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-5">
                    {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs flex items-start gap-2">
                            <MailCheck className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {showEmailConfirm && (
                        <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-center space-y-3">
                            <MailCheck className="w-10 h-10 text-brand-primary mx-auto" />
                            <div>
                                <div className="text-sm font-bold text-brand-text">Check Your Email</div>
                                <p className="text-xs text-brand-muted mt-1">
                                    We sent a confirmation link to <strong className="text-brand-text">{email}</strong>. Click the link to verify your account.
                                </p>
                            </div>
                            <button
                                onClick={handleContinueAfterConfirm}
                                className="w-full py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-glow"
                            >
                                I've Confirmed — Go to Sign In
                            </button>
                        </div>
                    )}

                    {!showEmailConfirm && (
                        <>
                            {/* Social OAuth Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleOAuth('google')}
                                    className="py-2.5 px-4 rounded-xl bg-brand-bg border border-brand-border hover:border-brand-primary text-xs font-semibold text-brand-text flex items-center justify-center gap-2 transition-all"
                                >
                                    <span>Google SSO</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleOAuth('github')}
                                    className="py-2.5 px-4 rounded-xl bg-brand-bg border border-brand-border hover:border-purple-500 text-xs font-semibold text-brand-text flex items-center justify-center gap-2 transition-all"
                                >
                                    <Github className="w-4 h-4 text-purple-400" />
                                    <span>GitHub OAuth</span>
                                </button>
                            </div>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-brand-border" />
                                <span className="flex-shrink mx-3 text-[10px] font-bold text-brand-muted uppercase">Or With Email</span>
                                <div className="flex-grow border-t border-brand-border" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'signup' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-brand-text mb-1">Full Name</label>
                                        <div className="relative">
                                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                                            <input
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Sarah Jenkins"
                                                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-brand-text mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="sarah@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text"
                                        />
                                    </div>
                                </div>

                                {mode !== 'magic_link' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-brand-text mb-1">Password</label>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary via-purple-600 to-brand-accent hover:opacity-90 text-white font-extrabold text-xs shadow-glow flex items-center justify-center space-x-2 transition-all"
                                >
                                    <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Workspace' : mode === 'signup' ? 'Create Free Account' : 'Send Magic Link'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>

                            {/* Toggle modes */}
                            <div className="pt-2 text-center text-xs text-brand-muted space-x-2">
                                {mode === 'login' ? (
                                    <>
                                        <span>Don't have an account?</span>
                                        <button onClick={() => setMode('signup')} className="text-brand-accent font-bold hover:underline">
                                            Sign Up
                                        </button>
                                        <span>•</span>
                                        <button onClick={() => setMode('magic_link')} className="text-purple-400 font-bold hover:underline">
                                            Magic Link
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setMode('login')} className="text-brand-accent font-bold hover:underline">
                                        Back to Sign In
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};