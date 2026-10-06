// Generates supabase/templates_seed.sql from the in-app template library
// (src/services/templateService.ts) so every template lands with its fields,
// options, quiz metadata and conditional-logic rules intact.
// Run with: node scripts/run-gen.cjs

import { formTemplates, FormTemplate } from '../src/services/templateService';

const DEFAULT_THEME = {
    primaryColor: '#2563EB',
    secondaryColor: '#64748B',
    accentColor: '#06B6D4',
    backgroundColor: '#F8FAFC',
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A',
    gradientStart: '#60A5FA',
    gradientEnd: '#22D3EE',
    fontFamily: 'Poppins',
    borderRadius: '8px',
};

const baseSettings = (isQuiz: boolean) => ({
    requireLogin: false,
    showTimerCountdown: false,
    customThankYouTitle: 'Response Submitted!',
    customThankYouMessage: 'Thank you for filling out this form.',
    thankYouPages: [] as any[],
    aiSentimentEnabled: true,
    enableCaptcha: false,
    enableDuplicateDetection: true,
    totalPages: 1,
    quiz: {
        enabled: isQuiz,
        timeLimitMinutes: 10,
        perQuestionTimerSeconds: undefined,
        showLeaderboard: true,
        showImmediateFeedback: true,
        antiCheatTabDetection: true,
        antiCheatDisableCopyPaste: true,
        passPercentage: 70,
        generateCertificate: true,
        certificateTitle: 'Certificate of Achievement',
    },
    theme: { ...DEFAULT_THEME },
});

const q = (s: any): string => `'` + String(s ?? '').replace(/'/g, `''`) + `'`;

const jsonb = (value: any): string => `${q(JSON.stringify(value))}::jsonb`;

// Deterministic per-template option / field ids so re-seeding is stable and the
// logic rule source/target ids in the same payload always resolve.
const slug = (s: string) =>
    String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const normalizeField = (f: any, idx: number, tplId: string) => {
    const id = f.id || `${tplId}-f${idx + 1}`;
    const out: any = {
        id,
        type: f.type,
        label: f.label,
        description: f.description,
        placeholder: f.placeholder,
        required: !!f.required,
        order: typeof f.order === 'number' ? f.order : idx + 1,
        page: typeof f.page === 'number' ? f.page : 1,
        logicRules: (f.logicRules || []).map((r: any, ri: number) => {
            const rule: any = {
                id: r.id || `${tplId}-r${ri + 1}`,
                sourceFieldId: r.sourceFieldId || id,
                operator: r.operator,
                targetValue: r.targetValue ?? '',
                action: r.action,
            };
            if (r.targetFieldId) rule.targetFieldId = r.targetFieldId;
            if (r.targetPage) rule.targetPage = r.targetPage;
            if (typeof r.scoreAdjustment === 'number') rule.scoreAdjustment = r.scoreAdjustment;
            return rule;
        }),
    };

    if (Array.isArray(f.options) && f.options.length) {
        // Deterministic option ids (the library's generated ids embed a
        // timestamp, which would make every re-seed produce a new payload).
        out.options = f.options.map((o: any, oi: number) => ({
            id: `${id}-opt${oi + 1}`,
            label: o.label,
            value: o.value ?? slug(o.label),
            isCorrect: !!o.isCorrect,
            ...(typeof o.scorePoints === 'number' ? { scorePoints: o.scorePoints } : {}),
        }));
    }
    if (Array.isArray(f.matchingPairs) && f.matchingPairs.length) {
        out.matchingPairs = f.matchingPairs.map((m: any, mi: number) => ({
            id: m.id || `${id}-pair${mi + 1}`,
            left: m.left,
            right: m.right,
        }));
    }
    if (Array.isArray(f.matrixColumns) && f.matrixColumns.length) out.matrixColumns = f.matrixColumns;
    if (typeof f.min === 'number') out.min = f.min;
    if (typeof f.max === 'number') out.max = f.max;
    if (typeof f.step === 'number') out.step = f.step;
    if (typeof f.points === 'number') out.points = f.points;
    if (f.correctAnswer !== undefined && f.correctAnswer !== null) out.correctAnswer = f.correctAnswer;
    if (f.defaultValue !== undefined && f.defaultValue !== null) out.defaultValue = f.defaultValue;
    if (f.validationPattern) out.validationPattern = f.validationPattern;
    if (f.acceptedFileTypes) out.acceptedFileTypes = f.acceptedFileTypes;
    if (typeof f.maxFileSizeMb === 'number') out.maxFileSizeMb = f.maxFileSizeMb;
    return out;
};

export const buildTemplatesSql = (): string => {
    const header = `-- ==========================================
-- COLLECTLY V2 - TEMPLATE SEED (${formTemplates.length} templates)
-- Generated from src/services/templateService.ts
-- Each template is its own idempotent INSERT statement.
-- Re-runnable: rows whose title+category already exist are skipped.
-- Run AFTER supabase/schema.sql
-- ==========================================
`;

    const blocks = formTemplates.map((tpl: FormTemplate, i: number) => {
        const fields = (tpl.fields || []).map((f: any, idx: number) => normalizeField(f, idx, tpl.id));
        const base = baseSettings(!!tpl.isQuiz);
        const tplSettings: any = tpl.settings || {};
        const settings = {
            ...base,
            ...tplSettings,
            quiz: { ...base.quiz, ...(tplSettings.quiz || {}) },
            theme: { ...base.theme, ...(tplSettings.theme || {}) },
        };

        const label = String(i + 1).padStart(3, '0');
        const logicCount = fields.reduce((acc: number, f: any) => acc + (f.logicRules?.length || 0), 0);

        return `-- ${label} | ${tpl.category} | ${tpl.id} | ${fields.length} fields | ${logicCount} logic rule(s) | quiz=${!!tpl.isQuiz}
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT ${q(tpl.title)},
       ${q(tpl.description)},
       ${q(tpl.category)},
       ${!!tpl.isQuiz},
       ${q(tpl.icon)},
       ${jsonb(fields)},
       ${jsonb(settings)},
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = ${q(tpl.title)} AND t.category = ${q(tpl.category)}
);`;
    });

    const byCategory = formTemplates.reduce((acc: Record<string, number>, t: FormTemplate) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
    }, {});
    const summary = Object.entries(byCategory)
        .map(([cat, count]) => `--   ${cat}: ${count}`)
        .join('\n');

    return `${header}\n-- CATEGORY COUNTS\n${summary}\n\n${blocks.join('\n\n')}\n`;
};

export const templateCount = formTemplates.length;