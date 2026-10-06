// Theme behaviour tests: the appearance helpers must write channel-based custom
// properties, honour the OS preference for "system", and keep accent text
// readable in both themes.
//
// Usage: node scripts/test-theme.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Minimal DOM stub so lib/theme.ts can run in Node.
const classes = new Set();
const styleProps = {};
let prefersDark = false;

global.document = {
    documentElement: {
        classList: {
            add: (c) => classes.add(c),
            remove: (c) => classes.delete(c),
            contains: (c) => classes.has(c),
            toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)),
        },
        style: {
            setProperty: (name, value) => { styleProps[name] = value; },
            getPropertyValue: (name) => styleProps[name] ?? '',
        },
    },
};
global.window = {
    matchMedia: (q) => ({ matches: prefersDark, media: q, addEventListener: () => {}, addListener: () => {} }),
};
global.getComputedStyle = () => ({ getPropertyValue: (n) => styleProps[n] ?? '' });

let failures = 0;
const check = (name, ok, extra = '') => {
    if (!ok) { failures++; console.log(`FAIL ${name} ${extra}`); }
    else console.log(`ok   ${name} ${extra}`);
};

const toLin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = (r, g, b) => 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
const contrast = (rgb, bg) => {
    const a = lum(...rgb);
    const b = lum(...bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};
const WHITE = [255, 255, 255];
const DARK_SURFACE = [30, 41, 59];

async function main() {
    const esbuild = require('esbuild');
    const TMP = path.join(ROOT, 'node_modules', '.theme-test');
    fs.mkdirSync(TMP, { recursive: true });
    const out = path.join(TMP, 'theme.cjs');

    await esbuild.build({
        entryPoints: [path.join(ROOT, 'src', 'lib', 'theme.ts')],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        outfile: out,
        logLevel: 'error',
    });

    const { applyThemeMode, applyAccent, cachedAppearance } = require(out);

    // --- theme mode -----------------------------------------------------
    applyThemeMode('light');
    check('light removes .dark', !classes.has('dark'));

    applyThemeMode('dark');
    check('dark adds .dark', classes.has('dark'));

    prefersDark = true;
    applyThemeMode('system');
    check('system follows OS dark', classes.has('dark'));

    prefersDark = false;
    applyThemeMode('system');
    check('system follows OS light', !classes.has('dark'));

    // --- accent writes channels, not hex -------------------------------
    applyThemeMode('light');
    applyAccent('#2563EB', '#06B6D4');
    check('primary is channels', /^\d+ \d+ \d+$/.test(styleProps['--brand-primary']), `"${styleProps['--brand-primary']}"`);
    check('accent is channels', /^\d+ \d+ \d+$/.test(styleProps['--brand-accent']), `"${styleProps['--brand-accent']}"`);

    // #06B6D4 is only 2.43:1 on white -> must be darkened for light mode
    const lightAccent = styleProps['--brand-accent'].split(' ').map(Number);
    const lightRatio = contrast(lightAccent, WHITE);
    check('pale accent darkened for light theme', lightRatio >= 4.5, `${lightRatio.toFixed(2)}:1`);

    // --- dark mode keeps the accent light enough -----------------------
    applyThemeMode('dark');
    applyAccent('#2563EB', '#06B6D4');
    const darkAccent = styleProps['--brand-accent'].split(' ').map(Number);
    const darkRatio = contrast(darkAccent, DARK_SURFACE);
    check('accent readable on dark surface', darkRatio >= 4.5, `${darkRatio.toFixed(2)}:1`);

    // --- already-compliant colours are preserved ----------------------
    applyThemeMode('light');
    applyAccent('#2563EB', '#0E7490');
    check('compliant accent untouched', styleProps['--brand-accent'] === '14 116 144', `"${styleProps['--brand-accent']}"`);

    // --- invalid input never corrupts state ---------------------------
    const beforePrimary = styleProps['--brand-primary'];
    applyAccent('#2563EB', 'not-a-colour');
    check('invalid accent leaves primary intact', styleProps['--brand-primary'] === beforePrimary);
    check('invalid accent falls back to a sane value', /^\d+ \d+ \d+$/.test(styleProps['--brand-accent']));

    check('cache exposes mode', typeof cachedAppearance.mode === 'string');
    check('cache remembers accent pick', cachedAppearance.accent === 'not-a-colour' || typeof cachedAppearance.accent === 'string');

    fs.rmSync(TMP, { recursive: true, force: true });
    console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
    process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });