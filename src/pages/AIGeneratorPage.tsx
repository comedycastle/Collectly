import React, { useState } from 'react';
import {
    Sparkles, Bot, ArrowRight, Zap, FileUp, X, CheckCircle2, AlertCircle, Trash2, Save,
    RefreshCw, SlidersHorizontal, ChevronDown, Check, Wand2, Star, Clock, FileText,
    HelpCircle, ShieldCheck, Layers, Hash, Award, CornerDownLeft, Plus, CheckSquare
} from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { generateFormWithAI, FREE_MODELS, AITone, QuizDifficulty, ProviderAttempt } from '../services/aiService';
import { FormCategory, FormField } from '../types';

interface Props {
    onFormGenerated: () => void;
}

interface GeneratedPreview {
    title: string;
    description: string;
    category: FormCategory;
    isQuiz: boolean;
    fields: FormField[];
    providerUsed: string;
    attempts?: ProviderAttempt[];
    enhancedPrompt?: string;
}

export const AIGeneratorPage: React.FC<Props> = ({ onFormGenerated }) => {
    const { createForm, updateForm, aiConfig } = useCollectlyStore();
    const [prompt, setPrompt] = useState('');
    const [isQuiz, setIsQuiz] = useState(false);
    const [category, setCategory] = useState<FormCategory | 'Auto'>('Auto');
    const [fieldCount, setFieldCount] = useState(5);
    const [docText, setDocText] = useState('');
    const [docName, setDocName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [preview, setPreview] = useState<GeneratedPreview | null>(null);
    const [error, setError] = useState('');
    const [tone, setTone] = useState<AITone>('Professional');
    const [includeContact, setIncludeContact] = useState(true);
    const [strictValidation, setStrictValidation] = useState(true);
    const [difficulty, setDifficulty] = useState<QuizDifficulty>('Mixed');
    const [pointsPerQuestion, setPointsPerQuestion] = useState(10);
    const [passPercentage, setPassPercentage] = useState(70);
    const [timeLimit, setTimeLimit] = useState(10);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showAttempts, setShowAttempts] = useState(false);

    const clampFieldCount = (v: number) => (Number.isNaN(v) ? 2 : Math.min(15, Math.max(2, Math.round(v))));

    const providers = [
        { id: 'gemini', label: 'Google Gemini', model: FREE_MODELS.gemini, key: aiConfig.geminiKey, free: '1.5 Flash (Free Tier)', badge: 'Recommended' },
        { id: 'openrouter', label: 'OpenRouter', model: FREE_MODELS.openrouter, key: aiConfig.openrouterKey, free: 'Llama 3.1 8B (Free)', badge: 'Fallback 1' },
        { id: 'groq', label: 'Groq Cloud', model: FREE_MODELS.groq, key: aiConfig.groqKey, free: 'Llama 3.1 8B (Free)', badge: 'Ultra-Fast' },
    ];
    const configuredCount = providers.filter((p) => p.key).length;

    const samplePrompts = [
        {
            title: 'Interactive React & TypeScript Quiz',
            desc: '5 graded multiple-choice questions on React hooks and state management with email and confidence rating fields',
            tag: 'Quiz • Graded',
            isQuiz: true,
            icon: HelpCircle
        },
        {
            title: 'SaaS Customer CSAT & Feedback Survey',
            desc: 'Customer satisfaction survey with full name, work email, Net Promoter Score (NPS), star rating, and open-ended feedback fields',
            tag: 'Survey • Feedback',
            isQuiz: false,
            icon: Star
        },
        {
            title: 'Tech Conference & Summit Registration',
            desc: 'Event registration with attendee name, work email, phone number, dietary preference radio choices, ticket type dropdown, and terms checkbox',
            tag: 'Event • Registration',
            isQuiz: false,
            icon: Layers
        },
        {
            title: 'Senior Developer Job Application',
            desc: 'Job application with full name, email, portfolio URL, resume file upload, years-of-experience dropdown, and short answer questions',
            tag: 'HR • Recruitment',
            isQuiz: false,
            icon: FileText
        },
    ];

    const quickKeywords = [
        { label: '+ NPS Scale', text: 'include Net Promoter Score (NPS 0-10) question' },
        { label: '+ Star Rating', text: 'include 5-star satisfaction rating' },
        { label: '+ File Upload', text: 'add resume or document file upload field' },
        { label: '+ Multiple Choice', text: 'include 4-option multiple choice questions' },
        { label: '+ Contact Block', text: 'capture full name, work email, and phone' },
        { label: '+ Signature', text: 'add digital signature verification' },
    ];

    const handleAddKeyword = (kwText: string) => {
        setPrompt((prev) => (prev ? `${prev.trim()}, and ${kwText}` : kwText));
    };

    const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            setDocText(text.slice(0, 8000));
            setDocName(file.name);
        } catch {
            setError('Could not read that document. Try a .txt, .md, .csv or .json file.');
        }
    };

    const handleGenerate = async (promptText: string, quizMode: boolean) => {
        if (!promptText.trim()) return;
        setIsGenerating(true);
        setError('');
        setPreview(null);
        try {
            const result = await generateFormWithAI({
                prompt: promptText,
                isQuiz: quizMode,
                category,
                fieldCount,
                context: docText || undefined,
                tone,
                includeContact,
                strictValidation,
                difficulty,
                pointsPerQuestion,
            });
            setPreview({
                title: result.title,
                description: result.description,
                category: result.category,
                isQuiz: result.isQuiz,
                fields: result.fields,
                providerUsed: result.providerUsed,
                attempts: result.attempts,
                enhancedPrompt: result.enhancedPrompt,
            });
            if (result.providerUsed === 'fallback') {
                const failed = (result.attempts || [])
                    .filter((a) => a.status === 'failed')
                    .map((a) => `${a.provider}: ${a.detail}`)
                    .join(' | ');
                setError(
                    failed
                        ? `Live models unavailable — switched to Smart Local Engine. Details: ${failed}`
                        : 'Live models unavailable — switched to Smart Local Engine. Add a free API key for live generation.'
                );
            }
        } catch (err: any) {
            setError(err.message || 'AI generation failed. Check your API keys or try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!preview) return;
        const newForm = createForm({
            title: preview.title,
            description: preview.description,
            category: preview.category,
            isQuiz: preview.isQuiz,
            fields: preview.fields,
        });
        // Apply quiz-mode customizations to the created form
        if (preview.isQuiz) {
            updateForm(newForm.id, {
                settings: {
                    ...newForm.settings,
                    showTimerCountdown: timeLimit > 0,
                    quiz: {
                        ...newForm.settings.quiz,
                        enabled: true,
                        passPercentage,
                        timeLimitMinutes: timeLimit,
                    },
                    totalPages: 1,
                },
            });
        }
        setPreview(null);
        onFormGenerated();
    };

    const removePreviewField = (id: string) => {
        if (!preview) return;
        setPreview({ ...preview, fields: preview.fields.filter((f) => f.id !== id) });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            if (prompt.trim() && !isGenerating) {
                handleGenerate(prompt, isQuiz);
            }
        }
    };

    return (
        <div className="p-6 sm:p-10 space-y-10 max-w-5xl mx-auto animate-in fade-in duration-300">
            {/* Header Hero Section */}
            <div className="text-center space-y-4 relative">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-primary/10 via-purple-500/10 to-brand-accent/10 border border-brand-primary/20 text-xs font-semibold text-brand-primary shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                    <span>Multi-Provider AI Engine • Zero-Downtime Fallback Architecture</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-text tracking-tight leading-tight">
                        AI Form &amp; Quiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-purple-600 to-brand-accent">Studio</span>
                    </h1>
                    <p className="text-sm sm:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
                        Describe what you need in plain English. The AI automatically designs questions, validates types, configures grading logic, and generates ready-to-publish forms.
                    </p>
                </div>
            </div>

            {/* Provider Status Indicator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {providers.map((p) => (
                    <div
                        key={p.id}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                            p.key
                                ? 'bg-brand-surface border-emerald-500/30 shadow-card hover:border-emerald-500/50'
                                : 'bg-brand-surface/70 border-brand-border hover:border-brand-border/80'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-text flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${p.key ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                                {p.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                p.key ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-brand-bg text-brand-muted border border-brand-border'
                            }`}>
                                {p.badge}
                            </span>
                        </div>
                        <div className="text-[11px] text-brand-muted mt-1 font-mono truncate">{p.model}</div>
                        <div className="flex items-center justify-between text-[10px] font-medium mt-2 pt-2 border-t border-brand-border/60">
                            <span className={p.key ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-brand-muted'}>
                                {p.key ? '✓ Connected' : 'Not configured'}
                            </span>
                            <span className="text-brand-muted text-[10px]">{p.free}</span>
                        </div>
                    </div>
                ))}
            </div>

            {configuredCount === 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                        <span>
                            No external AI API keys found. <strong>Smart Local Engine</strong> is active and will generate full schemas offline without API costs.
                        </span>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-muted shrink-0 hidden sm:inline">Free models supported</span>
                </div>
            )}

            {/* Main Interactive Studio Canvas */}
            <div className="p-6 sm:p-8 rounded-3xl bg-brand-surface border border-brand-border shadow-glow space-y-6">
                
                {/* Prompt Textarea Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-brand-text uppercase tracking-wider flex items-center gap-2">
                            <Wand2 className="w-3.5 h-3.5 text-brand-primary" />
                            <span>Natural Language Prompt</span>
                        </label>
                        <span className="text-[11px] font-semibold text-brand-muted">
                            Press <kbd className="px-1.5 py-0.5 rounded bg-brand-bg border border-brand-border text-[10px] font-mono">Ctrl+Enter</kbd> to generate
                        </span>
                    </div>

                    <div className="relative group">
                        <textarea
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. Create a 5-question Full-Stack assessment quiz with React hooks, TypeScript types, email capture, and 10 points per question with pass threshold..."
                            className="w-full p-4 sm:p-5 bg-brand-bg border border-brand-border rounded-2xl text-sm text-brand-text placeholder-brand-muted/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none leading-relaxed"
                        />
                        {prompt && (
                            <button
                                type="button"
                                onClick={() => setPrompt('')}
                                className="absolute right-3.5 top-3.5 p-1 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight transition-colors"
                                title="Clear prompt"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Quick Keyword Inserters */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mr-1">Quick Add:</span>
                        {quickKeywords.map((kw) => (
                            <button
                                key={kw.label}
                                type="button"
                                onClick={() => handleAddKeyword(kw.text)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-brand-bg hover:bg-brand-surfaceLight border border-brand-border hover:border-brand-primary/40 text-brand-text transition-all"
                            >
                                {kw.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Primary Parameters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {/* Category Selector */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                            Form Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs font-semibold text-brand-text focus:border-brand-primary transition-all"
                        >
                            <option value="Auto">Auto-Detect from Prompt</option>
                            <option value="Survey">Survey</option>
                            <option value="Quiz">Quiz</option>
                            <option value="Registration">Registration</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Application">Application</option>
                            <option value="Lead Generation">Lead Generation</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    {/* Number of Fields Stepper */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                                Field Count
                            </label>
                            <span className="text-xs font-black text-brand-primary">{fieldCount} Fields</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setFieldCount((c) => Math.max(2, c - 1))}
                                className="w-9 h-9 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center font-bold text-sm text-brand-text hover:bg-brand-surfaceLight transition-colors"
                            >
                                −
                            </button>
                            <input
                                type="range"
                                min={2}
                                max={15}
                                value={fieldCount}
                                onChange={(e) => setFieldCount(Number(e.target.value))}
                                className="flex-1 accent-brand-primary cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setFieldCount((c) => Math.min(15, c + 1))}
                                className="w-9 h-9 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center font-bold text-sm text-brand-text hover:bg-brand-surfaceLight transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Reference Document Dropzone */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                            Reference File (Optional)
                        </label>
                        <label className="flex items-center justify-between px-3.5 py-2.5 bg-brand-bg border border-brand-border hover:border-brand-primary/50 rounded-xl text-xs text-brand-muted cursor-pointer transition-colors group">
                            <span className="flex items-center gap-2 min-w-0">
                                <FileUp className="w-4 h-4 text-brand-accent shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="truncate text-brand-text font-medium">
                                    {docName || 'Upload .txt, .md, .csv'}
                                </span>
                            </span>
                            <input
                                type="file"
                                accept=".txt,.md,.csv,.json"
                                onChange={handleDocUpload}
                                className="hidden"
                            />
                            {docName && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDocText('');
                                        setDocName('');
                                    }}
                                    className="p-0.5 text-red-500 hover:text-red-700"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </label>
                    </div>
                </div>

                {docText && (
                    <div className="p-3 rounded-xl bg-brand-bg/80 border border-brand-border flex items-center justify-between text-xs text-brand-muted">
                        <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                            <span className="truncate">Attached context: <em>"{docText.slice(0, 100)}…"</em></span>
                        </div>
                        <span className="text-[10px] font-mono shrink-0 ml-2">{docText.length} chars</span>
                    </div>
                )}

                {/* Collapsible Advanced Generation Options */}
                <div className="pt-1">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-brand-bg hover:bg-brand-surfaceLight border border-brand-border text-xs font-bold text-brand-text transition-all"
                    >
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
                            <span>Fine-Tuning Parameters (Tone, Validation, Grading Rules)</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-brand-muted transition-transform duration-200 ${showAdvanced ? 'rotate-180 text-brand-primary' : ''}`} />
                    </button>

                    {showAdvanced && (
                        <div className="mt-3 p-5 rounded-2xl bg-brand-bg/60 border border-brand-border space-y-5 animate-in fade-in-0 duration-200">
                            <div>
                                <div className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2.5">
                                    Persona &amp; Validation Controls
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Tone Preset Chips */}
                                    <div className="space-y-1 sm:col-span-1">
                                        <label className="text-[10px] font-bold text-brand-muted uppercase">Tone of Voice</label>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {(['Professional', 'Friendly', 'Playful', 'Formal'] as AITone[]).map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setTone(t)}
                                                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                                                        tone === t
                                                            ? 'bg-brand-primary text-white shadow-sm'
                                                            : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Feature Toggles */}
                                    <div className="sm:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold text-brand-muted uppercase">Behavior Rules</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <label className="flex items-center justify-between p-3 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold cursor-pointer hover:border-brand-primary/40 transition-colors">
                                                <span>Contact Block First (Name/Email)</span>
                                                <input
                                                    type="checkbox"
                                                    checked={includeContact}
                                                    onChange={(e) => setIncludeContact(e.target.checked)}
                                                    className="w-4 h-4 accent-brand-primary rounded"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-3 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold cursor-pointer hover:border-brand-primary/40 transition-colors">
                                                <span>Strict Validation &amp; Regex</span>
                                                <input
                                                    type="checkbox"
                                                    checked={strictValidation}
                                                    onChange={(e) => setStrictValidation(e.target.checked)}
                                                    className="w-4 h-4 accent-brand-primary rounded"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quiz Specific Parameters when Quiz Mode is toggled */}
                            {isQuiz ? (
                                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                                    <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        <span>Assessment Rules (Active in Quiz Mode)</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-brand-muted mb-1">Difficulty</label>
                                            <select
                                                value={difficulty}
                                                onChange={(e) => setDifficulty(e.target.value as any)}
                                                className="w-full px-2.5 py-1.5 bg-brand-surface border border-brand-border rounded-lg text-xs font-semibold text-brand-text"
                                            >
                                                <option>Mixed</option>
                                                <option>Easy</option>
                                                <option>Medium</option>
                                                <option>Hard</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-brand-muted mb-1">Points / Question</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={25}
                                                value={pointsPerQuestion}
                                                onChange={(e) => setPointsPerQuestion(Math.min(25, Math.max(1, Number(e.target.value) || 1)))}
                                                className="w-full px-2.5 py-1.5 bg-brand-surface border border-brand-border rounded-lg text-xs font-bold text-center text-brand-text"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-brand-muted mb-1">Pass Threshold ({passPercentage}%)</label>
                                            <input
                                                type="range"
                                                min={50}
                                                max={100}
                                                step={5}
                                                value={passPercentage}
                                                onChange={(e) => setPassPercentage(Number(e.target.value))}
                                                className="w-full accent-brand-primary h-2 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-brand-muted mb-1">Time Limit (mins)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={180}
                                                value={timeLimit}
                                                onChange={(e) => setTimeLimit(Math.min(180, Math.max(1, Number(e.target.value) || 1)))}
                                                className="w-full px-2.5 py-1.5 bg-brand-surface border border-brand-border rounded-lg text-xs font-bold text-center text-brand-text"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[11px] text-brand-muted text-center pt-1">
                                    💡 Toggle <strong>Quiz Mode</strong> below to customize difficulty, pass thresholds, points, and timers.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Primary Action Button Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-brand-border">
                    <button
                        type="button"
                        onClick={() => setIsQuiz(!isQuiz)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                            isQuiz
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 shadow-sm'
                                : 'bg-brand-bg border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight'
                        }`}
                    >
                        <Zap className={`w-4 h-4 ${isQuiz ? 'text-purple-500 fill-purple-500/20' : 'text-brand-muted'}`} />
                        <span>{isQuiz ? 'Quiz Mode Active (Grading & Logic)' : 'Standard Form / Survey Mode'}</span>
                    </button>

                    <button
                        onClick={() => handleGenerate(prompt, isQuiz)}
                        disabled={isGenerating || !prompt.trim()}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary via-purple-600 to-brand-accent hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-glow flex items-center justify-center space-x-2 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isGenerating ? (
                            <>
                                <Bot className="w-4 h-4 animate-spin" />
                                <span>Generating Schema with AI…</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Generate Form Now</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Generated Schema Live Preview */}
            {preview && (
                <div className="p-6 sm:p-8 rounded-3xl bg-brand-surface border border-brand-accent/40 shadow-glow space-y-6 animate-in zoom-in-95 duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <h2 className="text-xl font-black text-brand-text">{preview.title}</h2>
                            </div>
                            <p className="text-xs text-brand-muted">{preview.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-accent/10 text-brand-accent border border-brand-accent/25">
                                Generated via {preview.providerUsed}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/25">
                                {preview.category}{preview.isQuiz ? ' • Quiz' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Field Cards Preview */}
                    <div className="space-y-2.5">
                        <div className="text-xs font-bold text-brand-muted uppercase tracking-wider px-1">
                            Generated Schema Fields ({preview.fields.length})
                        </div>
                        {preview.fields.map((f, i) => (
                            <div
                                key={f.id}
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-bg border border-brand-border hover:border-brand-primary/30 transition-all gap-4"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="w-6 h-6 rounded-lg bg-brand-surface border border-brand-border text-[11px] font-black text-brand-primary flex items-center justify-center shrink-0">
                                        {i + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs sm:text-sm font-bold text-brand-text truncate">
                                                {f.label}
                                            </span>
                                            {f.required && (
                                                <span className="text-red-500 text-xs font-bold" title="Required">*</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5">
                                            <span className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-mono font-bold">
                                                {f.type}
                                            </span>
                                            {f.points ? (
                                                <span className="font-bold text-amber-500">
                                                    ★ {f.points} points
                                                </span>
                                            ) : null}
                                            {f.placeholder && (
                                                <span className="truncate hidden sm:inline text-brand-muted/70">
                                                    Placeholder: "{f.placeholder}"
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removePreviewField(f.id)}
                                    className="p-1.5 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                                    title="Remove this field"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Preview CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => handleGenerate(prompt, isQuiz)}
                            disabled={isGenerating}
                            className="flex-1 py-3 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight border border-brand-border text-brand-text text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                            <span>Regenerate Schema</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-extrabold shadow-glow flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save to Form Builder ({preview.fields.length} Fields)</span>
                        </button>
                    </div>

                    {/* Provider Diagnostics Collapsible */}
                    {preview.attempts && preview.attempts.length > 0 && (
                        <div className="pt-2 border-t border-brand-border">
                            <button
                                type="button"
                                onClick={() => setShowAttempts(!showAttempts)}
                                className="text-[11px] font-bold text-brand-muted hover:text-brand-text flex items-center gap-1.5"
                            >
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAttempts ? 'rotate-180' : ''}`} />
                                <span>{showAttempts ? 'Hide' : 'Show'} Provider Diagnostic Logs ({preview.attempts.length})</span>
                            </button>

                            {showAttempts && (
                                <div className="mt-2.5 space-y-1.5 animate-in fade-in">
                                    {preview.attempts.map((a, i) => (
                                        <div
                                            key={i}
                                            className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 font-mono ${
                                                a.status === 'success'
                                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                    : a.status === 'skipped-no-key'
                                                    ? 'bg-brand-bg border-brand-border text-brand-muted'
                                                    : 'bg-red-500/5 border-red-500/20 text-red-500'
                                            }`}
                                        >
                                            <span className="font-bold">{a.provider}</span>
                                            <span className="truncate">{a.status}: {a.detail}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {preview.enhancedPrompt && (
                        <details className="text-[11px] text-brand-muted pt-1">
                            <summary className="cursor-pointer font-bold hover:text-brand-text">View Engineered System Prompt</summary>
                            <pre className="mt-1.5 p-3 rounded-xl bg-brand-bg border border-brand-border whitespace-pre-wrap font-mono text-[10px] max-h-48 overflow-y-auto">
                                {preview.enhancedPrompt}
                            </pre>
                        </details>
                    )}
                </div>
            )}

            {/* Inspiration Prompt Library */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                        <span>Pre-Made Inspiration Prompts</span>
                    </h3>
                    <span className="text-[11px] text-brand-muted">Click any prompt to load &amp; customize</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {samplePrompts.map((p, i) => {
                        const Icon = p.icon;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    setPrompt(p.desc);
                                    setIsQuiz(p.isQuiz);
                                    window.scrollTo({ top: 120, behavior: 'smooth' });
                                }}
                                className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-primary/50 text-left transition-all group shadow-card hover:shadow-glow cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                                            {p.title}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        p.isQuiz
                                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                            : 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'
                                    }`}>
                                        {p.tag}
                                    </span>
                                </div>
                                <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-2">
                                    {p.desc}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default AIGeneratorPage;
