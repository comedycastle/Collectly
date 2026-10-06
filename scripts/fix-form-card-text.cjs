// Final pass for PublicFormViewPage: text inside the form card still used
// APP theme colours (text-brand-text / text-brand-muted / text-brand-accent /
// text-brand-danger). Those flip to near-white in dark mode while the card stays
// painted with the form's own light palette — i.e. invisible text.
//
// Usage: node scripts/fix-form-card-text.cjs [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const PAGE = path.join(ROOT, 'src', 'pages', 'PublicFormViewPage.tsx');

const original = fs.readFileSync(PAGE, 'utf8');

const PAIRS = [
    ['<span className="text-xs font-semibold text-brand-muted">Page {currentPage} of {totalPages}</span>',
        '<span className="text-xs font-semibold" style={{ color: ui.muted }}>Page {currentPage} of {totalPages}</span>'],

    ['<label className="text-sm font-bold text-brand-text flex items-center gap-2">\n                                        <span className="text-brand-accent">Q{globalIndex + 1}.</span> {field.label}\n                                        {field.required && <span className="text-brand-danger text-xs">*</span>}',
        '<label className="text-sm font-bold flex items-center gap-2" style={{ color: theme.textColor }}>\n                                        <span style={{ color: ui.accent }}>Q{globalIndex + 1}.</span> {field.label}\n                                        {field.required && <span className="text-xs" style={{ color: ui.danger }}>*</span>'],

    ['{field.description && !isLayout && <p className="text-xs text-brand-muted">{field.description}</p>}',
        '{field.description && !isLayout && <p className="text-xs" style={{ color: ui.muted }}>{field.description}</p>'],

    ['{fieldError && <p className="text-[11px] text-brand-danger font-semibold">{fieldError}</p>}',
        '{fieldError && <p className="text-[11px] font-semibold" style={{ color: ui.danger }}>{fieldError}</p>'],

    ['<AlertTriangle className="w-5 h-5 text-brand-danger shrink-0" />',
        '<AlertTriangle className="w-5 h-5 shrink-0" style={{ color: ui.danger }} />'],
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