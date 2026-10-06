-- ==========================================
-- COLLECTLY V2 - COMPLETE SUPABASE SCHEMA
-- Safe to re-run (all objects use IF NOT EXISTS / DROP ... IF EXISTS)
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Owner' CHECK (role IN ('Owner', 'Admin', 'Viewer')),
  team_name TEXT DEFAULT 'My Collectly Team',
  settings JSONB DEFAULT '{}'::jsonb,
  branding JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. FORMS TABLE
CREATE TABLE IF NOT EXISTS public.forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'closed')),
  is_quiz BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}'::jsonb,
  logic_rules JSONB DEFAULT '[]'::jsonb,
  response_count INTEGER DEFAULT 0,
  completion_rate NUMERIC DEFAULT 0,
  average_time_seconds INTEGER DEFAULT 0,
  share_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. FIELDS TABLE
CREATE TABLE IF NOT EXISTS public.fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  placeholder TEXT,
  required BOOLEAN DEFAULT false,
  "order" INTEGER NOT NULL,
  page INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  correct_answer TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  logic_rules JSONB DEFAULT '[]'::jsonb,
  validation_pattern TEXT,
  accepted_file_types TEXT,
  max_file_size_mb INTEGER DEFAULT 5,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  is_duplicate BOOLEAN DEFAULT false,
  is_spam BOOLEAN DEFAULT false,
  score INTEGER,
  total_possible_points INTEGER,
  passed BOOLEAN,
  tags TEXT[] DEFAULT '{}',
  answers JSONB DEFAULT '{}'::jsonb,
  team_notes JSONB DEFAULT '[]'::jsonb,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  sentiment_score NUMERIC,
  device_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES public.responses(id) ON DELETE CASCADE NOT NULL,
  recipient_name TEXT NOT NULL,
  certificate_title TEXT NOT NULL,
  pdf_url TEXT,
  score_percentage INTEGER,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. FORM VERSIONS TABLE
CREATE TABLE IF NOT EXISTS public.form_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  fields JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  change_description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  is_quiz BOOLEAN DEFAULT false,
  icon TEXT DEFAULT '📋',
  fields JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. EXPORTS TABLE
CREATE TABLE IF NOT EXISTS public.exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  form_title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('csv', 'excel', 'pdf')),
  file_url TEXT,
  requested_by UUID REFERENCES auth.users(id),
  record_count INTEGER DEFAULT 0,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  branding JSONB DEFAULT '{}'::jsonb,
  notifications JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_forms_owner ON public.forms(owner_id);
CREATE INDEX IF NOT EXISTS idx_fields_form ON public.fields(form_id);
CREATE INDEX IF NOT EXISTS idx_responses_form ON public.responses(form_id);
CREATE INDEX IF NOT EXISTS idx_responses_form_submitted ON public.responses(form_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_form ON public.analytics_events(form_id);
CREATE INDEX IF NOT EXISTS idx_certificates_response ON public.certificates(response_id);
CREATE INDEX IF NOT EXISTS idx_form_versions_form ON public.form_versions(form_id);
CREATE INDEX IF NOT EXISTS idx_exports_form ON public.exports(form_id);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);

