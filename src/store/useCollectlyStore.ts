import { create } from 'zustand';
import { Form, FormField, FormResponse, UserProfile, FormCategory, AIProvider, FormSettings } from '../types';
import { getAIConfig, saveAIConfig, loadAIConfig } from '../services/aiService';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { formService, responseService, profileService, analyticsService, certificateService, exportService } from '../services/formService';
import { getPublicFormUrl } from '../lib/config';

const loadFromSupabase = async (set: any, get: any) => {
    if (!isSupabaseConfigured) return;
    try {
        const [forms, profile] = await Promise.all([
            formService.getForms(),
            profileService.getProfile()
        ]);
        set({ forms: forms || [] });
        if (profile) {
            set({
                user: {
                    id: profile.id,
                    email: profile.email,
                    fullName: profile.full_name,
                    avatarUrl: profile.avatar_url,
                    role: profile.role,
                    teamName: profile.team_name
                }
            });
        }
    } catch (err) {
        console.warn('Failed to load from Supabase:', err);
    }
    try {
        const aiConfig = await loadAIConfig();
        if (aiConfig) set({ aiConfig });
    } catch (err) {
        console.warn('Failed to load AI config from Supabase:', err);
    }
};

const genUUID = () => {
    try {
        if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
    } catch { }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const isUUID = (v: any) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

// Debounced auto-version snapshots: once a burst of edits settles (8s quiet),
// snapshot the form into form_versions (at most one per form per minute).
const snapshotTimers: Record<string, ReturnType<typeof setTimeout>> = {};
const lastSnapshotAt: Record<string, number> = {};
const scheduleFieldSnapshot = (formId: string, getForms: () => Form[]) => {
    if (!isSupabaseConfigured || !isUUID(formId)) return;
    if (snapshotTimers[formId]) clearTimeout(snapshotTimers[formId]);
    snapshotTimers[formId] = setTimeout(async () => {
        if (Date.now() - (lastSnapshotAt[formId] || 0) < 60_000) return;
        const form = getForms().find((f) => f.id === formId);
        if (!form) return;
        try {
            await formService.saveFormVersion(formId, 'Auto-snapshot — form edited');
            lastSnapshotAt[formId] = Date.now();
        } catch (err) {
            console.warn('Auto version snapshot failed:', err);
        }
    }, 8000);
};

const defaultTheme = {
    primaryColor: '#2563EB',
    secondaryColor: '#64748B',
    accentColor: '#06B6D4',
    backgroundColor: '#F8FAFC',
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A',
    gradientStart: '#60A5FA',
    gradientEnd: '#22D3EE',
    fontFamily: 'Poppins',
    borderRadius: '8px'
};

const defaultSettings = (isQuiz: boolean = false): FormSettings => ({
    requireLogin: false,
    showTimerCountdown: false,
    customThankYouTitle: 'Response Submitted!',
    customThankYouMessage: 'Thank you for filling out this form.',
    thankYouPages: [],
    aiSentimentEnabled: true,
    enableCaptcha: false,
    enableDuplicateDetection: true,
    totalPages: 1,
    quiz: {
        enabled: isQuiz,
        showLeaderboard: true,
        showImmediateFeedback: true,
        antiCheatTabDetection: true,
        antiCheatDisableCopyPaste: true,
        passPercentage: 70,
        generateCertificate: true,
        certificateTitle: 'Certificate of Achievement'
    },
    theme: { ...defaultTheme }
});

interface CollectlyStore {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
    forms: Form[];
    activeForm: Form | null;
    setActiveForm: (form: Form | null) => void;
    createForm: (newForm: Partial<Form>) => Form;
    updateForm: (id: string, updates: Partial<Form>) => void;
    publishFormWithVersion: (id: string, changeDescription?: string) => Promise<{ ok: boolean; skipped?: boolean; error?: string }>;
    deleteForm: (id: string) => void;
    duplicateForm: (id: string) => void;
    responses: FormResponse[];
    responsesError: string | null;
    addResponse: (response: FormResponse) => Promise<boolean>;
    addTeamNote: (responseId: string, noteText: string) => void;
    toggleResponseTag: (responseId: string, tag: string) => void;
    deleteResponse: (responseId: string) => void;
    bulkDeleteResponses: (responseIds: string[]) => void;
    bulkTagResponses: (responseIds: string[], tag: string) => void;
    loadFormsFromSupabase: () => Promise<void>;
    loadResponsesFromSupabase: (formId?: string) => Promise<void>;
    loadProfileFromSupabase: () => Promise<void>;
    loadAllFromSupabase: () => Promise<void>;
    syncLocalToSupabase: () => Promise<{ synced: number; skipped: number; errors: string[] }>;
    aiConfig: {
        geminiKey: string;
        openrouterKey: string;
        groqKey: string;
        preferredProvider: AIProvider;
    };
    setAIConfig: (config: Partial<{ geminiKey: string; openrouterKey: string; groqKey: string; preferredProvider: AIProvider }>) => Promise<boolean>;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
}

export const useCollectlyStore = create<CollectlyStore>((set, get) => ({
    user: {
        id: 'usr-1',
        email: 'admin@collectly.app',
        fullName: 'Sahil Dev',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        role: 'Owner',
        teamName: 'Collectly Innovation Workspace'
    },
    setUser: (user) => set({ user }),

    forms: [],
    activeForm: null,
    setActiveForm: (activeForm) => set({ activeForm }),

    loadFormsFromSupabase: async () => {
        if (!isSupabaseConfigured) return;
        try {
            const forms = await formService.getForms();
            set({ forms: forms || [] });
        } catch (err) {
            console.warn('Failed to load forms from Supabase:', err);
        }
    },

    loadResponsesFromSupabase: async (formId?: string) => {
        if (!isSupabaseConfigured) return;
        try {
            const responses = await responseService.getResponses(formId);
            set({ responses: (responses || []) as any, responsesError: null });
        } catch (err: any) {
            console.warn('Failed to load responses from Supabase:', err);
            set({ responsesError: err?.message || 'Unknown error while loading responses' });
        }
    },

    loadProfileFromSupabase: async () => {
        if (!isSupabaseConfigured) return;
        try {
            const profile = await profileService.getProfile();
            if (profile) {
                set({
                    user: {
                        id: profile.id,
                        email: profile.email,
                        fullName: profile.full_name,
                        avatarUrl: profile.avatar_url,
                        role: profile.role,
                        teamName: profile.team_name
                    }
                });
            }
        } catch (err) {
            console.warn('Failed to load profile from Supabase:', err);
        }
    },

    loadAllFromSupabase: async () => {
        await loadFromSupabase(set, get);
    },

    syncLocalToSupabase: async () => {
        let synced = 0;
        let skipped = 0;
        const errors: string[] = [];
        if (!isSupabaseConfigured) return { synced, skipped, errors: ['Supabase not configured'] };
        const { forms } = get();
        for (const f of forms) {
            if (!isUUID(f.id)) {
                skipped++;
                continue;
            }
            try {
                const existing = await formService.getForm(f.id).catch(() => null);
                if (existing) {
                    await formService.updateForm(f.id, { title: f.title, description: f.description, category: f.category as any, status: f.status as any, isQuiz: f.isQuiz, settings: f.settings, fields: f.fields });
                } else {
                    await formService.createForm(f as any);
                }
                synced++;
            } catch (e: any) {
                errors.push(`${f.title}: ${e.message}`);
            }
        }
        return { synced, skipped, errors };
    },

    createForm: (newFormPartial) => {
        const id = (newFormPartial as any).id && isUUID((newFormPartial as any).id) ? (newFormPartial as any).id : genUUID();
        const shareUrl = getPublicFormUrl(id);
        const fieldsWithUUID = (newFormPartial.fields || [
            { id: genUUID(), type: 'text', label: 'Your Name', placeholder: 'Enter text...', required: true, order: 1 }
        ]).map((f: any, i: number) => ({
            ...f,
            id: isUUID(f.id) ? f.id : genUUID(),
            order: f.order || i + 1,
            page: f.page || 1,
            logicRules: f.logicRules || [],
        }));
        const newForm: Form = {
            id,
            title: newFormPartial.title || 'Untitled Form',
            description: newFormPartial.description || '',
            category: newFormPartial.category || 'General',
            status: 'draft',
            isQuiz: newFormPartial.isQuiz || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            responseCount: 0,
            completionRate: 0,
            averageTimeSeconds: 0,
            shareUrl,
            settings: newFormPartial.settings || defaultSettings(newFormPartial.isQuiz || false),
            fields: fieldsWithUUID as any,
        };

        set((state) => {
            const forms = [newForm, ...state.forms];
            return { forms, activeForm: newForm };
        });

        if (isSupabaseConfigured) {
            formService.createForm(newForm).catch(err => console.warn('Supabase form create failed:', err));
        }

        return newForm;
    },

    updateForm: (id, updates) => {
        set((state) => {
            let updatedForm: Form | null = null;
            const updatedForms = state.forms.map((f) => {
                if (f.id === id) {
                    updatedForm = { ...f, ...updates, updatedAt: new Date().toISOString() };
                    return updatedForm;
                }
                return f;
            });
            return {
                forms: updatedForms,
                activeForm: state.activeForm?.id === id ? updatedForm : state.activeForm
            };
        });

        if (isSupabaseConfigured && isUUID(id)) {
            formService.updateForm(id, updates).catch(err => console.warn('Supabase form update failed:', err));
            // Content edits (fields/title/settings) auto-snapshot into form_versions
            if (updates.fields || updates.title || updates.settings) {
                scheduleFieldSnapshot(id, () => get().forms);
            }
        }
    },

    // Publish = persist the latest form state, then snapshot it into form_versions.
    // Called from the Publish & Share modal whenever the form is (re-)published.
    publishFormWithVersion: async (id, changeDescription = 'Published update') => {
        get().updateForm(id, { status: 'published' });
        if (!isSupabaseConfigured) return { ok: true, skipped: true };
        if (!isUUID(id)) return { ok: false, error: `Not a valid form id: ${id}` };
        const form = get().forms.find((f) => f.id === id);
        if (!form) return { ok: false, error: 'Form not found' };
        try {
            // Push the newest title/description/fields/settings first so the
            // version snapshot in form_versions matches exactly what went live.
            await formService.updateForm(id, {
                title: form.title,
                description: form.description,
                category: form.category,
                status: 'published',
                isQuiz: form.isQuiz,
                settings: form.settings,
                fields: form.fields,
            });
            await formService.saveFormVersion(id, changeDescription);
            lastSnapshotAt[id] = Date.now();
            return { ok: true };
        } catch (err: any) {
            console.warn('Failed to save form version:', err);
            return { ok: false, error: err?.message || 'Version insert failed' };
        }
    },

    deleteForm: (id) => {
        set((state) => {
            const forms = state.forms.filter((f) => f.id !== id);
            return {
                forms,
                activeForm: state.activeForm?.id === id ? null : state.activeForm
            };
        });

        if (isSupabaseConfigured && isUUID(id)) {
            formService.deleteForm(id).catch(err => console.warn('Supabase form delete failed:', err));
        }
    },

    duplicateForm: (id) => {
        const target = get().forms.find((f) => f.id === id);
        if (!target) return;
        const newId = genUUID();
        const duplicated: Form = {
            ...target,
            id: newId,
            title: `${target.title} (Copy)`,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            responseCount: 0,
            completionRate: 0,
            averageTimeSeconds: 0,
            shareUrl: getPublicFormUrl(newId),
            fields: target.fields.map((f) => ({ ...f, id: genUUID() })),
        };
        set((state) => {
            const forms = [duplicated, ...state.forms];
            return { forms };
        });

        if (isSupabaseConfigured) {
            formService.createForm(duplicated).catch(err => console.warn('Supabase duplicate failed:', err));
        }
    },

    responses: [],
    responsesError: null,
    addResponse: async (response) => {
        const respWithUUID = { ...response, id: isUUID(response.id) ? response.id : genUUID() };

        // Persist first. Anonymous submissions are allowed by the "Responses public insert"
        // policy — if the database rejects the row (e.g. missing policy), report failure
        // instead of silently keeping the response only in memory.
        if (isSupabaseConfigured) {
            try {
                await responseService.submitResponse({
                    id: isUUID(respWithUUID.id) ? respWithUUID.id : undefined,
                    form_id: respWithUUID.formId,
                    submitted_at: respWithUUID.submittedAt,
                    time_spent_seconds: respWithUUID.timeSpentSeconds,
                    is_duplicate: respWithUUID.isDuplicate,
                    is_spam: respWithUUID.isSpam,
                    score: respWithUUID.score,
                    total_possible_points: respWithUUID.totalPossiblePoints,
                    passed: respWithUUID.passed,
                    tags: respWithUUID.tags,
                    answers: respWithUUID.answers,
                    team_notes: respWithUUID.teamNotes,
                    sentiment: respWithUUID.sentiment,
                    sentiment_score: respWithUUID.sentimentScore,
                    device_info: respWithUUID.deviceInfo,
                });
            } catch (err) {
                console.warn('Supabase response submit failed:', err);
                return false;
            }
        }

        set((state) => {
            const responses = [respWithUUID, ...state.responses];
            const forms = state.forms.map(f => f.id === respWithUUID.formId ? { ...f, responseCount: f.responseCount + 1 } : f);
            return { responses, forms };
        });
        return true;
    },

    addTeamNote: (responseId, noteText) => {
        const author = get().user.fullName;
        set((state) => ({
            responses: state.responses.map((r) => {
                if (r.id === responseId) {
                    return { ...r, teamNotes: [...r.teamNotes, { id: `note-${Date.now()}`, author, text: noteText, createdAt: new Date().toISOString() }] };
                }
                return r;
            })
        }));

        if (isSupabaseConfigured) {
            responseService.addTeamNote(responseId, { id: `note-${Date.now()}`, author, text: noteText, createdAt: new Date().toISOString() }).catch(err => console.warn('Supabase note add failed:', err));
        }
    },

    toggleResponseTag: (responseId, tag) => {
        set((state) => ({
            responses: state.responses.map((r) => {
                if (r.id === responseId) {
                    const exists = r.tags.includes(tag);
                    return { ...r, tags: exists ? r.tags.filter((t) => t !== tag) : [...r.tags, tag] };
                }
                return r;
            })
        }));

        if (isSupabaseConfigured) {
            responseService.toggleTag(responseId, tag).catch(err => console.warn('Supabase tag toggle failed:', err));
        }
    },

    deleteResponse: (responseId) => {
        set((state) => ({
            responses: state.responses.filter((r) => r.id !== responseId)
        }));

        if (isSupabaseConfigured) {
            responseService.deleteResponse(responseId).catch(err => console.warn('Supabase response delete failed:', err));
        }
    },

    bulkDeleteResponses: (responseIds) => {
        set((state) => ({
            responses: state.responses.filter((r) => !responseIds.includes(r.id))
        }));

        if (isSupabaseConfigured) {
            responseService.bulkDeleteResponses(responseIds).catch(err => console.warn('Supabase bulk delete failed:', err));
        }
    },

    bulkTagResponses: (responseIds, tag) => {
        set((state) => ({
            responses: state.responses.map((r) => {
                if (responseIds.includes(r.id)) {
                    const exists = r.tags.includes(tag);
                    return { ...r, tags: exists ? r.tags.filter((t) => t !== tag) : [...r.tags, tag] };
                }
                return r;
            })
        }));

        if (isSupabaseConfigured) {
            responseService.bulkTagResponses(responseIds, tag).catch(err => console.warn('Supabase bulk tag failed:', err));
        }
    },

    aiConfig: getAIConfig(),
    setAIConfig: async (newConfig) => {
        set((state) => ({
            aiConfig: { ...state.aiConfig, ...newConfig }
        }));
        return await saveAIConfig(newConfig);
    },

    searchQuery: '',
    setSearchQuery: (searchQuery) => set({ searchQuery }),

    selectedCategory: 'All',
    setSelectedCategory: (selectedCategory) => set({ selectedCategory })
}));
