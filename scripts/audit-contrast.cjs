// Contrast audit for the whole dark/light token system.
//
// Parses the real :root / .dark blocks out of src/index.css and checks every
// foreground/background pair the app actually uses, in BOTH themes.
//
// Usage: node scripts/audit-contrast.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(ROOT, 'src', 'index.css'), 'utf8');

const parseVars = (block) => {
    const out = {};
    for (const m of block.matchAll(/--([\w-]+):\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*;/g)) {
        out[m[1]] = { r: +m[2], g: +m[3], b: +m[4] };
    }
    return out;
};

const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('.dark {'));
const darkBlock = css.slice(css.indexOf('.dark {'), css.indexOf('}', css.indexOf('.dark {')));

const light = parseVars(rootBlock);
// .dark only overrides what it declares — everything else cascades from :root,
// so merge the way the browser would.
const dark = { ...light, ...parseVars(darkBlock) };

const toLinear = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = ({ r, g, b }) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
const ratio = (a, b) => {
    const la = lum(a);
    const lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
// Composite a translucent token over a backdrop (for tint backgrounds).
const over = (fg, bg, alpha) => ({
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
});

const WHITE = { r: 255, g: 255, b: 255 };
const AA_TEXT = 4.5;
const AA_LARGE = 3.0; // >=18.66px bold / >=24px, and non-text graphics

let failures = 0;
const check = (theme, name, fg, bg, min, note = '') => {
    const r = ratio(fg, bg);
    const ok = r >= min - 0.005;
    if (!ok) failures++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} [${theme}] ${name.padEnd(34)} ${r.toFixed(2).padStart(6)}:1 (min ${min})${note}`);
};

for (const [theme, v, pageBg, surface] of [
    ['light', light, v_pageBg = light['brand-bg'], light['brand-surface']],
    ['dark', dark, dark['brand-bg'], dark['brand-surface']],
]) {
    const surfaceLight = v['brand-surface-light'];

    console.log(`\n--- ${theme.toUpperCase()} ---`);

    // Body text
    check(theme, 'text on page bg', v['brand-text'], pageBg, AA_TEXT);
    check(theme, 'text on surface', v['brand-text'], surface, AA_TEXT);
    check(theme, 'text on surfaceLight', v['brand-text'], surfaceLight, AA_TEXT);
    check(theme, 'muted on page bg', v['brand-muted'], pageBg, AA_TEXT);
    check(theme, 'muted on surface', v['brand-muted'], surface, AA_TEXT);
    check(theme, 'muted on surfaceLight', v['brand-muted'], surfaceLight, AA_TEXT);
    check(theme, 'secondary on surface', v['brand-secondary'], surface, AA_TEXT);

    // Accent / primary ink on surfaces and on their own 10% tint
    check(theme, 'accent on surface', v['brand-accent'], surface, AA_TEXT);
    check(theme, 'accent on page bg', v['brand-accent'], pageBg, AA_TEXT);
    check(theme, 'accent on accent/10 tint', v['brand-accent'], over(v['brand-accent'], surface, 0.1), AA_TEXT);
    check(theme, 'primaryInk on surface', v['brand-primary-ink'], surface, AA_TEXT);
    check(theme, 'primaryInk on primary/10 tint', v['brand-primary-ink'], over(v['brand-primary'], surface, 0.1), AA_TEXT);

    // Status inks on surfaces AND on their own 10% tint (badges use these)
    for (const token of ['violet', 'warning', 'success', 'danger', 'info', 'neutral']) {
        check(theme, `${token} on surface`, v[`brand-${token}`], surface, AA_TEXT);
        check(theme, `${token} on ${token}/10 tint`, v[`brand-${token}`], over(v[`brand-${token}`], surface, 0.1), AA_TEXT);
        check(theme, `${token} on page bg`, v[`brand-${token}`], pageBg, AA_TEXT);
    }

    // White labels on solid fills (buttons) — must clear AA in BOTH themes
    check(theme, 'white on primary button', WHITE, v['brand-primary'], AA_TEXT);
    for (const token of ['success-solid', 'warning-solid', 'neutral-solid', 'accent-solid']) {
        check(theme, `white on ${token}`, WHITE, v[`brand-${token}`], AA_TEXT);
    }

    // Gradient CTA endpoints carry white labels
    check(theme, 'white on gradient from', WHITE, v['brand-gradient-from'], AA_TEXT);
    check(theme, 'white on gradient to', WHITE, v['brand-gradient-to'], AA_TEXT);

    // Non-text: icon ink on surfaces and tinted chips. Components use primaryInk for
    // both (identical to primary in light, legible in dark).
    check(theme, 'primaryInk icon on surface (3:1)', v['brand-primary-ink'], surface, AA_LARGE);
    check(theme, 'primaryInk icon on primary/20 chip', v['brand-primary-ink'], over(v['brand-primary'], surface, 0.2), AA_LARGE);
    check(theme, 'primaryInk icon on page bg (3:1)', v['brand-primary-ink'], pageBg, AA_LARGE);

    // Borders should be visible against their surface (non-text 3:1 is ideal,
    // but a 1px divider only needs to be perceptible: flag < 1.3)
    const borderOnSurface = ratio(v['brand-border'], surface);
    if (borderOnSurface < 1.25) {
        console.log(`WARN [${theme}] brand-border on surface only ${borderOnSurface.toFixed(2)}:1 — dividers may be invisible`);
    }
}

console.log(failures === 0 ? '\nCONTRAST AUDIT PASSED (both themes)' : `\n${failures} CONTRAST FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);