import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Star, ArrowUp, ArrowDown, Mic, Square, Trash2, MapPin, GripVertical } from 'lucide-react';
import { FormField } from '../types';

export type RendererVariant = 'canvas' | 'preview' | 'public';

export interface FieldRendererProps {
    field: FormField;
    value: any;
    onChange: (v: any) => void;
    variant?: RendererVariant;
    error?: boolean;
    onFileChange?: (file: File) => void;
}

const hashStr = (s: string): number => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h;
};

const stableShuffle = (vals: string[], seed: string): string[] =>
    vals.slice().sort((a, b) => hashStr(seed + a) - hashStr(seed + b));

/* ---------------------------------- Signature ---------------------------------- */

const SignaturePad: React.FC<{ value?: string; onChange: (v: string) => void; disabled?: boolean; error?: boolean }> = ({ value, onChange, disabled, error }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        const w = Math.max(200, (parent?.clientWidth || 320) - 4);
        canvas.width = w * 2;
        canvas.height = 140 * 2;
        canvas.style.width = '100%';
        canvas.style.height = '140px';
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#64748B';
        if (value) {
            const img = new Image();
            img.onload = () => { try { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); } catch { } };
            img.src = value;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / rect.width) * canvas.width,
            y: ((e.clientY - rect.top) / rect.height) * canvas.height,
        };
    };

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (disabled) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        drawingRef.current = true;
        const p = point(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        (e.target as HTMLCanvasElement).setPointerCapture?.(e.pointerId);
    };

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawingRef.current || disabled) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const p = point(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };

    const end = () => {
        if (!drawingRef.current) return;
        drawingRef.current = false;
        const canvas = canvasRef.current;
        if (canvas) onChange(canvas.toDataURL());
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        onChange('');
    };

    return (
        <div className="space-y-1.5">
            <div className={`relative rounded-xl overflow-hidden border ${error ? 'border-red-500' : 'border-brand-border'} bg-brand-bg`}>
                <canvas
                    ref={canvasRef}
                    onPointerDown={start}
                    onPointerMove={move}
                    onPointerUp={end}
                    onPointerLeave={end}
                    className={`block touch-none ${disabled ? 'opacity-70' : 'cursor-crosshair'}`}
                />
                {!value && (
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] text-brand-muted pointer-events-none">
                        {disabled ? 'Signature pad' : 'Draw your signature here'}
                    </span>
                )}
            </div>
            {!disabled && (
                <button type="button" onClick={clear} className="text-[11px] font-semibold text-brand-muted hover:text-red-500 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear signature
                </button>
            )}
        </div>
    );
};

/* ------------------------------------ Map ------------------------------------- */

const parseLatLng = (v: any): { x: number; y: number } | null => {
    if (typeof v !== 'string') return null;
    const m = v.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (!m) return null;
    const lat = parseFloat(m[1]);
    const lng = parseFloat(m[2]);
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return { x: ((lng + 180) / 360) * 100, y: ((90 - lat) / 180) * 100 };
};

const MapPicker: React.FC<{ value?: string; onChange: (v: string) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => {
    const pin = parseLatLng(value);
    const handle = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const lng = (x / 100) * 360 - 180;
        const lat = 90 - (y / 100) * 180;
        onChange(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    };
    return (
        <div className="space-y-1.5">
            <div
                onClick={handle}
                className={`relative h-28 rounded-xl overflow-hidden border border-brand-border ${disabled ? 'cursor-default' : 'cursor-crosshair hover:border-brand-primary'}`}
                style={{
                    background: 'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(135deg, #ecfdf5, #eff6ff)',
                    backgroundSize: '24px 24px, 24px 24px, cover',
                }}
            >
                {pin ? (
                    <div className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
                        <MapPin className="w-6 h-6 text-red-500 fill-red-500 drop-shadow" />
                    </div>
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] text-brand-muted pointer-events-none">
                        {disabled ? 'Map location' : 'Click the map to drop a pin'}
                    </span>
                )}
            </div>
            {value && <p className="text-[10px] font-mono text-brand-muted">📍 {value}</p>}
            {!disabled && (
                <button type="button" onClick={() => onChange('')} className="text-[11px] font-semibold text-brand-muted hover:text-red-500">Clear pin</button>
            )}
        </div>
    );
};

/* ----------------------------------- Audio ------------------------------------ */

