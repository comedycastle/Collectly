import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus, Trash2, Sparkles, Eye, ChevronUp, ChevronDown,
    CheckCircle2, Smartphone, Tablet, Monitor, Save, ArrowLeft, GitBranch, GripVertical, PenTool,
    FilePlus2, Layers, Wand2, Sliders, X
} from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { FormField, FieldType, LogicRule } from '../types';
import { improveQuestionWithAI, generateFormWithAI } from '../services/aiService';
import { FieldRenderer } from '../components/FieldRenderer';
import { evaluateLogic, fieldsForPage } from '../lib/fieldLogic';
import { Logo, LogoMark } from '../components/Logo';

interface Props {
    onBackToDashboard: () => void;
    onPreviewPublicForm: (formId: string) => void;
}

export const FormBuilderPage: React.FC<Props> = ({ onBackToDashboard, onPreviewPublicForm }) => {
    const { activeForm, updateForm, forms, createForm } = useCollectlyStore();
    const formToEdit = activeForm || forms[0];

    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(formToEdit?.fields[0]?.id || null);
    const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [inspectorTab, setInspectorTab] = useState<'properties' | 'logic'>('properties');
    const [isImprovingAI, setIsImprovingAI] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>('Autosaved just now');
    const [draggedField, setDraggedField] = useState<string | null>(null);
    const [builderPage, setBuilderPage] = useState(1);
    const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
    const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
    const [previewPage, setPreviewPage] = useState(1);
    const [previewSubmitted, setPreviewSubmitted] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiGenerating, setAiGenerating] = useState(false);
    const [showAiBar, setShowAiBar] = useState(false);

    // Mobile drawers
    const [showMobilePalette, setShowMobilePalette] = useState(false);
    const [showMobileInspector, setShowMobileInspector] = useState(false);

    // Conditional logic shared by live preview (show/hide/jump/score) — must sit above any early return so hooks stay unconditional
    const previewLogic = useMemo(() => evaluateLogic(formToEdit?.fields || [], previewAnswers), [previewAnswers, formToEdit?.fields]);
    const previewHidden = previewLogic.hidden;

    const fieldCategories = [
        {
            title: 'Standard & Contact',
            fields: [
                { type: 'text', label: 'Short Text' },
                { type: 'textarea', label: 'Long Paragraph' },
                { type: 'email', label: 'Email Address' },
                { type: 'phone', label: 'Phone Number' },
                { type: 'number', label: 'Numeric Value' },
                { type: 'date', label: 'Date Picker' },
                { type: 'time', label: 'Time Picker' },
                { type: 'datetime', label: 'Date & Time' },
                { type: 'url', label: 'URL / Link' },
            ]
        },
        {
            title: 'Choice & Ratings',
            fields: [
                { type: 'select', label: 'Dropdown Select' },
                { type: 'radio', label: 'Single Choice Radio' },
                { type: 'checkbox', label: 'Multi Choice Checkbox' },
                { type: 'rating', label: 'Star Rating' },
                { type: 'nps', label: 'NPS Scale (0-10)' },
                { type: 'scale', label: 'Linear Rating Scale' },
                { type: 'ranking', label: 'Ranking / Order' },
                { type: 'matrix', label: 'Matrix Grid' },
                { type: 'slider', label: 'Range Slider' },
            ]
        },
        {
            title: 'Interactive & Media',
            fields: [
                { type: 'signature', label: 'E-Signature Pad' },
                { type: 'file', label: 'File Upload' },
                { type: 'color', label: 'Color Picker' },
                { type: 'map', label: 'Map Location' },
                { type: 'code', label: 'Code Editor' },
                { type: 'audio', label: 'Audio Recorder' },
                { type: 'video', label: 'Video Embed' },
                { type: 'terms', label: 'Terms & Check' },
                { type: 'payment', label: 'Payment' },
            ]
        },
        {
            title: 'Layout',
            fields: [
                { type: 'section', label: 'Section Header' },
                { type: 'page_break', label: 'Page Break' },
            ]
        },
        {
            title: 'Quiz & Anti-Cheat',
            fields: [
                { type: 'quiz_mcq', label: 'Quiz MCQ (Graded)' },
                { type: 'quiz_tf', label: 'Quiz True / False' },
                { type: 'quiz_short', label: 'Quiz Short Answer' },
                { type: 'quiz_matching', label: 'Quiz Matching Pairs' },
                { type: 'quiz_ordering', label: 'Quiz Ordering' },
                { type: 'quiz_fill_blank', label: 'Fill in the Blank' },
            ]
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setLastSaved('Autosaved just now');
        }, 15000);
        return () => clearInterval(timer);
    }, []);

    // Reset preview answers when editing a different form
    useEffect(() => {
        setPreviewAnswers({});
        setPreviewSubmitted(false);
    }, [formToEdit?.id]);

    if (!formToEdit) {
        return (
            <div className="p-4 sm:p-8 flex items-center justify-center min-h-[70vh]">
                <div className="max-w-md w-full text-center p-6 sm:p-10 rounded-2xl bg-brand-surface border border-brand-border shadow-sm space-y-5">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                        <FilePlus2 className="w-7 h-7 text-brand-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-extrabold text-brand-text">No form to build yet</h2>
                        <p className="text-sm text-brand-muted">
                            You haven't created any forms on this account. Create your first form to start adding questions, logic, and AI assistance.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => createForm({ title: 'Untitled Form', category: 'General' })}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs shadow-glow transition-all"
                        >
                            <Plus className="w-4 h-4" /> Create blank form
                        </button>
                        <button
                            onClick={onBackToDashboard}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text font-semibold text-xs hover:border-brand-muted transition-all"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalPages = formToEdit.settings?.totalPages || 1;
    const selectedField = formToEdit.fields.find((f) => f.id === selectedFieldId) || formToEdit.fields[0];

    const genId = (): string => (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`);
    const DEFAULT_MATRIX_COLS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    const typePlaceholders: Partial<Record<FieldType, string>> = {
        email: 'you@example.com', phone: '+1 (555) 000-0000', url: 'https://example.com',
        date: 'Pick a date…', time: 'Pick a time…', datetime: 'Pick date & time…',
        number: 'Enter a number…', quiz_short: 'Type your answer…', quiz_fill_blank: 'Type the missing word…',
        color: '#2563EB', video: 'Paste a YouTube or Vimeo link…',
    };
    const getDefaultField = (type: FieldType): Partial<FormField> => {
        const base = { type, logicRules: [] as LogicRule[] };
        if (type === 'quiz_tf') {
            return {
                ...base,
                correctAnswer: 'true',
                options: [
                    { id: genId(), label: 'True', value: 'true', isCorrect: true, scorePoints: 10 },
                    { id: genId(), label: 'False', value: 'false', isCorrect: false, scorePoints: 0 },
                ]
            };
        }
        if (['select', 'radio', 'checkbox', 'quiz_mcq'].includes(type)) {
            return {
                ...base,
                options: ['Option 1', 'Option 2', 'Option 3'].map((opt, i) => ({
                    id: genId(),
                    label: opt,
                    value: opt.toLowerCase().replace(/\s+/g, '-'),
                    isCorrect: i === 0,
                    scorePoints: i === 0 ? 10 : 0,
                }))
            };
        }
        if (type === 'matrix') {
            return {
                ...base,
                options: ['Statement A', 'Statement B'].map((opt, i) => ({ id: genId(), label: opt, value: `row-${i + 1}` })),
                matrixColumns: [...DEFAULT_MATRIX_COLS]
            };
        }
        if (type === 'quiz_matching') {
            return { ...base, matchingPairs: [{ id: genId(), left: 'Apple', right: 'Fruit' }, { id: genId(), left: 'Carrot', right: 'Vegetable' }], points: 10 };
        }
        if (type.startsWith('quiz')) return { ...base, points: 10 };
        if (type === 'rating') return { ...base, max: 5 };
        if (type === 'scale') return { ...base, min: 1, max: 10 };
        if (type === 'slider') return { ...base, min: 0, max: 100, step: 1 };
        if (type === 'file') return { ...base, acceptedFileTypes: '.pdf,.doc,.docx,.png,.jpg', maxFileSizeMb: 5 };
        if (type === 'terms') return { ...base, placeholder: 'I agree to the terms and conditions' };
        if (type === 'color') return { ...base, defaultValue: '#2563EB' };
        if (type === 'page_break') return { ...base, label: 'Page Break — new page starts below' };
        if (type === 'section') return { ...base, label: 'Section Heading', description: 'Section description...' };
        return base;
    };

    const handleAddField = (type: FieldType) => {
        const defaults = getDefaultField(type);
        const newField: FormField = {
            id: genId(),
            type,
            label: `New ${type.replace(/_/g, ' ').toUpperCase()} Question`,
            placeholder: typePlaceholders[type] || 'Enter answer...',
            required: false,
            order: formToEdit.fields.length + 1,
            page: builderPage,
            ...defaults,
        } as FormField;

        const updatedFields = [...formToEdit.fields, newField];
        updateForm(formToEdit.id, { fields: updatedFields });
        setSelectedFieldId(newField.id);
        setShowMobilePalette(false);
    };

    const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
        const updatedFields = formToEdit.fields.map((f) => f.id === fieldId ? { ...f, ...updates } : f);
        updateForm(formToEdit.id, { fields: updatedFields });
    };

    const handleDeleteField = (fieldId: string) => {
        const updatedFields = formToEdit.fields.filter((f) => f.id !== fieldId);
        updateForm(formToEdit.id, { fields: updatedFields });
        if (selectedFieldId === fieldId) {
            setSelectedFieldId(updatedFields[0]?.id || null);
        }
    };

    const handleAddLogicRule = () => {
        if (!selectedField) return;
        const newRule: LogicRule = {
            id: `rule-${Date.now()}`,
            sourceFieldId: selectedField.id,
            operator: 'equals',
            targetValue: '',
            action: 'show',
            targetFieldId: formToEdit.fields.find((f) => f.id !== selectedField.id)?.id || ''
        };
        const currentRules = selectedField.logicRules || [];
        handleUpdateField(selectedField.id, { logicRules: [...currentRules, newRule] });
    };

    const handleImproveWithAI = async () => {
        if (!selectedField) return;
        setIsImprovingAI(true);
        try {
            const res = await improveQuestionWithAI(selectedField.label, selectedField.type);
            handleUpdateField(selectedField.id, {
                label: res.improvedLabel,
                description: `AI Suggestion: ${res.suggestion}`
            });
        } finally {
            setIsImprovingAI(false);
        }
    };

    const handleAIGenerateFields = async () => {
        if (!aiPrompt.trim()) return;
        setAiGenerating(true);
        try {
            const result = await generateFormWithAI({ prompt: aiPrompt, isQuiz: formToEdit.isQuiz });
            const newFields: FormField[] = result.fields.map((f: any, i: number) => ({
                ...f,
                id: `field-${Date.now()}-${i}`,
                order: formToEdit.fields.length + i + 1,
                page: builderPage,
                logicRules: [],
            }));
            updateForm(formToEdit.id, { fields: [...formToEdit.fields, ...newFields] });
            setAiPrompt('');
            setShowAiBar(false);
        } catch (e) {
            console.warn('AI field generation failed:', e);
        } finally {
            setAiGenerating(false);
        }
    };

    const handleAddPage = () => {
        const next = totalPages + 1;
        updateForm(formToEdit.id, { settings: { ...formToEdit.settings, totalPages: next } });
        setBuilderPage(next);
    };

    const handleRemovePage = () => {
        if (totalPages <= 1) return;
        const next = totalPages - 1;
        const updatedFields = formToEdit.fields.map((f) => ({ ...f, page: Math.min(f.page || 1, next) }));
        updateForm(formToEdit.id, { fields: updatedFields, settings: { ...formToEdit.settings, totalPages: next } });
        setBuilderPage(Math.min(builderPage, next));
    };

    const handleDragStart = (fieldId: string) => setDraggedField(fieldId);
    const handleDragOver = (e: React.DragEvent, targetFieldId: string) => {
        e.preventDefault();
        if (!draggedField || draggedField === targetFieldId) return;
        const fields = [...formToEdit.fields];
        const dragIdx = fields.findIndex(f => f.id === draggedField);
        const targetIdx = fields.findIndex(f => f.id === targetFieldId);
        if (dragIdx === -1 || targetIdx === -1) return;
        const [moved] = fields.splice(dragIdx, 1);
        fields.splice(targetIdx, 0, moved);
        updateForm(formToEdit.id, { fields: fields.map((f, i) => ({ ...f, order: i + 1 })) });
    };
    const handleDragEnd = () => setDraggedField(null);

    const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
        const fields = [...formToEdit.fields];
        const idx = fields.findIndex(f => f.id === fieldId);
        if (idx === -1) return;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= fields.length) return;
        [fields[idx], fields[newIdx]] = [fields[newIdx], fields[idx]];
        updateForm(formToEdit.id, { fields: fields.map((f, i) => ({ ...f, order: i + 1 })) });
    };

    const builderFields = formToEdit.fields.filter((f) => (f.page || 1) === builderPage);
    const previewPageFields = fieldsForPage(formToEdit.fields, previewPage, totalPages, previewHidden);

    // Inspector Content Reusable Component (renders in desktop sidebar AND mobile bottom-sheet)
    const renderInspectorContent = () => {
        if (!selectedField) {
            return (
                <div className="text-center py-8 text-xs text-brand-muted">
                    Select a question on the canvas to configure its settings.
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex border-b border-brand-border">
                    <button
                        onClick={() => setInspectorTab('properties')}
                        className={`flex-1 text-xs font-bold uppercase pb-2 border-b-2 transition-colors ${inspectorTab === 'properties' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted'}`}
                    >
                        Properties
                    </button>
                    <button
                        onClick={() => setInspectorTab('logic')}
                        className={`flex-1 text-xs font-bold uppercase pb-2 border-b-2 flex items-center justify-center gap-1 transition-colors ${inspectorTab === 'logic' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-brand-muted'}`}
                    >
                        <GitBranch className="w-3.5 h-3.5" /> Logic
                    </button>
                </div>

                {inspectorTab === 'properties' && (
                    <div className="space-y-3.5">
                        <button
                            onClick={handleImproveWithAI}
                            disabled={isImprovingAI}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-semibold shadow-glow flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            {isImprovingAI ? 'Improving...' : 'AI Improve Wording'}
                        </button>
                        <div>
                            <label className="text-[11px] font-semibold text-brand-muted block mb-1">Label</label>
                            <input
                                value={selectedField.label}
                                onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-brand-muted block mb-1">Description</label>
                            <input
                                value={selectedField.description || ''}
                                onChange={(e) => handleUpdateField(selectedField.id, { description: e.target.value })}
                                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-brand-muted block mb-1">Placeholder</label>
                            <input
                                value={selectedField.placeholder || ''}
                                onChange={(e) => handleUpdateField(selectedField.id, { placeholder: e.target.value })}
                                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text focus:border-brand-primary"
                            />
                        </div>

                        {['text', 'textarea', 'email', 'phone', 'url', 'number', 'date', 'time', 'datetime', 'code', 'quiz_short', 'quiz_fill_blank'].includes(selectedField.type) && (
                            <div>
                                <label className="text-[11px] font-semibold text-brand-muted block mb-1">Default value</label>
                                <input
                                    value={selectedField.defaultValue || ''}
                                    onChange={(e) => handleUpdateField(selectedField.id, { defaultValue: e.target.value })}
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text focus:border-brand-primary"
                                />
                            </div>
                        )}

                        {['text', 'textarea', 'email', 'phone', 'url', 'quiz_short'].includes(selectedField.type) && (
                            <div>
                                <label className="text-[11px] font-semibold text-brand-muted block mb-1">Validation pattern (regex)</label>
                                <input
                                    value={selectedField.validationPattern || ''}
                                    onChange={(e) => handleUpdateField(selectedField.id, { validationPattern: e.target.value })}
                                    placeholder="e.g. ^[A-Za-z ]{2,50}$"
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs font-mono text-brand-text focus:border-brand-primary"
                                />
                                <p className="text-[10px] text-brand-muted mt-0.5">Optional — checked on submit in the public form.</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between py-2 border-y border-brand-border">
                            <span className="text-xs font-semibold text-brand-text">Required</span>
                            <input
                                type="checkbox"
                                checked={selectedField.required}
                                onChange={(e) => handleUpdateField(selectedField.id, { required: e.target.checked })}
                                className="w-4 h-4 rounded text-brand-primary accent-brand-primary cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-brand-muted block mb-1">Page</label>
                            <select
                                value={selectedField.page || 1}
                                onChange={(e) => handleUpdateField(selectedField.id, { page: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text focus:border-brand-primary"
                            >
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                                ))}
                            </select>
                        </div>

                        {(selectedField.type === 'number' || selectedField.type === 'slider' || selectedField.type === 'scale' || selectedField.type === 'rating') && (
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[10px] text-brand-muted block mb-0.5">Min</label>
                                    <input
                                        type="number"
                                        value={selectedField.min ?? 0}
                                        onChange={(e) => handleUpdateField(selectedField.id, { min: Number(e.target.value) })}
                                        className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-brand-muted block mb-0.5">Max</label>
                                    <input
                                        type="number"
                                        value={selectedField.max ?? 100}
                                        onChange={(e) => handleUpdateField(selectedField.id, { max: Number(e.target.value) })}
                                        className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-brand-muted block mb-0.5">Step</label>
                                    <input
                                        type="number"
                                        value={selectedField.step ?? 1}
                                        onChange={(e) => handleUpdateField(selectedField.id, { step: Number(e.target.value) })}
                                        className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedField.type === 'file' && (
                            <div className="space-y-2">
                                <div>
                                    <label className="text-[11px] text-brand-muted block mb-1">Accepted types</label>
                                    <input
                                        value={selectedField.acceptedFileTypes || ''}
                                        onChange={(e) => handleUpdateField(selectedField.id, { acceptedFileTypes: e.target.value })}
                                        className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] text-brand-muted block mb-1">Max MB</label>
                                    <input
                                        type="number"
                                        value={selectedField.maxFileSizeMb || 5}
                                        onChange={(e) => handleUpdateField(selectedField.id, { maxFileSizeMb: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedField.type.startsWith('quiz') && (
                            <div>
                                <label className="text-[11px] text-brand-muted block mb-1">Points</label>
                                <input
                                    type="number"
                                    value={selectedField.points || 10}
                                    onChange={(e) => handleUpdateField(selectedField.id, { points: Number(e.target.value) })}
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs"
                                />
                            </div>
                        )}

                        {(selectedField.type === 'quiz_short' || selectedField.type === 'quiz_fill_blank') && (
                            <div>
                                <label className="text-[11px] text-brand-muted block mb-1">Correct answer</label>
                                <input
                                    value={String(selectedField.correctAnswer || '')}
                                    onChange={(e) => handleUpdateField(selectedField.id, { correctAnswer: e.target.value })}
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs"
                                />
                            </div>
                        )}

                        {selectedField.type === 'quiz_tf' && (
                            <div>
                                <label className="text-[11px] text-brand-muted block mb-1">Correct answer</label>
                                <select
                                    value={String(selectedField.correctAnswer || 'true')}
                                    onChange={(e) => handleUpdateField(selectedField.id, { correctAnswer: e.target.value })}
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs"
                                >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>
                        )}

                        {selectedField.options && (
                            <div>
                                <label className="text-[11px] font-semibold text-brand-muted block mb-1">Options</label>
                                <div className="space-y-1.5 mt-1">
                                    {selectedField.options.map((opt, idx) => (
                                        <div key={opt.id} className="flex gap-1.5 items-center">
                                            <input
                                                value={opt.label}
                                                onChange={(e) => {
                                                    const next = [...(selectedField.options || [])];
                                                    next[idx] = { ...opt, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') };
                                                    handleUpdateField(selectedField.id, { options: next });
                                                }}
                                                className="flex-1 px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                            />
                                            {selectedField.type.startsWith('quiz') && (
                                                <input
                                                    type="checkbox"
                                                    title="Correct"
                                                    checked={!!opt.isCorrect}
                                                    onChange={(e) => {
                                                        const next = [...(selectedField.options || [])];
                                                        next[idx] = { ...opt, isCorrect: e.target.checked };
                                                        handleUpdateField(selectedField.id, { options: next });
                                                    }}
                                                    className="w-4 h-4 accent-brand-primary"
                                                />
                                            )}
                                            {selectedField.type.startsWith('quiz') && (
                                                <input
                                                    type="number"
                                                    title="Points for this option"
                                                    value={opt.scorePoints ?? 0}
                                                    onChange={(e) => {
                                                        const next = [...(selectedField.options || [])];
                                                        next[idx] = { ...opt, scorePoints: Number(e.target.value) };
                                                        handleUpdateField(selectedField.id, { options: next });
                                                    }}
                                                    className="w-14 px-1.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-[10px]"
                                                />
                                            )}
                                            <button
                                                onClick={() => handleUpdateField(selectedField.id, { options: (selectedField.options || []).filter((_, i) => i !== idx) })}
                                                className="p-1.5 text-brand-muted hover:text-red-500 rounded-lg hover:bg-brand-surfaceLight"
                                                aria-label="Remove option"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleUpdateField(selectedField.id, {
                                            options: [
                                                ...(selectedField.options || []),
                                                { id: `opt-${Date.now()}`, label: `Option ${(selectedField.options?.length || 0) + 1}`, value: `option-${(selectedField.options?.length || 0) + 1}`, isCorrect: false }
                                            ]
                                        })}
                                        className="w-full py-1.5 border border-dashed border-brand-border rounded-lg text-xs text-brand-muted hover:text-brand-text hover:border-brand-primary transition-colors"
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedField.type === 'matrix' && (
                            <div>
                                <label className="text-[11px] font-semibold text-brand-muted block mb-1">Matrix columns</label>
                                <div className="space-y-1.5 mt-1">
                                    {(selectedField.matrixColumns || DEFAULT_MATRIX_COLS).map((c, idx) => (
                                        <div key={idx} className="flex gap-1.5 items-center">
                                            <input
                                                value={c}
                                                onChange={(e) => {
                                                    const next = [...(selectedField.matrixColumns || DEFAULT_MATRIX_COLS)];
                                                    next[idx] = e.target.value;
                                                    handleUpdateField(selectedField.id, { matrixColumns: next });
                                                }}
                                                className="flex-1 px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                            />
                                            <button
                                                onClick={() => handleUpdateField(selectedField.id, { matrixColumns: (selectedField.matrixColumns || DEFAULT_MATRIX_COLS).filter((_, i) => i !== idx) })}
                                                className="p-1.5 text-brand-muted hover:text-red-500 rounded-lg hover:bg-brand-surfaceLight"
                                                aria-label="Remove column"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleUpdateField(selectedField.id, { matrixColumns: [...(selectedField.matrixColumns || DEFAULT_MATRIX_COLS), `Column ${(selectedField.matrixColumns || DEFAULT_MATRIX_COLS).length + 1}`] })}
                                        className="w-full py-1.5 border border-dashed border-brand-border rounded-lg text-xs text-brand-muted hover:text-brand-text hover:border-brand-primary"
                                    >
                                        + Add Column
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedField.type === 'quiz_matching' && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-brand-muted block mb-1">Matching pairs</label>
                                {(selectedField.matchingPairs || []).map((m, idx) => (
                                    <div key={m.id} className="flex gap-1.5 items-center">
                                        <input
                                            value={m.left}
                                            onChange={(e) => {
                                                const next = [...(selectedField.matchingPairs || [])];
                                                next[idx] = { ...m, left: e.target.value };
                                                handleUpdateField(selectedField.id, { matchingPairs: next });
                                            }}
                                            className="flex-1 px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                        />
                                        <input
                                            value={m.right}
                                            onChange={(e) => {
                                                const next = [...(selectedField.matchingPairs || [])];
                                                next[idx] = { ...m, right: e.target.value };
                                                handleUpdateField(selectedField.id, { matchingPairs: next });
                                            }}
                                            className="flex-1 px-2.5 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleUpdateField(selectedField.id, { matchingPairs: [...(selectedField.matchingPairs || []), { id: `m-${Date.now()}`, left: 'Left', right: 'Right' }] })}
                                    className="w-full py-1.5 border border-dashed border-brand-border rounded-lg text-xs text-brand-muted hover:text-brand-text hover:border-brand-primary"
                                >
                                    + Add Pair
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {inspectorTab === 'logic' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-text">Conditional Logic ({(selectedField.logicRules || []).length})</span>
                            <button
                                onClick={handleAddLogicRule}
                                className="px-2.5 py-1 rounded-lg bg-brand-primary text-white text-[11px] font-semibold flex items-center gap-1 shadow-glow"
                            >
                                <Plus className="w-3 h-3" /> Add Rule
                            </button>
                        </div>
                        {(selectedField.logicRules || []).length === 0 ? (
                            <div className="text-xs text-brand-muted text-center py-6 border border-dashed border-brand-border rounded-xl">
                                No rules yet. Rules show/hide questions, jump pages, or adjust scores based on answers — tested live in Preview mode.
                            </div>
                        ) : (
                            (selectedField.logicRules || []).map((rule, idx) => (
                                <div key={rule.id} className="p-3 rounded-xl bg-brand-bg/70 border border-brand-border space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-brand-accent">Rule #{idx + 1}</span>
                                        <button
                                            onClick={() => handleUpdateField(selectedField.id, { logicRules: (selectedField.logicRules || []).filter((r) => r.id !== rule.id) })}
                                            className="text-brand-muted hover:text-red-500 p-1"
                                            aria-label="Delete rule"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-brand-muted block mb-0.5">IF answer</label>
                                        <select
                                            value={rule.operator}
                                            onChange={(e) => {
                                                const next = [...(selectedField.logicRules || [])];
                                                next[idx] = { ...rule, operator: e.target.value as any };
                                                handleUpdateField(selectedField.id, { logicRules: next });
                                            }}
                                            className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                        >
                                            <option value="equals">Equals</option>
                                            <option value="not_equals">Not equals</option>
                                            <option value="contains">Contains</option>
                                            <option value="not_contains">Not contains</option>
                                            <option value="greater_than">Greater than</option>
                                            <option value="less_than">Less than</option>
                                            <option value="is_empty">Is empty</option>
                                            <option value="is_not_empty">Is not empty</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-brand-muted block mb-0.5">Value</label>
                                        <input
                                            value={rule.targetValue}
                                            onChange={(e) => {
                                                const next = [...(selectedField.logicRules || [])];
                                                next[idx] = { ...rule, targetValue: e.target.value };
                                                handleUpdateField(selectedField.id, { logicRules: next });
                                            }}
                                            className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                            placeholder="e.g. yes"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-brand-muted block mb-0.5">THEN</label>
                                        <select
                                            value={rule.action}
                                            onChange={(e) => {
                                                const next = [...(selectedField.logicRules || [])];
                                                next[idx] = { ...rule, action: e.target.value as any };
                                                handleUpdateField(selectedField.id, { logicRules: next });
                                            }}
                                            className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                        >
                                            <option value="show">Show question</option>
                                            <option value="hide">Hide question</option>
                                            <option value="jump_to_page">Jump to page</option>
                                            <option value="calculate_score">Adjust score</option>
                                        </select>
                                    </div>
                                    {(rule.action === 'show' || rule.action === 'hide') && (
                                        <div>
                                            <label className="text-[10px] text-brand-muted block mb-0.5">Target</label>
                                            <select
                                                value={rule.targetFieldId || ''}
                                                onChange={(e) => {
                                                    const next = [...(selectedField.logicRules || [])];
                                                    next[idx] = { ...rule, targetFieldId: e.target.value };
                                                    handleUpdateField(selectedField.id, { logicRules: next });
                                                }}
                                                className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                            >
                                                <option value="">Select...</option>
                                                {formToEdit.fields.filter((f) => f.id !== selectedField.id).map((f) => (
                                                    <option key={f.id} value={f.id}>{f.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {rule.action === 'jump_to_page' && (
                                        <div>
                                            <label className="text-[10px] text-brand-muted block mb-0.5">Page</label>
                                            <select
                                                value={rule.targetPage || 1}
                                                onChange={(e) => {
                                                    const next = [...(selectedField.logicRules || [])];
                                                    next[idx] = { ...rule, targetPage: Number(e.target.value) };
                                                    handleUpdateField(selectedField.id, { logicRules: next });
                                                }}
                                                className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                            >
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {rule.action === 'calculate_score' && (
                                        <div>
                                            <label className="text-[10px] text-brand-muted block mb-0.5">Score ±</label>
                                            <input
                                                type="number"
                                                value={rule.scoreAdjustment || 0}
                                                onChange={(e) => {
                                                    const next = [...(selectedField.logicRules || [])];
                                                    next[idx] = { ...rule, scoreAdjustment: Number(e.target.value) };
                                                    handleUpdateField(selectedField.id, { logicRules: next });
                                                }}
                                                className="w-full px-2 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden animate-in fade-in duration-200">
            {/* Top toolbar */}
            <div className="min-h-14 py-2 border-b border-brand-border bg-brand-surface/90 px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <button
                        onClick={onBackToDashboard}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight shrink-0"
                        aria-label="Back to dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <LogoMark size="sm" onClick={onBackToDashboard} className="cursor-pointer hidden sm:inline-flex shrink-0" />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5 sm:space-x-2">
                            <input
                                type="text"
                                value={formToEdit.title}
                                onChange={(e) => updateForm(formToEdit.id, { title: e.target.value })}
                                className="font-bold text-xs sm:text-sm text-brand-text bg-transparent border-b border-transparent hover:border-brand-border focus:border-brand-primary px-1 rounded truncate max-w-[140px] sm:max-w-xs"
                            />
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${formToEdit.isQuiz ? 'bg-purple-500/20 text-purple-600' : 'bg-brand-accent/20 text-brand-accent'}`}>
                                {formToEdit.isQuiz ? 'Quiz' : formToEdit.category}
                            </span>
                        </div>
                        <span className="text-[10px] text-brand-muted flex items-center gap-1">
                            <Save className="w-3 h-3 text-emerald-500" /> {lastSaved}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Mode switcher (Edit vs Live Preview) */}
                    <div className="flex items-center p-1 bg-brand-bg border border-brand-border rounded-xl">
                        <button
                            onClick={() => setPreviewMode('edit')}
                            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${previewMode === 'edit' ? 'bg-brand-primary text-white shadow-glow' : 'text-brand-muted hover:text-brand-text'}`}
                        >
                            <PenTool className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">Edit</span>
                        </button>
                        <button
                            onClick={() => { setPreviewMode('preview'); setPreviewPage(1); setPreviewSubmitted(false); }}
                            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${previewMode === 'preview' ? 'bg-brand-accent text-white shadow-glow' : 'text-brand-muted hover:text-brand-text'}`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">Preview</span>
                        </button>
                    </div>

                    {/* Device preview viewport switchers (desktop only) */}
                    <div className="hidden md:flex items-center space-x-1 p-1 bg-brand-bg border border-brand-border rounded-xl">
                        {[{ id: 'desktop', icon: Monitor }, { id: 'tablet', icon: Tablet }, { id: 'mobile', icon: Smartphone }].map((dev) => {
                            const Icon = dev.icon;
                            return (
                                <button
                                    key={dev.id}
                                    onClick={() => setDevicePreview(dev.id as any)}
                                    className={`p-1.5 rounded-lg transition-colors ${devicePreview === dev.id ? 'bg-brand-primary text-white shadow-glow' : 'text-brand-muted hover:text-brand-text'}`}
                                    aria-label={`Preview as ${dev.id}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Open public link */}
                    <button
                        onClick={() => onPreviewPublicForm(formToEdit.id)}
                        className="px-3 sm:px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-glow flex items-center gap-1.5"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Open Public</span>
                    </button>
                </div>
            </div>

            {/* AI bar & Page switcher */}
            <div className="border-b border-brand-border bg-brand-surface px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 shrink-0">
                <button
                    onClick={() => setShowAiBar(!showAiBar)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-semibold flex items-center gap-1 shadow-glow"
                >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Add Fields</span>
                </button>

                {showAiBar && (
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 order-3 sm:order-none mt-1 sm:mt-0">
                        <input
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g. Add 3 contact fields with validation..."
                            className="flex-1 px-3 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs text-brand-text focus:border-brand-primary"
                        />
                        <button
                            onClick={handleAIGenerateFields}
                            disabled={aiGenerating || !aiPrompt.trim()}
                            className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold disabled:opacity-50 shadow-glow shrink-0"
                        >
                            {aiGenerating ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                )}

                {/* Multi-page controls */}
                <div className="flex items-center gap-1.5 ml-auto text-xs">
                    <Layers className="w-3.5 h-3.5 text-brand-muted" />
                    <span className="text-brand-muted font-semibold">{totalPages} pg{totalPages > 1 ? 's' : ''}</span>
                    <button onClick={handleAddPage} className="px-2 py-1 rounded-lg bg-brand-bg border border-brand-border text-xs font-bold hover:border-brand-primary transition-colors">+ Page</button>
                    <button onClick={handleRemovePage} disabled={totalPages <= 1} className="px-2 py-1 rounded-lg bg-brand-bg border border-brand-border text-xs disabled:opacity-40 hover:border-brand-primary transition-colors">−</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left palette (Desktop) */}
                <div className="w-64 border-r border-brand-border bg-brand-surface/50 p-3 overflow-y-auto shrink-0 space-y-4 hidden md:block">
                    <div className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Add Fields (30+)</div>
                    {fieldCategories.map((cat, idx) => (
                        <div key={idx} className="space-y-1.5">
                            <div className="text-[11px] font-semibold text-brand-accent">{cat.title}</div>
                            <div className="grid grid-cols-2 gap-1.5">
                                {cat.fields.map((f) => (
                                    <button
                                        key={f.type}
                                        onClick={() => handleAddField(f.type as FieldType)}
                                        className="p-2 rounded-lg bg-brand-bg border border-brand-border hover:border-brand-primary text-left text-[11px] font-medium text-brand-text transition-all truncate"
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center canvas / live preview */}
                <div className="flex-1 bg-brand-bg p-3 sm:p-5 overflow-y-auto flex justify-center">
                    <div className={`w-full ${devicePreview === 'mobile' ? 'max-w-sm' : devicePreview === 'tablet' ? 'max-w-xl' : 'max-w-2xl'}`}>
                        {previewMode === 'edit' ? (
                            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-6 shadow-card space-y-4">
                                {/* Page tabs in canvas */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setBuilderPage(i + 1)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${builderPage === i + 1 ? 'bg-brand-primary text-white shadow-glow' : 'bg-brand-bg border border-brand-border text-brand-muted'}`}
                                        >
                                            Page {i + 1}
                                        </button>
                                    ))}
                                </div>

                                {/* Form title & description banner */}
                                <div className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border space-y-2">
                                    <input
                                        value={formToEdit.title}
                                        onChange={(e) => updateForm(formToEdit.id, { title: e.target.value })}
                                        className="w-full text-lg sm:text-xl font-extrabold bg-transparent text-brand-text border-b border-transparent focus:border-brand-primary"
                                        placeholder="Form Title..."
                                    />
                                    <textarea
                                        value={formToEdit.description}
                                        onChange={(e) => updateForm(formToEdit.id, { description: e.target.value })}
                                        rows={2}
                                        className="w-full text-xs text-brand-muted bg-transparent resize-none border-b border-transparent focus:border-brand-primary"
                                        placeholder="Form Description (optional)..."
                                    />
                                </div>

                                {builderFields.length === 0 && (
                                    <div className="text-center text-xs text-brand-muted py-10 border border-dashed border-brand-border rounded-xl space-y-3">
                                        <p>No fields on Page {builderPage}.</p>
                                        <button
                                            onClick={() => setShowMobilePalette(true)}
                                            className="md:hidden px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-glow inline-flex items-center gap-1.5"
                                        >
                                            <Plus className="w-4 h-4" /> Add Question from Palette
                                        </button>
                                    </div>
                                )}

                                {formToEdit.fields.filter((f) => (f.page || 1) === builderPage).map((field, index) => {
                                    const isSelected = selectedFieldId === field.id;
                                    return (
                                        <div
                                            key={field.id}
                                            draggable
                                            onDragStart={() => handleDragStart(field.id)}
                                            onDragOver={(e) => handleDragOver(e, field.id)}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => {
                                                setSelectedFieldId(field.id);
                                            }}
                                            className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-brand-primary shadow-glow bg-brand-surfaceLight/50' : 'bg-brand-bg/40 border-brand-border hover:border-brand-border/80'} ${draggedField === field.id ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex items-center justify-between mb-2 gap-2">
                                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                                                    <GripVertical className="w-4 h-4 text-brand-muted cursor-grab hidden sm:block shrink-0" />
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary uppercase shrink-0">
                                                        Q{index + 1} • {field.type}
                                                    </span>
                                                    {formToEdit.isQuiz && Boolean(field.points && field.points > 0) && (field.type.startsWith('quiz') || field.options?.some(o => o.isCorrect)) ? (
                                                        <span className="text-[10px] font-bold text-amber-600 shrink-0">+{field.points} pts</span>
                                                    ) : null}
                                                    {(field.logicRules?.length || 0) > 0 && (
                                                        <span className="text-[10px] font-bold text-brand-accent flex items-center gap-0.5 shrink-0">
                                                            <GitBranch className="w-3 h-3" />{field.logicRules?.length}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFieldId(field.id);
                                                            setShowMobileInspector(true);
                                                        }}
                                                        className="md:hidden p-1.5 rounded-lg text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 text-[10px] font-semibold flex items-center gap-1"
                                                        title="Configure Field"
                                                    >
                                                        <Sliders className="w-3.5 h-3.5" />
                                                        <span>Settings</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleMoveField(field.id, 'up'); }}
                                                        className="p-1 text-brand-muted hover:text-brand-text rounded hover:bg-brand-surfaceLight"
                                                        aria-label="Move question up"
                                                    >
                                                        <ChevronUp className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleMoveField(field.id, 'down'); }}
                                                        className="p-1 text-brand-muted hover:text-brand-text rounded hover:bg-brand-surfaceLight"
                                                        aria-label="Move question down"
                                                    >
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id); }}
                                                        className="p-1 text-brand-muted hover:text-red-500 rounded hover:bg-brand-surfaceLight"
                                                        aria-label="Delete question"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <input
                                                value={field.label}
                                                onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                                                className="w-full font-semibold text-sm bg-transparent border-b border-transparent focus:border-brand-primary text-brand-text"
                                            />
                                            <div className="mt-2 opacity-90 pointer-events-none">
                                                <FieldRenderer field={field} value={undefined} onChange={() => { }} variant="canvas" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-6 shadow-glow space-y-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-extrabold text-base sm:text-lg text-brand-text flex items-center flex-wrap gap-1">
                                        <span>{formToEdit.title}</span>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE PREVIEW</span>
                                    </h3>
                                    <span className="text-[11px] text-brand-muted">Page {previewPage}/{totalPages}</span>
                                </div>
                                <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-gradient transition-all" style={{ width: `${(previewPage / totalPages) * 100}%` }} />
                                </div>
                                {!previewSubmitted ? (
                                    <div className="space-y-4">
                                        {previewPageFields.map((field) => (
                                            <div key={field.id} className="p-3.5 sm:p-4 rounded-xl bg-brand-bg/60 border border-brand-border space-y-2">
                                                <label className="text-sm font-bold text-brand-text block">
                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                </label>
                                                <FieldRenderer
                                                    field={field}
                                                    value={previewAnswers[field.id]}
                                                    onChange={(v) => setPreviewAnswers((p) => ({ ...p, [field.id]: v }))}
                                                    variant="preview"
                                                />
                                                {(field.logicRules?.length || 0) > 0 && <p className="text-[10px] text-brand-accent">Logic: {field.logicRules?.length} rule(s) active</p>}
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center pt-2">
                                            <button
                                                disabled={previewPage === 1}
                                                onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                                                className="px-4 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold disabled:opacity-40 text-brand-text"
                                            >
                                                Previous
                                            </button>
                                            {previewPage < totalPages ? (
                                                <button
                                                    onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
                                                    className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-glow"
                                                >
                                                    Next
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        const jump = previewLogic.jumpToPage;
                                                        setPreviewPage((p) => (jump && jump >= 1 && jump <= totalPages && jump !== p ? jump : Math.min(totalPages, p + 1)));
                                                    }}
                                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-bold shadow-glow"
                                                >
                                                    Next
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 space-y-3">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                                        <h4 className="font-bold text-brand-text">Preview submitted!</h4>
                                        <p className="text-xs text-brand-muted">Logic evaluated {previewHidden.size} hidden field(s). This is a test — no data saved.</p>
                                        <button
                                            onClick={() => { setPreviewSubmitted(false); setPreviewPage(1); setPreviewAnswers({}); }}
                                            className="px-4 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary"
                                        >
                                            Restart Preview
                                        </button>
                                    </div>
                                )}
                                <div className="pt-4 flex justify-center">
                                    <Logo variant="badge" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right inspector (Desktop sidebar) */}
                <div className="w-80 border-l border-brand-border bg-brand-surface/60 p-4 overflow-y-auto shrink-0 space-y-5 hidden md:block">
                    {renderInspectorContent()}
                </div>
            </div>

            {/* Mobile Bottom Navigation Toolbar */}
            <div className="md:hidden border-t border-brand-border bg-brand-surface/95 backdrop-blur-md p-2.5 flex items-center justify-between gap-2 shrink-0 z-20">
                <button
                    onClick={() => setShowMobilePalette(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-glow"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                </button>
                {selectedField && (
                    <button
                        onClick={() => setShowMobileInspector(true)}
                        className="py-2 px-3.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs font-bold flex items-center justify-center gap-1.5 hover:border-brand-primary"
                    >
                        <Sliders className="w-4 h-4 text-brand-primary" />
                        <span>Settings</span>
                    </button>
                )}
                <button
                    onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
                    className="py-2 px-3.5 rounded-xl bg-brand-surfaceLight border border-brand-border text-brand-text text-xs font-bold flex items-center justify-center gap-1.5"
                >
                    {previewMode === 'edit' ? <Eye className="w-4 h-4 text-brand-accent" /> : <PenTool className="w-4 h-4 text-brand-primary" />}
                    <span>{previewMode === 'edit' ? 'Preview' : 'Edit'}</span>
                </button>
            </div>

            {/* Mobile Palette Modal Drawer */}
            {showMobilePalette && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-brand-surface border-t border-brand-border rounded-t-3xl max-h-[85vh] flex flex-col shadow-glow overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Add question field"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                            <div>
                                <h3 className="text-base font-extrabold text-brand-text">Add Question</h3>
                                <p className="text-[11px] text-brand-muted">Choose from 30+ field types & graded quiz items</p>
                            </div>
                            <button
                                onClick={() => setShowMobilePalette(false)}
                                className="p-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4 space-y-4">
                            {fieldCategories.map((cat, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="text-xs font-bold text-brand-accent uppercase tracking-wider">{cat.title}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {cat.fields.map((f) => (
                                            <button
                                                key={f.type}
                                                onClick={() => handleAddField(f.type as FieldType)}
                                                className="p-3 rounded-xl bg-brand-bg border border-brand-border hover:border-brand-primary text-left text-xs font-semibold text-brand-text flex items-center gap-2 transition-all active:scale-95"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
                                                <span className="truncate">{f.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Inspector Modal Drawer */}
            {showMobileInspector && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-brand-surface border-t border-brand-border rounded-t-3xl max-h-[85vh] flex flex-col shadow-glow overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Question settings and logic"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                            <div>
                                <h3 className="text-base font-extrabold text-brand-text">Question Settings</h3>
                                <p className="text-[11px] text-brand-muted truncate max-w-xs">{selectedField?.label || 'Configure active question'}</p>
                            </div>
                            <button
                                onClick={() => setShowMobileInspector(false)}
                                className="p-2 rounded-xl text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-5">
                            {renderInspectorContent()}
                        </div>
                        <div className="p-3 border-t border-brand-border bg-brand-bg/50">
                            <button
                                onClick={() => setShowMobileInspector(false)}
                                className="w-full py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-glow"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
