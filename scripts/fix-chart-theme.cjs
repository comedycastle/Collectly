// Make Recharts axes, gridlines and legends theme-aware in AnalyticsPage.
//
// Recharts defaults tick label fill to #666 and the app hardcoded a #E2E8F0
// grid, so on a dark surface the axis labels sat at ~2.2:1 (unreadable) and the
// gridlines stayed near-white.
//
// Usage: node scripts/fix-chart-theme.cjs [--apply]

const fs = require('fs');
const path = require('path');

const TARGET = path.resolve(__dirname, '..', 'src', 'pages', 'AnalyticsPage.tsx');
const APPLY = process.argv.includes('--apply');

const original = fs.readFileSync(TARGET, 'utf8');
let text = original;

// Axis tick labels: add an explicit theme-aware fill.
text = text.replace(/tick=\{\{ fontSize: (\d+) \}\}/g, 'tick={{ fontSize: $1, fill: SLATE }}');

// Hardcoded light gridlines.
text = text.replace(/stroke="#E2E8F0"/g, 'stroke={palette.grid}');

// Hardcoded series colour that now has a semantic token.
text = text.replace(/stroke="#2563EB"/g, 'stroke={palette.primary}');
text = text.replace(/stopColor="#2563EB"/g, 'stopColor={palette.primary}');

// Legend text follows the theme too.
text = text.replace(/wrapperStyle=\{\{ fontSize: 12 \}\}/g, 'wrapperStyle={{ fontSize: 12, color: palette.tooltipText }}');
text = text.replace(/wrapperStyle=\{\{ fontSize: 11 \}\}/g, 'wrapperStyle={{ fontSize: 11, color: palette.tooltipText }}');

if (text === original) {
    console.log('no changes needed');
} else {
    const ticks = (text.match(/fill: SLATE/g) || []).length;
    const grids = (text.match(/stroke=\{palette\.grid\}/g) || []).length;
    console.log(`${APPLY ? 'FIXED' : 'WOULD FIX'} AnalyticsPage — ${ticks} axis ticks, ${grids} gridlines`);
    if (APPLY) fs.writeFileSync(TARGET, text, 'utf8');
}