-- One row per user for user_settings (required for safe upserts from the app)
DELETE FROM public.user_settings a
USING public.user_settings b
WHERE a.user_id = b.user_id
  AND (a.updated_at < b.updated_at OR (a.updated_at = b.updated_at AND a.id < b.id));

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_settings_user ON public.user_settings(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles view self" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update self" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insert self" ON public.profiles;
CREATE POLICY "Profiles view self" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles update self" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles insert self" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- FORMS POLICIES (drop-then-create for idempotency)
DROP POLICY IF EXISTS "Forms owner access" ON public.forms;
DROP POLICY IF EXISTS "Forms public select" ON public.forms;
DROP POLICY IF EXISTS "Forms owner insert" ON public.forms;
DROP POLICY IF EXISTS "Forms owner update" ON public.forms;
DROP POLICY IF EXISTS "Forms owner delete" ON public.forms;
DROP POLICY IF EXISTS "Forms owner select" ON public.forms;
CREATE POLICY "Forms owner select" ON public.forms FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Forms owner insert" ON public.forms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Forms owner update" ON public.forms FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Forms owner delete" ON public.forms FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Forms public select" ON public.forms FOR SELECT USING (status = 'published');

-- FIELDS POLICIES
DROP POLICY IF EXISTS "Fields public select" ON public.fields;
DROP POLICY IF EXISTS "Fields owner access" ON public.fields;
DROP POLICY IF EXISTS "Fields owner insert" ON public.fields;
DROP POLICY IF EXISTS "Fields owner update" ON public.fields;
DROP POLICY IF EXISTS "Fields owner delete" ON public.fields;
DROP POLICY IF EXISTS "Fields owner select" ON public.fields;
CREATE POLICY "Fields public select" ON public.fields FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = fields.form_id AND forms.status = 'published')
);
CREATE POLICY "Fields owner select" ON public.fields FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = fields.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Fields owner insert" ON public.fields FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = fields.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Fields owner update" ON public.fields FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = fields.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Fields owner delete" ON public.fields FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = fields.form_id AND forms.owner_id = auth.uid())
);

-- RESPONSES POLICIES
DROP POLICY IF EXISTS "Responses public insert" ON public.responses;
DROP POLICY IF EXISTS "Responses owner select" ON public.responses;
DROP POLICY IF EXISTS "Responses owner update" ON public.responses;
DROP POLICY IF EXISTS "Responses owner delete" ON public.responses;
CREATE POLICY "Responses public insert" ON public.responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Responses owner select" ON public.responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = responses.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Responses owner update" ON public.responses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = responses.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Responses owner delete" ON public.responses FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = responses.form_id AND forms.owner_id = auth.uid())
);

-- ANALYTICS POLICIES
DROP POLICY IF EXISTS "Analytics owner access" ON public.analytics_events;
DROP POLICY IF EXISTS "Analytics owner select" ON public.analytics_events;
DROP POLICY IF EXISTS "Analytics owner insert" ON public.analytics_events;
DROP POLICY IF EXISTS "Analytics public insert" ON public.analytics_events;
CREATE POLICY "Analytics owner select" ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = analytics_events.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Analytics owner insert" ON public.analytics_events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = analytics_events.form_id AND forms.owner_id = auth.uid())
);
-- Anonymous respondents may record funnel events (form_view / form_submit) on published forms
CREATE POLICY "Analytics public insert" ON public.analytics_events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = analytics_events.form_id AND forms.status = 'published')
);

-- CERTIFICATES POLICIES
DROP POLICY IF EXISTS "Certificates public select" ON public.certificates;
DROP POLICY IF EXISTS "Certificates owner insert" ON public.certificates;
DROP POLICY IF EXISTS "Certificates owner select" ON public.certificates;
CREATE POLICY "Certificates public select" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Certificates owner select" ON public.certificates FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.responses WHERE responses.id = certificates.response_id
          AND EXISTS (SELECT 1 FROM public.forms WHERE forms.id = responses.form_id AND forms.owner_id = auth.uid()))
);
CREATE POLICY "Certificates owner insert" ON public.certificates FOR INSERT WITH CHECK (true);

-- FORM VERSIONS POLICIES
DROP POLICY IF EXISTS "Form versions owner access" ON public.form_versions;
DROP POLICY IF EXISTS "Form versions owner select" ON public.form_versions;
DROP POLICY IF EXISTS "Form versions owner insert" ON public.form_versions;
CREATE POLICY "Form versions owner select" ON public.form_versions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = form_versions.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Form versions owner insert" ON public.form_versions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = form_versions.form_id AND forms.owner_id = auth.uid())
);

-- TEMPLATES POLICIES
DROP POLICY IF EXISTS "Templates public select" ON public.templates;
DROP POLICY IF EXISTS "Templates owner access" ON public.templates;
DROP POLICY IF EXISTS "Templates owner insert" ON public.templates;
DROP POLICY IF EXISTS "Templates owner select" ON public.templates;
CREATE POLICY "Templates public select" ON public.templates FOR SELECT USING (is_public = true);
CREATE POLICY "Templates owner select" ON public.templates FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Templates owner insert" ON public.templates FOR INSERT WITH CHECK (true);

