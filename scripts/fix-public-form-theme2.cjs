// Second pass for PublicFormViewPage: the remaining inset panels / alerts whose
// exact class strings differed from the first pass.
//
// Usage: node scripts/fix-public-form-theme.cjs [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const PAGE = path.join(ROOT, 'src', 'pages', 'PublicFormViewPage.tsx');

const original = fs.readFileSync(PAGE, 'utf8');

const PAIRS = [
    // tab-switch warning banner
    ['<div className="max-w-3xl mx-auto w-full mt-4 p-4 rounded-xl bg-brand-danger/20 border border-brand-danger/40 text-brand-danger text-xs space-y-2">',
        '<div className="max-w-3xl mx-auto w-full mt-4 p-4 rounded-xl border text-xs space-y-2" style={{ backgroundColor: dangerBg, borderColor: dangerBorder, color: ui.danger }}>'],

    // page progress track
    ['<div className="h-1.5 w-24 bg-brand-bg rounded-full overflow-hidden">',
        '<div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ backgroundColor: withAlpha(theme.secondaryColor, 0.18) }}>'],

    // every question container
    ['className={`p-5 rounded-xl bg-brand-bg/60 border space-y-3 ${fieldError ? \'border-brand-danger/70 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]\' : \'border-brand-border/80\'}`}',
        'className="p-5 rounded-xl border space-y-3" style={{ backgroundColor: ui.fieldBg, borderColor: fieldError ? dangerBorder : ui.cardBorder, boxShadow: fieldError ? \'0 0 0 1px rgba(239,68,68,0.35)\' : undefined }}'],

    // points badge
    ['<span className="text-[10px] font-bold text-brand-warning bg-brand-warning/10 px-2 py-0.5 rounded">+{field.points} pts</span>',
        '<span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ color: ui.warning, backgroundColor: warningBg }}>+{field.points} pts</span>'],

    // captcha row
    ['<label className="flex items-center gap-3 p-4 rounded-xl border border-brand-border bg-brand-bg/50 text-xs font-semibold cursor-pointer">',
        '<label className="flex items-center gap-3 p-4 rounded-xl border text-xs font-semibold cursor-pointer" style={{ borderColor: ui.cardBorder, backgroundColor: ui.inset }}>'],

    // pass / fail pill
    ["${scoreResult.passed ? 'bg-brand-success/20 text-brand-success border border-brand-success/30' : 'bg-brand-danger/20 text-brand-danger border border-brand-danger/30'}",
        "${scoreResult.passed ? '' : ''}"],
];

let text = original;
const misses = [];
for (const [from, to] of PAIRS) {
    if (!text.includes(from)) { misses.push(from.slice(0, 70)); continue; }
    text = text.split(from).join(to);
}

if (misses.length) console.log(`unmatched: ${misses.length}\n  - ${misses.join('\n  - ')}`);

if (text !== original) {
    console.log(`${APPLY ? 'FIXED' : 'WOULD FIX'} PublicFormViewPage (${PAIRS.length - misses.length}/${PAIRS.length})`);
    if (APPLY) fs.writeFileSync(PAGE, text, 'utf8');
} else {
    console.log('no changes');
}