import React, { useState, useEffect, useMemo } from 'react';
import { X, Copy, Check, QrCode, Code2, Link, Lock, Calendar, ShieldCheck, Download, Share2, Globe, Timer, Users, Mail, MessageCircle, Send } from 'lucide-react';
import QRCode from 'qrcode';
import { Form, FormStatus } from '../types';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { getPublicFormUrl } from '../lib/config';

interface Props {
    form: Form;
    isOpen: boolean;
    onClose: () => void;
    onUpdateSettings?: (settings: any) => void;
}

const toInputDT = (iso?: string) => {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
        return '';
    }
};

const useCountdown = (endsAt?: string) => {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        if (!endsAt) return;
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, [endsAt]);
    return useMemo(() => {
        if (!endsAt) return null;
        const diff = new Date(endsAt).getTime() - now;
        if (diff <= 0) return { expired: true, d: 0, h: 0, m: 0, s: 0 };
        return { expired: false, d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000) % 24, m: Math.floor(diff / 60000) % 60, s: Math.floor(diff / 1000) % 60 };
    }, [endsAt, now]);
};

export const PublishModal: React.FC<Props> = ({ form, isOpen, onClose }) => {
    const { forms, updateForm, publishFormWithVersion } = useCollectlyStore();
    const liveForm = forms.find((f) => f.id === form.id) || form;

    const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'embed' | 'security' | 'share'>('link');
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);
    const [copiedMsg, setCopiedMsg] = useState(false);
    const [embedWidth, setEmbedWidth] = useState('100%');
    const [embedHeight, setEmbedHeight] = useState('600px');
    const [qrSize, setQrSize] = useState(512);
    const [qrDark, setQrDark] = useState('#0F172A');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [qrError, setQrError] = useState('');
    const [saved, setSaved] = useState(false);
    const [versionMsg, setVersionMsg] = useState<{ ok: boolean; text: string } | null>(null);

    // Controlled security / lifecycle state
    const [status, setStatus] = useState<FormStatus>(liveForm.status);
    const [password, setPassword] = useState(liveForm.settings.passwordProtection || '');
    const [requireLogin, setRequireLogin] = useState(!!liveForm.settings.requireLogin);
    const [responseLimit, setResponseLimit] = useState(liveForm.settings.responseLimit?.toString() || '');
    const [startsAt, setStartsAt] = useState(toInputDT(liveForm.settings.startsAt));
    const [endsAt, setEndsAt] = useState(toInputDT(liveForm.settings.endsAt));
    const [showCountdown, setShowCountdown] = useState(!!liveForm.settings.showTimerCountdown);
    const [enableCaptcha, setEnableCaptcha] = useState(!!liveForm.settings.enableCaptcha);
    const [enableDup, setEnableDup] = useState(liveForm.settings.enableDuplicateDetection !== false);
    const [redirectUrl, setRedirectUrl] = useState(liveForm.settings.redirectUrl || '');

    useEffect(() => {
        if (!isOpen) return;
        setStatus(liveForm.status);
        setPassword(liveForm.settings.passwordProtection || '');
        setRequireLogin(!!liveForm.settings.requireLogin);
        setResponseLimit(liveForm.settings.responseLimit?.toString() || '');
        setStartsAt(toInputDT(liveForm.settings.startsAt));
        setEndsAt(toInputDT(liveForm.settings.endsAt));
        setShowCountdown(!!liveForm.settings.showTimerCountdown);
        setEnableCaptcha(!!liveForm.settings.enableCaptcha);
        setEnableDup(liveForm.settings.enableDuplicateDetection !== false);
        setRedirectUrl(liveForm.settings.redirectUrl || '');
        setSaved(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, form.id]);

    const publicUrl = getPublicFormUrl(liveForm.id);
    const countdown = useCountdown(liveForm.settings.endsAt);

    // Real QR code bound to the share URL
    useEffect(() => {
        if (!isOpen) return;
        setQrError('');
        QRCode.toDataURL(publicUrl, { width: qrSize, margin: 2, color: { dark: qrDark, light: '#FFFFFF' } })
            .then(setQrDataUrl)
            .catch(() => setQrError('Could not generate QR code.'));
    }, [isOpen, publicUrl, qrSize, qrDark]);

    if (!isOpen) return null;

    const embedCode = `<iframe
  src="${publicUrl}"
  width="${embedWidth}"
  height="${embedHeight}"
  frameborder="0"
  marginheight="0"
  marginwidth="0"
  title="${liveForm.title.replace(/"/g, '&quot;')}"
  style="border: none; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
  Loading Collectly form...
</iframe>`;

    const copyText = async (text: string, which: 'link' | 'embed' | 'msg') => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        if (which === 'link') { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
        if (which === 'embed') { setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); }
        if (which === 'msg') { setCopiedMsg(true); setTimeout(() => setCopiedMsg(false), 2000); }
    };

    const snapshotVersion = async (description: string) => {
        const res = await publishFormWithVersion(liveForm.id, description);
        if (res.skipped) return;
        setVersionMsg(res.ok
            ? { ok: true, text: 'Version snapshot saved ✓' }
            : { ok: false, text: `Version snapshot failed: ${res.error || 'unknown error'} — try saving again.` });
        setTimeout(() => setVersionMsg(null), 6000);
    };

    const handleSave = () => {
        updateForm(liveForm.id, {
            status,
            settings: {
                ...liveForm.settings,
                passwordProtection: password || undefined,
                requireLogin,
                responseLimit: responseLimit ? Number(responseLimit) : undefined,
                startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
                endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
                showTimerCountdown: showCountdown,
                enableCaptcha,
                enableDuplicateDetection: enableDup,
                redirectUrl: redirectUrl || undefined,
            },
        });
        // Snapshot the published state into form_versions when saving while live
        if (status === 'published') {
            snapshotVersion('Published — access & schedule settings updated');
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const setQuickStatus = (s: FormStatus) => {
        setStatus(s);
        if (s === 'published') {
            // Persist latest fields + snapshot them as a new form_versions row
            snapshotVersion('Published update');
        } else {
            updateForm(liveForm.id, { status: s });
        }
    };

    const shareText = `${liveForm.title} — fill out my form: ${publicUrl}`;
    const shareLinks = [
        { name: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, icon: Share2 },
        { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(shareText)}`, icon: MessageCircle },
        { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`, icon: Globe },
        { name: 'Email', href: `mailto:?subject=${encodeURIComponent(liveForm.title)}&body=${encodeURIComponent(shareText)}`, icon: Mail },
        { name: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(liveForm.title)}`, icon: Send },
    ];

    const statusBadge = status === 'published'
        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        : status === 'closed' ? 'bg-red-500/10 text-red-500 border-red-500/20'
        : status === 'archived' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        : 'bg-amber-500/10 text-amber-600 border-amber-500/20';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-glow overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-brand-border bg-gradient-to-r from-brand-surface to-brand-bg">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-brand-text">Publish & Share</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusBadge}`}>{status}</span>
                            </div>
                            <p className="text-xs text-brand-muted">{liveForm.title} • {liveForm.responseCount} responses{liveForm.settings.responseLimit ? ` / ${liveForm.settings.responseLimit} limit` : ''}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Publish action bar */}
                <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-brand-border bg-brand-bg/50">
                    {status !== 'published' ? (
                        <button onClick={() => setQuickStatus('published')} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-glow">● Publish Now</button>
                    ) : (
                        <>
                            <button onClick={() => setQuickStatus('draft')} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold">Unpublish to Draft</button>
                            <button onClick={() => snapshotVersion('Published update — manual republish')} className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow">Save New Version</button>
                        </>
                    )}
                    {versionMsg && (
                        <span className={`text-[11px] font-semibold ${versionMsg.ok ? 'text-emerald-500' : 'text-red-500'}`}>{versionMsg.text}</span>
                    )}
                    {status !== 'closed' && <button onClick={() => setQuickStatus('closed')} className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold">Close Form</button>}
                    {status === 'closed' && <button onClick={() => setQuickStatus('archived')} className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold">Archive</button>}
                    {countdown && !countdown.expired && liveForm.settings.endsAt && (
                        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-accent">
                            <Timer className="w-3.5 h-3.5" /> Closes in {countdown.d}d {countdown.h}h {countdown.m}m {countdown.s}s
                        </span>
                    )}
                    {countdown?.expired && <span className="ml-auto text-[11px] font-bold text-red-500">Expired — form is closed to new responses</span>}
                </div>

                <div className="flex border-b border-brand-border bg-brand-bg/50 px-5 overflow-x-auto">
                    {[
                        { id: 'link', label: 'Share Link', icon: Link },
                        { id: 'qr', label: 'QR Code', icon: QrCode },
                        { id: 'embed', label: 'Embed HTML', icon: Code2 },
                        { id: 'security', label: 'Access & Schedule', icon: ShieldCheck },
                        { id: 'share', label: 'Social Share', icon: Share2 },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${isActive ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-text'}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                    {activeTab === 'link' && (
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-brand-text">Direct Shareable Link</label>
                            <div className="flex items-center gap-2">
                                <input type="text" readOnly value={publicUrl} onFocus={(e) => e.target.select()} className="flex-1 px-4 py-3 bg-brand-bg border border-brand-border rounded-xl text-sm font-mono text-brand-accent" />
                                <button onClick={() => copyText(publicUrl, 'link')} className="px-5 py-3 rounded-xl bg-brand-primary text-white font-medium text-sm flex items-center gap-2 shadow-glow shrink-0">
                                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copiedLink ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                            {status !== 'published' && (
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600">
                                    This form is currently <strong>{status}</strong>. Publish it to accept responses at this link.
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border">
                                    <div className="text-xs font-semibold mb-1">Preview respondent view</div>
                                    <a href={publicUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-brand-primary hover:underline">Open Live Form →</a>
                                </div>
                                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border">
                                    <div className="text-xs font-semibold mb-1 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Responses</div>
                                    <span className="text-xs text-brand-muted">{liveForm.responseCount}{liveForm.settings.responseLimit ? ` of ${liveForm.settings.responseLimit}` : ''} submitted</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'qr' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <div className="p-4 bg-white rounded-2xl shadow border border-gray-200 mx-auto">
                                    {qrError ? (
                                        <div className="w-48 h-48 flex items-center justify-center text-xs text-red-500 text-center">{qrError}</div>
                                    ) : qrDataUrl ? (
                                        <img src={qrDataUrl} alt={`QR code for ${liveForm.title}`} className="w-48 h-48" />
                                    ) : (
                                        <div className="w-48 h-48 flex items-center justify-center text-xs text-brand-muted">Generating…</div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">Image size</label>
                                        <div className="flex gap-2">
                                            {[256, 512, 1024].map((s) => (
                                                <button key={s} onClick={() => setQrSize(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${qrSize === s ? 'bg-brand-primary text-white border-brand-primary' : 'bg-brand-bg border-brand-border'}`}>{s}px</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-1">QR color</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={qrDark} onChange={(e) => setQrDark(e.target.value)} className="w-9 h-9 rounded-lg border border-brand-border bg-transparent cursor-pointer" />
                                            <input type="text" value={qrDark} onChange={(e) => setQrDark(e.target.value)} className="flex-1 px-3 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs font-mono" />
                                        </div>
                                    </div>
                                    <a href={qrDataUrl} download={`${liveForm.title.replace(/\s+/g, '_')}_QR_${qrSize}px.png`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surfaceLight border border-brand-border text-xs font-semibold hover:border-brand-primary">
                                        <Download className="w-4 h-4 text-brand-accent" /> Download PNG ({qrSize}px)
                                    </a>
                                    <p className="text-[11px] text-brand-muted">Scans straight to <span className="font-mono text-brand-accent">{publicUrl}</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'embed' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold">Embed HTML Snippet</label>
                                <div className="flex items-center gap-2 text-xs">
                                    <input value={embedWidth} onChange={(e) => setEmbedWidth(e.target.value)} className="w-20 px-2 py-1 bg-brand-bg border border-brand-border rounded text-center" aria-label="Embed width" />
                                    <span className="text-brand-muted">x</span>
                                    <input value={embedHeight} onChange={(e) => setEmbedHeight(e.target.value)} className="w-20 px-2 py-1 bg-brand-bg border border-brand-border rounded text-center" aria-label="Embed height" />
                                </div>
                            </div>
                            <div className="relative">
                                <textarea readOnly rows={6} value={embedCode} className="w-full p-4 bg-brand-bg border border-brand-border rounded-xl text-xs font-mono text-brand-muted" />
                                <button onClick={() => copyText(embedCode, 'embed')} className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium flex items-center gap-1.5 shadow-glow">
                                    {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedEmbed ? 'Copied' : 'Copy HTML'}
                                </button>
                            </div>
                            <div className="p-3 rounded-xl bg-brand-bg/60 border border-brand-border text-xs text-brand-muted">
                                Paste into WordPress, Webflow, Notion, or any HTML page. The form inherits its saved theme.
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold mb-1.5">Form Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value as FormStatus)} className="w-full px-3 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-medium">
                                    <option value="draft">Draft — not accepting responses</option>
                                    <option value="published">Published — accepting responses</option>
                                    <option value="closed">Closed — submissions blocked</option>
                                    <option value="archived">Archived — hidden from dashboard counts</option>
                                </select>
                            </div>
                            <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border space-y-3">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-brand-accent" />
                                    <span className="text-sm font-semibold">Password Protection</span>
                                </div>
                                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave empty for public access…" className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/50 border border-brand-border text-xs font-semibold cursor-pointer">
                                    <span>Require login to respond</span>
                                    <input type="checkbox" checked={requireLogin} onChange={(e) => setRequireLogin(e.target.checked)} className="w-4 h-4 accent-brand-primary" />
                                </label>
                                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border">
                                    <label className="block text-xs font-semibold mb-1">Response limit (blank = unlimited)</label>
                                    <input type="number" min={1} value={responseLimit} onChange={(e) => setResponseLimit(e.target.value)} placeholder="e.g. 100" className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-xs" />
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border space-y-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm font-semibold">Schedule Form Availability</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-brand-muted mb-1">Opens At</label>
                                        <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-xs" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-brand-muted mb-1">Closes At</label>
                                        <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-xs" />
                                    </div>
                                </div>
                                <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                                    <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-brand-accent" /> Show countdown on public form</span>
                                    <input type="checkbox" checked={showCountdown} onChange={(e) => setShowCountdown(e.target.checked)} className="w-4 h-4 accent-brand-primary" />
                                </label>
                                {endsAt && (
                                    <p className="text-[11px] text-brand-muted">
                                        {countdown && !countdown.expired
                                            ? `Respondents will see: closes in ${countdown.d}d ${countdown.h}h ${countdown.m}m ${countdown.s}s.`
                                            : 'This end date is in the past — the public form will show as expired.'}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/50 border border-brand-border text-xs font-semibold cursor-pointer">
                                    <span>Spam guard (duplicate check)</span>
                                    <input type="checkbox" checked={enableDup} onChange={(e) => setEnableDup(e.target.checked)} className="w-4 h-4 accent-brand-primary" />
                                </label>
                                <label className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/50 border border-brand-border text-xs font-semibold cursor-pointer">
                                    <span>CAPTCHA challenge</span>
                                    <input type="checkbox" checked={enableCaptcha} onChange={(e) => setEnableCaptcha(e.target.checked)} className="w-4 h-4 accent-brand-primary" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5">Redirect After Submit (optional)</label>
                                <input type="url" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} placeholder="https://yoursite.com/thanks" className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs" />
                            </div>
                            <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow">
                                {saved ? 'Saved!' : 'Save Access & Schedule Settings'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'share' && (
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold">Share via Social & Email</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {shareLinks.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-brand-bg border border-brand-border hover:border-brand-primary text-xs font-semibold transition-all">
                                            <Icon className="w-4 h-4 text-brand-primary" /> {s.name}
                                        </a>
                                    );
                                })}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5">Invite Message (copy & send anywhere)</label>
                                <textarea readOnly rows={3} value={`Hi! Please fill out "${liveForm.title}": ${publicUrl}`} className="w-full p-3 bg-brand-bg border border-brand-border rounded-xl text-xs" />
                                <button onClick={() => copyText(`Hi! Please fill out "${liveForm.title}": ${publicUrl}`, 'msg')} className="mt-2 px-4 py-2 rounded-xl bg-brand-surfaceLight border border-brand-border text-xs font-semibold flex items-center gap-2">
                                    {copiedMsg ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />} {copiedMsg ? 'Copied!' : 'Copy Message'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-brand-border bg-brand-bg/50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-brand-surfaceLight hover:bg-brand-border text-brand-text font-medium text-xs transition-colors">Done</button>
                </div>
            </div>
        </div>
    );
};
