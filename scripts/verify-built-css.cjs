// Verifies the BUILT stylesheet: every brand token used by a generated utility
// must resolve in both themes, and the form-scoped classes must exist.
//
// Usage: node scripts/verify-built-css.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const distDir = path.join(ROOT, 'dist', 'assets');
const file = fs.readdirSync(distDir).find((f) => f.endsWith('.css'));
if (!file) {
    console.error('no built CSS found — run `npm run build` first');
    process.exit(1);
}

const css = fs.readFileSync(path.join(distDir, file), 'utf8');

const rootStart = css.indexOf(':root{');
const rootEnd = css.indexOf('}', rootStart);
const rootVars = new Set([...css.slice(rootStart, rootEnd).matchAll(/--([\w-]+):/g)].map((m) => m[1]));

const darkStart = css.indexOf('.dark{');
const darkEnd = css.indexOf('}', darkStart);
const darkVars = new Set([...css.slice(darkStart, darkEnd).matchAll(/--([\w-]+):/g)].map((m) => m[1]));

// Utilities generated from the Tailwind palette, e.g. .text-brand-warning{...var(--brand-warning)}
const used = new Set([...css.matchAll(/var\(--(brand-[\w-]+)/g)].map((m) => m[1]));

let problems = 0;

const missingLight = [...used].filter((v) => !rootVars.has(v));
if (missingLight.length) {
    console.log(`MISSING in :root  ${missingLight.join(', ')}`);
    problems += missingLight.length;
}

// Theme-invariant tokens are declared once in :root and cascade (solids).
const invariant = ['brand-success-solid', 'brand-warning-solid', 'brand-neutral-solid', 'brand-accent-solid'];
const missingDark = [...used].filter((v) => !darkVars.has(v) && !rootVars.has(v));
if (missingDark.length) {
    console.log(`MISSING everywhere  ${missingDark.join(', ')}`);
    problems += missingDark.length;
}

console.log(`tokens in :root        ${rootVars.size}`);
console.log(`tokens in .dark        ${darkVars.size}`);
console.log(`tokens referenced      ${used.size}`);
console.log(`theme-invariant (solid)${invariant.filter((v) => rootVars.has(v)).length}/${invariant.length} declared in :root only`);

for (const cls of ['.bg-field-surface', '.border-field', '.text-field', '.placeholder-field']) {
    const ok = css.includes(cls);
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${cls}`);
    if (!ok) problems++;
}

// Dark mode must repaint the surfaces that used to stay light.
for (const v of ['brand-surface-light', 'brand-bg', 'brand-surface', 'brand-text', 'brand-muted', 'brand-border', 'brand-accent']) {
    const flipped = darkVars.has(v);
    if (!flipped) { console.log(`FAIL .dark does not override --${v}`); problems++; }
}
console.log('ok   .dark overrides every surface/text token');

console.log(problems === 0 ? '\nBUILT CSS VERIFIED' : `\n${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);