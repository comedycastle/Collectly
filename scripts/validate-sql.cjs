// Validates supabase/templates_seed.sql:
//  - every INSERT has balanced SQL string quoting
//  - every ::jsonb literal is valid JSON
//  - every logic rule's sourceFieldId/targetFieldId resolve to a field in the same payload
// Usage: node scripts/validate-sql.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const sql = fs.readFileSync(path.join(ROOT, 'supabase', 'templates_seed.sql'), 'utf8');

const inserts = sql.split(/\nINSERT INTO public\.templates/).slice(1);
let errors = 0;
let totalFields = 0;
let totalRules = 0;
let quizCount = 0;
let templatesWithLogic = 0;

const err = (i, msg) => {
    console.error(`  [template ${i}] ${msg}`);
    errors++;
};

inserts.forEach((block, idx) => {
    const n = idx + 1;

    // 1. Single-quote parity across the whole statement (apostrophes are doubled)
    const squotes = (block.match(/'/g) || []).length;
    if (squotes % 2 !== 0) err(n, `unbalanced single quotes (${squotes})`);

    // 2. Extract ''::jsonb literals (SQL-escaped) and JSON.parse them
    const jsonbLiterals = [];
    const re = /'((?:[^']|'')*)'::jsonb/g;
    let m;
    while ((m = re.exec(block)) !== null) jsonbLiterals.push(m[1].split("''").join("'"));

    if (jsonbLiterals.length !== 2) {
        err(n, `expected 2 jsonb literals (fields, settings), found ${jsonbLiterals.length}`);
        return;
    }

    let fields, settings;
    try {
        fields = JSON.parse(jsonbLiterals[0]);
    } catch (e) {
        return err(n, `fields JSON invalid: ${e.message}`);
    }
    try {
        settings = JSON.parse(jsonbLiterals[1]);
    } catch (e) {
        return err(n, `settings JSON invalid: ${e.message}`);
    }

    if (!Array.isArray(fields) || fields.length === 0) return err(n, 'fields array empty');
    totalFields += fields.length;
    if (settings.quiz && settings.quiz.enabled) quizCount++;

    // 3. Every logic rule must reference a field that exists in the same payload
    const ids = new Set(fields.map((f) => f.id));
    const dupes = fields.map((f) => f.id).filter((id, i, a) => a.indexOf(id) !== i);
    if (dupes.length) err(n, `duplicate field ids: ${dupes.join(', ')}`);

    let ruleCount = 0;
    for (const f of fields) {
        if (!f.type || !f.label) err(n, `field ${f.id} missing type/label`);
        if (typeof f.order !== 'number') err(n, `field ${f.id} missing order`);
        const rules = f.logicRules || [];
        ruleCount += rules.length;
        for (const r of rules) {
            if (!ids.has(r.sourceFieldId)) err(n, `rule ${r.id} sourceFieldId "${r.sourceFieldId}" not in payload`);
            if ((r.action === 'show' || r.action === 'hide') && r.targetFieldId && !ids.has(r.targetFieldId)) {
                err(n, `rule ${r.id} targetFieldId "${r.targetFieldId}" not in payload`);
            }
            if (!r.operator || !r.action) err(n, `rule ${r.id} missing operator/action`);
        }
        // quiz fields must carry grading metadata
        if (f.type && f.type.startsWith('quiz_') && f.type !== 'quiz_short' && f.type !== 'quiz_fill_blank') {
            const hasCorrect = (f.options || []).some((o) => o.isCorrect);
            if (!hasCorrect && !f.correctAnswer) err(n, `quiz field ${f.id} has no correct answer marked`);
        }
    }
    totalRules += ruleCount;
    if (ruleCount > 0) templatesWithLogic++;
});

console.log(`statements:      ${inserts.length}`);
console.log(`fields:          ${totalFields}`);
console.log(`logic rules:     ${totalRules}`);
console.log(`with logic:      ${templatesWithLogic}`);
console.log(`quiz templates:  ${quizCount}`);
console.log(errors === 0 ? 'RESULT: OK — all JSON valid, all rule references resolve' : `RESULT: ${errors} problem(s)`);
process.exit(errors === 0 ? 0 : 1);