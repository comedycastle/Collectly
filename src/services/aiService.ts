import { FormField, FormCategory, AIProvider } from '../types';
import { getAppBaseUrl } from '../lib/config';

export type AITone = 'Professional' | 'Friendly' | 'Playful' | 'Formal';
export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';

interface AIGenerateRequest {
    prompt: string;
    category?: FormCategory | 'Auto';
    isQuiz?: boolean;
    fieldCount?: number;
    context?: string; // extracted document text
    tone?: AITone;
    language?: string;
    includeContact?: boolean;
    strictValidation?: boolean;
    difficulty?: QuizDifficulty;
    pointsPerQuestion?: number;
}

export interface ProviderAttempt {
    provider: AIProvider;
    status: 'success' | 'skipped-no-key' | 'failed';
    detail: string;
}

interface AIGenerateResponse {
    title: string;
    description: string;
    category: FormCategory;
    isQuiz: boolean;
    fields: FormField[];
    providerUsed: AIProvider;
    attempts?: ProviderAttempt[];
    enhancedPrompt?: string;
}

// Free-tier model identifiers (updated — old IDs retired by providers)
export const FREE_MODELS = {
    gemini: 'gemini-2.0-flash',
    openrouter: 'meta-llama/llama-3.3-70b-instruct:free',
    groq: 'llama-3.3-70b-versatile',
};

// Fallback model lists tried in order when the primary is retired / 404s
const MODEL_FALLBACKS: Record<'gemini' | 'openrouter' | 'groq', string[]> = {
    gemini: ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'],
    openrouter: [
        'meta-llama/llama-3.3-70b-instruct:free',
        'google/gemma-3-27b-it:free',
        'mistralai/mistral-small-3.1-24b-instruct:free',
        'deepseek/deepseek-chat-v3-0324:free',
    ],
    groq: ['llama-3.3-70b-versatile', 'openai/gpt-oss-20b', 'qwen/qwen3-32b'],
};

// AI config lives in Supabase (user_settings.settings.aiConfig) — one row per signed-in user,
// protected by RLS (only the owner can read/write). A module-level runtime cache keeps
// getAIConfig() synchronous for the generation flows.
export interface AIConfig {
    geminiKey: string;
    openrouterKey: string;
    groqKey: string;
    preferredProvider: AIProvider;
}

// Bootstrap values only: env keys are migrated into the user's Supabase row on first load
// (see loadAIConfig), so Supabase becomes the single source of truth for all API keys.
let runtimeAIConfig: AIConfig = {
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    openrouterKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    groqKey: import.meta.env.VITE_GROQ_API_KEY || '',
    preferredProvider: 'gemini',
};

export const getAIConfig = (): AIConfig => ({ ...runtimeAIConfig });

export const setRuntimeAIConfig = (config: Partial<AIConfig>) => {
    runtimeAIConfig = { ...runtimeAIConfig, ...config };
};

// Persist AI keys + preferred provider to the signed-in user's Supabase settings row.
// Returns true when the row is saved (or Supabase is not configured), false on failure.
export const saveAIConfig = async (config: Partial<AIConfig>): Promise<boolean> => {
    setRuntimeAIConfig(config);
    try {
        const { isSupabaseConfigured } = await import('../lib/supabaseClient');
        if (!isSupabaseConfigured) return true;
        const { profileService } = await import('./formService');
        const existing = await profileService.getUserSettings().catch(() => null);
        const existingSettings = (existing as any)?.settings || {};
        await profileService.updateUserSettings({
            settings: {
                ...existingSettings,
                aiConfig: { ...(existingSettings.aiConfig || {}), ...config },
            },
        });
        return true;
    } catch (err) {
        console.warn('Failed to save AI config to Supabase:', err);
        return false;
    }
};