const AudioField: React.FC<{ value?: string; onChange: (v: any) => void; disabled?: boolean; onFileChange?: (f: File) => void }> = ({ value, onChange, disabled, onFileChange }) => {
    const [recording, setRecording] = useState(false);
    const recRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const startRec = async () => {
        if (disabled || recording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            chunksRef.current = [];
            mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
            mr.onstop = () => {
                stream.getTracks().forEach((t) => t.stop());
                const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
                const file = new File([blob], `audio-${Date.now()}.webm`, { type: blob.type });
                if (onFileChange) onFileChange(file);
                else onChange(URL.createObjectURL(blob));
            };
            mr.start();
            recRef.current = mr;
            setRecording(true);
        } catch {
            setRecording(false);
        }
    };

    const stopRec = () => {
        try { recRef.current?.stop(); } catch { /* already stopped */ }
        setRecording(false);
    };

    const showPlayer = typeof value === 'string' && value && !value.startsWith('uploading:') && (value.startsWith('blob:') || value.startsWith('http'));

    return (
        <div className="space-y-2">
            {!disabled && (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={recording ? stopRec : startRec}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${recording ? 'bg-red-500/10 border-red-500/40 text-red-500 animate-pulse' : 'bg-brand-bg border-brand-border text-brand-text'}`}
                    >
                        {recording ? <><Square className="w-3.5 h-3.5" /> Stop recording</> : <><Mic className="w-3.5 h-3.5" /> Record audio</>}
                    </button>
                    <label className="px-3 py-2 rounded-xl bg-brand-bg border border-brand-border text-xs font-semibold cursor-pointer hover:border-brand-primary">
                        Upload file
                        <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                if (onFileChange) onFileChange(f);
                                else onChange(URL.createObjectURL(f));
                            }}
                        />
                    </label>
                </div>
            )}
            {typeof value === 'string' && value.startsWith('uploading:') && (
                <p className="text-[11px] text-brand-accent">Uploading {value.replace('uploading:', '')}…</p>
            )}
            {showPlayer && <audio controls src={value as string} className="w-full h-9" />}
            {disabled && !showPlayer && !value && (
                <div className="p-3 rounded-xl bg-brand-bg border border-dashed border-brand-border text-[11px] text-brand-muted flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5" /> Audio recorder
                </div>
            )}
        </div>
    );
};

/* ----------------------------------- Video ------------------------------------ */

const embedUrl = (url: string): string | null => {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return null;
};

const VideoField: React.FC<{ value?: string; onChange: (v: string) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => {
    const src = typeof value === 'string' && value.startsWith('http') ? embedUrl(value) : null;
    return (
        <div className="space-y-2">
            {!disabled && (
                <input
                    type="url"
                    value={String(value || '')}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste a YouTube or Vimeo link…"
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted/50"
                />
            )}
            {src ? (
                <div className="aspect-video rounded-xl overflow-hidden border border-brand-border bg-black">
                    <iframe src={src} title="Video embed" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen />
                </div>
            ) : (
                <div className="p-3 rounded-xl bg-brand-bg border border-dashed border-brand-border text-[11px] text-brand-muted">
                    {disabled ? 'Video embed' : typeof value === 'string' && value ? 'Link saved — no embeddable preview for this URL.' : 'Add a video link to embed it here.'}
                </div>
            )}
        </div>
    );
};

/* ---------------------------------- Payment ----------------------------------- */

const PaymentField: React.FC<{ value?: string; onChange: (v: string) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => {
    const [card, setCard] = useState('');
    const [exp, setExp] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');

    const emit = (c: string, e: string, n: string) => {
        const digits = c.replace(/\D/g, '');
        if (digits.length < 4) { onChange(''); return; }
        const masked = `•••• •••• •••• ${digits.slice(-4)}`;
        onChange(`${masked}${e ? ` • exp ${e}` : ''}${n ? ` • ${n}` : ''}`);
    };

    const inputCls = "w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-xs text-brand-text placeholder-brand-muted/50 font-mono";

    if (disabled) {
        return (
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <input disabled value={String(value || '')} placeholder="•••• •••• •••• 4242" className={`${inputCls} col-span-2`} />
                <input disabled placeholder="MM/YY" className={inputCls} />
                <input disabled placeholder="CVC" className={inputCls} />
                <p className="col-span-2 text-[10px] text-amber-600">Card details are masked — only the last 4 digits are stored.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <input
                value={card}
                onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
                    setCard(formatted);
                    emit(formatted, exp, name);
                }}
                placeholder="Card number (4242 4242 4242 4242)"
                inputMode="numeric"
                className={`${inputCls} col-span-2`}
            />
            <div className="grid grid-cols-3 gap-2">
                <input
                    value={exp}
                    onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                        setExp(v);
                        emit(card, v, name);
                    }}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    className={inputCls}
                />
                <input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="CVC"
                    inputMode="numeric"
                    className={inputCls}
                />
                <input
                    value={name}
                    onChange={(e) => { setName(e.target.value); emit(card, exp, e.target.value); }}
                    placeholder="Name on card"
                    className={inputCls}
                />
            </div>
            <p className="text-[10px] text-brand-muted">Demo payment field — no real charge is made. Only a masked summary is saved.</p>
        </div>
    );
};

/* --------------------------------- Order list --------------------------------- */

const OrderListWidget: React.FC<{
    field: FormField;
    value: any;
    onChange: (v: any) => void;
    disabled?: boolean;
    shuffle: boolean;
}> = ({ field, value, onChange, disabled, shuffle }) => {
    const options = field.options || [];
    const baseOrder = useMemo(() => options.map((o) => o.value), [options]);
    const initial = useMemo(() => (shuffle ? stableShuffle(baseOrder, field.id) : baseOrder), [shuffle, baseOrder, field.id]);
    const order: string[] = Array.isArray(value) && value.length ? value.filter((v) => baseOrder.includes(v)) : initial;
    const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

    const move = (idx: number, dir: -1 | 1) => {
        if (disabled) return;
        const next = order.slice();
        const j = idx + dir;
        if (j < 0 || j >= next.length) return;
        [next[idx], next[j]] = [next[j], next[idx]];
        onChange(next);
    };

    return (
        <div className="space-y-1.5">
            {order.map((v, i) => (
                <div key={v} className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs">
                    <GripVertical className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                    <span className="w-5 h-5 rounded-md bg-brand-primary/10 text-brand-primary text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="flex-1 text-brand-text">{labelOf(v)}</span>
                    {!disabled && (
                        <span className="flex gap-0.5 shrink-0">
                            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-brand-muted hover:text-brand-primary disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} className="p-1 text-brand-muted hover:text-brand-primary disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                        </span>
                    )}
                </div>
            ))}
            {!disabled && <p className="text-[10px] text-brand-muted">Use the arrows to set your order.</p>}
        </div>
    );
};

/* ---------------------------------- Matrix ------------------------------------ */

const DEFAULT_MATRIX_COLUMNS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

const MatrixWidget: React.FC<{
    field: FormField;
    value: any;
    onChange: (v: any) => void;
    disabled?: boolean;
}> = ({ field, value, onChange, disabled }) => {
    const rows = field.options || [];
    const cols = (field.matrixColumns && field.matrixColumns.length ? field.matrixColumns : DEFAULT_MATRIX_COLUMNS);
    const current: Record<string, number> = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return (
        <div className="overflow-x-auto rounded-xl border border-brand-border">
            <div className="min-w-full" style={{ display: 'grid', gridTemplateColumns: `minmax(110px, 1.6fr) repeat(${cols.length}, minmax(54px, 1fr))` }}>
                <div className="p-2 bg-brand-bg text-[10px] font-bold text-brand-muted border-b border-brand-border">Statement</div>
                {cols.map((c) => (
                    <div key={c} className="p-2 bg-brand-bg text-[9px] font-bold text-brand-muted text-center border-b border-brand-border leading-tight">{c}</div>
                ))}
                {rows.map((row) => (
                    <React.Fragment key={row.id}>
                        <div className="p-2 text-xs text-brand-text border-b border-brand-border/60 bg-brand-surface">{row.label}</div>
                        {cols.map((c, ci) => (
                            <label key={`${row.id}-${ci}`} className="p-2 flex items-center justify-center border-b border-brand-border/60 cursor-pointer hover:bg-brand-primary/5">
                                <input
                                    type="radio"
                                    name={`${field.id}-${row.id}`}
                                    disabled={disabled}
                                    checked={current[row.value] === ci}
                                    onChange={() => { if (!disabled) onChange({ ...current, [row.value]: ci }); }}
                                    className="w-3.5 h-3.5 accent-brand-primary"
                                />
                            </label>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

/* --------------------------------- Matching ----------------------------------- */

const MatchingWidget: React.FC<{
    field: FormField;
    value: any;
    onChange: (v: any) => void;
    disabled?: boolean;
}> = ({ field, value, onChange, disabled }) => {
    const pairs = field.matchingPairs || [];
    const rights = pairs.map((p) => p.right);
    const current: Record<string, string> = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return (
        <div className="space-y-2">
            {pairs.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2">
                    <span className="flex-1 p-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs">{i + 1}. {p.left}</span>
                    <span className="text-brand-muted text-xs">→</span>
                    {disabled ? (
                        <span className="flex-1 p-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs">{current[p.id] || p.right}</span>
                    ) : (
                        <select
                            value={current[p.id] || ''}
                            onChange={(e) => onChange({ ...current, [p.id]: e.target.value })}
                            className="flex-1 p-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-text"
                        >
                            <option value="">Match with…</option>
                            {rights.map((r, ri) => <option key={`${r}-${ri}`} value={r}>{r}</option>)}
                        </select>
                    )}
                </div>
            ))}
        </div>
    );
};

/* ------------------------------- Main Renderer -------------------------------- */

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, variant = 'preview', error, onFileChange }) => {
    const disabled = variant === 'canvas';
    const showCorrectMarks = variant !== 'public';
    const inputBg = variant === 'public' ? 'bg-brand-surface' : 'bg-brand-bg';
    const common = `w-full px-4 py-2.5 ${inputBg} border rounded-xl text-xs text-brand-text placeholder-brand-muted/50 ${error ? 'border-red-500' : 'border-brand-border'}`;
    const val = value ?? '';
    const strVal = typeof val === 'object' && !Array.isArray(val) ? '' : String(val ?? '');

    switch (field.type) {
        /* Basic & Contact */
        case 'text':
        case 'email':
        case 'phone':
        case 'url':
        case 'quiz_short':
        case 'quiz_fill_blank': {
            const inputType = field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text';
            const placeholders: Record<string, string> = {
                email: 'you@example.com',
                phone: '+1 (555) 000-0000',
                url: 'https://example.com',
                quiz_fill_blank: 'Type the missing word…',
            };
            return (
                <input
                    type={inputType}
                    disabled={disabled}
                    placeholder={field.placeholder || placeholders[field.type] || 'Type your answer...'}
                    value={strVal}
                    onChange={(e) => onChange(e.target.value)}
                    className={common}
                />
            );
        }
        case 'number':
            return (
                <div className="space-y-1">
                    <input
                        type="number"
                        disabled={disabled}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        placeholder={field.placeholder || 'Enter a number...'}
                        value={strVal}
                        onChange={(e) => onChange(e.target.value)}
                        className={common}
                    />
                    {(field.min !== undefined || field.max !== undefined) && (
                        <p className="text-[10px] text-brand-muted">{field.min ?? '-∞'} to {field.max ?? '∞'}{field.step ? ` • step ${field.step}` : ''}</p>
                    )}
                </div>
            );
        case 'textarea':
            return (
                <textarea
                    rows={3}
                    disabled={disabled}
                    placeholder={field.placeholder || 'Type long detailed answer...'}
                    value={strVal}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full p-4 ${inputBg} border rounded-xl text-xs text-brand-text placeholder-brand-muted/50 ${error ? 'border-red-500' : 'border-brand-border'}`}
                />
            );
        case 'code':
            return (
                <textarea
                    rows={5}
                    disabled={disabled}
                    placeholder={field.placeholder || '// write code here...'}
                    value={strVal}
                    onChange={(e) => onChange(e.target.value)}
                    spellCheck={false}
                    className={`w-full p-4 ${inputBg} border rounded-xl text-xs text-brand-text font-mono placeholder-brand-muted/50 ${error ? 'border-red-500' : 'border-brand-border'}`}
                />
            );
        case 'date':
            return <input type="date" disabled={disabled} value={strVal} onChange={(e) => onChange(e.target.value)} className={common} />;
        case 'time':
            return <input type="time" disabled={disabled} value={strVal} onChange={(e) => onChange(e.target.value)} className={common} />;
        case 'datetime':
            return <input type="datetime-local" disabled={disabled} value={strVal} onChange={(e) => onChange(e.target.value)} className={common} />;

        /* Choice & Selection */
        case 'select':
            return (
                <select disabled={disabled} value={strVal} onChange={(e) => onChange(e.target.value)} className={common}>
                    <option value="">{field.placeholder || 'Select...'}</option>
                    {(field.options || []).map((o) => <option key={o.id} value={o.value}>{o.label}</option>)}
                </select>
            );
        case 'radio':
        case 'quiz_mcq':
        case 'quiz_tf':
            return (
                <div className="space-y-2">
                    {(field.options || []).map((o) => (
                        <label key={o.id} className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer ${strVal === o.value ? 'bg-brand-primary/10 border-brand-primary' : `${inputBg}/50 ${error ? 'border-red-500' : 'border-brand-border'} hover:border-brand-muted`}`}>
                            <input
                                type="radio"
                                name={`fr-${field.id}`}
                                disabled={disabled}
                                checked={strVal === o.value}
                                onChange={() => onChange(o.value)}
                                className="accent-brand-primary"
                            />
                            <span className="flex-1">{o.label}</span>
                            {showCorrectMarks && field.type.startsWith('quiz') && o.isCorrect && (
                                <span className="text-[9px] text-emerald-500 font-bold">✓ correct</span>
                            )}
                        </label>
                    ))}
                </div>
            );
        case 'checkbox': {
            const arr = Array.isArray(val) ? val : [];
            return (
                <div className="space-y-2">
                    {(field.options || []).map((o) => (
                        <label key={o.id} className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer ${arr.includes(o.value) ? 'bg-brand-primary/10 border-brand-primary' : `${inputBg}/50 ${error ? 'border-red-500' : 'border-brand-border'} hover:border-brand-muted`}`}>
                            <input
                                type="checkbox"
                                disabled={disabled}
                                checked={arr.includes(o.value)}
                                onChange={(e) => onChange(e.target.checked ? [...arr, o.value] : arr.filter((v: string) => v !== o.value))}
                                className="accent-brand-primary"
                            />
                            <span>{o.label}</span>
                        </label>
                    ))}
                </div>
            );
        }
        case 'rating': {
            const stars = field.max || 5;
            return (
                <div className="flex items-center gap-1 py-1">
                    {Array.from({ length: stars }, (_, i) => (
                        <button
                            key={i}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(Number(val) === i + 1 ? 0 : i + 1)}
                            className={`p-1 transition-transform ${disabled ? '' : 'hover:scale-110'} ${Number(val) >= i + 1 ? 'text-amber-400' : 'text-slate-400'}`}
                            aria-label={`${i + 1} star`}
                        >
                            <Star className={`w-6 h-6 ${Number(val) >= i + 1 ? 'fill-amber-400' : ''}`} />
                        </button>
                    ))}
                    {Number(val) > 0 && <span className="ml-2 text-xs font-bold text-brand-text">{val}/{stars}</span>}
                </div>
            );
        }
        case 'nps':
            return (
                <div className="space-y-1.5 py-1">
                    <div className="flex flex-wrap gap-1.5">
                        {Array.from({ length: 11 }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                disabled={disabled}
                                onClick={() => onChange(i)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${Number(val) === i ? 'bg-brand-primary text-white shadow-glow scale-110' : `${inputBg} border ${error ? 'border-red-500' : 'border-brand-border'} text-brand-muted hover:text-brand-text`}`}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-brand-muted"><span>Not likely at all</span><span>Extremely likely</span></div>
                </div>
            );
        case 'scale': {
            const min = field.min ?? 1;
            const max = field.max ?? 10;
            const count = Math.max(1, Math.min(max - min + 1, 50));
            return (
                <div className="flex flex-wrap gap-1.5 py-1">
                    {Array.from({ length: count }, (_, i) => {
                        const v = min + i;
                        return (
                            <button
                                key={v}
                                type="button"
                                disabled={disabled}
                                onClick={() => onChange(v)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${Number(val) === v ? 'bg-brand-primary text-white shadow-glow scale-110' : `${inputBg} border ${error ? 'border-red-500' : 'border-brand-border'} text-brand-muted hover:text-brand-text`}`}
                            >
                                {v}
                            </button>
                        );
                    })}
                </div>
            );
        }
        case 'slider': {
            const min = field.min ?? 0;
            const max = field.max ?? 100;
            const num = Number(val);
            const shown = Number.isNaN(num) ? min : num;
            return (
                <div className="space-y-1.5 py-1">
                    <input
                        type="range"
                        disabled={disabled}
                        min={min}
                        max={max}
                        step={field.step || 1}
                        value={shown}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full accent-brand-primary"
                    />
                    <div className="flex justify-between text-[10px] text-brand-muted"><span>{min}</span><span className="font-bold text-brand-text text-xs">{shown}</span><span>{max}</span></div>
                </div>
            );
        }
        case 'ranking':
            return <OrderListWidget field={field} value={val} onChange={onChange} disabled={disabled} shuffle={true} />;
        case 'matrix':
            return <MatrixWidget field={field} value={val} onChange={onChange} disabled={disabled} />;

        /* Advanced & Interactive */
        case 'file': {
            const has = typeof value === 'string' && value && !value.startsWith('uploading:');
            const uploading = typeof value === 'string' && value.startsWith('uploading:');
            return (
                <div className="space-y-2">
                    <label className={`block w-full text-center px-4 py-3 ${inputBg} border ${error ? 'border-red-500' : 'border-brand-border'} rounded-xl text-xs font-semibold cursor-pointer hover:border-brand-primary ${disabled ? 'pointer-events-none opacity-70' : ''}`}>
                        {disabled ? 'File upload' : 'Choose file…'}
                        <input
                            type="file"
                            disabled={disabled}
                            accept={field.acceptedFileTypes || undefined}
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                if (onFileChange) onFileChange(f);
                                else onChange(f.name);
                            }}
                        />
                    </label>
                    {uploading && <p className="text-[11px] text-brand-accent">Uploading {value.replace('uploading:', '')}…</p>}
                    {has && <p className="text-[11px] text-emerald-600 break-all">✓ {value}</p>}
                    {field.maxFileSizeMb ? <p className="text-[10px] text-brand-muted">Max {field.maxFileSizeMb} MB {field.acceptedFileTypes ? `• ${field.acceptedFileTypes}` : ''}</p> : null}
                </div>
            );
        }
        case 'signature':
            return <SignaturePad value={typeof value === 'string' && value && !value.startsWith('uploading:') ? value : ''} onChange={onChange} disabled={disabled} error={error} />;
        case 'color': {
            const hex = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(strVal) ? strVal : '#2563EB';
            return (
                <div className="flex items-center gap-3">
                    <input type="color" disabled={disabled} value={hex} onChange={(e) => onChange(e.target.value)} className="w-12 h-10 rounded-lg border border-brand-border cursor-pointer" />
                    <input type="text" disabled={disabled} value={strVal || hex} onChange={(e) => onChange(e.target.value)} placeholder="#2563EB" className={`${common} w-36 font-mono`} />
                </div>
            );
        }
        case 'map':
            return <MapPicker value={typeof value === 'string' ? value : ''} onChange={onChange} disabled={disabled} />;
        case 'terms':
            return (
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer ${val ? 'bg-emerald-500/5 border-emerald-500/40' : `${inputBg} ${error ? 'border-red-500' : 'border-brand-border'}`}`}>
                    <input
                        type="checkbox"
                        disabled={disabled}
                        checked={!!val}
                        onChange={(e) => onChange(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-brand-primary"
                    />
                    <span className="text-brand-text">{field.placeholder || 'I agree to the terms and conditions'}</span>
                </label>
            );
        case 'payment':
            return <PaymentField value={typeof value === 'string' ? value : ''} onChange={onChange} disabled={disabled} />;
        case 'audio':
            return <AudioField value={typeof value === 'string' ? value : ''} onChange={onChange} disabled={disabled} onFileChange={onFileChange} />;
        case 'video':
            return <VideoField value={typeof value === 'string' ? value : ''} onChange={onChange} disabled={disabled} />;

        /* Layout */
        case 'section':
            if (variant === 'canvas') {
                return field.description ? <p className="text-[11px] text-brand-muted">{field.description}</p> : null;
            }
            return (
                <div className="p-3.5 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
                    <div className="font-bold text-sm text-brand-text">{field.label}</div>
                    {field.description && <div className="text-[11px] text-brand-muted mt-0.5">{field.description}</div>}
                </div>
            );
        case 'page_break':
            return (
                <div className="py-1">
                    <div className="flex items-center gap-2 text-[10px] text-purple-500 font-bold uppercase">
                        <span className="flex-1 h-px border-t border-dashed border-purple-400" />
                        Page Break
                        <span className="flex-1 h-px border-t border-dashed border-purple-400" />
                    </div>
                </div>
            );

        /* Quiz */
        case 'quiz_matching':
            return <MatchingWidget field={field} value={val} onChange={onChange} disabled={disabled} />;
        case 'quiz_ordering':
            return <OrderListWidget field={field} value={val} onChange={onChange} disabled={disabled} shuffle={true} />;

        default:
            return (
                <input
                    disabled={disabled}
                    placeholder={field.placeholder || 'Type your answer...'}
                    value={strVal}
                    onChange={(e) => onChange(e.target.value)}
                    className={common}
                />
            );
    }
};

export default FieldRenderer;
