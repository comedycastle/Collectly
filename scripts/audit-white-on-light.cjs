// Audit: `text-white` sitting on a LIGHT surface (invisible), excluding
// CertificateModal which is an intentionally dark certificate.
//
// Usage: node scripts/audit-white-on-light.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const walk = (dir, out = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (/\.tsx$/.test(entry.name)) out.push(full);
    }
    return out;
};

const CLASSNAME = /className=(?:\{`([^`]*)`|"([^"]*)"|'([^']*)')/g;

// Light surfaces that must never carry white text.
const LIGHT_BG = /\bbg-brand-(surface|surfaceLight|bg|white)(?![\w/-])/;
// Backgrounds that legitimately carry white text.
const DARK_BG_OK = /\bbg-brand-(primary|accentSolid|successSolid|warningSolid|neutralSolid|gradient)(?![\w/-])/
    || /from-brand|to-brand|bg-slate-9|bg-black/;

let problems = 0;
for (const file of walk(path.join(ROOT, 'src'))) {
    if (file.includes('CertificateModal')) continue;

    const text = fs.readFileSync(file, 'utf8');
    CLASSNAME.lastIndex = 0;

    let match;
    while ((match = CLASSNAME.exec(text)) !== null) {
        const value = match[1] ?? match[2] ?? match[3] ?? '';
        if (!value) continue;
        if (!/\btext-white\b/.test(value)) continue;

        // Ternary class strings put each variant in its own quoted segment, so a
        // light background in one branch says nothing about the branch that
        // actually carries text-white. Check segment by segment.
        for (const segment of value.split(/['"`]/)) {
            if (!/\btext-white\b/.test(segment)) continue;
            if (!LIGHT_BG.test(segment)) continue;
            if (DARK_BG_OK.test(segment)) continue;

            const line = text.slice(0, match.index).split('\n').length;
            console.log(`WHITE-ON-LIGHT  ${path.relative(ROOT, file)}:${line}  ${segment.trim().slice(0, 95)}`);
            problems++;
        }
    }
}

console.log(problems === 0 ? 'CLEAN — no white text on light surfaces' : `${problems} issue(s)`);
process.exit(problems === 0 ? 0 : 1);