// Load AI config from Supabase into the runtime cache (called on app data load).
// If the user's row has no aiConfig yet, any env-embedded bootstrap keys are migrated
// into Supabase once, so all user API keys live in the database from then on.
export const loadAIConfig = async (): Promise<AIConfig | null> => {
    try {
        const { isSupabaseConfigured } = await import('../lib/supabaseClient');
        if (!isSupabaseConfigured) return null;
        const { profileService } = await import('./formService');
        const row = await profileService.getUserSettings().catch(() => null);
        const stored = (row as any)?.settings?.aiConfig;
        if (stored && typeof stored === 'object') {
            setRuntimeAIConfig(stored);
            return getAIConfig();
        }
        const bootstrap: Partial<AIConfig> = {
            geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
            openrouterKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
            groqKey: import.meta.env.VITE_GROQ_API_KEY || '',
        };
        if (bootstrap.geminiKey || bootstrap.openrouterKey || bootstrap.groqKey) {
            await saveAIConfig(bootstrap);
            return getAIConfig();
        }
        return null;
    } catch (err) {
        console.warn('Failed to load AI config from Supabase:', err);
        return null;
    }
};

// Strip markdown code fences and extract the first JSON object/array
const extractJSON = (text: string): any | null => {
    if (!text) return null;
    let cleaned = text.trim();
    // Remove ```json ... ``` or ``` ... ``` fences
    cleaned = cleaned.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '').trim();
    const start = cleaned.search(/[\[{]/);
    if (start === -1) return null;
    const candidate = cleaned.slice(start);
    // Try full parse first
    try {
        return JSON.parse(candidate);
    } catch { }
    // Fall back to balanced-brace scan for the first complete object
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = 0; i < candidate.length; i++) {
        const ch = candidate[i];
        if (inStr) {
            if (esc) esc = false;
            else if (ch === '\\') esc = true;
            else if (ch === '"') inStr = false;
        } else {
            if (ch === '"') inStr = true;
            else if (ch === '{' || ch === '[') depth++;
            else if (ch === '}' || ch === ']') {
                depth--;
                if (depth === 0) {
                    try {
                        return JSON.parse(candidate.slice(0, i + 1));
                    } catch {
                        return null;
                    }
                }
            }
        }
    }
    return null;
};

const ALL_FIELD_TYPES = [
    'text', 'textarea', 'email', 'number', 'phone', 'url', 'date', 'time', 'datetime',
    'select', 'radio', 'checkbox', 'rating', 'scale', 'nps', 'ranking', 'matrix', 'slider',
    'signature', 'file', 'color', 'code', 'map', 'terms',
    'section', 'quiz_mcq', 'quiz_tf', 'quiz_matching', 'quiz_short', 'quiz_ordering', 'quiz_fill_blank',
].join(' | ');

const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Normalize AI-returned fields: valid types, ids, order, options, quiz metadata
const normalizeFields = (rawFields: any[], isQuiz: boolean): FormField[] => {
    const validTypes = new Set(ALL_FIELD_TYPES.split(' | '));
    return (rawFields || []).slice(0, 20).map((f: any, i: number) => {
        let type = typeof f.type === 'string' ? f.type.trim() : 'text';
        if (!validTypes.has(type)) {
            // Map common aliases to valid types
            const lower = type.toLowerCase();
            if (lower.includes('multiple') || lower.includes('mcq')) type = isQuiz ? 'quiz_mcq' : 'radio';
            else if (lower.includes('true') || lower.includes('false')) type = isQuiz ? 'quiz_tf' : 'radio';
            else if (lower.includes('paragraph') || lower.includes('long')) type = 'textarea';
            else if (lower.includes('dropdown')) type = 'select';
            else if (lower.includes('star')) type = 'rating';
            else type = 'text';
        }
        const needsOptions = ['select', 'radio', 'checkbox', 'ranking', 'matrix', 'quiz_mcq', 'quiz_tf'].includes(type);
        const options = needsOptions
            ? (Array.isArray(f.options) && f.options.length > 0
                ? f.options.map((o: any, j: number) => {
                    const label = typeof o === 'string' ? o : (o.label || `Option ${j + 1}`);
                    const value = typeof o === 'string' ? o.toLowerCase().replace(/\s+/g, '-') : (o.value || label.toLowerCase().replace(/\s+/g, '-'));
                    return { id: genId('opt'), label: String(label), value: String(value), isCorrect: !!o.isCorrect, scorePoints: o.scorePoints };
                })
                : ['Option 1', 'Option 2', 'Option 3'].map((label, j) => ({
                    id: genId('opt'),
                    label,
                    value: label.toLowerCase().replace(/\s+/g, '-'),
                    isCorrect: type.startsWith('quiz') ? j === 0 : undefined,
                })))
            : undefined;

        const field: any = {
            id: genId('field'),
            type,
            label: String(f.label || `Question ${i + 1}`),
            description: f.description || undefined,
            placeholder: f.placeholder || undefined,
            required: !!f.required,
            order: i + 1,
            page: 1,
            options,
            logicRules: [],
        };
        if (type.startsWith('quiz') || typeof f.points === 'number') {
            field.points = typeof f.points === 'number' ? f.points : 10;
        }
        if (typeof f.correctAnswer === 'string') field.correctAnswer = f.correctAnswer;
        if (typeof f.min === 'number') field.min = f.min;
        if (typeof f.max === 'number') field.max = f.max;
        if (type === 'rating' && !field.max) field.max = 5;
        if (type === 'scale' && field.min === undefined) { field.min = 1; field.max = 10; }
        return field as FormField;
    });
};

