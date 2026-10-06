import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    HelpCircle, ShieldAlert, Award, Clock, Trophy, Ban, Zap, Eye, Timer, Plus, Sparkles,
    CheckCircle2, PenTool, ExternalLink, Copy, Check, AlertTriangle, ShieldCheck, BarChart3,
    BookOpen, Layers, ChevronDown
} from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { CertificateModal } from '../components/CertificateModal';
import { Form, FormResponse } from '../types';
import { ActiveTab } from '../components/Sidebar';
import { getPublicFormUrl } from '../lib/config';

interface Props {
    onEditForm?: (form: Form) => void;
    onOpenAIGenerator?: () => void;
    onPreviewPublicForm?: (formId: string) => void;
    onNavigateTab?: (tab: ActiveTab) => void;
}

const getQuiz = (form: Form | null) => form?.settings?.quiz ?? {
    enabled: true,
    showLeaderboard: true,
    showImmediateFeedback: true,
    antiCheatTabDetection: true,
    antiCheatDisableCopyPaste: true,
    passPercentage: 70,
    generateCertificate: true,
    certificateTitle: 'Certificate of Achievement',
    timeLimitMinutes: 10,
};

export const QuizHubPage: React.FC<Props> = ({
    onEditForm,
    onOpenAIGenerator,
    onPreviewPublicForm,
    onNavigateTab,
}) => {
    const { forms, updateForm, responses, createForm, setActiveForm } = useCollectlyStore();
    const quizForms = useMemo(() => forms.filter((f) => f.isQuiz), [forms]);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

    const activeQuiz = quizForms.find((f) => f.id === selectedQuizId) || quizForms[0] || null;

    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isQuizDropdownOpen, setIsQuizDropdownOpen] = useState(false);
    const quizDropdownRef = useRef<HTMLDivElement>(null);

    const [tabAntiCheat, setTabAntiCheat] = useState(true);
    const [copyAntiCheat, setCopyAntiCheat] = useState(true);
    const [passPercent, setPassPercent] = useState(70);
    const [certTitle, setCertTitle] = useState('Certificate of Achievement');
    const [timeLimit, setTimeLimit] = useState(10);
    const [showLeaderboard, setShowLeaderboard] = useState(true);
    const [showFeedback, setShowFeedback] = useState(true);
    const [generateCert, setGenerateCert] = useState(true);
    const [saved, setSaved] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    // Dismiss custom dropdown on outside click or escape key
    useEffect(() => {
        if (!isQuizDropdownOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (quizDropdownRef.current && !quizDropdownRef.current.contains(e.target as Node)) {
                setIsQuizDropdownOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsQuizDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isQuizDropdownOpen]);

    // Sync settings whenever active quiz changes
    useEffect(() => {
        if (!activeQuiz) return;
        const q = getQuiz(activeQuiz);
        setTabAntiCheat(q.antiCheatTabDetection ?? true);
        setCopyAntiCheat(q.antiCheatDisableCopyPaste ?? true);
        setPassPercent(q.passPercentage ?? 70);
        setCertTitle(q.certificateTitle || 'Certificate of Achievement');
        setTimeLimit(q.timeLimitMinutes ?? 10);
        setShowLeaderboard(q.showLeaderboard ?? true);
        setShowFeedback(q.showImmediateFeedback ?? true);
        setGenerateCert(q.generateCertificate ?? true);
    }, [activeQuiz?.id, activeQuiz?.updatedAt]);

    // Calculate points and total questions
    const { totalQuizQuestions, totalPossiblePoints } = useMemo(() => {
        if (!activeQuiz) return { totalQuizQuestions: 0, totalPossiblePoints: 0 };
        const questions = activeQuiz.fields.filter(
            (f) => f.type.startsWith('quiz_') || f.points !== undefined
        );
        const points = questions.reduce((acc, f) => acc + (f.points || 10), 0);
        return {
            totalQuizQuestions: questions.length || activeQuiz.fields.length,
            totalPossiblePoints: points || 100,
        };
    }, [activeQuiz]);

    // Responses for active quiz
    const quizResponses = useMemo(
        () => (activeQuiz ? responses.filter((r) => r.formId === activeQuiz.id) : []),
        [activeQuiz, responses]
    );

    const passedCount = quizResponses.filter((r) => r.passed).length;
    const passRate = quizResponses.length > 0 ? Math.round((passedCount / quizResponses.length) * 100) : 0;
    const avgScore = quizResponses.length > 0
        ? Math.round(quizResponses.reduce((acc, r) => acc + (r.score || 0), 0) / quizResponses.length)
        : 0;

    // Security & Anti-Cheat incidents calculation
    const securityAudit = useMemo(() => {
        let totalTabSwitches = 0;
        let totalCopyBlocked = 0;
        let flaggedAttempts = 0;

        quizResponses.forEach((r) => {
            const hasFlag = r.tags?.some((t) => t.toLowerCase().includes('flagged'));
            if (hasFlag || r.isSpam) flaggedAttempts++;

            r.tags?.forEach((t) => {
                if (t.includes('Tab-Switch x')) {
                    const count = parseInt(t.replace('Tab-Switch x', '')) || 0;
                    totalTabSwitches += count;
                }
                if (t.includes('Copy-Blocked x')) {
                    const count = parseInt(t.replace('Copy-Blocked x', '')) || 0;
                    totalCopyBlocked += count;
                }
            });
        });

        const totalViolations = totalTabSwitches + totalCopyBlocked;
        const integrityRate = quizResponses.length > 0
            ? Math.round(((quizResponses.length - flaggedAttempts) / quizResponses.length) * 100)
            : 100;

        return {
            totalTabSwitches,
            totalCopyBlocked,
            flaggedAttempts,
            totalViolations,
            integrityRate,
        };
    }, [quizResponses]);

    const handleSaveQuizSettings = () => {
        if (!activeQuiz) return;
        updateForm(activeQuiz.id, {
            settings: {
                ...activeQuiz.settings,
                quiz: {
                    ...getQuiz(activeQuiz),
                    antiCheatTabDetection: tabAntiCheat,
                    antiCheatDisableCopyPaste: copyAntiCheat,
                    passPercentage: passPercent,
                    certificateTitle: certTitle.trim() || 'Certificate of Achievement',
                    timeLimitMinutes: timeLimit,
                    showLeaderboard: showLeaderboard,
                    showImmediateFeedback: showFeedback,
                    generateCertificate: generateCert,
                },
            },
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleCopyShareLink = () => {
        if (!activeQuiz) return;
        const shareUrl = getPublicFormUrl(activeQuiz.id);
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCreateNewQuiz = () => {
        const newQuiz = createForm({
            title: 'New Comprehensive Assessment',
            category: 'Quiz',
            isQuiz: true,
        });
        setActiveForm(newQuiz);
        setSelectedQuizId(newQuiz.id);
        if (onEditForm) {
            onEditForm(newQuiz);
        }
    };

    // Leaderboard Data extraction
    const leaderboardData = useMemo(() => {
        return [...quizResponses]
            .filter((r) => r.score !== undefined)
            .sort((a, b) => {
                if ((b.score || 0) !== (a.score || 0)) {
                    return (b.score || 0) - (a.score || 0);
                }
                // Tie breaker: faster time spent
                return a.timeSpentSeconds - b.timeSpentSeconds;
            })
            .slice(0, 10);
    }, [quizResponses]);

    const formatDuration = (seconds: number) => {
        if (!seconds || seconds <= 0) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    };

    // Helper to extract clean respondent name
    const getCandidateName = (resp: FormResponse, index: number) => {
        if (resp.answers['respondent_name']?.value) {
            return String(resp.answers['respondent_name'].value);
        }
        const nameField = Object.values(resp.answers).find((a) =>
            a.fieldLabel?.toLowerCase().includes('name') && typeof a.value === 'string' && a.value.trim().length > 0
        );
        if (nameField?.value) return String(nameField.value);
        if (resp.answers['respondent_email']?.value) {
            return String(resp.answers['respondent_email'].value).split('@')[0];
        }
        return `Candidate #${index + 1}`;
    };

    // Empty state — when no quiz forms exist in workspace
    if (!activeQuiz) {
        return (
            <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
                <div className="text-center py-20 px-6 bg-brand-surface rounded-3xl border border-brand-border shadow-card space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-brand-primary/20 border border-purple-500/30 flex items-center justify-center mx-auto shadow-glow">
                        <HelpCircle className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-brand-text">Quiz & Assessment Hub</h2>
                        <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                            Create your first proctored quiz to configure anti-cheat protection, automatic grading, passing score thresholds, and verified PDF certificates.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                            onClick={handleCreateNewQuiz}
                            className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-glow flex items-center gap-2 hover:opacity-95 transition-all transform active:scale-98"
                        >
                            <Plus className="w-4 h-4" /> Create Blank Quiz
                        </button>
                        <button
                            onClick={() => {
                                if (onOpenAIGenerator) onOpenAIGenerator();
                                else if (onNavigateTab) onNavigateTab('ai');
                            }}
                            className="px-6 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text font-bold text-xs flex items-center gap-2 hover:border-brand-accent/50 hover:bg-brand-surfaceLight transition-all"
                        >
                            <Sparkles className="w-4 h-4 text-brand-accent" /> Generate with AI
                        </button>
                        <button
                            onClick={() => onNavigateTab?.('templates')}
                            className="px-6 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-muted font-bold text-xs flex items-center gap-2 hover:text-brand-text transition-all"
                        >
                            <BookOpen className="w-4 h-4" /> Browse Quiz Templates
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
            {/* Header & Page Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-brand-text flex items-center gap-2.5">
                        <HelpCircle className="w-7 h-7 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span>Interactive Quiz &amp; Assessment Hub</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-muted">
                        Configure proctored anti-cheat security, automatic grading, passing thresholds, and printable PDF certificates
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        onClick={() => setIsCertModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-glow flex items-center space-x-2 transition-all transform active:scale-98"
                    >
                        <Award className="w-4 h-4" />
                        <span>Preview Certificate</span>
                    </button>
                    <button
                        onClick={handleSaveQuizSettings}
                        className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-glow flex items-center space-x-1.5 transition-all transform active:scale-98 ${
                            saved ? 'bg-emerald-600' : 'bg-brand-primary hover:bg-brand-primary/90'
                        }`}
                    >
                        {saved ? <Check className="w-4 h-4" /> : null}
                        <span>{saved ? 'Saved!' : 'Save Quiz Rules'}</span>
                    </button>
                </div>
            </div>

            {/* Active Quiz Selector & Action Toolbar */}
            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">Active Quiz:</span>
                    </div>

                    <div ref={quizDropdownRef} className="relative flex-1 min-w-0 max-w-lg">
                        <button
                            type="button"
                            onClick={() => setIsQuizDropdownOpen(!isQuizDropdownOpen)}
                            className={`w-full px-3.5 py-2.5 bg-brand-bg hover:bg-brand-surfaceLight border rounded-xl flex items-center justify-between text-left transition-all ${
                                isQuizDropdownOpen
                                    ? 'border-brand-primary ring-2 ring-brand-primary/20 shadow-sm'
                                    : 'border-brand-border hover:border-brand-muted/50'
                            }`}
                        >
                            <div className="flex items-center gap-2.5 min-w-0 mr-2">
                                <div className="w-5 h-5 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                    <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-bold text-xs sm:text-sm text-brand-text truncate">
                                    {activeQuiz.title}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                    {activeQuiz.fields.length} Qs • {activeQuiz.responseCount} attempts
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${
                                        isQuizDropdownOpen ? 'rotate-180 text-brand-primary' : ''
                                    }`}
                                />
                            </div>
                        </button>

                        {/* Custom Dropdown Flyout Menu */}
                        {isQuizDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 w-full min-w-[280px] sm:min-w-[340px] bg-brand-surface border border-brand-border rounded-2xl shadow-glow z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                                <div className="px-3 py-2 border-b border-brand-border bg-brand-bg/60 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                                        Select Quiz ({quizForms.length} available)
                                    </span>
                                </div>

                                <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                                    {quizForms.map((q) => {
                                        const isCurrent = q.id === activeQuiz.id;
                                        return (
                                            <button
                                                key={q.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedQuizId(q.id);
                                                    setIsQuizDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                                                    isCurrent
                                                        ? 'bg-brand-primary/10 border border-brand-primary/25 text-brand-primary'
                                                        : 'hover:bg-brand-surfaceLight border border-transparent text-brand-text'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0 mr-3">
                                                    <div
                                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                                            isCurrent ? 'bg-brand-primary' : 'bg-transparent'
                                                        }`}
                                                    />
                                                    <div className="min-w-0">
                                                        <div className={`text-xs font-bold truncate ${isCurrent ? 'text-brand-primary' : 'text-brand-text'}`}>
                                                            {q.title}
                                                        </div>
                                                        <div className="text-[10px] text-brand-muted flex items-center gap-1.5 mt-0.5">
                                                            <span>{q.fields.length} questions</span>
                                                            <span>•</span>
                                                            <span>{q.responseCount} attempts</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {isCurrent && (
                                                    <Check className="w-4 h-4 text-brand-primary shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="p-2 border-t border-brand-border bg-brand-bg/40">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsQuizDropdownOpen(false);
                                            handleCreateNewQuiz();
                                        }}
                                        className="w-full py-2 px-3 rounded-xl bg-brand-surface hover:bg-brand-surfaceLight border border-dashed border-brand-border text-xs font-semibold text-brand-text flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <Plus className="w-3.5 h-3.5 text-brand-primary" />
                                        <span>Create New Assessment</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions for Active Quiz */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                        onClick={handleCopyShareLink}
                        className="px-3.5 py-2 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Copy direct quiz share link"
                    >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-brand-muted" />}
                        <span>{copiedLink ? 'Copied Link!' : 'Share Link'}</span>
                    </button>

                    {onPreviewPublicForm && (
                        <button
                            onClick={() => onPreviewPublicForm(activeQuiz.id)}
                            className="px-3.5 py-2 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-brand-accent" />
                            <span>Take Quiz</span>
                        </button>
                    )}

                    {onEditForm && (
                        <button
                            onClick={() => onEditForm(activeQuiz)}
                            className="px-3.5 py-2 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                            <PenTool className="w-3.5 h-3.5 text-brand-primary" />
                            <span>Edit Questions</span>
                        </button>
                    )}

                    <button
                        onClick={handleCreateNewQuiz}
                        className="px-3 py-2 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight border border-brand-border text-brand-muted hover:text-brand-text text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Create another quiz"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">New Quiz</span>
                    </button>
                </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-card flex flex-col justify-between">
                    <div className="flex items-center justify-between text-brand-muted">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Attempts</span>
                        <BarChart3 className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl sm:text-3xl font-black text-brand-text">{quizResponses.length}</div>
                        <div className="text-[11px] text-brand-muted mt-0.5">Submitted candidates</div>
                    </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-card flex flex-col justify-between">
                    <div className="flex items-center justify-between text-brand-muted">
                        <span className="text-xs font-bold uppercase tracking-wider">Pass Rate</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="mt-3">
                        <div className={`text-2xl sm:text-3xl font-black ${passRate >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {passRate}%
                        </div>
                        <div className="text-[11px] text-brand-muted mt-0.5">{passedCount} of {quizResponses.length} passed</div>
                    </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-card flex flex-col justify-between">
                    <div className="flex items-center justify-between text-brand-muted">
                        <span className="text-xs font-bold uppercase tracking-wider">Avg Score</span>
                        <Trophy className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl sm:text-3xl font-black text-brand-text">
                            {avgScore} <span className="text-xs font-normal text-brand-muted">/ {totalPossiblePoints}</span>
                        </div>
                        <div className="text-[11px] text-brand-muted mt-0.5">
                            {totalPossiblePoints > 0 ? `${Math.round((avgScore / totalPossiblePoints) * 100)}% average` : 'No points calculated'}
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-card flex flex-col justify-between">
                    <div className="flex items-center justify-between text-brand-muted">
                        <span className="text-xs font-bold uppercase tracking-wider">Time Limit</span>
                        <Clock className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl sm:text-3xl font-black text-brand-text">
                            {timeLimit > 0 ? `${timeLimit}m` : 'None'}
                        </div>
                        <div className="text-[11px] text-brand-muted mt-0.5">Countdown proctored</div>
                    </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-card col-span-2 md:col-span-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-brand-muted">
                        <span className="text-xs font-bold uppercase tracking-wider">Integrity Rate</span>
                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="mt-3">
                        <div className={`text-2xl sm:text-3xl font-black ${securityAudit.integrityRate === 100 ? 'text-emerald-500' : 'text-purple-500'}`}>
                            {securityAudit.integrityRate}%
                        </div>
                        <div className="text-[11px] text-brand-muted mt-0.5">
                            {securityAudit.flaggedAttempts} flagged attempts
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Settings: 2 Column Configuration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Proctored Anti-Cheat Safeguards Card */}
                <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-6">
                    <div className="flex items-center space-x-3 pb-2 border-b border-brand-border">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-brand-text">Proctored Anti-Cheat Safeguards</h2>
                            <p className="text-xs text-brand-muted">Prevent tab-switching, unauthorized assistance, and unauthorized copies</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Tab Detection Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/60 border border-brand-border gap-4">
                            <div className="flex items-start gap-3">
                                <Eye className="w-4 h-4 text-brand-accent mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-xs font-bold text-brand-text">Tab-Switching Detection &amp; Warning</div>
                                    <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
                                        Detects window blurring and monitors tab switches. Warns candidates and flags submissions with 3+ violations.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTabAntiCheat(!tabAntiCheat)}
                                aria-label="Toggle tab switching detection"
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                                    tabAntiCheat ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform absolute top-0.5 ${
                                        tabAntiCheat ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Copy / Paste Lock Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-brand-bg/60 border border-brand-border gap-4">
                            <div className="flex items-start gap-3">
                                <Ban className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-xs font-bold text-brand-text">Lock Copy, Cut &amp; Right-Click</div>
                                    <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
                                        Disables clipboard copying, right-click context menu, and text drag-selection during the active quiz attempt.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCopyAntiCheat(!copyAntiCheat)}
                                aria-label="Toggle copy paste protection"
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                                    copyAntiCheat ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform absolute top-0.5 ${
                                        copyAntiCheat ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Time Limit Setting with Chips */}
                        <div className="p-4 rounded-xl bg-brand-bg/60 border border-brand-border space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Timer className="w-4 h-4 text-amber-500" />
                                    <div>
                                        <div className="text-xs font-bold text-brand-text">Quiz Time Limit</div>
                                        <p className="text-[11px] text-brand-muted mt-0.5">Auto-submits assessment when timer expires</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="number"
                                        min={1}
                                        max={180}
                                        value={timeLimit}
                                        onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 10))}
                                        className="w-16 px-2.5 py-1.5 bg-brand-surface border border-brand-border rounded-xl text-center text-xs font-bold text-brand-text focus:border-brand-primary"
                                    />
                                    <span className="text-xs font-semibold text-brand-muted">min</span>
                                </div>
                            </div>

                            {/* Quick Preset Time Chips */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Presets:</span>
                                {[5, 10, 15, 30, 45, 60].map((mins) => (
                                    <button
                                        key={mins}
                                        type="button"
                                        onClick={() => setTimeLimit(mins)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                            timeLimit === mins
                                                ? 'bg-brand-primary text-white shadow-sm'
                                                : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text'
                                        }`}
                                    >
                                        {mins}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Security Incident Summary Badge */}
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-xs text-purple-700 dark:text-purple-300">
                                <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
                                <span>
                                    <strong>{securityAudit.totalViolations}</strong> violation attempt{securityAudit.totalViolations === 1 ? '' : 's'} recorded (
                                    {securityAudit.totalTabSwitches} tab switch, {securityAudit.totalCopyBlocked} copy blocked)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Grading & Certification Settings Card */}
                <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3 pb-2 border-b border-brand-border">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-extrabold text-brand-text">Grading, Feedback &amp; Certification</h2>
                                <p className="text-xs text-brand-muted">Set passing score criteria and verified PDF certificate options</p>
                            </div>
                        </div>

                        {/* Passing Score Slider with Presets */}
                        <div className="p-4 rounded-xl bg-brand-bg/60 border border-brand-border space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-brand-text">
                                <span>Passing Score Threshold</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                    {passPercent}% required
                                </span>
                            </div>

                            <input
                                type="range"
                                min={20}
                                max={100}
                                step={5}
                                value={passPercent}
                                onChange={(e) => setPassPercent(parseInt(e.target.value))}
                                className="w-full accent-brand-primary cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                            />

                            <div className="flex items-center justify-between text-[11px] text-brand-muted">
                                <span>
                                    Candidates need <strong>{Math.ceil((passPercent / 100) * totalPossiblePoints)}</strong> of {totalPossiblePoints} points to pass.
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {[50, 60, 70, 80, 90].map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setPassPercent(preset)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                passPercent === preset
                                                    ? 'bg-brand-primary text-white'
                                                    : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text'
                                            }`}
                                        >
                                            {preset}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Certificate Title Input */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-brand-text">Certificate Award Title</label>
                                <button
                                    type="button"
                                    onClick={() => setIsCertModalOpen(true)}
                                    className="text-[11px] font-semibold text-brand-accent hover:underline flex items-center gap-1"
                                >
                                    <Eye className="w-3 h-3" /> Preview PDF
                                </button>
                            </div>
                            <input
                                type="text"
                                value={certTitle}
                                onChange={(e) => setCertTitle(e.target.value)}
                                placeholder="e.g. Certified Full-Stack Specialist"
                                className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs sm:text-sm text-brand-text font-medium focus:border-brand-primary transition-all"
                            />
                        </div>

                        {/* Toggle Options */}
                        <div className="space-y-3">
                            {/* Auto-generate Certificate Toggle */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg/60 border border-brand-border gap-4">
                                <div className="flex items-center gap-2.5">
                                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                    <div>
                                        <div className="text-xs font-bold text-brand-text">Auto-Issue Verified PDF Certificates</div>
                                        <p className="text-[11px] text-brand-muted mt-0.5">Allows passing participants to download certified PDF credentials</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setGenerateCert(!generateCert)}
                                    aria-label="Toggle certificate generation"
                                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                                        generateCert ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform absolute top-0.5 ${
                                            generateCert ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Show Leaderboard Toggle */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg/60 border border-brand-border gap-4">
                                <div className="flex items-center gap-2.5">
                                    <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                                    <div>
                                        <div className="text-xs font-bold text-brand-text">Display Candidate Leaderboard</div>
                                        <p className="text-[11px] text-brand-muted mt-0.5">Shows ranked top performers after submission</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                                    aria-label="Toggle leaderboard"
                                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                                        showLeaderboard ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform absolute top-0.5 ${
                                            showLeaderboard ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Immediate Feedback Toggle */}
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg/60 border border-brand-border gap-4">
                                <div className="flex items-center gap-2.5">
                                    <Zap className="w-4 h-4 text-brand-accent shrink-0" />
                                    <div>
                                        <div className="text-xs font-bold text-brand-text">Instant Score &amp; Feedback</div>
                                        <p className="text-[11px] text-brand-muted mt-0.5">Reveals correct answers and explanations upon submission</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowFeedback(!showFeedback)}
                                    aria-label="Toggle immediate feedback"
                                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                                        showFeedback ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform absolute top-0.5 ${
                                            showFeedback ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSaveQuizSettings}
                        className={`w-full py-3 rounded-xl font-bold text-xs shadow-glow transition-all transform active:scale-98 ${
                            saved ? 'bg-emerald-600 text-white' : 'bg-brand-primary hover:bg-brand-primary/90 text-white'
                        }`}
                    >
                        {saved ? '✓ Quiz Rules Successfully Saved!' : 'Save Quiz Rules'}
                    </button>
                </div>
            </div>

            {/* Candidate Leaderboard Table */}
            {showLeaderboard && (
                <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                <Trophy className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-brand-text">Official Candidate Leaderboard</h3>
                                <p className="text-xs text-brand-muted">Top performers ranked by points and completion speed</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-bg border border-brand-border text-brand-muted">
                            {leaderboardData.length} Ranked Attempt{leaderboardData.length === 1 ? '' : 's'}
                        </span>
                    </div>

                    {leaderboardData.length > 0 ? (
                        <div className="space-y-2.5 pt-1">
                            {leaderboardData.map((resp, idx) => {
                                const candidateName = getCandidateName(resp, idx);
                                const isPassing = resp.passed ?? (resp.score !== undefined && (resp.score / (resp.totalPossiblePoints || 1)) * 100 >= passPercent);
                                const isFlagged = resp.tags?.some((t) => t.toLowerCase().includes('flagged'));

                                return (
                                    <div
                                        key={resp.id}
                                        className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg/60 border border-brand-border hover:border-brand-primary/30 transition-all gap-4"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            {/* Rank Podium Badge */}
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                                    idx === 0
                                                        ? 'bg-amber-400 text-amber-950 shadow-sm'
                                                        : idx === 1
                                                        ? 'bg-slate-300 text-slate-800'
                                                        : idx === 2
                                                        ? 'bg-amber-700 text-amber-100'
                                                        : 'bg-brand-surface border border-brand-border text-brand-muted'
                                                }`}
                                            >
                                                {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : idx + 1}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-brand-text truncate">
                                                        {candidateName}
                                                    </span>
                                                    {isFlagged && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-0.5">
                                                            <AlertTriangle className="w-3 h-3" /> Flagged
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-brand-muted flex items-center gap-2 mt-0.5">
                                                    <span>Attempt {new Date(resp.submittedAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {formatDuration(resp.timeSpentSeconds)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <div className="text-sm font-black text-brand-text">
                                                    {resp.score ?? 0}{' '}
                                                    <span className="text-xs font-semibold text-brand-muted">
                                                        / {resp.totalPossiblePoints || totalPossiblePoints}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] font-bold text-brand-accent">
                                                    {Math.round(((resp.score || 0) / (resp.totalPossiblePoints || totalPossiblePoints || 1)) * 100)}%
                                                </div>
                                            </div>

                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    isPassing
                                                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                                        : 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30'
                                                }`}
                                            >
                                                {isPassing ? 'Passed' : 'Failed'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4 rounded-xl bg-brand-bg/40 border border-dashed border-brand-border space-y-2">
                            <Trophy className="w-8 h-8 text-amber-500/40 mx-auto" />
                            <h4 className="text-sm font-bold text-brand-text">No Leaderboard Submissions Yet</h4>
                            <p className="text-xs text-brand-muted max-w-sm mx-auto">
                                Once candidates submit answers to this quiz, their scores, percentage, and time will appear here automatically.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Certificate Modal Preview */}
            <CertificateModal
                isOpen={isCertModalOpen}
                onClose={() => setIsCertModalOpen(false)}
                recipientName="Sarah Jenkins (Sample Participant)"
                quizTitle={activeQuiz.title}
                certificateTitle={certTitle}
                scorePercentage={passPercent}
                completedDate={new Date().toLocaleDateString()}
            />
        </div>
    );
};
export default QuizHubPage;
