import { supabase } from '../lib/supabaseClient';
import { Form, FormField, FormSettings, FormCategory, FormStatus } from '../types';
import { getPublicFormUrl } from '../lib/config';

export const formService = {
  async getForms(): Promise<Form[]> {
    const { data, error } = await supabase
      .from('forms')
      .select('*, fields(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(this.mapFormFromDB) || [];
  },

  async getForm(id: string): Promise<Form | null> {
    const { data, error } = await supabase
      .from('forms')
      .select('*, fields(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? this.mapFormFromDB(data) : null;
  },

  async getPublishedForm(id: string): Promise<Form | null> {
    const { data, error } = await supabase
      .from('forms')
      .select('*, fields(*)')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    return data ? this.mapFormFromDB(data) : null;
  },

  isUUID(v: any): boolean {
    return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
  },

  async createForm(form: Partial<Form>): Promise<Form> {
    const { data: userData } = await supabase.auth.getUser();
    const ownerId = userData.user?.id;
    if (!ownerId) throw new Error('Not authenticated — sign in to save your forms.');

    const dbForm: any = {
      owner_id: ownerId,
      title: form.title || 'Untitled Form',
      description: form.description || '',
      category: form.category || 'General',
      status: form.status || 'draft',
      is_quiz: form.isQuiz || false,
      settings: form.settings || this.getDefaultSettings(),
      logic_rules: (form.settings as any)?.thankYouPages || [],
      response_count: 0,
      completion_rate: 0,
      average_time_seconds: 0,
      share_url: form.id ? getPublicFormUrl(form.id) : '',
    };
    // Preserve client UUID so local + remote stay in sync
    if (form.id && this.isUUID(form.id)) dbForm.id = form.id;

    const { data, error } = await supabase
      .from('forms')
      .insert(dbForm)
      .select('*, fields(*)')
      .single();

    if (error) throw error;

    if (form.fields && form.fields.length > 0) {
      await this.saveFields(data.id, form.fields);
    }

    const { data: fullForm } = await supabase
      .from('forms')
      .select('*, fields(*)')
      .eq('id', data.id)
      .single();

    return this.mapFormFromDB(fullForm!);
  },

  async updateForm(id: string, updates: Partial<Form>): Promise<Form> {
    if (!this.isUUID(id)) throw new Error(`Cannot save this form: invalid form id (${id}). Create a new form to save it.`);
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.isQuiz !== undefined) dbUpdates.is_quiz = updates.isQuiz;
    if (updates.settings !== undefined) dbUpdates.settings = updates.settings;

    const { error } = await supabase
      .from('forms')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;

    if (updates.fields) {
      await this.saveFields(id, updates.fields);
    }

    const { data } = await supabase
      .from('forms')
      .select('*, fields(*)')
      .eq('id', id)
      .single();

    return this.mapFormFromDB(data!);
  },

  async deleteForm(id: string): Promise<void> {
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async duplicateForm(id: string): Promise<Form> {
    const form = await this.getForm(id);
    if (!form) throw new Error('Form not found');

    const duplicated = await this.createForm({
      ...form,
      title: `${form.title} (Copy)`,
      status: 'draft',
      id: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseCount: 0,
      shareUrl: '',
    });

    return duplicated;
  },

  async publishForm(id: string): Promise<Form> {
    const shareUrl = getPublicFormUrl(id);
    return this.updateForm(id, { status: 'published', shareUrl });
  },

  async saveFields(formId: string, fields: FormField[]): Promise<void> {
    if (!this.isUUID(formId)) {
      console.warn('Skipping Supabase field save: legacy non-UUID form id', formId);
      return;
    }
    await supabase.from('fields').delete().eq('form_id', formId);

    if (fields.length > 0) {
      const dbFields = fields.map(f => {
        const row: any = {
          form_id: formId,
          type: f.type,
          label: f.label,
          description: f.description,
          placeholder: f.placeholder,
          required: f.required,
          order: f.order,
          page: f.page || 1,
          points: f.points || 0,
          correct_answer: typeof f.correctAnswer === 'string' ? f.correctAnswer : null,
          options: f.options || [],
          logic_rules: f.logicRules || [],
          validation_pattern: f.validationPattern || null,
          accepted_file_types: f.acceptedFileTypes || null,
          max_file_size_mb: f.maxFileSizeMb || 5,
        };
        if (f.id && this.isUUID(f.id)) row.id = f.id;
        return row;
      });

      const { error } = await supabase.from('fields').insert(dbFields);
      if (error) throw error;
    }
  },

  async saveFormVersion(formId: string, changeDescription: string): Promise<void> {
    const form = await this.getForm(formId);
    if (!form) return;

    const { data: versions } = await supabase
      .from('form_versions')
      .select('version')
      .eq('form_id', formId)
      .order('version', { ascending: false })
      .limit(1);

    const nextVersion = (versions?.[0]?.version || 0) + 1;
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('form_versions').insert({
      form_id: formId,
      version: nextVersion,
      title: form.title,
      fields: form.fields,
      settings: form.settings,
      change_description: changeDescription,
      created_by: userData.user?.id,
    });
    if (error) throw error;
  },

  async getFormVersions(formId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('form_versions')
      .select('*')
      .eq('form_id', formId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async restoreFormVersion(formId: string, versionId: string): Promise<void> {
    const { data: version, error } = await supabase
      .from('form_versions')
      .select('*')
      .eq('id', versionId)
      .single();

    if (error) throw error;
    if (!version) throw new Error('Version not found');

    await this.updateForm(formId, {
      title: version.title,
      fields: version.fields,
      settings: version.settings,
    });
  },

  async getTemplates(): Promise<any[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createTemplate(template: any): Promise<any> {
    const { data, error } = await supabase
      .from('templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToForms(callback: () => void) {
    return supabase
      .channel('forms:changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forms' }, callback)
      .subscribe();
  },

  getDefaultSettings(): FormSettings {
    return {
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
        enabled: false,
        showLeaderboard: true,
        showImmediateFeedback: true,
        antiCheatTabDetection: true,
        antiCheatDisableCopyPaste: true,
        passPercentage: 70,
        generateCertificate: true,
        certificateTitle: 'Certificate of Achievement',
      },
      theme: {
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
      },
    };
  },

  mapFormFromDB(dbForm: any): Form {
    return {
      id: dbForm.id,
      title: dbForm.title,
      description: dbForm.description || '',
      category: dbForm.category,
      status: dbForm.status,
      isQuiz: dbForm.is_quiz,
      fields: (dbForm.fields || []).map((f: any) => ({
        id: f.id,
        type: f.type,
        label: f.label,
        description: f.description,
        placeholder: f.placeholder,
        required: f.required,
        order: f.order,
        page: f.page || 1,
        points: f.points,
        correctAnswer: f.correct_answer,
        options: f.options || [],
        logicRules: f.logic_rules || [],
        validationPattern: f.validation_pattern,
        acceptedFileTypes: f.accepted_file_types,
        maxFileSizeMb: f.max_file_size_mb,
      })),
      settings: dbForm.settings || this.getDefaultSettings(),
      createdAt: dbForm.created_at,
      updatedAt: dbForm.updated_at,
      responseCount: dbForm.response_count || 0,
      completionRate: dbForm.completion_rate || 0,
      averageTimeSeconds: dbForm.average_time_seconds || 0,
      shareUrl: dbForm.share_url || (dbForm.id ? getPublicFormUrl(dbForm.id) : ''),
    };
  },
};

export const responseService = {
  mapResponseFromDB(dbResp: any): any {
    return {
      id: dbResp.id,
      formId: dbResp.form_id,
      submittedAt: dbResp.submitted_at,
      timeSpentSeconds: dbResp.time_spent_seconds || 0,
      isDuplicate: dbResp.is_duplicate || false,
      isSpam: dbResp.is_spam || false,
      score: dbResp.score,
      totalPossiblePoints: dbResp.total_possible_points,
      passed: dbResp.passed,
      tags: dbResp.tags || [],
      answers: dbResp.answers || {},
      teamNotes: dbResp.team_notes || [],
      sentiment: dbResp.sentiment,
      sentimentScore: dbResp.sentiment_score,
      deviceInfo: dbResp.device_info || {},
    };
  },

  async getResponses(formId?: string): Promise<any[]> {
    let query = supabase
      .from('responses')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (formId) {
      query = query.eq('form_id', formId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((r: any) => this.mapResponseFromDB(r));
  },

  async submitResponse(response: any): Promise<any> {
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (response.form_id && !uuidRe.test(response.form_id)) {
      throw new Error(`Cannot save this response: invalid form id (${response.form_id}). Publish a new form to collect responses.`);
    }
    const payload: any = { ...response };
    if (payload.id && !uuidRe.test(payload.id)) delete payload.id;
    const { error } = await supabase
      .from('responses')
      .insert(payload);

    if (error) throw error;

    // response_count is maintained by the on_response_created DB trigger
    // (works for anonymous public submissions and is race-free).
    // Intentionally no .select(): anonymous respondents have no SELECT policy
    // on responses, so RETURNING would come back empty even when the insert
    // itself succeeded.
    return null;
  },

  async hasPriorResponse(formId: string, email: string): Promise<boolean> {
    if (!formId || !email) return false;
    const { isSupabaseConfigured } = await import('../lib/supabaseClient');
    if (!isSupabaseConfigured) return false;
    const { data, error } = await supabase.rpc('has_prior_response', {
      p_form_id: formId,
      p_email: email.trim().toLowerCase(),
    });
    if (error) {
      console.warn('Duplicate check failed:', error);
      return false;
    }
    return !!data;
  },

  async incrementResponseCount(formId: string): Promise<void> {
    const { data: form } = await supabase
      .from('forms')
      .select('response_count')
      .eq('id', formId)
      .single();

    if (form) {
      await supabase
        .from('forms')
        .update({ response_count: (form.response_count || 0) + 1 })
        .eq('id', formId);
    }
  },

  async addTeamNote(responseId: string, note: any): Promise<void> {
    const { data: response } = await supabase
      .from('responses')
      .select('team_notes')
      .eq('id', responseId)
      .single();

    const notes = response?.team_notes || [];
    notes.push(note);

    await supabase
      .from('responses')
      .update({ team_notes: notes })
      .eq('id', responseId);
  },

  async toggleTag(responseId: string, tag: string): Promise<void> {
    const { data: response } = await supabase
      .from('responses')
      .select('tags')
      .eq('id', responseId)
      .single();

    const tags = response?.tags || [];
    const exists = tags.includes(tag);
    const newTags = exists ? tags.filter((t: string) => t !== tag) : [...tags, tag];

    await supabase
      .from('responses')
      .update({ tags: newTags })
      .eq('id', responseId);
  },

  async deleteResponse(responseId: string): Promise<void> {
    const { error } = await supabase
      .from('responses')
      .delete()
      .eq('id', responseId);

    if (error) throw error;
  },

  async bulkDeleteResponses(responseIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('responses')
      .delete()
      .in('id', responseIds);

    if (error) throw error;
  },

  async bulkTagResponses(responseIds: string[], tag: string): Promise<void> {
    for (const id of responseIds) {
      await this.toggleTag(id, tag);
    }
  },

  subscribeToResponses(formId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`responses:${formId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'responses', filter: `form_id=eq.${formId}` },
        callback
      )
      .subscribe();
  },
};

export const analyticsService = {
  async getFunnelData(formId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type, created_at')
      .eq('form_id', formId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getDeviceBreakdown(formId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('responses')
      .select('device_info')
      .eq('form_id', formId);

    if (error) throw error;
    return data || [];
  },

  async getGeoBreakdown(formId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('responses')
      .select('device_info')
      .eq('form_id', formId);

    if (error) throw error;
    return data || [];
  },

  async getSentimentBreakdown(formId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('responses')
      .select('sentiment')
      .eq('form_id', formId);

    if (error) throw error;
    return data || [];
  },

  async getTimelineData(formId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('responses')
      .select('submitted_at')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async trackEvent(formId: string, eventType: string, payload: any = {}): Promise<void> {
    await supabase.from('analytics_events').insert({
      form_id: formId,
      event_type: eventType,
      payload,
    });
  },
};

export const certificateService = {
  async createCertificate(data: any): Promise<any> {
    const { data: cert, error } = await supabase
      .from('certificates')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return cert;
  },

  async getCertificateByResponse(responseId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('response_id', responseId)
      .single();

    if (error) throw error;
    return data;
  },

  async uploadCertificatePdf(path: string, blob: Blob): Promise<string> {
    const { data, error } = await supabase.storage
      .from('certificates')
      .upload(path, blob, { contentType: 'application/pdf' });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },
};

export const exportService = {
  async saveExportRecord(data: any): Promise<any> {
    const { data: record, error } = await supabase
      .from('exports')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return record;
  },

  async getExportHistory(formId?: string): Promise<any[]> {
    let query = supabase
      .from('exports')
      .select('*')
      .order('requested_at', { ascending: false });

    if (formId) {
      query = query.eq('form_id', formId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async deleteExportRecord(id: string): Promise<void> {
    const { error } = await supabase.from('exports').delete().eq('id', id);
    if (error) throw error;
  },

  async uploadExportFile(path: string, blob: Blob): Promise<string> {
    const { data, error } = await supabase.storage
      .from('exports')
      .upload(path, blob);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('exports')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },
};

export const profileService = {
  async getProfile(): Promise<any | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(updates: any): Promise<any> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userData.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSettings(): Promise<any | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateUserSettings(updates: any): Promise<any> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');
    const userId = userData.user.id;

    // Read current row, then shallow-merge each JSONB column so partial saves
    // (theme, aiConfig, notifications, security…) never wipe each other.
    const { data: existing, error: readError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (readError) throw readError;

    const row: any = { user_id: userId, updated_at: new Date().toISOString() };
    for (const [key, value] of Object.entries(updates)) {
      const current = existing ? (existing as any)[key] : null;
      if (
        current && typeof current === 'object' && !Array.isArray(current) &&
        value && typeof value === 'object' && !Array.isArray(value)
      ) {
        row[key] = { ...current, ...value };
      } else {
        row[key] = value;
      }
    }

    const { data, error } = await supabase
      .from('user_settings')
      .upsert(row, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const path = `avatars/${userData.user.id}/${file.name}`;
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },
};