const detectCategory = (prompt: string, aiCategory?: string, isQuiz?: boolean): FormCategory => {
    const valid: FormCategory[] = ['Survey', 'Quiz', 'Registration', 'Feedback', 'Application', 'Lead Generation', 'General'];
    if (aiCategory && valid.includes(aiCategory as FormCategory)) return aiCategory as FormCategory;
    if (isQuiz) return 'Quiz';
    const lower = prompt.toLowerCase();
    if (lower.includes('feedback') || lower.includes('csat') || lower.includes('nps')) return 'Feedback';
    if (lower.includes('register') || lower.includes('event') || lower.includes('rsvp')) return 'Registration';
    if (lower.includes('lead') || lower.includes('contact') || lower.includes('demo')) return 'Lead Generation';
    if (lower.includes('survey') || lower.includes('research')) return 'Survey';
    if (lower.includes('job') || lower.includes('application') || lower.includes('apply')) return 'Application';
    return 'General';
};

// 1. Fallback Local AI Form Engine
const fallbackFormGenerator = (prompt: string, isQuizRequested?: boolean): AIGenerateResponse => {
    const lowerPrompt = prompt.toLowerCase();
    const isQuiz = isQuizRequested || lowerPrompt.includes('quiz') || lowerPrompt.includes('test') || lowerPrompt.includes('exam') || lowerPrompt.includes('assessment');

    const category = detectCategory(prompt, undefined, isQuiz);
    const title = prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt.split('.')[0] || 'Generated Collectly Form';
    const description = `AI-generated ${isQuiz ? 'interactive quiz' : 'smart form'} based on: "${prompt}"`;

    let fields: FormField[];

    if (isQuiz) {
        fields = normalizeFields([
            {
                type: 'quiz_mcq', label: 'Which of the following best describes the core concept?', description: 'Select one correct answer.', required: true, points: 10, options: [
                    { label: 'Primary Core Concept A', value: 'a', isCorrect: true },
                    { label: 'Secondary Distractor B', value: 'b' },
                    { label: 'Alternative Option C', value: 'c' },
                    { label: 'Incorrect Option D', value: 'd' },
                ]
            },
            {
                type: 'quiz_tf', label: 'True or False: The principle applies under standard execution conditions.', required: true, points: 5, correctAnswer: 'true', options: [
                    { label: 'True', value: 'true', isCorrect: true },
                    { label: 'False', value: 'false' }
                ]
            },
            { type: 'quiz_short', label: 'Briefly explain the primary mechanism in 1-2 sentences.', placeholder: 'Type your explanation...', required: true, points: 15 },
            { type: 'rating', label: 'Rate your confidence level with this subject matter:', required: false },
        ], true);
    } else {
        fields = normalizeFields([
            { type: 'text', label: 'Full Name', placeholder: 'e.g. Sarah Jenkins', required: true },
            { type: 'email', label: 'Email Address', placeholder: 'sarah@example.com', required: true },
            {
                type: 'radio', label: 'How did you hear about us?', required: true, options: [
                    { label: 'Social Media', value: 'social' },
                    { label: 'Search Engine (Google/Bing)', value: 'search' },
                    { label: 'Friend / Colleague Recommendation', value: 'referral' },
                    { label: 'Other', value: 'other' }
                ]
            },
            { type: 'nps', label: 'How likely are you to recommend our platform to a peer?', description: '0 = Not at all likely, 10 = Extremely likely', required: true },
            { type: 'textarea', label: 'Additional Feedback or Suggestions', placeholder: 'Share your thoughts here...', required: false }
        ], false);
    }

    return {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description,
        category,
        isQuiz,
        fields,
        providerUsed: 'fallback'
    };
};

