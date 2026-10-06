import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, Monitor, Globe, Sparkles, CheckCircle2, Clock, Users, Download, RefreshCw, GitBranch, Star, ShieldAlert } from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line, FunnelChart, Funnel, LabelList,
} from 'recharts';
import { useCollectlyStore } from '../store/useCollectlyStore';

const PRIMARY = '#2563EB';
const ACCENT = '#06B6D4';
const PURPLE = '#8B5CF6';
const EMERALD = '#10B981';
const AMBER = '#F59E0B';
const RED = '#EF4444';
const SLATE = '#64748B';

const tooltipStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '12px',
} as const;

export const AnalyticsPage: React.FC = () => {
    const { forms, responses, loadResponsesFromSupabase } = useCollectlyStore();
    const [selectedFormId, setSelectedFormId] = useState<string>('all');
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
    const [section, setSection] = useState<'overview' | 'audience' | 'questions' | 'sentiment' | 'quiz'>('overview');
    const [refreshing, setRefreshing] = useState(false);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        loadResponsesFromSupabase(selectedFormId === 'all' ? undefined : selectedFormId);
    }, [selectedFormId]);

    useEffect(() => {
        (async () => {
            try {
                const { isSupabaseConfigured } = await import('../lib/supabaseClient');
                if (!isSupabaseConfigured) return;
                const { analyticsService } = await import('../services/formService');
                if (selectedFormId !== 'all') {
                    const evts = await analyticsService.getFunnelData(selectedFormId).catch(() => []);
                    setEvents(evts || []);
                    await analyticsService.trackEvent(selectedFormId, 'analytics_view', { timeRange }).catch(() => {});
                } else {
                    setEvents([]);
                }
            } catch {}
        })();
    }, [selectedFormId, timeRange]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadResponsesFromSupabase(selectedFormId === 'all' ? undefined : selectedFormId);
        setRefreshing(false);
    };

    const filteredResponses = useMemo(() => {
        let filtered = selectedFormId === 'all' ? responses : responses.filter(r => r.formId === selectedFormId);
        if (timeRange !== 'all') {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
            const cutoff = new Date(Date.now() - days * 86400000);
            filtered = filtered.filter(r => new Date(r.submittedAt) >= cutoff);
        }
        return filtered;
    }, [responses, selectedFormId, timeRange]);

    const selectedForm = forms.find(f => f.id === selectedFormId);

    // KPI stats
    const stats = useMemo(() => {
        const total = filteredResponses.length;
        const positive = filteredResponses.filter(r => r.sentiment === 'positive').length;
        const negative = filteredResponses.filter(r => r.sentiment === 'negative').length;
        const neutral = filteredResponses.filter(r => r.sentiment === 'neutral').length;
        const avgTime = total > 0 ? Math.round(filteredResponses.reduce((a, r) => a + r.timeSpentSeconds, 0) / total) : 0;
        const passed = filteredResponses.filter(r => r.passed === true).length;
        const failed = filteredResponses.filter(r => r.passed === false).length;
        const flagged = filteredResponses.filter(r => r.tags.some((t: string) => t.toLowerCase().includes('flag') || t.toLowerCase().includes('tab-switch'))).length;
        return { total, positive, negative, neutral, avgTime, passed, failed, flagged };
    }, [filteredResponses]);

    // Timeline (per day, last N)
    const timeline = useMemo(() => {
        const map: Record<string, number> = {};
        filteredResponses.forEach((r) => {
            const d = new Date(r.submittedAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map).sort().slice(-14).map(([date, count]) => ({
            date: date.slice(5),
            count,
            full: date,
        }));
    }, [filteredResponses]);

    // Hourly distribution
    const hourly = useMemo(() => {
        const buckets = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}h`, count: 0 }));
        filteredResponses.forEach((r) => {
            const h = new Date(r.submittedAt).getHours();
            buckets[h].count++;
        });
        return buckets;
    }, [filteredResponses]);

    // Weekday distribution
    const weekday = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const buckets = days.map((d) => ({ day: d, count: 0 }));
        filteredResponses.forEach((r) => {
            buckets[new Date(r.submittedAt).getDay()].count++;
        });
        return buckets;
    }, [filteredResponses]);

    // Device + geo
    const deviceData = useMemo(() => {
        const c: Record<'desktop' | 'tablet' | 'mobile' | 'unknown', number> = { desktop: 0, tablet: 0, mobile: 0, unknown: 0 };
        filteredResponses.forEach((r) => {
            const d = (r.deviceInfo as any)?.device as string;
            if (d === 'desktop' || d === 'tablet' || d === 'mobile') c[d]++;
            else c.unknown++;
        });
        return [
            { name: 'Desktop', value: c.desktop, color: PRIMARY },
            { name: 'Mobile', value: c.mobile, color: ACCENT },
            { name: 'Tablet', value: c.tablet, color: PURPLE },
            ...(c.unknown > 0 ? [{ name: 'Unknown', value: c.unknown, color: SLATE }] : []),
        ].filter((d) => d.value > 0);
    }, [filteredResponses]);

    const geoData = useMemo(() => {
        const m: Record<string, number> = {};
        filteredResponses.forEach((r) => {
            const c = (r.deviceInfo as any)?.country || 'Unknown';
            m[c] = (m[c] || 0) + 1;
        });
        return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
    }, [filteredResponses]);

    // Sentiment
    const sentimentData = useMemo(() => [
        { name: 'Positive', value: stats.positive, color: EMERALD },
        { name: 'Neutral', value: stats.neutral, color: SLATE },
        { name: 'Negative', value: stats.negative, color: RED },
    ].filter((s) => s.value > 0), [stats]);

    const sentimentTrend = useMemo(() => {
        const map: Record<string, { date: string; positive: number; neutral: number; negative: number }> = {};
        filteredResponses.forEach((r) => {
            const d = new Date(r.submittedAt);
            const key = `${d.getMonth() + 1}/${d.getDate()}`;
            if (!map[key]) map[key] = { date: key, positive: 0, neutral: 0, negative: 0 };
            if (r.sentiment) map[key][r.sentiment]++;
        });
        return Object.values(map).slice(-14);
    }, [filteredResponses]);

    // Funnel: real view events when available, else estimate
    const funnel = useMemo(() => {
        const views = events.filter((e) => e.event_type === 'form_view').length;
        const submits = events.filter((e) => e.event_type === 'form_submit').length;
        const completed = stats.total;
        const v = views > 0 ? views : Math.round(completed * 1.35) || 0;
        const started = submits > 0 ? Math.max(submits, completed) : Math.round(v * 0.88);
        return [
            { name: 'Viewed form', value: Math.max(v, started, completed), fill: PRIMARY },
            { name: 'Started filling', value: Math.max(started, completed), fill: ACCENT },
            { name: 'Submitted', value: completed, fill: PURPLE },
        ];
    }, [events, stats.total]);

    // NPS analysis (first NPS field found)
    const nps = useMemo(() => {
        if (!selectedForm) return null;
        const npsField = selectedForm.fields.find((f) => f.type === 'nps');
        if (!npsField) return null;
        const scores = filteredResponses.map((r) => Number(r.answers[npsField.id]?.value)).filter((n) => !Number.isNaN(n));
        if (scores.length === 0) return null;
        const prom = scores.filter((s) => s >= 9).length;
        const pass = scores.filter((s) => s >= 7 && s <= 8).length;
        const detr = scores.filter((s) => s <= 6).length;
        const dist = Array.from({ length: 11 }, (_, s) => ({ score: s, count: scores.filter((x) => x === s).length }));
        return { score: Math.round((prom / scores.length) * 100 - (detr / scores.length) * 100), prom, pass, detr, total: scores.length, dist };
    }, [selectedForm, filteredResponses]);

    // Rating averages
    const ratingAvgs = useMemo(() => {
        if (!selectedForm) return [];
        return selectedForm.fields
            .filter((f) => f.type === 'rating' || f.type === 'scale')
            .map((f) => {
                const vals = filteredResponses.map((r) => Number(r.answers[f.id]?.value)).filter((n) => !Number.isNaN(n) && n > 0);
                return { name: f.label.length > 28 ? f.label.slice(0, 28) + '…' : f.label, avg: vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0, responses: vals.length, max: f.max || 5 };
            })
            .filter((r) => r.responses > 0);
    }, [selectedForm, filteredResponses]);

    // Per-question choice distributions
    const questionCharts = useMemo(() => {
        if (!selectedForm) return [];
        return selectedForm.fields
            .filter((f) => ['select', 'radio', 'checkbox', 'quiz_mcq', 'quiz_tf'].includes(f.type) && f.options?.length)
            .map((f) => {
                const counts: Record<string, number> = {};
                f.options!.forEach((o) => { counts[o.label] = 0; });
                filteredResponses.forEach((r) => {
                    const v = r.answers[f.id]?.value;
                    if (Array.isArray(v)) {
                        v.forEach((vv) => {
                            const opt = f.options!.find((o) => o.value === vv);
                            if (opt) counts[opt.label]++;
                        });
                    } else if (v !== undefined && v !== '') {
                        const opt = f.options!.find((o) => o.value === v);
                        if (opt) counts[opt.label]++;
                    }
                });
                return {
                    field: f,
                    data: Object.entries(counts).map(([name, count], i) => ({ name: name.length > 22 ? name.slice(0, 22) + '…' : name, count, correct: !!f.options![i]?.isCorrect })),
                };
            })
            .filter((q) => q.data.some((d) => d.count > 0));
    }, [selectedForm, filteredResponses]);

    // Quiz score histogram + pass pie
    const scoreHist = useMemo(() => {
        const buckets = [
            { name: '0-49', count: 0 }, { name: '50-69', count: 0 }, { name: '70-89', count: 0 }, { name: '90-100', count: 0 },
        ];
        filteredResponses.forEach((r) => {
            if (r.score === undefined || !r.totalPossiblePoints) return;
            const pct = (r.score / r.totalPossiblePoints) * 100;
            if (pct < 50) buckets[0].count++;
            else if (pct < 70) buckets[1].count++;
            else if (pct < 90) buckets[2].count++;
            else buckets[3].count++;
        });
        return buckets;
    }, [filteredResponses]);

    const passPie = useMemo(() => [
        { name: 'Passed', value: stats.passed, color: EMERALD },
        { name: 'Failed', value: stats.failed, color: RED },
    ].filter((s) => s.value > 0), [stats]);

    const handleExportCSV = () => {
        const rows = [
            ['Metric', 'Value'],
            ['Form', selectedForm?.title || 'All forms'],
            ['Time range', timeRange],
            ['Total responses', stats.total],
            ['Positive', stats.positive],
            ['Neutral', stats.neutral],
            ['Negative', stats.negative],
            ['Avg time (s)', stats.avgTime],
            ['Passed', stats.passed],
            ['Failed', stats.failed],
            ['Flagged', stats.flagged],
            [],
            ['Date', 'Responses'],
            ...timeline.map((t) => [t.full, t.count]),
        ];
        const csv = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Collectly_Analytics_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'audience', label: 'Audience', icon: Users },
        { id: 'questions', label: 'Questions', icon: GitBranch },
        { id: 'sentiment', label: 'Sentiment', icon: Sparkles },
        { id: 'quiz', label: 'Quiz Performance', icon: CheckCircle2 },
    ] as const;

    const Card = ({ title, subtitle, children, span }: { title: string; subtitle?: string; children: React.ReactNode; span?: boolean }) => (
        <div className={`p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-card ${span ? 'lg:col-span-2' : ''}`}>
            <h3 className="text-sm font-bold text-brand-text">{title}</h3>
            {subtitle && <p className="text-[11px] text-brand-muted mt-0.5 mb-3">{subtitle}</p>}
            <div className={!subtitle ? 'mt-3' : ''}>{children}</div>
        </div>
    );

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-brand-text flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-brand-primary" /> Analytics & Funnel Insights
                    </h2>
                    <p className="text-xs text-brand-muted">Realtime performance, funnels, audience, per-question breakdowns and AI sentiment</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <select value={selectedFormId} onChange={(e) => setSelectedFormId(e.target.value)} className="px-3 py-2 bg-brand-surface border border-brand-border rounded-xl text-xs font-medium max-w-[220px]">
                        <option value="all">All Forms</option>
                        {forms.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
                    </select>
                    <div className="flex items-center space-x-1 p-1 bg-brand-surface border border-brand-border rounded-xl">
                        {(['7d', '30d', '90d', 'all'] as const).map((r) => (
                            <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${timeRange === r ? 'bg-brand-primary text-white' : 'text-brand-muted hover:text-brand-text'}`}>
                                {r === 'all' ? 'All' : r}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleRefresh} disabled={refreshing} className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text disabled:opacity-50">
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={handleExportCSV} className="px-3 py-2 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold flex items-center gap-1.5 hover:border-brand-primary">
                        <Download className="w-3.5 h-3.5 text-brand-accent" /> Export CSV
                    </button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                {[
                    { label: 'Responses', value: stats.total, icon: Users, color: PRIMARY },
                    { label: 'Avg Time', value: `${Math.floor(stats.avgTime / 60)}m ${stats.avgTime % 60}s`, icon: Clock, color: ACCENT },
                    { label: 'Positive', value: `${stats.total ? Math.round((stats.positive / stats.total) * 100) : 0}%`, icon: Sparkles, color: EMERALD },
                    { label: 'Pass Rate', value: stats.passed + stats.failed > 0 ? `${Math.round((stats.passed / (stats.passed + stats.failed)) * 100)}%` : '—', icon: CheckCircle2, color: PURPLE },
                    { label: 'Flagged', value: stats.flagged, icon: ShieldAlert, color: stats.flagged > 0 ? RED : SLATE },
                    { label: 'Views (tracked)', value: events.filter((e) => e.event_type === 'form_view').length || '—', icon: BarChart3, color: AMBER },
                ].map((k) => {
                    const Icon = k.icon;
                    return (
                        <div key={k.label} className="p-4 rounded-2xl bg-brand-surface border border-brand-border shadow-card">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-brand-muted">{k.label}</span>
                                <Icon className="w-4 h-4" style={{ color: k.color }} />
                            </div>
                            <div className="text-xl font-black text-brand-text mt-1">{k.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Section tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    return (
                        <button key={t.id} onClick={() => setSection(t.id)} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap ${section === t.id ? 'bg-brand-primary text-white shadow-glow' : 'bg-brand-surface border border-brand-border text-brand-muted'}`}>
                            <Icon className="w-3.5 h-3.5" /> {t.label}
                        </button>
                    );
                })}
            </div>

            {stats.total === 0 ? (
                <div className="text-center py-16 bg-brand-surface rounded-2xl border border-dashed border-brand-border">
                    <BarChart3 className="w-10 h-10 text-brand-muted mx-auto mb-3" />
                    <h3 className="font-bold text-brand-text">No responses in this view</h3>
                    <p className="text-xs text-brand-muted mt-1">Share your form to start collecting analytics, or widen the time range.</p>
                </div>
            ) : (
                <>
                    {section === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <Card title="Response Volume" subtitle="Submissions per day (last 14 days)" span>
                                <ResponsiveContainer width="100%" height={240}>
                                    <AreaChart data={timeline} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
                                                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0.02} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke={SLATE} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Area type="monotone" dataKey="count" name="Responses" stroke={PRIMARY} strokeWidth={2.5} fill="url(#volGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Conversion Funnel" subtitle={events.length ? 'From tracked view/submit events' : 'Estimated from submissions'}>
                                <ResponsiveContainer width="100%" height={240}>
                                    <FunnelChart>
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Funnel dataKey="value" data={funnel} isAnimationActive>
                                            <LabelList position="right" fill={SLATE} stroke="none" dataKey="name" fontSize={11} />
                                        </Funnel>
                                    </FunnelChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                                    {funnel.map((f) => (
                                        <div key={f.name} className="p-2 rounded-xl bg-brand-bg border border-brand-border">
                                            <div className="text-sm font-black text-brand-text">{f.value}</div>
                                            <div className="text-[10px] text-brand-muted">{f.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card title="Responses by Hour" subtitle="When do people respond? (local time)">
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={hourly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="hour" interval={3} tick={{ fontSize: 9 }} stroke={SLATE} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="count" name="Responses" radius={[4, 4, 0, 0]}>
                                            {hourly.map((_, i) => <Cell key={i} fill={i >= 9 && i <= 17 ? ACCENT : PRIMARY} opacity={0.85} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Responses by Weekday" subtitle="Weekly rhythm">
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={weekday} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke={SLATE} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="count" name="Responses" fill={PURPLE} radius={[4, 4, 0, 0]} opacity={0.85} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    )}

                    {section === 'audience' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <Card title="Device Split" subtitle="Where respondents answer from">
                                {deviceData.length ? (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                                                {deviceData.map((d) => <Cell key={d.name} fill={d.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <p className="text-xs text-brand-muted text-center py-10">No device data yet.</p>}
                            </Card>
                            <Card title="Top Locations" subtitle="Countries by response count">
                                {geoData.length ? (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart data={geoData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} stroke={SLATE} />
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Bar dataKey="count" name="Responses" fill={ACCENT} radius={[0, 6, 6, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : <p className="text-xs text-brand-muted text-center py-10">No location data yet.</p>}
                            </Card>
                            <Card title="Browser & OS Mix" subtitle="Latest respondent environments" span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                    {filteredResponses.slice(0, 12).map((r) => (
                                        <div key={r.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs">
                                            <Monitor className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                                            <span className="font-medium truncate">{(r.deviceInfo as any)?.browser || 'Unknown browser'}</span>
                                            <span className="text-brand-muted truncate">• {(r.deviceInfo as any)?.os || 'Unknown OS'}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {section === 'questions' && (
                        <div className="space-y-5">
                            {!selectedForm ? (
                                <div className="text-center py-12 bg-brand-surface rounded-2xl border border-dashed border-brand-border text-sm text-brand-muted">
                                    Select a single form above to see per-question answer distributions.
                                </div>
                            ) : (
                                <>
                                    {nps && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            <Card title={`NPS Score: ${nps.score}`} subtitle={`${nps.total} scored responses • Promoters ${nps.prom} • Passives ${nps.pass} • Detractors ${nps.detr}`}>
                                                <ResponsiveContainer width="100%" height={220}>
                                                    <BarChart data={nps.dist} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                                        <XAxis dataKey="score" tick={{ fontSize: 10 }} stroke={SLATE} />
                                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                                        <Tooltip contentStyle={tooltipStyle} />
                                                        <Bar dataKey="count" name="Votes" radius={[4, 4, 0, 0]}>
                                                            {nps.dist.map((d) => <Cell key={d.score} fill={d.score >= 9 ? EMERALD : d.score >= 7 ? AMBER : RED} />)}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Card>
                                            {ratingAvgs.length > 0 && (
                                                <Card title="Average Ratings" subtitle="Mean score per rating field">
                                                    <ResponsiveContainer width="100%" height={220}>
                                                        <BarChart data={ratingAvgs} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                                            <XAxis type="number" domain={[0, 'dataMax']} tick={{ fontSize: 10 }} stroke={SLATE} />
                                                            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} stroke={SLATE} />
                                                            <Tooltip contentStyle={tooltipStyle} />
                                                            <Bar dataKey="avg" name="Average" fill={AMBER} radius={[0, 6, 6, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </Card>
                                            )}
                                        </div>
                                    )}
                                    {ratingAvgs.length > 0 && !nps && (
                                        <Card title="Average Ratings" subtitle="Mean score per rating field">
                                            <ResponsiveContainer width="100%" height={Math.max(180, ratingAvgs.length * 60)}>
                                                <BarChart data={ratingAvgs} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                                    <XAxis type="number" domain={[0, 'dataMax']} tick={{ fontSize: 10 }} stroke={SLATE} />
                                                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10 }} stroke={SLATE} />
                                                    <Tooltip contentStyle={tooltipStyle} />
                                                    <Bar dataKey="avg" name="Average" fill={AMBER} radius={[0, 6, 6, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Card>
                                    )}
                                    {questionCharts.length === 0 ? (
                                        <div className="text-center py-12 bg-brand-surface rounded-2xl border border-dashed border-brand-border text-sm text-brand-muted">
                                            No choice-question answers in this view yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            {questionCharts.map((q) => (
                                                <Card key={q.field.id} title={q.field.label} subtitle={`${q.field.type} • ${q.data.reduce((a, d) => a + d.count, 0)} answers`}>
                                                    <ResponsiveContainer width="100%" height={200}>
                                                        <BarChart data={q.data} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                                            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} stroke={SLATE} />
                                                            <Tooltip contentStyle={tooltipStyle} />
                                                            <Bar dataKey="count" name="Votes" radius={[0, 6, 6, 0]}>
                                                                {q.data.map((d, i) => <Cell key={i} fill={d.correct ? EMERALD : PRIMARY} opacity={d.correct ? 1 : 0.8} />)}
                                                            </Bar>
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                    {ratingAvgs.length === 0 && !nps && questionCharts.length > 0 && (
                                        <p className="text-[11px] text-brand-muted text-center flex items-center justify-center gap-1">
                                            <Star className="w-3 h-3 text-amber-500" /> Green bars mark correct quiz options.
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {section === 'sentiment' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <Card title="Sentiment Split" subtitle={`${stats.total} analyzed responses`}>
                                {sentimentData.length ? (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                                                {sentimentData.map((s) => <Cell key={s.name} fill={s.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <p className="text-xs text-brand-muted text-center py-10">No sentiment data yet.</p>}
                            </Card>
                            <Card title="Sentiment Trend" subtitle="Positive vs negative over time">
                                {sentimentTrend.length ? (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <LineChart data={sentimentTrend} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke={SLATE} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Legend wrapperStyle={{ fontSize: 11 }} />
                                            <Line type="monotone" dataKey="positive" name="Positive" stroke={EMERALD} strokeWidth={2.5} dot={false} />
                                            <Line type="monotone" dataKey="neutral" name="Neutral" stroke={SLATE} strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="negative" name="Negative" stroke={RED} strokeWidth={2.5} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : <p className="text-xs text-brand-muted text-center py-10">Not enough data for a trend yet.</p>}
                            </Card>
                        </div>
                    )}

                    {section === 'quiz' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <Card title="Score Distribution" subtitle="Quiz attempts by score band">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={scoreHist} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke={SLATE} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke={SLATE} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="count" name="Attempts" radius={[6, 6, 0, 0]}>
                                            {[RED, AMBER, ACCENT, EMERALD].map((c, i) => <Cell key={i} fill={c} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card title="Pass vs Fail" subtitle={`${stats.passed} passed • ${stats.failed} failed`}>
                                {passPie.length ? (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie data={passPie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                                                {passPie.map((s) => <Cell key={s.name} fill={s.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <p className="text-xs text-brand-muted text-center py-10">No graded attempts in this view.</p>}
                            </Card>
                        </div>
                    )}
                </>
            )}

            <div className="flex items-center gap-2 text-[11px] text-brand-muted">
                <Globe className="w-3.5 h-3.5" />
                <span>Live responses + tracked view/submit events. Switch forms or ranges to explore.</span>
            </div>
        </div>
    );
};
