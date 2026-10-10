import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2, Clock, AlertTriangle, Award, Sparkles, Send, Lock, ArrowLeft, ChevronLeft, ChevronRight, ShieldAlert, ShieldCheck, Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { CertificateModal } from '../components/CertificateModal';
import { analyzeSentiment } from '../services/aiService';
import { FieldRenderer } from '../components/FieldRenderer';
import { evaluateLogic, fieldsForPage, pageOfField, validateFields } from '../lib/fieldLogic';
import { Form } from '../types';
import { Logo } from '../components/Logo';

interface Props {
    formId?: string;
    onBackToDashboard?: () => void;
}

// Session-scoped duplicate marker used when Supabase is not configured
const submittedThisSession = new Set<string>();

export const PublicFormViewPage: React.FC<Props> = ({ formId, onBackToDashboard }) => {
    const { forms, addResponse } = useCollectlyStore();
    const [remoteForm, setRemoteForm] = useState<Form | null>(null);
    const [formFetchDone, setFormFetchDone] = useState(false);
    const form = forms.find((f) => f.id === formId)
        || (remoteForm && remoteForm.id === formId ? remoteForm : null)
        || (formId ? null : forms[0] || null);

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [respondentName, setRespondentName] = useState('');
    const [respondentEmail, setRespondentEmail] = useState('');
    const [tabWarningCount, setTabWarningCount] = useState(0);
    const [showTabWarning, setShowTabWarning] = useState(false);
    const [tabLog, setTabLog] = useState<string[]>([]);
    const [copyAttempts, setCopyAttempts] = useState(0);
    const [showCopyWarning, setShowCopyWarning] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [scoreResult, setScoreResult] = useState<{ score: number; totalPossible: number; passed: boolean } | null>(null);
    const [isCertOpen, setIsCertOpen] = useState(false);
    const [secondsSpent, setSecondsSpent] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [captchaChecked, setCaptchaChecked] = useState(false);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [hasSession, setHasSession] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(() => {
        try {
            return !!formId && submittedThisSession.has(formId);
        } catch {
            return false;
        }
    });

    // Require-login gate: check Supabase session once
    useEffect(() => {
        (async () => {
            try {
                const mod = await import('../lib/supabaseClient');
                if (!mod.isSupabaseConfigured) {
                    setHasSession(true);
                } else {
                    const { data } = await mod.supabase.auth.getSession();
                    setHasSession(!!data.session);
                }
            } catch {
                setHasSession(false);
            } finally {
                setSessionChecked(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (isSubmitted) return;
        const interval = setInterval(() => {
            setSecondsSpent((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isSubmitted]);

    // Anti-cheat 1: Tab-switching detection + logging (visibility + window blur)
    useEffect(() => {
        if (!form?.isQuiz || !form.settings?.quiz?.antiCheatTabDetection || isSubmitted) return;

        const logSwitch = (via: string) => {
            const stamp = new Date().toLocaleTimeString();
            setTabWarningCount((prev) => prev + 1);
            setTabLog((prev) => [...prev, `${stamp} via ${via}`]);
            setShowTabWarning(true);
        };
        const handleVisibilityChange = () => {
            if (document.hidden) logSwitch('tab-hide');
        };
        const handleBlur = () => logSwitch('window-blur');

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [form, isSubmitted]);

    // Anti-cheat 2: Disable copy / cut / paste + right-click + text selection on the quiz container
    useEffect(() => {
        if (!form?.isQuiz || !form.settings?.quiz?.antiCheatDisableCopyPaste || isSubmitted) return;
        const el = formRef.current;
        if (!el) return;

        const block = (e: Event, kind: string) => {
            e.preventDefault();
            e.stopPropagation();
            setCopyAttempts((prev) => prev + 1);
            setShowCopyWarning(true);
            return false;
        };
        const onCopy = (e: Event) => block(e, 'copy');
        const onCut = (e: Event) => block(e, 'cut');
        const onPaste = (e: Event) => block(e, 'paste');
        const onContext = (e: Event) => block(e, 'contextmenu');
        const onDrag = (e: Event) => block(e, 'drag');

        el.addEventListener('copy', onCopy);
        el.addEventListener('cut', onCut);
        el.addEventListener('paste', onPaste);
        el.addEventListener('contextmenu', onContext);
        el.addEventListener('dragstart', onDrag);
        return () => {
            el.removeEventListener('copy', onCopy);
            el.removeEventListener('cut', onCut);
            el.removeEventListener('paste', onPaste);
            el.removeEventListener('contextmenu', onContext);
            el.removeEventListener('dragstart', onDrag);
        };
    }, [form, isSubmitted, currentPage]);

    // Load the form from Supabase when it isn't in the local store (share links / fresh visitors)
    useEffect(() => {
        if (!formId) {
            setFormFetchDone(true);
            return;
        }
        if (forms.some((f) => f.id === formId)) {
            setFormFetchDone(true);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const { isSupabaseConfigured } = await import('../lib/supabaseClient');
                if (!isSupabaseConfigured) return;
                const { formService } = await import('../services/formService');
                const fetched = await formService.getForm(formId);
                if (!cancelled && fetched) setRemoteForm(fetched);
            } catch (e) {
                console.warn('Failed to load form from Supabase:', e);
            } finally {
                if (!cancelled) setFormFetchDone(true);
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);

    // Prefill answers with each field's default value once the form is known
    useEffect(() => {
        if (!form) return;
        const init: Record<string, any> = {};
        form.fields.forEach((f) => {
            if (f.defaultValue !== undefined && f.defaultValue !== null && String(f.defaultValue) !== '') init[f.id] = f.defaultValue;
        });
        if (Object.keys(init).length) setAnswers((prev) => ({ ...init, ...prev }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form?.id]);

    // Duplicate-submission check against Supabase as soon as the respondent types their email
    useEffect(() => {
        if (!form || !form.settings?.enableDuplicateDetection) return;
        const email = respondentEmail.trim().toLowerCase();
        if (!email || !email.includes('@')) return;
        let cancelled = false;
        (async () => {
            try {
                const { responseService } = await import('../services/formService');
                const dup = await responseService.hasPriorResponse(form.id, email);
                if (!cancelled && dup) setAlreadySubmitted(true);
            } catch { /* if the check is unavailable, allow the submission */ }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form?.id, respondentEmail, form?.settings?.enableDuplicateDetection]);

    // Track form view in Supabase analytics + storage of form impression
    useEffect(() => {
        (async () => {
            try {
                const { isSupabaseConfigured } = await import('../lib/supabaseClient');
                if (!isSupabaseConfigured || !form) return;
                const { analyticsService } = await import('../services/formService');
                await analyticsService.trackEvent(form.id, 'form_view', { title: form.title });
            } catch { }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form?.id]);

    if (!form) {
        if (!formFetchDone) {
            return (
                <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex items-center justify-center p-4">
                    <div className="text-center space-y-3">
                        <div className="w-10 h-10 mx-auto border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-brand-muted">Loading form…</p>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-glow text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                        <Lock className="w-7 h-7 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-extrabold text-brand-text">Form not found</h2>
                    <p className="text-xs text-brand-muted">This form does not exist or is not published yet.</p>
                    {onBackToDashboard && (
                        <button onClick={onBackToDashboard} className="px-5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold">
                            Back to Dashboard
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Evaluate conditional logic first (must come before pagination filtering)
    const logicResult = evaluateLogic(form.fields, answers);
    const hiddenFieldIds = logicResult.hidden;

    const totalPages = form.settings?.totalPages || 1;
    const visibleFields = form.fields.filter((f) => !hiddenFieldIds.has(f.id));
    const currentPageFields = fieldsForPage(form.fields, currentPage, totalPages, hiddenFieldIds);
    const isLastPage = currentPage === totalPages;
    const isFirstPage = currentPage === 1;

    const needsPassword = form.settings?.passwordProtection && !showPasswordPrompt;
    const passwordMatches = !form.settings?.passwordProtection || passwordInput === form.settings?.passwordProtection;

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === form.settings?.passwordProtection) {
            setShowPasswordPrompt(true);
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    };

    const handleFieldValueChange = (fieldId: string, val: any) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: val }));
        if (submitError) setSubmitError('');
        setValidationErrors((prev) => {
            if (!prev[fieldId]) return prev;
            const next = { ...prev };
            delete next[fieldId];
            return next;
        });
    };

    const handleFileChange = async (fieldId: string, file: File | undefined) => {
        if (!file) return;
        setAnswers((prev) => ({ ...prev, [fieldId]: `uploading:${file.name}` }));
        try {
            const { supabaseStorage } = await import('../services/supabaseStorage');
            const path = `responses/${form.id}/${Date.now()}_${file.name}`;
            const storagePath = await supabaseStorage.uploadFormAttachment(path, file);
            const publicUrl = await supabaseStorage.getPublicUrl('uploads', storagePath);
            setAnswers((prev) => ({ ...prev, [fieldId]: publicUrl }));
        } catch (e) {
            console.warn('File upload failed:', e);
            setAnswers((prev) => ({ ...prev, [fieldId]: file.name }));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const jump = logicResult.jumpToPage;
            setCurrentPage(jump && jump >= 1 && jump <= totalPages && jump !== currentPage ? jump : currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate every visible field (required, email/url/phone, regex pattern, min/max)
        const errors = validateFields(form.fields, answers, hiddenFieldIds);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            const firstErrField = form.fields.find((f) => errors[f.id]);
            if (firstErrField) {
                setCurrentPage(pageOfField(form.fields, firstErrField.id, totalPages, hiddenFieldIds));
                setTimeout(() => {
                    const el = document.getElementById(`field-${firstErrField.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 60);
            }
            return;
        }
        setValidationErrors({});

        const emailTrimmed = respondentEmail.trim();

        // Duplicate detection via Supabase (works across devices/browsers)
        if (form.settings?.enableDuplicateDetection && emailTrimmed) {
            try {
                const { responseService } = await import('../services/formService');
                const isDup = await responseService.hasPriorResponse(form.id, emailTrimmed);
                if (isDup) {
                    submittedThisSession.add(form.id);
                    setAlreadySubmitted(true);
                    return;
                }
            } catch { /* if the check is unavailable, allow the submission */ }
        }

        let totalScore = 0;
        let totalPossible = 0;
        const formattedAnswers: Record<string, any> = {};

        let combinedTextForSentiment = '';

        form.fields.forEach((field) => {
            // Hidden-by-logic fields are not answered and never graded
            if (hiddenFieldIds.has(field.id)) return;

            const userVal = answers[field.id];
            let isCorrect = false;
            let pointsEarned = 0;

            if (field.type === 'text' || field.type === 'textarea') {
                if (typeof userVal === 'string') combinedTextForSentiment += ' ' + userVal;
            }

            if (form.isQuiz) {
                if (field.points) totalPossible += field.points;

                if (field.type === 'quiz_mcq') {
                    const selectedOpt = field.options?.find((o) => o.value === userVal);
                    if (selectedOpt && selectedOpt.isCorrect) {
                        isCorrect = true;
                        pointsEarned = field.points || selectedOpt.scorePoints || 10;
                        totalScore += pointsEarned;
                    }
                } else if (field.type === 'quiz_tf') {
                    const correctVal = field.correctAnswer ?? field.options?.find((o) => o.isCorrect)?.value;
                    if (userVal !== undefined && userVal !== null && correctVal !== undefined && String(userVal).toLowerCase() === String(correctVal).toLowerCase()) {
                        isCorrect = true;
                        pointsEarned = field.points || 5;
                        totalScore += pointsEarned;
                    }
                } else if (field.type === 'quiz_short' || field.type === 'quiz_fill_blank') {
                    if (userVal && field.correctAnswer && String(userVal).trim().toLowerCase() === String(field.correctAnswer).trim().toLowerCase()) {
                        isCorrect = true;
                        pointsEarned = field.points || 10;
                        totalScore += pointsEarned;
                    }
                } else if (field.type === 'quiz_matching') {
                    const pairs = field.matchingPairs || [];
                    const uv = userVal && typeof userVal === 'object' && !Array.isArray(userVal) ? userVal : {};
                    if (pairs.length > 0 && pairs.every((p) => uv[p.id] === p.right)) {
                        isCorrect = true;
                        pointsEarned = field.points || 10;
                        totalScore += pointsEarned;
                    }
                } else if (field.type === 'quiz_ordering') {
                    const correct = (field.options || []).map((o) => o.value);
                    const uv = Array.isArray(userVal) ? userVal : [];
                    if (correct.length > 0 && uv.length === correct.length && correct.every((v, i) => uv[i] === v)) {
                        isCorrect = true;
                        pointsEarned = field.points || 10;
                        totalScore += pointsEarned;
                    }
                }
            }

            formattedAnswers[field.id] = {
                fieldId: field.id,
                fieldLabel: field.label,
                value: userVal === undefined || userVal === null ? '' : userVal,
                isCorrect,
                pointsEarned
            };
        });

        // Conditional-logic score adjustments (calculate_score rules)
        totalScore = Math.max(0, totalScore + evaluateLogic(form.fields, answers).scoreAdjustment);

        // Persist respondent identity with the response (used for duplicate detection + shown in the response detail view)
        if (respondentName) {
            formattedAnswers['respondent_name'] = {
                fieldId: 'respondent_name',
                fieldLabel: 'Your Full Name',
                value: respondentName
            };
        }
        if (emailTrimmed) {
            formattedAnswers['respondent_email'] = {
                fieldId: 'respondent_email',
                fieldLabel: 'Your Email Address',
                value: emailTrimmed
            };
        }

        const passThreshold = form.settings?.quiz?.passPercentage || 70;
        const passScoreNeeded = (passThreshold / 100) * (totalPossible || 1);
        const passed = totalScore >= passScoreNeeded;

        const sentimentResult = analyzeSentiment(combinedTextForSentiment);

        // Anti-cheat audit trail: flags + timestamped log persisted with the response
        const cheatTags: string[] = form.isQuiz ? (passed ? ['Passed'] : ['Failed']) : ['Verified'];
        if (form.isQuiz && tabWarningCount > 0) cheatTags.push(`Tab-Switch x${tabWarningCount}`);
        if (form.isQuiz && tabWarningCount >= 3) cheatTags.push('Flagged');
        if (form.isQuiz && copyAttempts > 0) cheatTags.push(`Copy-Blocked x${copyAttempts}`);
        const cheatNotes = form.isQuiz && (tabWarningCount > 0 || copyAttempts > 0)
            ? [{ id: `note-${Date.now()}`, author: 'Anti-Cheat System', text: `Tab switches: ${tabWarningCount}${tabLog.length ? ` (${tabLog.join('; ')})` : ''} | Copy/cut/paste blocked: ${copyAttempts}`, createdAt: new Date().toISOString() }]
            : [];

        setIsSubmitting(true);
        const saved = await addResponse({
            id: `resp-${Date.now()}`,
            formId: form.id,
            submittedAt: new Date().toISOString(),
            timeSpentSeconds: secondsSpent,
            isDuplicate: false,
            isSpam: form.isQuiz && tabWarningCount >= 5,
            score: form.isQuiz ? totalScore : undefined,
            totalPossiblePoints: form.isQuiz ? totalPossible : undefined,
            passed: form.isQuiz ? passed : undefined,
            tags: cheatTags,
            answers: formattedAnswers,
            teamNotes: cheatNotes,
            sentiment: sentimentResult.sentiment,
            sentimentScore: sentimentResult.score,
            deviceInfo: {
                browser: 'Chrome 128',
                os: 'Windows 11',
                device: 'desktop',
                country: 'United States',
                city: 'San Francisco'
            }
        });
        setIsSubmitting(false);

        if (!saved) {
            setSubmitError('We could not save your response. Please check your internet connection and try submitting again.');
            return;
        }
        setSubmitError('');

        setScoreResult({ score: totalScore, totalPossible, passed });
        setIsSubmitted(true);
        try {
            if (form.settings?.enableDuplicateDetection) submittedThisSession.add(form.id);
        } catch { }
        if (form.settings?.redirectUrl) {
            setTimeout(() => { window.location.href = form.settings.redirectUrl as string; }, 2500);
        }

        // Track submission in Supabase analytics (form_submit + funnel)
        (async () => {
            try {
                const { isSupabaseConfigured } = await import('../lib/supabaseClient');
                if (!isSupabaseConfigured) return;
                const { analyticsService } = await import('../services/formService');
                await analyticsService.trackEvent(form.id, 'form_submit', { score: totalScore, passed, tabSwitches: tabWarningCount, copyBlocked: copyAttempts });
            } catch { }
        })();

        if (form.isQuiz && passed) {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
    };

    const getDynamicThankYou = () => {
        if (!form.isQuiz || !scoreResult) {
            return { title: form.settings?.customThankYouTitle || 'Response Submitted!', message: form.settings?.customThankYouMessage || 'Thank you for filling out this form.' };
        }

        const percentage = Math.round((scoreResult.score / (scoreResult.totalPossible || 1)) * 100);

        if (percentage >= 90) return { title: 'Outstanding Performance!', message: `You scored ${percentage}% — exceptional work!` };
        if (percentage >= 70) return { title: 'Great Job!', message: `You passed with ${percentage}%. Well done!` };
        if (percentage >= 50) return { title: 'Good Effort!', message: `You scored ${percentage}%. Keep practicing!` };
        return { title: 'Thank You!', message: `You scored ${percentage}%. Review the material and try again.` };
    };

    if (needsPassword && !passwordMatches) {
        return (
            <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-glow text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8 text-brand-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-brand-text">Password Required</h2>
                        <p className="text-xs text-brand-muted mt-2">This form is protected. Enter the password to continue.</p>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                            placeholder="Enter form password"
                            className={`w-full px-4 py-3 bg-brand-bg border rounded-xl text-sm text-brand-text text-center ${passwordError ? 'border-red-500' : 'border-brand-border'}`}
                        />
                        {passwordError && <p className="text-xs text-red-400">Incorrect password. Please try again.</p>}
                        <button type="submit" className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm shadow-glow">
                            Unlock Form
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Access enforcement: status / schedule / limits / login / duplicate
    const nowMs = Date.now();
    const startsAtMs = form.settings?.startsAt ? new Date(form.settings.startsAt).getTime() : null;
    const endsAtMs = form.settings?.endsAt ? new Date(form.settings.endsAt).getTime() : null;
    const notYetOpen = startsAtMs !== null && !Number.isNaN(startsAtMs) && nowMs < (startsAtMs as number);
    const expired = endsAtMs !== null && !Number.isNaN(endsAtMs) && nowMs > (endsAtMs as number);
    const limitReached = !!form.settings?.responseLimit && form.responseCount >= (form.settings.responseLimit as number);
    const isClosed = form.status === 'closed' || form.status === 'archived';
    const loginBlocked = !!form.settings?.requireLogin && sessionChecked && !hasSession;
    const duplicateBlocked = !!form.settings?.enableDuplicateDetection && alreadySubmitted && !isSubmitted;
    const showDraftBanner = form.status === 'draft';

    const countdownParts = endsAtMs && !Number.isNaN(endsAtMs) && endsAtMs > nowMs
        ? { d: Math.floor((endsAtMs - nowMs) / 86400000), h: Math.floor((endsAtMs - nowMs) / 3600000) % 24, m: Math.floor((endsAtMs - nowMs) / 60000) % 60, s: Math.floor((endsAtMs - nowMs) / 1000) % 60 }
        : null;

    if (isClosed || expired || notYetOpen || limitReached || loginBlocked || duplicateBlocked) {
        const reason = isClosed
            ? { title: 'This form is closed', desc: 'The owner has closed this form. It is no longer accepting responses.' }
            : expired
                ? { title: 'This form has expired', desc: `Submissions closed on ${new Date(endsAtMs as number).toLocaleString()}.` }
                : notYetOpen
                    ? { title: 'This form is not open yet', desc: `It opens on ${new Date(startsAtMs as number).toLocaleString()}. Please come back then.` }
                    : limitReached
                        ? { title: 'Response limit reached', desc: `This form has received its maximum of ${form.settings?.responseLimit} responses.` }
                        : loginBlocked
                            ? { title: 'Login required', desc: 'Please sign in to your Collectly account to fill out this form.' }
                            : { title: 'Already submitted', desc: 'Our spam guard shows this device already submitted this form.' };
        return (
            <div className="min-h-screen bg-brand-bg font-sans flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-glow text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-extrabold text-brand-text">{reason.title}</h2>
                    <p className="text-xs text-brand-muted">{reason.desc}</p>
                    {onBackToDashboard && (
                        <button onClick={onBackToDashboard} className="px-5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold">
                            Back to Dashboard
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const thankYouContent = getDynamicThankYou();
    const theme = {
        primaryColor: form.settings?.theme?.primaryColor || '#2563EB',
        secondaryColor: (form.settings?.theme as any)?.secondaryColor || '#64748B',
        accentColor: form.settings?.theme?.accentColor || '#06B6D4',
        backgroundColor: form.settings?.theme?.backgroundColor || '#F8FAFC',
        surfaceColor: form.settings?.theme?.surfaceColor || '#FFFFFF',
        textColor: form.settings?.theme?.textColor || '#0F172A',
        gradientStart: (form.settings?.theme as any)?.gradientStart || '#60A5FA',
        gradientEnd: (form.settings?.theme as any)?.gradientEnd || '#22D3EE',
        fontFamily: form.settings?.theme?.fontFamily || 'Poppins',
        borderRadius: form.settings?.theme?.borderRadius || '12px',
        logoUrl: form.settings?.theme?.logoUrl,
        customCss: form.settings?.theme?.customCss,
    };

    return (
        <div className="min-h-screen font-sans flex flex-col justify-between p-4 sm:p-8" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}>
            {theme.customCss && <style>{theme.customCss}</style>}
            {/* Header Bar */}
            <div className="max-w-3xl mx-auto w-full flex items-center justify-between py-4 border-b border-brand-border/60">
                <div className="flex items-center space-x-3">
                    {onBackToDashboard && (
                        <button
                            onClick={onBackToDashboard}
                            className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text"
                            aria-label="Back to dashboard"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <Logo size="sm" onClick={onBackToDashboard} />
                </div>

                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-muted">
                    <Clock className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Timer: <strong className="text-brand-text">{Math.floor(secondsSpent / 60)}m {secondsSpent % 60}s</strong></span>
                </div>
            </div>

            {form.isQuiz && (form.settings?.quiz?.antiCheatTabDetection || form.settings?.quiz?.antiCheatDisableCopyPaste) && !isSubmitted && (
                <div className="max-w-3xl mx-auto w-full mt-4 flex flex-wrap gap-2 text-xs">
                    {form.settings?.quiz?.antiCheatTabDetection && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-700 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" /> Tab monitoring ON{tabWarningCount > 0 ? ` • ${tabWarningCount} violation${tabWarningCount > 1 ? 's' : ''}` : ''}
                        </span>
                    )}
                    {form.settings?.quiz?.antiCheatDisableCopyPaste && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 font-semibold">
                            <Copy className="w-3.5 h-3.5" /> Copy protection ON{copyAttempts > 0 ? ` • ${copyAttempts} blocked` : ''}
                        </span>
                    )}
                </div>
            )}

            {showTabWarning && !isSubmitted && (
                <div className="max-w-3xl mx-auto w-full mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-700 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <span>
                                <strong>Proctored Anti-Cheat Warning:</strong> Tab switching detected ({tabWarningCount} time{tabWarningCount === 1 ? '' : 's'}). {tabWarningCount >= 3 ? 'Further violations may auto-flag this attempt.' : 'Violations are logged with this attempt.'}
                            </span>
                        </div>
                        <button onClick={() => setShowTabWarning(false)} className="text-xs underline font-semibold shrink-0">Dismiss</button>
                    </div>
                    {tabLog.length > 0 && (
                        <div className="pl-7 text-[11px] opacity-80">Log: {tabLog.slice(-3).join(' • ')}{tabLog.length > 3 ? ` (+${tabLog.length - 3} more)` : ''}</div>
                    )}
                </div>
            )}

            {showCopyWarning && !isSubmitted && (
                <div className="max-w-3xl mx-auto w-full mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        <span><strong>Copy protection:</strong> Copying, pasting, and right-click are disabled during this quiz ({copyAttempts} attempt{copyAttempts === 1 ? '' : 's'} blocked).</span>
                    </div>
                    <button onClick={() => setShowCopyWarning(false)} className="text-xs underline font-semibold shrink-0">Dismiss</button>
                </div>
            )}

            {showDraftBanner && !isSubmitted && (
                <div className="max-w-3xl mx-auto w-full mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs text-center">
                    Preview mode — this form is still a <strong>draft</strong>. Publish it to accept public responses.
                </div>
            )}

            {form.settings?.showTimerCountdown && countdownParts && !isSubmitted && (
                <div className="max-w-3xl mx-auto w-full mt-4 p-3 rounded-xl border text-xs text-center font-bold" style={{ backgroundColor: theme.surfaceColor, borderColor: theme.accentColor + '44', color: theme.textColor }}>
                    ⏳ Closes in {countdownParts.d}d {countdownParts.h}h {countdownParts.m}m {countdownParts.s}s
                </div>
            )}

            {/* Main Box */}
            <div ref={formRef} className="max-w-3xl mx-auto w-full my-8 border p-6 sm:p-10 shadow-glow" style={{ backgroundColor: theme.surfaceColor, borderColor: theme.secondaryColor + '33', borderRadius: theme.borderRadius, color: theme.textColor, userSelect: form.isQuiz && form.settings?.quiz?.antiCheatDisableCopyPaste && !isSubmitted ? 'none' : 'auto' } as React.CSSProperties}>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="border-b pb-6 space-y-2" style={{ borderColor: theme.secondaryColor + '44' }}>
                            {theme.logoUrl && <img src={theme.logoUrl} alt="Brand logo" className="h-10 object-contain mb-2" />}
                            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: theme.textColor }}>{form.title}</h1>
                            {form.description && <p className="text-xs sm:text-sm" style={{ color: theme.secondaryColor }}>{form.description}</p>}
                            <div className="h-1.5 w-32 rounded-full" style={{ background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` }} />
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-bg/50 border border-brand-border">
                                <span className="text-xs font-semibold text-brand-muted">Page {currentPage} of {totalPages}</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 bg-brand-bg rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${(currentPage / totalPages) * 100}%`, background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">Your Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={respondentName}
                                    onChange={(e) => setRespondentName(e.target.value)}
                                    placeholder="e.g. Sarah Jenkins"
                                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-brand-text mb-1">Your Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={respondentEmail}
                                    onChange={(e) => setRespondentEmail(e.target.value)}
                                    placeholder="sarah@example.com"
                                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {currentPageFields.map((field) => {
                                const globalIndex = visibleFields.findIndex((f) => f.id === field.id);
                                const fieldError = validationErrors[field.id];
                                const isLayout = field.type === 'section' || field.type === 'page_break';
                                return (
                                    <div key={field.id} id={`field-${field.id}`} className={`p-5 rounded-xl bg-brand-bg/60 border space-y-3 ${fieldError ? 'border-red-500/70 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]' : 'border-brand-border/80'}`}>
                                        {!isLayout && (
                                            <div className="flex items-start justify-between">
                                                <label className="text-sm font-bold text-brand-text flex items-center gap-2">
                                                    <span className="text-brand-accent">Q{globalIndex + 1}.</span> {field.label}
                                                    {field.required && <span className="text-red-400 text-xs">*</span>}
                                                </label>
                                                {form.isQuiz && Boolean(field.points && field.points > 0) && (field.type.startsWith('quiz_') || field.options?.some(o => o.isCorrect)) && (
                                                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                                        +{field.points} pts
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {field.description && !isLayout && <p className="text-xs text-brand-muted">{field.description}</p>}

                                        <FieldRenderer
                                            field={field}
                                            value={answers[field.id]}
                                            onChange={(v) => handleFieldValueChange(field.id, v)}
                                            onFileChange={(f) => handleFileChange(field.id, f)}
                                            variant="public"
                                            error={!!fieldError}
                                        />

                                        {fieldError && <p className="text-[11px] text-red-400 font-semibold">{fieldError}</p>}
                                    </div>
                                );
                            })}
                        </div>

                        {submitError && (
                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-400 font-semibold text-center">
                                {submitError}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handlePrevPage}
                                    disabled={isFirstPage}
                                    className="px-4 py-2 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                {isLastPage ? (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || (!!form.settings?.enableCaptcha && !captchaChecked)}
                                        className="px-6 py-2 rounded-xl text-white font-extrabold text-sm shadow-glow flex items-center space-x-2 disabled:opacity-50"
                                        style={{ background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, borderRadius: theme.borderRadius }}
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>{isSubmitting ? 'Submitting…' : 'Submit Responses'}</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNextPage}
                                        className="px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1 shadow-glow"
                                        style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        {form.settings?.enableCaptcha && (
                            <label className="flex items-center gap-3 p-4 rounded-xl border border-brand-border bg-brand-bg/50 text-xs font-semibold cursor-pointer">
                                <input type="checkbox" checked={captchaChecked} onChange={(e) => setCaptchaChecked(e.target.checked)} className="w-4 h-4 accent-brand-primary" />
                                <span>I'm not a robot (spam check required by the form owner)</span>
                            </label>
                        )}

                        {totalPages === 1 && (
                            <button
                                type="submit"
                                disabled={isSubmitting || (!!form.settings?.enableCaptcha && !captchaChecked)}
                                className="w-full py-4 rounded-xl hover:opacity-95 text-white font-extrabold text-sm shadow-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                                style={{ background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`, borderRadius: theme.borderRadius }}
                            >
                                <Send className="w-4 h-4" />
                                <span>{isSubmitting ? 'Submitting…' : 'Submit Responses'}</span>
                            </button>
                        )}
                    </form>
                ) : (
                    <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-glow">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: theme.textColor }}>
                                {thankYouContent.title}
                            </h2>
                            <p className="text-sm font-medium max-w-md mx-auto mt-2 leading-relaxed" style={{ color: theme.secondaryColor }}>
                                {thankYouContent.message}
                            </p>
                        </div>

                        {form.isQuiz && scoreResult && (
                            <div className="p-6 rounded-2xl border max-w-sm mx-auto space-y-3.5 shadow-card" style={{ backgroundColor: theme.backgroundColor, borderColor: theme.secondaryColor + '33' }}>
                                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.secondaryColor }}>Your Assessment Result</div>
                                <div className="text-3xl sm:text-4xl font-black" style={{ color: theme.textColor }}>
                                    {scoreResult.score} / {scoreResult.totalPossible} <span className="text-xs font-semibold" style={{ color: theme.secondaryColor }}>Points ({Math.round((scoreResult.score / (scoreResult.totalPossible || 1)) * 100)}%)</span>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        scoreResult.passed
                                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                                            : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/40'
                                    }`}>
                                        {scoreResult.passed ? '✓ Passed Assessment' : 'Needs Improvement'}
                                    </span>
                                </div>

                                {scoreResult.passed && form.settings?.quiz?.generateCertificate && (
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setIsCertOpen(true)}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-glow flex items-center justify-center space-x-2 transition-all transform active:scale-98"
                                        >
                                            <Award className="w-4 h-4" />
                                            <span>View &amp; Download PDF Certificate</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-2 flex items-center justify-center gap-3">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setAnswers({});
                                    setValidationErrors({});
                                    setCurrentPage(1);
                                    setScoreResult(null);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                                style={{ backgroundColor: theme.backgroundColor, borderColor: theme.secondaryColor + '44', color: theme.textColor }}
                            >
                                Submit Another Response
                            </button>
                            {onBackToDashboard && (
                                <button
                                    onClick={onBackToDashboard}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 text-white shadow-sm"
                                    style={{ backgroundColor: theme.primaryColor }}
                                >
                                    Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Public Form Footer Badge */}
            <div className="max-w-3xl mx-auto w-full py-6 flex items-center justify-center">
                <Logo variant="badge" onClick={onBackToDashboard} />
            </div>

            {isCertOpen && (
                <CertificateModal
                    isOpen={isCertOpen}
                    onClose={() => setIsCertOpen(false)}
                    recipientName={respondentName || 'Valued Participant'}
                    quizTitle={form.title}
                    certificateTitle={form.settings?.quiz?.certificateTitle || 'Certificate of Achievement'}
                    scorePercentage={scoreResult ? Math.round((scoreResult.score / (scoreResult.totalPossible || 1)) * 100) : 100}
                    completedDate={new Date().toLocaleDateString()}
                />
            )}
        </div>
    );
};
