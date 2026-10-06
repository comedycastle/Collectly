import React, { useState, useEffect } from 'react';
import {
    Inbox, Search, Filter, Download, MessageSquare, Tag, AlertTriangle,
    CheckCircle2, Trash2, ShieldAlert, Sparkles, ExternalLink, Printer, FileSpreadsheet, FileText, CheckSquare, Square, X
} from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { FormResponse } from '../types';
import { exportService } from '../services/exportService';

export const ResponsesPage: React.FC = () => {
    const { responses, responsesError, forms, addTeamNote, toggleResponseTag, deleteResponse, bulkDeleteResponses, bulkTagResponses, loadResponsesFromSupabase } = useCollectlyStore();
    const [selectedFormId, setSelectedFormId] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
    const [newNoteText, setNewNoteText] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkTag, setShowBulkTag] = useState(false);
    const [bulkTagText, setBulkTagText] = useState('');

    useEffect(() => {
        loadResponsesFromSupabase(selectedFormId === 'All' ? undefined : selectedFormId);
    }, [selectedFormId]);

    // Realtime: auto-refresh when new response arrives in Supabase
    useEffect(() => {
        let channel: any = null;
        (async () => {
            try {
                const { isSupabaseConfigured } = await import('../lib/supabaseClient');
                if (!isSupabaseConfigured) return;
                const { responseService } = await import('../services/formService');
                const { supabase } = await import('../lib/supabaseClient');
                if (selectedFormId !== 'All') {
                    channel = responseService.subscribeToResponses(selectedFormId, () => {
                        loadResponsesFromSupabase(selectedFormId);
                    });
                } else {
                    channel = supabase.channel('responses:all').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'responses' }, () => {
                        loadResponsesFromSupabase();
                    }).subscribe();
                }
            } catch {}
        })();
        return () => {
            if (channel) {
                import('../lib/supabaseClient').then(({ supabase }) => supabase.removeChannel(channel));
            }
        };
    }, [selectedFormId]);

    const filteredResponses = responses.filter((r) => {
        const matchesForm = selectedFormId === 'All' || r.formId === selectedFormId;
        const matchesSearch = Object.values(r.answers).some((ans) =>
            String(ans.value).toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesForm && matchesSearch;
    });

    const currentForm = forms.find(f => f.id === selectedFormId) || forms[0];

    const handleExportCSV = () => {
        if (filteredResponses.length === 0 || !currentForm) return;
        exportService.exportCSV(filteredResponses, currentForm);
        setShowExportMenu(false);
    };

    const handleExportExcel = () => {
        if (filteredResponses.length === 0 || !currentForm) return;
        exportService.exportExcel(filteredResponses, currentForm);
        setShowExportMenu(false);
    };

    const handleExportPDF = () => {
        if (filteredResponses.length === 0 || !currentForm) return;
        exportService.exportPDF(filteredResponses, currentForm);
        setShowExportMenu(false);
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedResponse || !newNoteText.trim()) return;
        addTeamNote(selectedResponse.id, newNoteText);
        setNewNoteText('');
        setSelectedResponse({
            ...selectedResponse,
            teamNotes: [
                ...selectedResponse.teamNotes,
                { id: `note-${Date.now()}`, author: 'Current User', text: newNoteText, createdAt: new Date().toISOString() }
            ]
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredResponses.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredResponses.map(r => r.id));
        }
    };

    const handleSelectResponse = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        bulkDeleteResponses(selectedIds);
        setSelectedIds([]);
    };

    const handleBulkTag = () => {
        if (selectedIds.length === 0 || !bulkTagText.trim()) return;
        bulkTagResponses(selectedIds, bulkTagText);
        setBulkTagText('');
        setShowBulkTag(false);
        setSelectedIds([]);
    };

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-brand-text flex items-center gap-2">
                        <Inbox className="w-6 h-6 text-brand-primary" /> Live Response Feed
                    </h2>
                    <p className="text-xs text-brand-muted">View, search, tag, and add team notes to incoming submissions.</p>
                </div>

                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                            <span className="text-xs font-semibold text-brand-primary">{selectedIds.length} selected</span>
                            <button onClick={() => setShowBulkTag(true)} className="p-1 rounded-lg text-brand-primary hover:bg-brand-primary/20">
                                <Tag className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={handleBulkDelete} className="p-1 rounded-lg text-red-500 hover:bg-red-500/10">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setSelectedIds([])} className="p-1 rounded-lg text-brand-muted hover:bg-brand-surfaceLight">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="px-4 py-2.5 rounded-xl bg-brand-surfaceLight hover:bg-brand-border text-brand-text font-semibold text-xs border border-brand-border flex items-center space-x-2 transition-colors shrink-0 shadow-card"
                        >
                            <Download className="w-4 h-4 text-brand-accent" />
                            <span>Export Responses</span>
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-brand-surface border border-brand-border rounded-xl shadow-glow z-10 overflow-hidden">
                                <button onClick={handleExportCSV} className="w-full px-4 py-2.5 text-left text-xs text-brand-text hover:bg-brand-surfaceLight flex items-center space-x-2 transition-colors">
                                    <Download className="w-3.5 h-3.5 text-brand-primary" />
                                    <span>Export as CSV</span>
                                </button>
                                <button onClick={handleExportExcel} className="w-full px-4 py-2.5 text-left text-xs text-brand-text hover:bg-brand-surfaceLight flex items-center space-x-2 transition-colors">
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Export as Excel</span>
                                </button>
                                <button onClick={handleExportPDF} className="w-full px-4 py-2.5 text-left text-xs text-brand-text hover:bg-brand-surfaceLight flex items-center space-x-2 transition-colors">
                                    <FileText className="w-3.5 h-3.5 text-red-500" />
                                    <span>Export as PDF</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bulk Tag Modal */}
            {showBulkTag && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-brand-surface border border-brand-border rounded-2xl shadow-glow overflow-hidden">
                        <div className="p-6 space-y-4">
                            <h3 className="text-lg font-bold text-brand-text">Add Tag to {selectedIds.length} Responses</h3>
                            <input
                                type="text"
                                value={bulkTagText}
                                onChange={(e) => setBulkTagText(e.target.value)}
                                placeholder="e.g. Verified, Spam, Follow-up..."
                                className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-sm text-brand-text"
                            />
                            <div className="flex gap-3">
                                <button onClick={() => setShowBulkTag(false)} className="flex-1 py-2.5 rounded-xl bg-brand-surfaceLight text-brand-text text-xs font-semibold border border-brand-border">
                                    Cancel
                                </button>
                                <button onClick={handleBulkTag} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-glow">
                                    Apply Tag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Load error banner */}
            {responsesError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500">
                    Failed to load responses: {responsesError}
                </div>
            )}

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-surface/60 border border-brand-border">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <select
                        value={selectedFormId}
                        onChange={(e) => setSelectedFormId(e.target.value)}
                        className="px-3 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text font-medium"
                    >
                        <option value="All">All Forms ({responses.length})</option>
                        {forms.map((f) => (
                            <option key={f.id} value={f.id}>{f.title}</option>
                        ))}
                    </select>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search within answers..."
                        className="w-full pl-9 pr-4 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted focus:border-brand-primary"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-brand-surface/70 border border-brand-border rounded-2xl overflow-hidden shadow-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-brand-bg/80 border-b border-brand-border text-brand-muted uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-4 py-4">
                                    <button onClick={handleSelectAll} className="text-brand-muted hover:text-brand-text">
                                        {selectedIds.length === filteredResponses.length && filteredResponses.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                    </button>
                                </th>
                                <th className="px-6 py-4">Submission Date</th>
                                <th className="px-6 py-4">Form</th>
                                <th className="px-6 py-4">Key Answers</th>
                                <th className="px-6 py-4">Tags & Team Notes</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/60">
                            {filteredResponses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-brand-muted">
                                        No response submissions match your current filters.
                                        {responses.length === 0 && forms.length > 0 && !responsesError && (
                                            <div className="mt-3 text-[11px] text-amber-500 max-w-xl mx-auto leading-relaxed">
                                                Your account can't currently see any responses. Make sure you are signed in with the same account that created these forms —
                                                responses are only visible to the form owner's account.
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredResponses.map((resp) => {
                                    const form = forms.find((f) => f.id === resp.formId);
                                    const firstAnswer = Object.values(resp.answers)[0];
                                    const isSelected = selectedIds.includes(resp.id);

                                    return (
                                        <tr key={resp.id} className={`hover:bg-brand-surfaceLight/40 transition-colors ${isSelected ? 'bg-brand-primary/5' : ''}`}>
                                            <td className="px-4 py-4">
                                                <button onClick={() => handleSelectResponse(resp.id)} className="text-brand-muted hover:text-brand-text">
                                                    {isSelected ? <CheckSquare className="w-4 h-4 text-brand-primary" /> : <Square className="w-4 h-4" />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-[11px] text-brand-muted">
                                                {new Date(resp.submittedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-brand-text">
                                                {form?.title || resp.formId}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate text-brand-muted">
                                                {firstAnswer ? `${firstAnswer.fieldLabel}: ${firstAnswer.value}` : 'No data'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {resp.tags.map((tag) => (
                                                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {resp.teamNotes.length > 0 && (
                                                        <span className="flex items-center space-x-1 text-[10px] text-amber-400 font-bold">
                                                            <MessageSquare className="w-3 h-3" />
                                                            <span>{resp.teamNotes.length}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => setSelectedResponse(resp)}
                                                    className="px-3 py-1.5 rounded-lg bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white text-xs font-medium transition-all"
                                                >
                                                    Details & Notes
                                                </button>
                                                <button
                                                    onClick={() => deleteResponse(resp.id)}
                                                    className="p-1.5 rounded-lg text-brand-muted hover:text-red-400 hover:bg-brand-surfaceLight"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Response Detail & Team Notes Drawer/Modal */}
            {selectedResponse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl shadow-glow overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-brand-border">
                            <h3 className="text-lg font-bold text-brand-text">Response Details & Team Notes</h3>
                            <button onClick={() => setSelectedResponse(null)} className="text-brand-muted hover:text-brand-text">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            {/* Answers Breakdown */}
                            <div className="space-y-3">
                                <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Submitted Answers</div>
                                {Object.values(selectedResponse.answers).map((ans, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-brand-bg/60 border border-brand-border">
                                        <div className="text-xs font-semibold text-brand-accent">{ans.fieldLabel}</div>
                                        <div className="text-sm font-medium text-brand-text mt-1">{String(ans.value)}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Team Notes */}
                            <div className="space-y-3 pt-4 border-t border-brand-border">
                                <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Team Discussion & Private Notes</div>
                                <div className="space-y-2">
                                    {selectedResponse.teamNotes.map((note) => (
                                        <div key={note.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                                            <div className="flex items-center justify-between font-bold text-amber-300">
                                                <span>{note.author}</span>
                                                <span className="text-[10px] text-brand-muted font-normal">{new Date(note.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-brand-text mt-1">{note.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                                    <input
                                        type="text"
                                        value={newNoteText}
                                        onChange={(e) => setNewNoteText(e.target.value)}
                                        placeholder="Add private note for your team..."
                                        className="flex-1 px-4 py-2 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text"
                                    />
                                    <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold shadow-glow">
                                        Add Note
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
