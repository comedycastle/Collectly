// Switch remaining `text-brand-primary` ink usages to `text-brand-primaryInk`.
//
// In the light theme both tokens are #2563EB, so nothing changes visually. In
// dark mode `primary` stays dark (it carries white button labels) and would be
// only 2.83:1 as an icon or label on #1E293B, while `primaryInk` lightens to
// #93C5FD (8:1).
//
// Exception: elements with a hardcoded white background must keep the dark ink.
//
// Usage: node scripts/ink-primary-remaining.cjs [--apply]

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

const CLASSNAME = /className=(?:\{`([^`]*)`|"([^"]*)"|'([^']*)')/g;

let total = 0;
for (const file of walk(path.join(ROOT, 'src'))) {
    const original = fs.readFileSync(file, 'utf8');
    let count = 0;

    const text = original.replace(CLASSNAME, (match, tpl, dq, sq) => {
        const value = tpl !== undefined ? tpl : dq !== undefined ? dq : sq !== undefined ? sq : null;
        if (value === null) return match;
        if (!/\btext-brand-primary(?![\w-])/.test(value)) return match;

        // A hardcoded white backdrop needs the dark ink in both themes.
        if (/\bbg-white(?![\w-])/.test(value)) return match;

        const updated = value.replace(/\btext-brand-primary(?![\w-])/g, 'text-brand-primaryInk');
        count += (value.match(/\btext-brand-primary(?![\w-])/g) || []).length;

        if (tpl !== undefined) return `className={\`${updated}\``;
        if (dq !== undefined) return `className="${updated}"`;
        return `className='${updated}'`;
    });

    if (text !== original) {
        total += count;
        console.log(`${APPLY ? 'FIXED' : 'WOULD FIX'} ${path.relative(ROOT, file)} (${count})`);
        if (APPLY) fs.writeFileSync(file, text, 'utf8');
    }
}

console.log(`\n${APPLY ? 'rewrote' : 'would rewrite'} ${total} usage(s)`);