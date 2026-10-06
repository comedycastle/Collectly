import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Search, FileSpreadsheet, File, Clock, AlertCircle } from 'lucide-react';
import { useCollectlyStore } from '../store/useCollectlyStore';
import { ExportRecord } from '../types';

export const ExportHistoryPage: React.FC = () => {
    const { user } = useCollectlyStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'csv' | 'excel' | 'pdf'>('all');
    const [exports, setExports] = useState<ExportRecord[]>([]);
    const [loadError, setLoadError] = useState('');
    const [loading, setLoading] = useState(true);

    const loadExports = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (!isSupabaseConfigured) {
                setExports([]);
                return;
            }
            const { exportService: dbExports } = await import('../services/formService');
            const rows = await dbExports.getExportHistory();
            setExports(rows.map((r: any) => ({
                id: r.id,
                formId: r.form_id,
                formTitle: r.form_title,
                type: r.type,
                fileUrl: r.file_url || undefined,
                requestedAt: r.requested_at,
                requestedBy: user.fullName,
                recordCount: r.record_count || 0,
            })));
        } catch (e: any) {
            setLoadError(e?.message || 'Could not load export history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (exp: ExportRecord) => {
        try {
            const { exportService: dbExports } = await import('../services/formService');
            await dbExports.deleteExportRecord(exp.id);
            setExports(prev => prev.filter(x => x.id !== exp.id));
        } catch (e: any) {
            setLoadError(e?.message || 'Could not delete export record.');
        }
    };

    const filteredExports = exports.filter((exp) => {
        const matchesSearch = exp.formTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || exp.type === filterType;
        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'csv': return <File className="w-4 h-4 text-emerald-500" />;
            case 'excel': return <FileSpreadsheet className="w-4 h-4 text-blue-500" />;
            case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
            default: return <File className="w-4 h-4 text-brand-muted" />;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'csv': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'excel': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'pdf': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-brand-bg text-brand-muted border-brand-border';
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
            <div>
                <h2 className="text-2xl font-extrabold text-brand-text flex items-center gap-2">
                    <FileText className="w-6 h-6 text-brand-primary" /> Export History
                </h2>
                <p className="text-xs text-brand-muted mt-1">View and manage all your exported response data</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    {(['all', 'csv', 'excel', 'pdf'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filterType === type
                                    ? 'bg-brand-primary text-white shadow-glow'
                                    : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text'
                                }`}
                        >
                            {type === 'all' ? 'All' : type.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search exports..."
                        className="w-full pl-9 pr-4 py-2 bg-brand-surface border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted focus:border-brand-primary"
                    />
                </div>
            </div>

            {/* Load error banner */}
            {loadError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {loadError}
                </div>
            )}

            {/* Export List */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-card">
                {loading ? (
                    <div className="text-center py-16 text-xs text-brand-muted">Loading export history…</div>
                ) : filteredExports.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-brand-text">No Exports Found</h3>
                            <p className="text-xs text-brand-muted max-w-sm mx-auto mt-1">
                                Export your form responses to CSV, Excel, or PDF from the Responses page.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-brand-border/60">
                        {filteredExports.map((exp) => (
                            <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-brand-surfaceLight/40 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center">
                                        {getTypeIcon(exp.type)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-brand-text">{exp.formTitle}</div>
                                        <div className="flex items-center gap-3 text-xs text-brand-muted mt-0.5">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getTypeBadge(exp.type)}`}>
                                                {exp.type.toUpperCase()}
                                            </span>
                                            <span>{exp.recordCount} records</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(exp.requestedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {exp.fileUrl ? (
                                        <a
                                            href={exp.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            title="Download export"
                                            className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    ) : (
                                        <span className="p-2 text-brand-muted/40" title="File no longer available">
                                            <Download className="w-4 h-4" />
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleDelete(exp)}
                                        title="Remove from history"
                                        className="p-2 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};