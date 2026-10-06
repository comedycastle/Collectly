// Repaint PublicFormViewPage + FieldRenderer so the public form follows the
// FORM's palette instead of the app theme.
//
// In dark mode the form card stays painted with the owner's chosen colours
// (usually light), so app-theme tokens produced dark inputs and dark inset
// panels inside a white card.
//
// Usage: node scripts/fix-public-form-theme.cjs [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

const PAGE = path.join(ROOT, 'src', 'pages', 'PublicFormViewPage.tsx');
const RENDERER = path.join(ROOT, 'src', 'components', 'FieldRenderer.tsx');

const replaceAll = (text, pairs, label) => {
    let out = text;
    const misses = [];
    for (const [from, to] of pairs) {
        if (!out.includes(from)) { misses.push(from.slice(0, 60)); continue; }
        out = out.split(from).join(to);
    }
    return { out, misses };
};

// --- FieldRenderer: public variant uses the form-scoped tokens -------------
const rendererPairs = [
    ["const inputBg = variant === 'public' ? 'bg-brand-surface' : 'bg-brand-bg';",
        "const isPublic = variant === 'public';\n    const inputBg = isPublic ? 'bg-field-surface' : 'bg-brand-bg';\n    const borderTone = isPublic ? 'border-field' : 'border-brand-border';\n    const textTone = isPublic ? 'text-field' : 'text-brand-text';\n    const placeholderTone = isPublic ? 'placeholder-field' : 'placeholder-brand-muted';"],
    ["const common = `w-full px-4 py-2.5 ${inputBg} border rounded-xl text-xs text-brand-text placeholder-brand-muted ${error ? 'border-red-500' : 'border-brand-border'}`;",
        "const common = `w-full px-4 py-2.5 ${inputBg} border rounded-xl text-xs ${textTone} ${placeholderTone} ${error ? 'border-red-500' : borderTone}`;"],
    // textarea / code inputs build their own class string
    ["className={`w-full p-4 ${inputBg} border rounded-xl text-xs text-brand-text placeholder-brand-muted/50 ${error ? 'border-red-500' : 'border-brand-border'}`}",
        "className={`w-full p-4 ${inputBg} border rounded-xl text-xs ${textTone} ${placeholderTone} ${error ? 'border-red-500' : borderTone}`}"],
    ["className={`w-full p-4 ${inputBg} border rounded-xl text-xs text-brand-text font-mono placeholder-brand-muted/50 ${error ? 'border-red-500' : 'border-brand-border'}`}",
        "className={`w-full p-4 ${inputBg} border rounded-xl text-xs ${textTone} font-mono ${placeholderTone} ${error ? 'border-red-500' : borderTone}`}"],
];

// --- PublicFormViewPage: inset panels + alerts use the form palette -------
const pagePairs = [
    // page chrome
    ['<div className="max-w-3xl mx-auto w-full flex items-center justify-between py-4 border-b border-brand-border/60">',
        '<div className="max-w-3xl mx-auto w-full flex items-center justify-between py-4" style={{ borderBottomColor: ui.divider }}>'],
    ['className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text"',
        'className="p-2 rounded-xl border" style={{ backgroundColor: theme.surfaceColor, borderColor: ui.cardBorder, color: ui.muted }}'],
    ['<div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-xs text-brand-muted">',
        '<div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs" style={{ backgroundColor: theme.surfaceColor, borderColor: ui.cardBorder, color: ui.muted }}>'],

    // anti-cheat status pills
    ['bg-brand-violet/10 border border-brand-violet/30 text-brand-violet font-semibold',
        'font-semibold'],
    ['bg-brand-warning/10 border border-brand-warning/30 text-brand-warning font-semibold',
        'font-semibold'],

    // warning banners
    ['bg-brand-danger/20 border border-brand-danger/40 text-brand-danger space-y-2',
        'space-y-2'],
    ['bg-brand-warning/10 border border-brand-warning/30 text-brand-warning text-xs flex items-center justify-between',
        'text-xs flex items-center justify-between'],
    ['bg-brand-warning/10 border border-brand-warning/30 text-brand-warning text-xs text-center',
        'text-xs text-center'],

    // inset panels inside the form card
    ['className="flex items-center justify-between p-3 rounded-xl bg-brand-bg/50 border border-brand-border"',
        'className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: ui.inset, borderColor: ui.cardBorder }}'],
    ['className="p-4 rounded-xl bg-brand-bg/50 border border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-4"',
        'className="p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ backgroundColor: ui.inset, borderColor: ui.cardBorder }}'],
    ['className="p-4 rounded-xl border border-brand-border bg-brand-bg/50 text-xs font-semibold cursor-pointer"',
        'className="p-4 rounded-xl border text-xs font-semibold cursor-pointer" style={{ borderColor: ui.cardBorder, backgroundColor: ui.inset }}'],

    // error + result surfaces
    ['className="p-3.5 rounded-xl bg-brand-danger/10 border border-brand-danger/40 text-xs text-brand-danger font-semibold text-center"',
        'className="p-3.5 rounded-xl border text-xs font-semibold text-center" style={{ backgroundColor: dangerBg, borderColor: dangerBorder, color: ui.danger }}'],
    ['className="p-6 rounded-2xl bg-brand-bg/80 border border-brand-border max-w-sm mx-auto space-y-3 shadow-glow"',
        'className="p-6 rounded-2xl border max-w-sm mx-auto space-y-3 shadow-glow" style={{ backgroundColor: ui.inset, borderColor: ui.cardBorder }}'],
    ['w-16 h-16 rounded-full bg-brand-success/20 border border-brand-success/30 text-brand-success',
        'w-16 h-16 rounded-full border'],
    ['${scoreResult.passed ? \'bg-brand-success/20 text-brand-success border border-brand-success/30\' : \'bg-brand-danger/20 text-brand-danger border border-brand-danger/30\'}',
        '${scoreResult.passed ? \'\' : \'\'}'],
    ['className="px-4 py-2 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-xs font-semibold flex items-center gap-1 disabled:opacity-50"',
        'className="px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 disabled:opacity-50" style={{ backgroundColor: ui.insetSolid, borderColor: ui.cardBorder, color: theme.textColor }}'],

    // respondent inputs follow the form palette
    ['className="w-full px-4 py-2.5 bg-brand-surface border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-muted"',
        'className="w-full px-4 py-2.5 bg-field-surface border-field text-field placeholder-field rounded-xl text-xs"'],
];

const apply = (file, pairs, label) => {
    const original = fs.readFileSync(file, 'utf8');
    const { out, misses } = replaceAll(original, pairs, label);
    if (misses.length) console.log(`  ${label} unmatched: ${misses.length}`);
    if (out !== original) {
        console.log(`${APPLY ? 'FIXED' : 'WOULD FIX'} ${label}`);
        if (APPLY) fs.writeFileSync(file, out, 'utf8');
    }
};

apply(RENDERER, rendererPairs, 'FieldRenderer');
apply(PAGE, pagePairs, 'PublicFormViewPage');