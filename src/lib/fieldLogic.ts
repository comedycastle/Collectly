import { FormField, LogicRule } from '../types';

const matchesRule = (rule: LogicRule, sourceVal: any): boolean => {
    const sv = String(sourceVal ?? '');
    const tv = rule.targetValue ?? '';
    switch (rule.operator) {
        case 'equals': return sv === tv;
        case 'not_equals': return sv !== tv;
        case 'contains': return sv.includes(tv);
        case 'not_contains': return !sv.includes(tv);
        case 'greater_than': return Number(sv) > Number(tv);
        case 'less_than': return Number(sv) < Number(tv);
        case 'is_empty': return sv === '' || sv === '[]';
        case 'is_not_empty': return sv !== '' && sv !== '[]';
        default: return false;
    }
};

export interface LogicResult {
    hidden: Set<string>;
    jumpToPage: number | null;
    scoreAdjustment: number;
}

export const evaluateLogic = (fields: FormField[], answers: Record<string, any>): LogicResult => {
    const hidden = new Set<string>();
    let jumpToPage: number | null = null;
    let scoreAdjustment = 0;
    const showMatch = new Map<string, boolean>();

    fields.forEach((f) => {
        (f.logicRules || []).forEach((rule) => {
            const sourceVal = answers[rule.sourceFieldId ?? f.id] ?? answers[f.id];
            const match = matchesRule(rule, sourceVal);
            if (rule.action === 'hide') {
                if (match && rule.targetFieldId) hidden.add(rule.targetFieldId);
            } else if (rule.action === 'show' && rule.targetFieldId) {
                showMatch.set(rule.targetFieldId, (showMatch.get(rule.targetFieldId) || false) || match);
            } else if (rule.action === 'jump_to_page' && match && rule.targetPage) {
                jumpToPage = rule.targetPage;
            } else if (rule.action === 'calculate_score' && match) {
                scoreAdjustment += rule.scoreAdjustment || 0;
            }
        });
    });

    // A target with "show" rules is only visible while at least one rule matches
    showMatch.forEach((anyMatch, targetId) => {
        if (anyMatch) hidden.delete(targetId);
        else hidden.add(targetId);
    });

    return { hidden, jumpToPage, scoreAdjustment };
};

export const usesExplicitPages = (fields: FormField[], totalPages: number): boolean =>
    totalPages > 1 && fields.some((f) => (f.page || 1) > 1);

export const fieldsForPage = (
    fields: FormField[],
    page: number,
    totalPages: number,
    hidden?: Set<string>
): FormField[] => {
    const visible = hidden ? fields.filter((f) => !hidden.has(f.id)) : fields.slice();
    if (totalPages <= 1) return visible;
    if (usesExplicitPages(fields, totalPages)) return visible.filter((f) => (f.page || 1) === page);
    const per = Math.ceil(visible.length / totalPages) || 1;
    return visible.slice((page - 1) * per, page * per);
};

export const pageOfField = (
    fields: FormField[],
    fieldId: string,
    totalPages: number,
    hidden?: Set<string>
): number => {
    const visible = hidden ? fields.filter((f) => !hidden.has(f.id)) : fields;
    if (totalPages <= 1) return 1;
    if (usesExplicitPages(fields, totalPages)) return fields.find((f) => f.id === fieldId)?.page || 1;
    const per = Math.ceil(visible.length / totalPages) || 1;
    const idx = visible.findIndex((f) => f.id === fieldId);
    return idx === -1 ? 1 : Math.min(totalPages, Math.floor(idx / per) + 1);
};

export const isAnswered = (field: FormField, value: any): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0 && !value.startsWith('uploading:');
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value; // terms checkbox must be checked
    if (typeof value === 'number') return true; // 0 is a valid answer (NPS 0, scale min...)
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return !!value;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+/i;
const PHONE_RE = /^[+()\d\s.-]{7,}$/;

export const validateFields = (
    fields: FormField[],
    answers: Record<string, any>,
    hidden: Set<string>
): Record<string, string> => {
    const errors: Record<string, string> = {};
    fields.forEach((f) => {
        if (hidden.has(f.id)) return;
        if (f.type === 'section' || f.type === 'page_break') return;
        const val = answers[f.id];
        if (f.required && !isAnswered(f, val)) {
            errors[f.id] = 'This field is required.';
            return;
        }
        if (val === undefined || val === null || val === '' || typeof val === 'boolean') return;
        const str = typeof val === 'string' ? val.trim() : '';
        if (f.type === 'email' && str && !EMAIL_RE.test(str)) {
            errors[f.id] = 'Enter a valid email address.';
            return;
        }
        if (f.type === 'url' && str && !URL_RE.test(str)) {
            errors[f.id] = 'Enter a valid URL starting with http(s)://';
            return;
        }
        if (f.type === 'phone' && str && !PHONE_RE.test(str)) {
            errors[f.id] = 'Enter a valid phone number.';
            return;
        }
        if (f.validationPattern && typeof val === 'string' && str) {
            try {
                if (!new RegExp(f.validationPattern).test(str)) errors[f.id] = 'Format is not valid.';
            } catch { /* invalid pattern configured by owner — skip */ }
        }
        if (f.type === 'number' && typeof val !== 'string' && !Number.isNaN(Number(val))) {
            const n = Number(val);
            if (f.min !== undefined && n < f.min) { errors[f.id] = `Must be at least ${f.min}.`; return; }
            if (f.max !== undefined && n > f.max) { errors[f.id] = `Must be at most ${f.max}.`; return; }
        }
        if (f.type === 'slider') {
            const n = Number(val);
            if (!Number.isNaN(n)) {
                if (f.min !== undefined && n < f.min) { errors[f.id] = `Must be at least ${f.min}.`; return; }
                if (f.max !== undefined && n > f.max) { errors[f.id] = `Must be at most ${f.max}.`; return; }
            }
        }
    });
    return errors;
};
