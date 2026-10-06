// Audit: find classNames where a themed token is used as BOTH background and
// text (bg-brand-X + text-brand-X) — that renders the label invisible in every
// theme. Also flags solid themed backgrounds paired with text-white, which is
// unreadable in dark mode once the token lightens.
//
// Usage: node scripts/audit-token-pairs.cjs

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

const THEMED = ['violet', 'warning', 'success', 'danger', 'info', 'neutral', 'primaryInk', 'primary', 'accent'];
const CLASSNAME = /className=(?:\{`([^`]*)`|"([^"]*)"|'([^']*)')/g;

let problems = 0;

for (const file of walk(path.join(ROOT, 'src'))) {
    const text = fs.readFileSync(file, 'utf8');
    CLASSNAME.lastIndex = 0;

    let match;
    while ((match = CLASSNAME.exec(text)) !== null) {
        const value = match[1] ?? match[2] ?? match[3] ?? '';
        if (!value) continue;

        const line = text.slice(0, match.index).split('\n').length;
        const rel = `${path.relative(ROOT, file)}:${line}`;

        // 1. same token as a SOLID background and as text (tints like /10 are fine)
        for (const token of THEMED) {
            const asBg = new RegExp(`\\bbg-brand-${token}(?![\\w/-])`).test(value);
            const asText = new RegExp(`\\btext-brand-${token}(?![\\w/])`).test(value);
            if (asBg && asText) {
                console.log(`INVISIBLE  ${rel}  bg-brand-${token} + text-brand-${token}`);
                problems++;
            }
        }

        // 2. solid themed fill behind white text (unreadable once token lightens)
        const solidWithWhite = /\bbg-brand-(violet|warning|success|danger|info|neutral)(?![\w/-])/.test(value)
            && /\btext-white\b/.test(value);
        if (solidWithWhite) {
            console.log(`WHITE-ON-TOKEN  ${rel}  solid themed bg + text-white`);
            problems++;
        }
    }
}

console.log(problems === 0 ? '\nAUDIT CLEAN — no invisible label pairs' : `\n${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);