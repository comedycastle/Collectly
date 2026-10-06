import React, { useState } from 'react';
import {
    Plus, Search, Sparkles, Filter, MoreVertical, Share2, Eye,
    BarChart2, Copy, Trash2, HelpCircle, CheckCircle2, Clock, Users, FileText
} from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { Form, FormCategory } from '../types';
import { PublishModal } from '../components/PublishModal';

interface Props {
    onEditForm: (form: Form) => void;
    onOpenAIGenerator: () => void;
    onNavigateTab: (tab: any) => void;
}

export const DashboardPage: React.FC<Props> = ({ onEditForm, onOpenAIGenerator, onNavigateTab }) => {
    const { forms, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, createForm, duplicateForm, deleteForm } = useCollectlyStore();
    const [selectedFormForPublish, setSelectedFormForPublish] = useState<Form | null>(null);

    const categories: Array<FormCategory | 'All' | 'Quiz'> = ['All', 'General', 'Feedback', 'Survey', 'Registration', 'Lead Generation', 'Application', 'Quiz'];

    const getEffectiveCompletionRate = (form: Form): number => {
        // Stored completion_rate is never updated by the backend (always 0),
        // so a form that actually has submissions must have completed them.
        if (form.completionRate > 0) return form.completionRate;
        if (form.responseCount > 0) return 100;
        return 0;
    };

    const filteredForms = forms.filter((form) => {
        const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            form.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All'
            ? true
            : selectedCategory === 'Quiz'
                ? form.isQuiz
                : form.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalSubmissions = forms.reduce((acc, f) => acc + (f.responseCount || 0), 0);
    const totalQuizzes = forms.filter((f) => f.isQuiz).length;
    const avgCompletionRate = forms.length > 0
        ? (forms.reduce((acc, f) => acc + getEffectiveCompletionRate(f), 0) / forms.length).toFixed(1)
        : '0';
    const hasAnySubmissions = totalSubmissions > 0;
    const avgTimeSeconds = forms.length > 0
        ? Math.round(forms.reduce((acc, f) => acc + (f.averageTimeSeconds || 0), 0) / forms.length)
        : 0;
    const formatAvgTime = (secs: number): string => {
        if (!secs || secs <= 0) return '—';
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        if (m === 0) return `${s}s`;
        return `${m}m ${s.toString().padStart(2, '0')}s`;
    };

    const handleCreateBlank = () => {
        const newForm = createForm({ title: 'Untitled Form', category: 'General' as FormCategory });
        onEditForm(newForm);
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
            {/* Top Banner & Quick Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-2xl bg-brand-surface border border-brand-border shadow-sm relative overflow-hidden">
                <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                        <span>AI-Driven Form Platform</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-brand-text">Forms & Quiz Dashboard</h2>
                    <p className="text-sm text-brand-muted max-w-xl">
                        Create high-converting forms, interactive quizzes, and automated sentiment surveys powered by AI.
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10 shrink-0">
                    <button
                        onClick={onOpenAIGenerator}
                        className="px-5 py-3 rounded-xl bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs shadow-glow flex items-center space-x-2 transition-all"
                    >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>AI Prompt Generator</span>
                    </button>
                    <button
                        onClick={handleCreateBlank}
                        className="px-5 py-3 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight text-brand-text font-semibold text-xs border border-brand-border flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="w-4 h-4 text-brand-primary" />
                        <span>New Blank Form</span>
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-between shadow-card">
                    <div>
                        <div className="text-xs font-semibold text-brand-muted">Total Forms</div>
                        <div className="text-2xl font-black text-brand-text mt-1">{forms.length}</div>
                        <div className="text-[11px] text-brand-accent mt-0.5">{totalQuizzes > 0 ? `${totalQuizzes} Active ${totalQuizzes === 1 ? 'Quiz' : 'Quizzes'}` : 'No quizzes yet'}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <FileText className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-between shadow-card">
                    <div>
                        <div className="text-xs font-semibold text-brand-muted">Total Submissions</div>
                        <div className="text-2xl font-black text-brand-text mt-1">{totalSubmissions}</div>
                        <div className={`text-[11px] font-semibold mt-0.5 ${hasAnySubmissions ? 'text-emerald-600' : 'text-brand-muted'}`}>{hasAnySubmissions ? '+14% vs last week' : 'No submissions yet'}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-between shadow-card">
                    <div>
                        <div className="text-xs font-semibold text-brand-muted">Avg Completion Rate</div>
                        <div className="text-2xl font-black text-brand-text mt-1">{avgCompletionRate}%</div>
                        <div className={`text-[11px] font-semibold mt-0.5 ${hasAnySubmissions ? 'text-brand-accent' : 'text-brand-muted'}`}>{hasAnySubmissions ? 'High Conversion' : 'No data yet'}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-between shadow-card">
                    <div>
                        <div className="text-xs font-semibold text-brand-muted">Avg Completion Time</div>
                        <div className="text-2xl font-black text-brand-text mt-1">{formatAvgTime(avgTimeSeconds)}</div>
                        <div className="text-[11px] text-brand-muted mt-0.5">{avgTimeSeconds > 0 ? 'Optimal Engagement' : 'No data yet'}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Category Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-brand-primary text-white shadow-glow'
                                : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-muted'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter forms..."
                            className="pl-9 pr-4 py-2 bg-brand-surface border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted focus:border-brand-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Forms Grid */}
            {filteredForms.length === 0 ? (
                <div className="text-center py-16 bg-brand-surface rounded-2xl border border-dashed border-brand-border space-y-4">
                    <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-text">No Forms Found</h3>
                        <p className="text-xs text-brand-muted max-w-sm mx-auto mt-1">
                            Create a new form or quiz using our AI prompt generator or start from scratch.
                        </p>
                    </div>
                    <button
                        onClick={onOpenAIGenerator}
                        className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-medium text-xs inline-flex items-center gap-2 shadow-glow"
                    >
                        <Sparkles className="w-4 h-4" /> Generate Form with AI
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredForms.map((form) => (
                        <div
                            key={form.id}
                            className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-primary/50 transition-all group flex flex-col justify-between shadow-card hover:-translate-y-1 relative"
                        >
                            {/* Form Card Header */}
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${form.isQuiz
                                            ? 'bg-purple-500/10 text-purple-600 border border-purple-200'
                                            : 'bg-brand-accent/10 text-brand-accent border border-cyan-200'
                                            }`}>
                                            {form.isQuiz ? 'Quiz Mode' : form.category}
                                        </span>
                                        <span className={`w-2 h-2 rounded-full ${form.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>

                                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => duplicateForm(form.id)}
                                            title="Duplicate Form"
                                            className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => deleteForm(form.id)}
                                            title="Delete Form"
                                            className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-brand-surfaceLight"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary transition-colors line-clamp-1">
                                        {form.title}
                                    </h3>
                                    <p className="text-xs text-brand-muted line-clamp-2 mt-1 min-h-[32px]">
                                        {form.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* Form Stats Footer */}
                            <div className="mt-6 pt-4 border-t border-brand-border space-y-4">
                                <div className="flex items-center justify-between text-xs text-brand-muted">
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-3.5 h-3.5 text-brand-accent" />
                                        <span><strong className="text-brand-text">{form.responseCount}</strong> submissions</span>
                                    </div>
                                    <div className="text-[11px] font-semibold text-emerald-600">
                                        {getEffectiveCompletionRate(form)}% completion
                                    </div>
                                </div>

                                {/* Primary Card Buttons */}
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => onEditForm(form)}
                                        className="py-2 px-3 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight text-brand-text text-xs font-semibold border border-brand-border transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => onNavigateTab('responses')}
                                        className="py-2 px-3 rounded-xl bg-brand-bg hover:bg-brand-surfaceLight text-brand-text text-xs font-semibold border border-brand-border transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <BarChart2 className="w-3.5 h-3.5 text-brand-accent" />
                                        <span>Data</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedFormForPublish(form)}
                                        className="py-2 px-3 rounded-xl bg-brand-primary text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1 shadow-glow"
                                    >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Publish Modal */}
            {selectedFormForPublish && (
                <PublishModal
                    form={selectedFormForPublish}
                    isOpen={!!selectedFormForPublish}
                    onClose={() => setSelectedFormForPublish(null)}
                />
            )}
        </div>
    );
};