// Enhance a short prompt into a detailed generation spec (used as the backend prompt)
export const buildEnhancedPrompt = (req: AIGenerateRequest): string => {
    const parts: string[] = [];
    parts.push(`Goal: ${req.prompt}`);
    parts.push(`Output: exactly ${Math.min(Math.max(req.fieldCount || 5, 2), 15)} fields`);
    if (req.category && req.category !== 'Auto') parts.push(`Category: ${req.category}`);
    if (req.tone) parts.push(`Tone: ${req.tone} wording for all labels/descriptions`);
    if (req.language && req.language !== 'English') parts.push(`Language: write everything in ${req.language}`);
    if (req.includeContact) parts.push('Include a contact block first: full name (text, required) + email (email, required)');
    if (req.isQuiz) parts.push(`Quiz mode: grade every scorable field, difficulty ${req.difficulty || 'Mixed'}, ${req.pointsPerQuestion || 10} points per question`);
    else parts.push('Form mode: do NOT add points/correct answers; mix required and optional fields');
    if (req.strictValidation) parts.push('Strict validation: realistic placeholders + description hints on every field');
    if (req.context) parts.push(`Ground questions in this document:\n${req.context.slice(0, 6000)}`);
    return parts.join('\n');
};

// 2. Main AI Request Delegator — respects preferred provider, free-tier models only
export const generateFormWithAI = async (req: AIGenerateRequest): Promise<AIGenerateResponse> => {
    const config = getAIConfig();
    const fieldCount = Math.min(Math.max(req.fieldCount || 5, 2), 15);
    const tone = req.tone || 'Professional';
    const language = req.language || 'English';
    const difficulty = req.difficulty || 'Mixed';
    const pointsEach = req.pointsPerQuestion || 10;
    const systemPrompt = `You are Collectly AI, an expert form & quiz generator. You deeply analyze the user's prompt and choose the CORRECT input type for every single question.
Return ONLY valid JSON (no markdown, no explanation) matching this structure:
{
  "title": string,
  "description": string,
  "category": "Survey" | "Quiz" | "Registration" | "Feedback" | "Application" | "Lead Generation" | "General",
  "isQuiz": boolean,
  "fields": Array<{
    "type": "${ALL_FIELD_TYPES}",
    "label": string,
    "placeholder"?: string,
    "description"?: string,
    "required": boolean,
    "points"?: number,
    "correctAnswer"?: string,
    "min"?: number,
    "max"?: number,
    "options"?: Array<{ "label": string, "value": string, "isCorrect"?: boolean }>
  }>
}

FIELD-TYPE PLAYBOOK (follow strictly):
- Personal identity: text (full name), email (email addresses ONLY), phone (phone numbers ONLY), url (websites/portfolios), date/time/datetime (scheduling, DOB, availability).
- Numeric: number for counts/ages/quantities (with min/max where sensible).
- Single answer from list: radio for ≤4 visible options, select for ≥5 options or long lists (country, department, ticket type).
- Multiple answers: checkbox.
- Opinion meter: nps for 0-10 recommend likelihood (use ONLY when user mentions NPS/recommend/likelihood); rating (stars, max 5) for satisfaction/quality; scale (1-10) for agreement/skill levels; slider for ranges (budget, age range).
- Text depth: textarea for open feedback / explanations / cover notes; text for one-line answers.
- Proof & consent: file for resume/CV/photo uploads; signature for agreements; terms (required checkbox) for consent/T&C; color for color preference; code for code snippets; map for locations.
- Structure: section for grouping headers (does not collect data); NEVER use page_break unless multi-page requested.
- Quizzes ONLY when isQuiz=true: quiz_mcq (4 options, exactly one isCorrect, points), quiz_tf (options True/False + correctAnswer "true"/"false", points), quiz_short (correctAnswer string, points), quiz_matching (matchingPairs implied via options), quiz_ordering (options in correct order), quiz_fill_blank (correctAnswer string).
- Forms (isQuiz=false): NEVER emit points, isCorrect, or correctAnswer.

QUALITY RULES:
- Exactly ${fieldCount} fields, ordered logically (contact → specifics → ratings → open feedback).
- Tone: ${tone}. Language: ${language} (every label/description/option in this language).
- Every field: clear label + required flag. Choice fields: 3-4 realistic options derived from the prompt topic (never generic Option 1/2/3).
- Placeholders must be realistic examples (e.g. "sarah@example.com", "+1 (555) 000-0000").
- Descriptions only where they disambiguate (NPS scale legend, quiz instructions).
- ${req.includeContact ? 'Start with Full Name (text, required) + Email (email, required).' : 'Only include contact fields if the prompt implies them.'}
- ${req.strictValidation ? 'Add helpful description hints and realistic placeholders on every field.' : 'Keep descriptions concise.'}
- Category must fit the request; isQuiz=true ONLY for quizzes/tests/exams/assessments (else false).`;

    const enhancedPrompt = buildEnhancedPrompt(req);
    const userPrompt = `${enhancedPrompt}\n\nRaw user prompt: "${req.prompt}"`;

    const orderedProviders: AIProvider[] = (() => {
        const pref = config.preferredProvider;
        const all: AIProvider[] = ['gemini', 'openrouter', 'groq'];
        return [pref, ...all.filter((p) => p !== pref)].filter((p) => p !== 'fallback') as AIProvider[];
    })();

    const attempts: ProviderAttempt[] = [];
    const record = (provider: AIProvider, status: ProviderAttempt['status'], detail: string) => {
        attempts.push({ provider, status, detail });
    };

    const applyPointsDefault = (fields: FormField[]): FormField[] => {
        if (!req.isQuiz || !req.pointsPerQuestion) return fields;
        return fields.map((f) => (f.type.startsWith('quiz') && !f.points ? { ...f, points: req.pointsPerQuestion } : f));
    };

    const tryGemini = async (): Promise<AIGenerateResponse | null> => {
        if (!config.geminiKey) {
            record('gemini', 'skipped-no-key', 'No Gemini API key configured');
            return null;
        }
        for (const model of MODEL_FALLBACKS.gemini) {
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
                    })
                });
                if (!res.ok) {
                    const body = await res.text().catch(() => '');
                    record('gemini', 'failed', `${model}: HTTP ${res.status} ${body.slice(0, 120)}`);
                    continue; // try next fallback model
                }
                const data = await res.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                const parsed = extractJSON(text || '');
                if (parsed?.fields) {
                    const isQuiz = parsed.isQuiz ?? !!req.isQuiz;
                    record('gemini', 'success', `${model}: generated ${parsed.fields.length} fields`);
                    return {
                        title: parsed.title || req.prompt.slice(0, 50),
                        description: parsed.description || '',
                        category: detectCategory(req.prompt, parsed.category, isQuiz),
                        isQuiz,
                        fields: applyPointsDefault(normalizeFields(parsed.fields, isQuiz)),
                        providerUsed: 'gemini',
                        attempts: [...attempts],
                        enhancedPrompt,
                    };
                }
                record('gemini', 'failed', `${model}: no parseable JSON in response`);
            } catch (err: any) {
                record('gemini', 'failed', `${model}: ${err?.message || 'Network error'}`);
            }
        }
        return null;
    };

    const callOpenRouter = async (model: string): Promise<AIGenerateResponse | { retryWith: string } | null> => {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.openrouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': getAppBaseUrl(),
                'X-Title': 'Collectly AI Form Studio',
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 4096,
            })
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            // OpenRouter suggests a replacement slug on 404 ("use this slug instead: xyz") — follow it automatically
            const slugMatch = body.match(/use this slug instead:\s*([a-z0-9\-\/.:_]+)/i);
            if (res.status === 404 && slugMatch?.[1]) {
                return { retryWith: slugMatch[1].replace(/[.]+$/, '') };
            }
            record('openrouter', 'failed', `${model}: HTTP ${res.status} ${body.slice(0, 140)}`);
            return null;
        }
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        const parsed = extractJSON(text || '');
        if (parsed?.fields) {
            const isQuiz = parsed.isQuiz ?? !!req.isQuiz;
            record('openrouter', 'success', `${model}: generated ${parsed.fields.length} fields`);
            return {
                title: parsed.title || req.prompt.slice(0, 50),
                description: parsed.description || '',
                category: detectCategory(req.prompt, parsed.category, isQuiz),
                isQuiz,
                fields: applyPointsDefault(normalizeFields(parsed.fields, isQuiz)),
                providerUsed: 'openrouter',
                attempts: [...attempts],
                enhancedPrompt,
            };
        }
        record('openrouter', 'failed', `${model}: no parseable JSON in response`);
        return null;
    };

    const tryOpenRouter = async (): Promise<AIGenerateResponse | null> => {
        if (!config.openrouterKey) {
            record('openrouter', 'skipped-no-key', 'No OpenRouter API key configured');
            return null;
        }
        try {
            const tried = new Set<string>();
            const queue = [...MODEL_FALLBACKS.openrouter];
            while (queue.length > 0) {
                const model = queue.shift()!;
                if (tried.has(model)) continue;
                tried.add(model);
                const result = await callOpenRouter(model);
                if (result && 'retryWith' in result) {
                    const suggested = result.retryWith as string;
                    record('openrouter', 'failed', `${model}: retired, retrying suggested ${suggested}`);
                    if (!tried.has(suggested)) queue.unshift(suggested);
                    continue;
                }
                if (result) return result;
            }
        } catch (err: any) {
            record('openrouter', 'failed', err?.message || 'Network error');
        }
        return null;
    };

    const tryGroq = async (): Promise<AIGenerateResponse | null> => {
        if (!config.groqKey) {
            record('groq', 'skipped-no-key', 'No Groq API key configured');
            return null;
        }
        for (const model of MODEL_FALLBACKS.groq) {
            try {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${config.groqKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ],
                        temperature: 0.7,
                        max_tokens: 4096,
                    })
                });
                if (!res.ok) {
                    const body = await res.text().catch(() => '');
                    record('groq', 'failed', `${model}: HTTP ${res.status} ${body.slice(0, 140)}`);
                    continue;
                }
                const data = await res.json();
                const text = data.choices?.[0]?.message?.content;
                const parsed = extractJSON(text || '');
                if (parsed?.fields) {
                    const isQuiz = parsed.isQuiz ?? !!req.isQuiz;
                    record('groq', 'success', `${model}: generated ${parsed.fields.length} fields`);
                    return {
                        title: parsed.title || req.prompt.slice(0, 50),
                        description: parsed.description || '',
                        category: detectCategory(req.prompt, parsed.category, isQuiz),
                        isQuiz,
                        fields: applyPointsDefault(normalizeFields(parsed.fields, isQuiz)),
                        providerUsed: 'groq',
                        attempts: [...attempts],
                        enhancedPrompt,
                    };
                }
                record('groq', 'failed', `${model}: no parseable JSON in response`);
            } catch (err: any) {
                record('groq', 'failed', `${model}: ${err?.message || 'Network error'}`);
            }
        }
        return null;
    };

    const runners: Record<string, () => Promise<AIGenerateResponse | null>> = {
        gemini: tryGemini,
        openrouter: tryOpenRouter,
        groq: tryGroq,
    };

    for (const provider of orderedProviders) {
        const result = await runners[provider]();
        if (result) {
            result.attempts = [...attempts];
            return result;
        }
    }

    // Final Fallback: Smart Local Template Generator
    const fallback = fallbackFormGenerator(req.prompt + (req.context ? `\n${req.context.slice(0, 500)}` : ''), req.isQuiz);
    return { ...fallback, attempts, enhancedPrompt };
};

