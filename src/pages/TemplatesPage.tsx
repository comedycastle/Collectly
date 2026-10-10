import React, { useState, useMemo, useEffect } from 'react';
import { LayoutTemplate, Search, ArrowRight, Sparkles, X, GitBranch, Star, CheckCircle2, Eye } from 'lucide-react';
import { formTemplates, FormTemplate, instantiateTemplate, templateStats, fetchTemplatesFromSupabase, seedTemplatesToSupabase } from '../services/templateService';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { FormCategory } from '../types';

interface Props {
    onTemplateSelect: (template: FormTemplate) => void;
    onOpenAIGenerator: () => void;
}

type SortKey = 'popular' | 'rating' | 'az' | 'fields' | 'quizzes';

export const TemplatesPage: React.FC<Props> = ({ onTemplateSelect, onOpenAIGenerator }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<FormCategory | 'All'>('All');
    const [sort, setSort] = useState<SortKey>('popular');
    const [previewTpl, setPreviewTpl] = useState<FormTemplate | null>(null);
    const [library, setLibrary] = useState<FormTemplate[]>(formTemplates);
    const { createForm } = useCollectlyStore();

    const stats = useMemo(() => templateStats(), []);
    const categories: Array<FormCategory | 'All'> = ['All', 'Feedback', 'Quiz', 'Survey', 'Registration', 'Lead Generation', 'Application', 'General'];

    useEffect(() => {
        (async () => {
            try {
                let remote = await fetchTemplatesFromSupabase();
                if (remote.length === 0) {
                    await seedTemplatesToSupabase();
                    remote = await fetchTemplatesFromSupabase();
                }
                if (remote.length > formTemplates.length) setLibrary(remote);
            } catch {
                // offline or library unavailable — built-in library already rendered
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        let list = library.filter((t) => {
            const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
            const matchQ = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.fields.some((f: any) => String(f.label || '').toLowerCase().includes(q));
            return matchCat && matchQ;
        });
        switch (sort) {
            case 'popular': list = [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); break;
            case 'rating': list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            case 'az': list = [...list].sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'fields': list = [...list].sort((a, b) => b.fields.length - a.fields.length); break;
            case 'quizzes': list = [...list].sort((a, b) => Number(b.isQuiz) - Number(a.isQuiz)); break;
        }
        return list;
    }, [library, searchQuery, selectedCategory, sort]);

    const handleUseTemplate = (template: FormTemplate) => {
        const payload = instantiateTemplate(template);
        const newForm = createForm(payload as any);
        setPreviewTpl(null);
        onTemplateSelect(template);
        void newForm;
    };

    const logicCount = (t: FormTemplate) => t.fields.reduce((acc: number, f: any) => acc + ((f.logicRules || []).length), 0);
    const pointsTotal = (t: FormTemplate) => t.fields.reduce((acc: number, f: any) => acc + (f.points || 0), 0);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-brand-text flex items-center gap-2">
                        <LayoutTemplate className="w-6 h-6 text-brand-primary" /> Template Gallery
                    </h2>
                    <p className="text-xs text-brand-muted mt-1">
                        {stats.total} ready-to-use templates • {stats.withLogic} with conditional logic • {stats.quizzes} graded quizzes — every template ships with validation, logic rules and one-click setup
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={onOpenAIGenerator} className="px-5 py-2.5 rounded-xl bg-brand-gradient text-white font-semibold text-xs shadow-glow flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Generate with AI</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Templates', value: stats.total },
                    { label: 'With Logic Rules', value: stats.withLogic },
                    { label: 'Quizzes', value: stats.quizzes },
                    { label: 'Showing', value: filtered.length },
                ].map((s) => (
                    <div key={s.label} className="p-4 rounded-2xl bg-brand-surface border border-brand-border text-center">
                        <div className="text-xl font-black text-brand-text">{s.value}</div>
                        <div className="text-[11px] text-brand-muted">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {categories.map((cat) => {
                        const count = cat === 'All' ? library.length : library.filter((t) => t.category === cat).length;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-brand-primary text-white shadow-glow' : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text'}`}
                            >
                                {cat} <span className="opacity-70">({count})</span>
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="px-3 py-2 bg-brand-surface border border-brand-border rounded-xl text-xs font-medium">
                        <option value="popular">Most popular</option>
                        <option value="rating">Highest rated</option>
                        <option value="az">A → Z</option>
                        <option value="fields">Most fields</option>
                        <option value="quizzes">Quizzes first</option>
                    </select>
                    <div className="relative w-56">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search 140+ templates…" className="w-full pl-9 pr-4 py-2 bg-brand-surface border border-brand-border rounded-xl text-xs" />
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-brand-surface rounded-2xl border border-dashed border-brand-border">
                    <h3 className="text-lg font-bold text-brand-text">No Templates Found</h3>
                    <p className="text-xs text-brand-muted mt-1">Try a different search term or category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((t) => (
                        <div key={t.id} className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-primary/50 transition-all group shadow-card hover:-translate-y-0.5 flex flex-col">
                            <div className="flex items-start justify-between gap-2">
                                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xl shrink-0">{t.icon}</div>
                                <div className="flex flex-wrap gap-1.5 justify-end">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.isQuiz ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' : 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20'}`}>
                                        {t.isQuiz ? 'Quiz' : t.category}
                                    </span>
                                    {logicCount(t) > 0 && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                                            <GitBranch className="w-3 h-3" />{logicCount(t)} logic
                                        </span>
                                    )}
                                </div>
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-brand-text group-hover:text-brand-primary line-clamp-1">{t.title}</h3>
                            <p className="text-[11px] text-brand-muted mt-1 line-clamp-2 min-h-[30px]">{t.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-brand-muted">
                                <span>{t.fields.length} fields</span>
                                {t.isQuiz && <span className="font-bold text-amber-600">{pointsTotal(t)} pts</span>}
                                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{(t.rating || 4.6).toFixed(1)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <button onClick={() => setPreviewTpl(t)} className="py-2 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold flex items-center justify-center gap-1 hover:border-brand-primary">
                                    <Eye className="w-3.5 h-3.5" /> Preview
                                </button>
                                <button onClick={() => handleUseTemplate(t)} className="py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow flex items-center justify-center gap-1">
                                    Use <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {previewTpl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPreviewTpl(null)}>
                    <div className="w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-glow overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-brand-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl">{previewTpl.icon}</div>
                                <div>
                                    <h3 className="font-bold text-brand-text">{previewTpl.title}</h3>
                                    <p className="text-[11px] text-brand-muted">{previewTpl.description}</p>
                                </div>
                            </div>
                            <button onClick={() => setPreviewTpl(null)} className="p-1.5 text-brand-muted hover:text-brand-text"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 overflow-y-auto space-y-2 flex-1">
                            <div className="flex flex-wrap gap-2 text-[11px]">
                                <span className="px-2 py-0.5 rounded-full bg-brand-bg border font-bold">{previewTpl.fields.length} fields</span>
                                {previewTpl.isQuiz && <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold">{pointsTotal(previewTpl)} total points</span>}
                                {logicCount(previewTpl) > 0 && <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-bold flex items-center gap-1"><GitBranch className="w-3 h-3" />{logicCount(previewTpl)} conditional rules</span>}
                            </div>
                            {previewTpl.fields.map((f: any, i: number) => (
                                <div key={f.id} className="p-3 rounded-xl bg-brand-bg border border-brand-border">
                                    <div className="text-xs">
                                        <span className="font-bold text-brand-accent mr-2">Q{i + 1}</span>
                                        <span className="font-semibold">{f.label}</span>
                                        {f.required && <span className="ml-1 text-[10px] text-red-500 font-bold">required</span>}
                                        {previewTpl.isQuiz && Boolean(f.points && f.points > 0) && (f.type.startsWith('quiz') || f.options?.some((o: any) => o.isCorrect)) ? (
                                            <span className="ml-1 text-[10px] text-amber-600 font-bold">+{f.points} pts</span>
                                        ) : null}
                                    </div>
                                    {(f.options || []).length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                            {f.options.map((o: any) => (
                                                <span key={o.id} className="px-2 py-0.5 rounded-lg bg-brand-surface border text-[10px]">{o.label}{o.isCorrect ? ' ✓' : ''}</span>
                                            ))}
                                        </div>
                                    )}
                                    {(f.logicRules || []).map((r: any) => (
                                        <div key={r.id} className="mt-1.5 text-[10px] text-purple-600 bg-purple-500/5 border border-purple-500/20 rounded-lg px-2 py-1 flex items-center gap-1">
                                            <GitBranch className="w-3 h-3" /> If answer {r.operator} “{r.targetValue}” → {r.action} target question
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-brand-border flex gap-3">
                            <button onClick={() => setPreviewTpl(null)} className="flex-1 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold">Close</button>
                            <button onClick={() => handleUseTemplate(previewTpl)} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Use This Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
