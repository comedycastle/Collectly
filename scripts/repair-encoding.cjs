// One-off repair: reverse the Windows-1252 mis-decode introduced by a bulk
// PowerShell rewrite (Get-Content read UTF-8 bytes using the ANSI codepage, then
// re-encoded them as UTF-8).
//
// mangled characters -> original cp1252 bytes -> decode as UTF-8 = original text.
//
// The byte<->character table is derived from Node's own windows-1252 decoder so
// it cannot drift from the encoder that caused the damage.
//
// Usage: node scripts/repair-encoding.cjs [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

// Windows-1252 table. Node's TextDecoder('windows-1252') resolves to Latin-1 in
// this runtime (0x80 -> U+0080), but the damage was done by .NET's cp1252 encoder,
// which maps 0x80 -> U+20AC etc. Only 0x81/0x8D/0x8F/0x90/0x9D are undefined and
// fall through to identity.
const CP1252_HIGH = {
    0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
    0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
    0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
    0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
    0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
    0x9E: 0x017E, 0x9F: 0x0178,
};

const CHAR_TO_BYTE = new Map();
for (const [byte, codePoint] of Object.entries(CP1252_HIGH)) {
    CHAR_TO_BYTE.set(String.fromCodePoint(codePoint), Number(byte));
}

const toOriginalBytes = (str) => {
    const bytes = [];
    for (const ch of str) {
        const code = ch.codePointAt(0);
        if (code <= 0xff) bytes.push(code);
        else if (CHAR_TO_BYTE.has(ch)) bytes.push(CHAR_TO_BYTE.get(ch));
        else return null; // genuinely non-latin1 char: not part of this corruption
    }
    return Buffer.from(bytes);
};

const listFiles = (dir, out = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) listFiles(full, out);
        else if (/\.(tsx|ts|css)$/.test(entry.name)) out.push(full);
    }
    return out;
};

const suspicious = /[\u00C2-\u00E3\u0080-\u009F]/;

let changed = 0;
let skipped = 0;

for (const file of listFiles(path.join(ROOT, 'src'))) {
    // Strip the BOM that PowerShell's UTF8 writer prepended, then repair if mangled.
    const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    if (!suspicious.test(raw)) {
        if (raw !== fs.readFileSync(file, 'utf8')) {
            fs.writeFileSync(file, raw, 'utf8');
            console.log(`BOM stripped  ${path.relative(ROOT, file)}`);
            changed++;
        }
        continue;
    }

    const bytes = toOriginalBytes(raw);
    let repaired = null;
    if (bytes) {
        const candidate = bytes.toString('utf8');
        if (!candidate.includes('\uFFFD')) repaired = candidate; // clean round trip only
    }

    const rel = path.relative(ROOT, file);
    if (repaired === null) {
        console.log(`SKIP (not reversible) ${rel}`);
        skipped++;
        continue;
    }

    changed++;
    console.log(`${APPLY ? 'FIXED' : 'WOULD FIX'} ${rel}`);
    if (APPLY) fs.writeFileSync(file, repaired, 'utf8');
}

console.log(`\n${APPLY ? 'repaired' : 'would repair'} ${changed} file(s), skipped ${skipped}`);