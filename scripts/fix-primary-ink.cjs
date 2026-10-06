// Second pass: any className that carries a primary TINT background
// (bg-brand-primary/N) together with text-brand-primary gets the ink token,
// regardless of class order or line breaks.
//
// Icons only clear the 3:1 non-text bar; tinted chips plus the few small-text
// labels inside them need 4.5:1, which #2563EB cannot reach on a dark surface.
//
// Usage: node scripts/fix-primary-ink.cjs [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

const walk = (dir, out = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (/\.tsx$/.test(entry.name)) out.push(full);
    }
    return out;
};

// Match each quoted className (or template-literal chunk) independently.
const CLASSNAME = /className=(?:\{`|"([^"]*)"|'([^']*)')/g;

let total = 0;
for (const file of walk(path.join(ROOT, 'src'))) {
    const original = fs.readFileSync(file, 'utf8');
    let count = 0;

    const text = original.replace(CLASSNAME, (match, dq, sq) => {
        const value = dq !== undefined ? dq : sq !== undefined ? sq : match.slice('className={`'.length, -1);
        if (value === undefined) return match;

        const hasTint = /bg-brand-primary\/\d+/.test(value);
        if (!hasTint) return match;
        if (!/text-brand-primary(?!Ink)/.test(value)) return match;

        const updated = value.replace(/text-brand-primary(?!Ink)/g, 'text-brand-primaryInk');
        count += (value.match(/text-brand-primary(?!Ink)/g) || []).length;
        if (dq !== undefined) return `className="${updated}"`;
        if (sq !== undefined) return `className='${updated}'`;
        return `className={\`${updated}\``;
    });

    if (text !== original) {
        total += count;
        console.log(`${APPLY ? 'FIXED' : 'WOULD FIX'} ${path.relative(ROOT, file)} (${count})`);
        if (APPLY) fs.writeFileSync(file, text, 'utf8');
    }
}

console.log(`\n${APPLY ? 'rewrote' : 'would rewrite'} ${total} tinted-chip usage(s)`);