// Solve for token values that meet WCAG AA against the exact surfaces/tints
// used by the app. Prints ready-to-paste hex values for src/index.css.
const toLinear = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = ({ r, g, b }) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
const ratio = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
const over = (fg, bg, a) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const hex = (h) => { const s = h.replace('#', ''); return { r: parseInt(s.slice(0, 2), 16), g: parseInt(s.slice(2, 4), 16), b: parseInt(s.slice(4, 6), 16) }; };
const toHex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const rgb = (h) => { const c = hex(h); return `${c.r} ${c.g} ${c.b}`; };

// Darken toward black (light theme) or lighten toward white (dark theme).
const solve = (start, bg, min, toward) => {
    let cur = hex(start);
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const cand = {
            r: cur.r + (toward.r - cur.r) * t,
            g: cur.g + (toward.g - cur.g) * t,
            b: cur.b + (toward.b - cur.b) * t,
        };
        if (ratio(cand, bg) >= min) return { hex: toHex(cand), ratio: ratio(cand, bg) };
    }
    return { hex: toHex(cur), ratio: ratio(cur, bg) };
};

const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };

const L_SURFACE = hex('#FFFFFF');
const L_SURFACE_LIGHT = hex('#F1F5F9');
const L_PAGE = hex('#F8FAFC');
const D_SURFACE = hex('#1E293B');
const D_SURFACE_LIGHT = hex('#334155');

console.log('== LIGHT THEME ==');
// muted must clear 4.5:1 on the LIGHTEST surface it lands on (surfaceLight)
let m = solve('#64748B', L_SURFACE_LIGHT, 4.5, BLACK);
console.log(`brand-muted        ${m.hex}  ${m.ratio.toFixed(2)}:1 on #F1F5F9   channels: ${rgb(m.hex)}`);

// warning / danger inks must clear 4.5:1 on their own 10% tint over white
for (const [name, start] of [['brand-warning', '#B45309'], ['brand-danger', '#DC2626'], ['brand-success', '#047857'], ['brand-violet', '#7C3AED']]) {
    let bgTint = over(hex(start), L_SURFACE, 0.1);
    let s = solve(start, bgTint, 4.5, BLACK);
    let verify = ratio(hex(s.hex), over(hex(s.hex), L_SURFACE, 0.1));
    console.log(`${name.padEnd(17)} ${s.hex}  ${verify.toFixed(2)}:1 on its /10 tint   channels: ${rgb(s.hex)}`);
}

// accent-solid: white label must clear AA in BOTH themes (theme-invariant fill)
let a = solve('#06B6D4', WHITE, 4.5, BLACK);
console.log(`accent-solid       ${a.hex}  ${a.ratio.toFixed(2)}:1 with white      channels: ${rgb(a.hex)}`);

// divider visibility
console.log(`border #E2E8F0     ${ratio(hex('#E2E8F0'), L_SURFACE).toFixed(2)}:1 on surface`);
console.log(`border #CBD5E1     ${ratio(hex('#CBD5E1'), L_SURFACE).toFixed(2)}:1 on surface  (candidate)`);

console.log('\n== DARK THEME ==');
let dm = solve('#94A3B8', D_SURFACE_LIGHT, 4.5, WHITE);
console.log(`brand-muted        ${dm.hex}  ${dm.ratio.toFixed(2)}:1 on #334155   channels: ${rgb(dm.hex)}`);
console.log(`border #334155     ${ratio(hex('#334155'), D_SURFACE).toFixed(2)}:1 on surface`);