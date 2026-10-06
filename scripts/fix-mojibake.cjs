// Targeted mojibake fix for files that contain a MIX of correct UTF-8 and
// cp1252-mangled sequences (index.css was spliced by PowerShell and then edited
// again afterwards). A full byte reversal would corrupt the correct characters,
// so only known mangled sequences are substituted.
//
// Usage: node scripts/fix-mojibake.cjs [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

// Each entry: the 3-character sequence cp1252 produced, and the real character.
const SEQUENCES = [
    ['\u00E2\u20AC\u201D', '\u2014'], // â€”  em dash
    ['\u00E2\u20AC\u00A2', '\u2022'], // â€¢  bullet
    ['\u00E2\u20AC\u2122', '\u2122'], // â€tm trademark
    ['\u00E2\u0080\u0099', '\u201D'], // â€™  right quote
    ['\u00E2\u0080\u0098', '\u201C'], // â€œ  left quote
    ['\u00E2\u0080\u0093', '\u2013'], // â€“  en dash
    ['\u00E2\u0080\u009A', '\u0161'], // â€š  s-caron
    ['\u00C2\u00A0', '\u00A0'],        // Â   nbsp
];

const targets = [
    path.join(ROOT, 'src', 'index.css'),
    ...['components', 'pages', 'lib', 'store', 'services', 'hooks'].map((d) =>
        path.join(ROOT, 'src', d)
    ),
];

const walk = (p, out = []) => {
    if (!fs.existsSync(p)) return out;
    const st = fs.statSync(p);
    if (st.isDirectory()) {
        for (const e of fs.readdirSync(p)) walk(path.join(p, e), out);
    } else if (/\.(tsx|ts|css)$/.test(p)) {
        out.push(p);
    }
    return out;
};

let totalFixes = 0;
for (const file of targets.flatMap((t) => walk(t))) {
    const original = fs.readFileSync(file, 'utf8');
    let text = original;
    let fixes = 0;

    for (const [broken, real] of SEQUENCES) {
        if (!text.includes(broken)) continue;
        const count = text.split(broken).length - 1;
        text = text.split(broken).join(real);
        fixes += count;
    }

    if (fixes > 0) {
        totalFixes += fixes;
        console.log(`${APPLY ? 'FIXED' : 'WOULD FIX'} ${path.relative(ROOT, file)} (${fixes})`);
        if (APPLY) fs.writeFileSync(file, text, 'utf8');
    }
}

console.log(`\n${APPLY ? 'fixed' : 'would fix'} ${totalFixes} mojibake sequence(s)`);