-- EXPORTS POLICIES
DROP POLICY IF EXISTS "Exports owner access" ON public.exports;
DROP POLICY IF EXISTS "Exports owner select" ON public.exports;
DROP POLICY IF EXISTS "Exports owner insert" ON public.exports;
CREATE POLICY "Exports owner select" ON public.exports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = exports.form_id AND forms.owner_id = auth.uid())
);
CREATE POLICY "Exports owner insert" ON public.exports FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.forms WHERE forms.id = exports.form_id AND forms.owner_id = auth.uid())
);

-- USER SETTINGS POLICIES
DROP POLICY IF EXISTS "User settings access" ON public.user_settings;
DROP POLICY IF EXISTS "User settings select" ON public.user_settings;
DROP POLICY IF EXISTS "User settings insert" ON public.user_settings;
DROP POLICY IF EXISTS "User settings update" ON public.user_settings;
CREATE POLICY "User settings select" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User settings insert" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User settings update" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AUTO-CREATE PROFILE + SETTINGS TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, team_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'Owner',
    'My Collectly Team'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_settings (user_id, settings, branding, notifications)
  VALUES (NEW.id, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- AUTO-INCREMENT FORM RESPONSE COUNT ON EVERY SUBMITTED RESPONSE
-- (works for anonymous public submissions, race-free, replaces the old client-side read-modify-write)
CREATE OR REPLACE FUNCTION public.handle_response_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forms
  SET response_count = COALESCE(response_count, 0) + 1
  WHERE id = NEW.form_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_response_created ON public.responses;
CREATE TRIGGER on_response_created
  AFTER INSERT ON public.responses
  FOR EACH ROW EXECUTE FUNCTION public.handle_response_insert();

-- ONE-TIME / MAINTENANCE: re-sync denormalized response counts with actual rows
UPDATE public.forms f
SET response_count = sub.cnt
FROM (
  SELECT form_id, COUNT(*)::int AS cnt
  FROM public.responses
  GROUP BY form_id
) sub
WHERE sub.form_id = f.id
  AND COALESCE(f.response_count, 0) <> sub.cnt;

-- DUPLICATE-SUBMISSION CHECK (used by the public form page; does not expose response rows)
CREATE OR REPLACE FUNCTION public.has_prior_response(p_form_id UUID, p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.responses r
    WHERE r.form_id = p_form_id
      AND p_email <> ''
      AND position(lower(p_email) IN lower(COALESCE(r.answers::text, ''))) > 0
  );
$$;

REVOKE ALL ON FUNCTION public.has_prior_response(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_prior_response(UUID, TEXT) TO anon, authenticated;

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('collectly-storage', 'collectly-storage', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Storage public read" ON storage.objects;
DROP POLICY IF EXISTS "Storage authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "Storage authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Storage authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Storage public insert form attachments" ON storage.objects;
CREATE POLICY "Storage public read" ON storage.objects FOR SELECT USING (bucket_id IN ('collectly-storage', 'certificates', 'exports', 'uploads'));
CREATE POLICY "Storage authenticated insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('collectly-storage', 'certificates', 'exports', 'uploads') AND auth.role() = 'authenticated');
CREATE POLICY "Storage authenticated update" ON storage.objects FOR UPDATE USING (bucket_id IN ('collectly-storage', 'certificates', 'exports', 'uploads') AND auth.role() = 'authenticated');
CREATE POLICY "Storage authenticated delete" ON storage.objects FOR DELETE USING (bucket_id IN ('collectly-storage', 'certificates', 'exports', 'uploads') AND auth.role() = 'authenticated');
-- Anonymous respondents can upload file answers (uploads/responses/<formId>/...)
CREATE POLICY "Storage public insert form attachments" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'uploads' AND (storage.foldername(name))[1] = 'responses'
);