// 3. AI Question Improver Service
export const improveQuestionWithAI = async (questionLabel: string, fieldType: string): Promise<{ improvedLabel: string; suggestion: string; providerUsed: AIProvider }> => {
    const config = getAIConfig();

    if (config.geminiKey) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${FREE_MODELS.gemini}:generateContent?key=${config.geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Rephrase this form question to be clearer, more engaging, and professional. Question: "${questionLabel}" (Type: ${fieldType}). Return ONLY JSON: {"improvedLabel": "...", "suggestion": "..."}` }] }]
                })
            });
            if (res.ok) {
                const data = await res.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                const parsed = extractJSON(text || '');
                if (parsed?.improvedLabel) {
                    return { improvedLabel: parsed.improvedLabel, suggestion: parsed.suggestion || '', providerUsed: 'gemini' };
                }
            }
        } catch (e) {
            // Fallback below
        }
    }

    // Fallback improvement
    return {
        improvedLabel: `Could you please share ${questionLabel.toLowerCase().replace('?', '')}?`,
        suggestion: 'Rephrased to be more polite, concise, and clear for form respondents.',
        providerUsed: 'fallback'
    };
};

// 4. Local Fast Sentiment Analysis (Zero external API overhead - instantaneous)
export const analyzeSentiment = (text: string): { sentiment: 'positive' | 'neutral' | 'negative'; score: number } => {
    if (!text || typeof text !== 'string' || !text.trim()) {
        return { sentiment: 'neutral', score: 0.5 };
    }
    const lower = text.toLowerCase();
    const positiveWords = [
        'great', 'excellent', 'love', 'amazing', 'good', 'super', 'best', 'awesome',
        'helpful', 'fast', 'easy', 'perfect', 'happy', 'smooth', 'impressive', 'wonderful',
        'clean', 'satisfied', 'pleased', 'fantastic', 'brilliant', 'delightful'
    ];
    const negativeWords = [
        'bad', 'poor', 'terrible', 'slow', 'hard', 'broken', 'issue', 'bug', 'worst',
        'hate', 'difficult', 'annoying', 'error', 'confusing', 'unhappy', 'frustrating',
        'horrible', 'awful', 'laggy', 'failed', 'fail', 'crash', 'disappointed'
    ];

    let posCount = 0;
    let negCount = 0;

    positiveWords.forEach(w => {
        const regex = new RegExp(`\\b${w}\\b`, 'i');
        if (regex.test(lower)) posCount++;
    });
    negativeWords.forEach(w => {
        const regex = new RegExp(`\\b${w}\\b`, 'i');
        if (regex.test(lower)) negCount++;
    });

    if (posCount > negCount) return { sentiment: 'positive', score: Math.min(0.98, 0.6 + (posCount - negCount) * 0.1) };
    if (negCount > posCount) return { sentiment: 'negative', score: Math.min(0.98, 0.6 + (negCount - posCount) * 0.1) };
    return { sentiment: 'neutral', score: 0.5 };
};

export interface AISentimentSynthesis {
    summary: string;
    keyThemes: { theme: string; sentiment: 'positive' | 'neutral' | 'negative'; count: number }[];
    actionableSuggestions: string[];
    topPraises: string[];
    topComplaints: string[];
    providerUsed: string;
}

// In-memory session cache for AI sentiment synthesis to prevent any redundant API calls
const sentimentSynthesisCache = new Map<string, { timestamp: number; data: AISentimentSynthesis }>();

/**
 * On-demand AI Sentiment & Qualitative Synthesis for the Analytics Page.
 *
 * ONLY executed when the user explicitly triggers "Analyze with AI" on the Sentiment section.
 * Automatically utilizes in-memory caching (5-minute TTL based on response count and hash)
 * to ensure ZERO wasted API tokens or redundant network requests.
 */
export const synthesizeSentimentWithAI = async (
    formTitle: string,
    sampleComments: string[],
    stats: { total: number; positive: number; neutral: number; negative: number }
): Promise<AISentimentSynthesis> => {
    // Generate cache key
    const cacheKey = `${formTitle}::${sampleComments.length}::${stats.total}::${sampleComments.slice(0, 5).join('|')}`;
    const cached = sentimentSynthesisCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < 300000) {
        return cached.data;
    }

    const config = getAIConfig();
    const promptText = `Analyze these ${sampleComments.length} user response comments for the form "${formTitle}".
Current Stats: Total: ${stats.total}, Positive: ${stats.positive}, Neutral: ${stats.neutral}, Negative: ${stats.negative}.

User Comments sample:
${sampleComments.slice(0, 20).map((c, i) => `${i + 1}. "${c}"`).join('\n')}

Provide an executive qualitative sentiment breakdown.
Return ONLY valid JSON matching this exact structure:
{
  "summary": "2-3 concise sentences summarizing audience sentiment and overall satisfaction tone.",
  "keyThemes": [
    { "theme": "Theme title", "sentiment": "positive", "count": 5 },
    { "theme": "Theme title", "sentiment": "negative", "count": 3 }
  ],
  "topPraises": ["praise point 1", "praise point 2"],
  "topComplaints": ["complaint point 1", "complaint point 2"],
  "actionableSuggestions": ["Action item 1", "Action item 2"]
}`;

    // Try Gemini if key configured
    if (config.geminiKey) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${FREE_MODELS.gemini}:generateContent?key=${config.geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                })
            });
            if (res.ok) {
                const data = await res.json();
                const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                const parsed = extractJSON(rawText || '');
                if (parsed?.summary) {
                    const result: AISentimentSynthesis = {
                        summary: parsed.summary,
                        keyThemes: Array.isArray(parsed.keyThemes) ? parsed.keyThemes : [],
                        topPraises: Array.isArray(parsed.topPraises) ? parsed.topPraises : [],
                        topComplaints: Array.isArray(parsed.topComplaints) ? parsed.topComplaints : [],
                        actionableSuggestions: Array.isArray(parsed.actionableSuggestions) ? parsed.actionableSuggestions : [],
                        providerUsed: 'Google Gemini'
                    };
                    sentimentSynthesisCache.set(cacheKey, { timestamp: now, data: result });
                    return result;
                }
            }
        } catch (e) {
            console.warn('Gemini sentiment analysis failed, falling back:', e);
        }
    }

    // Try Groq if key configured
    if (config.groqKey) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.groqKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: FREE_MODELS.groq,
                    messages: [
                        { role: 'system', content: 'You are an analytics sentiment expert. Output valid JSON only.' },
                        { role: 'user', content: promptText }
                    ],
                    response_format: { type: 'json_object' }
                })
            });
            if (res.ok) {
                const data = await res.json();
                const content = data.choices?.[0]?.message?.content;
                const parsed = extractJSON(content || '');
                if (parsed?.summary) {
                    const result: AISentimentSynthesis = {
                        summary: parsed.summary,
                        keyThemes: Array.isArray(parsed.keyThemes) ? parsed.keyThemes : [],
                        topPraises: Array.isArray(parsed.topPraises) ? parsed.topPraises : [],
                        topComplaints: Array.isArray(parsed.topComplaints) ? parsed.topComplaints : [],
                        actionableSuggestions: Array.isArray(parsed.actionableSuggestions) ? parsed.actionableSuggestions : [],
                        providerUsed: 'Groq Cloud'
                    };
                    sentimentSynthesisCache.set(cacheKey, { timestamp: now, data: result });
                    return result;
                }
            }
        } catch (e) {
            console.warn('Groq sentiment analysis failed, falling back:', e);
        }
    }

    // Smart Local Heuristic Synthesizer (Instant, 0 API calls, 100% reliable fallback)
    const posPercent = stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0;
    const negPercent = stats.total > 0 ? Math.round((stats.negative / stats.total) * 100) : 0;
    const tone = posPercent >= 60 ? 'predominantly positive' : negPercent >= 40 ? 'mixed with concerns' : 'balanced and neutral';

    const fallbackResult: AISentimentSynthesis = {
        summary: `Audience feedback for "${formTitle}" is currently ${tone}. ${posPercent}% of analyzed responses exhibit satisfied sentiment, with ${negPercent}% expressing friction points.`,
        keyThemes: [
            { theme: 'User Experience & Satisfaction', sentiment: posPercent >= 50 ? 'positive' : 'neutral', count: stats.positive || 1 },
            { theme: 'Form Clarity & Ease of Use', sentiment: 'positive', count: Math.ceil(stats.total * 0.4) || 1 },
            { theme: 'Identified Friction & Roadblocks', sentiment: 'negative', count: stats.negative || 0 }
        ],
        topPraises: [
            'Clear question layout and prompt response flow',
            'Smooth submission experience and responsive interface'
        ],
        topComplaints: stats.negative > 0 ? [
            'Ambiguity in open-ended question responses',
            'Opportunities to streamline optional response fields'
        ] : ['No major complaints reported so far'],
        actionableSuggestions: [
            'Maintain the straightforward question wording to keep completion rates high',
            stats.negative > 0 ? 'Review recurring negative submissions in the Response Feed to address respondent concerns' : 'A/B test shorter question paths to boost response throughput'
        ],
        providerUsed: 'Smart Local Engine'
    };

    sentimentSynthesisCache.set(cacheKey, { timestamp: now, data: fallbackResult });
    return fallbackResult;
};
