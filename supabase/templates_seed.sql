-- ==========================================
-- COLLECTLY V2 - TEMPLATE SEED (147 templates)
-- Generated from src/services/templateService.ts
-- Each template is its own idempotent INSERT statement.
-- Re-runnable: rows whose title+category already exist are skipped.
-- Run AFTER supabase/schema.sql
-- ==========================================

-- CATEGORY COUNTS
--   Feedback: 21
--   Quiz: 21
--   Survey: 21
--   Registration: 21
--   Lead Generation: 21
--   Application: 21
--   General: 21

-- 001 | Feedback | tpl-fb-1 | 6 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Customer Satisfaction Survey',
       'Measure satisfaction for customer satisfaction with NPS, ratings and smart follow-ups.',
       'Feedback',
       false,
       '😊',
       '[{"id":"tpl-fb-1-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-1-f2","type":"email","label":"Email Address","placeholder":"you@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-fb-1-f3","type":"nps","label":"How likely are you to recommend our customer satisfaction?","description":"0 = Not at all, 10 = Extremely likely","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-fb-1-r1","sourceFieldId":"tpl-fb-1-f3","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-fb-1-f5"}]},{"id":"tpl-fb-1-f4","type":"rating","label":"Overall satisfaction","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-fb-1-r2","sourceFieldId":"tpl-fb-1-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-1-f5"}],"max":5},{"id":"tpl-fb-1-f5","type":"textarea","label":"What can we improve?","placeholder":"Be specific — we read everything...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-1-f6","type":"checkbox","label":"May we contact you about your feedback?","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-1-f6-opt1","label":"Yes, by email","value":"yes-by-email","isCorrect":false},{"id":"tpl-fb-1-f6-opt2","label":"Yes, by phone","value":"yes-by-phone","isCorrect":false},{"id":"tpl-fb-1-f6-opt3","label":"No thanks","value":"no-thanks","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Customer Satisfaction Survey' AND t.category = 'Feedback'
);

-- 002 | Feedback | tpl-fb-2 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'NPS Loyalty Review Form',
       'Star ratings, aspect scores and photo-friendly review flow for nps loyalty.',
       'Feedback',
       false,
       '⭐',
       '[{"id":"tpl-fb-2-f1","type":"text","label":"Name","placeholder":"Your name","required":false,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-2-f2","type":"rating","label":"Quality","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-2-r1","sourceFieldId":"tpl-fb-2-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-2-f6"}],"max":5},{"id":"tpl-fb-2-f3","type":"rating","label":"Value for money","required":true,"order":3,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-2-f4","type":"rating","label":"Support experience","required":true,"order":4,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-2-f5","type":"select","label":"How often do you use it?","required":true,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-2-f5-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-fb-2-f5-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-fb-2-f5-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-fb-2-f5-opt4","label":"First time","value":"first-time","isCorrect":false}]},{"id":"tpl-fb-2-f6","type":"textarea","label":"Tell us more","placeholder":"What stood out?","required":false,"order":6,"page":1,"logicRules":[]},{"id":"tpl-fb-2-f7","type":"file","label":"Attach a screenshot (optional)","required":false,"order":7,"page":1,"logicRules":[],"acceptedFileTypes":".png,.jpg,.pdf","maxFileSizeMb":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'NPS Loyalty Review Form' AND t.category = 'Feedback'
);

-- 003 | Feedback | tpl-fb-3 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Product Feedback Support Check',
       'Support reason routing with priority follow-up for product feedback.',
       'Feedback',
       false,
       '💬',
       '[{"id":"tpl-fb-3-f1","type":"email","label":"Email","placeholder":"you@example.com","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-3-f2","type":"select","label":"Topic","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-3-r1","sourceFieldId":"tpl-fb-3-f2","operator":"equals","targetValue":"billing","action":"show","targetFieldId":"tpl-fb-3-f3"}],"options":[{"id":"tpl-fb-3-f2-opt1","label":"Billing","value":"billing","isCorrect":false},{"id":"tpl-fb-3-f2-opt2","label":"Technical issue","value":"technical-issue","isCorrect":false},{"id":"tpl-fb-3-f2-opt3","label":"Account access","value":"account-access","isCorrect":false},{"id":"tpl-fb-3-f2-opt4","label":"Something else","value":"something-else","isCorrect":false}]},{"id":"tpl-fb-3-f3","type":"text","label":"Account ID (billing only)","placeholder":"e.g. ACC-1234","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-fb-3-f4","type":"scale","label":"Urgency (1-10)","required":true,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-fb-3-f5","type":"textarea","label":"Describe the issue","placeholder":"What happened?","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-3-f6","type":"terms","label":"I agree to be contacted about this ticket","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Product Feedback Support Check' AND t.category = 'Feedback'
);

-- 004 | Feedback | tpl-fb-4 | 6 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Support Quality Survey',
       'Measure satisfaction for support quality with NPS, ratings and smart follow-ups.',
       'Feedback',
       false,
       '😊',
       '[{"id":"tpl-fb-4-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-4-f2","type":"email","label":"Email Address","placeholder":"you@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-fb-4-f3","type":"nps","label":"How likely are you to recommend our support quality?","description":"0 = Not at all, 10 = Extremely likely","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-fb-4-r1","sourceFieldId":"tpl-fb-4-f3","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-fb-4-f5"}]},{"id":"tpl-fb-4-f4","type":"rating","label":"Overall satisfaction","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-fb-4-r2","sourceFieldId":"tpl-fb-4-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-4-f5"}],"max":5},{"id":"tpl-fb-4-f5","type":"textarea","label":"What can we improve?","placeholder":"Be specific — we read everything...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-4-f6","type":"checkbox","label":"May we contact you about your feedback?","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-4-f6-opt1","label":"Yes, by email","value":"yes-by-email","isCorrect":false},{"id":"tpl-fb-4-f6-opt2","label":"Yes, by phone","value":"yes-by-phone","isCorrect":false},{"id":"tpl-fb-4-f6-opt3","label":"No thanks","value":"no-thanks","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Support Quality Survey' AND t.category = 'Feedback'
);

-- 005 | Feedback | tpl-fb-5 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Restaurant Dining Review Form',
       'Star ratings, aspect scores and photo-friendly review flow for restaurant dining.',
       'Feedback',
       false,
       '⭐',
       '[{"id":"tpl-fb-5-f1","type":"text","label":"Name","placeholder":"Your name","required":false,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-5-f2","type":"rating","label":"Quality","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-5-r1","sourceFieldId":"tpl-fb-5-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-5-f6"}],"max":5},{"id":"tpl-fb-5-f3","type":"rating","label":"Value for money","required":true,"order":3,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-5-f4","type":"rating","label":"Support experience","required":true,"order":4,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-5-f5","type":"select","label":"How often do you use it?","required":true,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-5-f5-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-fb-5-f5-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-fb-5-f5-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-fb-5-f5-opt4","label":"First time","value":"first-time","isCorrect":false}]},{"id":"tpl-fb-5-f6","type":"textarea","label":"Tell us more","placeholder":"What stood out?","required":false,"order":6,"page":1,"logicRules":[]},{"id":"tpl-fb-5-f7","type":"file","label":"Attach a screenshot (optional)","required":false,"order":7,"page":1,"logicRules":[],"acceptedFileTypes":".png,.jpg,.pdf","maxFileSizeMb":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Restaurant Dining Review Form' AND t.category = 'Feedback'
);

-- 006 | Feedback | tpl-fb-6 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Hotel Stay Support Check',
       'Support reason routing with priority follow-up for hotel stay.',
       'Feedback',
       false,
       '💬',
       '[{"id":"tpl-fb-6-f1","type":"email","label":"Email","placeholder":"you@example.com","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-6-f2","type":"select","label":"Topic","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-6-r1","sourceFieldId":"tpl-fb-6-f2","operator":"equals","targetValue":"billing","action":"show","targetFieldId":"tpl-fb-6-f3"}],"options":[{"id":"tpl-fb-6-f2-opt1","label":"Billing","value":"billing","isCorrect":false},{"id":"tpl-fb-6-f2-opt2","label":"Technical issue","value":"technical-issue","isCorrect":false},{"id":"tpl-fb-6-f2-opt3","label":"Account access","value":"account-access","isCorrect":false},{"id":"tpl-fb-6-f2-opt4","label":"Something else","value":"something-else","isCorrect":false}]},{"id":"tpl-fb-6-f3","type":"text","label":"Account ID (billing only)","placeholder":"e.g. ACC-1234","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-fb-6-f4","type":"scale","label":"Urgency (1-10)","required":true,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-fb-6-f5","type":"textarea","label":"Describe the issue","placeholder":"What happened?","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-6-f6","type":"terms","label":"I agree to be contacted about this ticket","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Hotel Stay Support Check' AND t.category = 'Feedback'
);

-- 007 | Feedback | tpl-fb-7 | 6 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'E-commerce Order Survey',
       'Measure satisfaction for e-commerce order with NPS, ratings and smart follow-ups.',
       'Feedback',
       false,
       '😊',
       '[{"id":"tpl-fb-7-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-7-f2","type":"email","label":"Email Address","placeholder":"you@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-fb-7-f3","type":"nps","label":"How likely are you to recommend our e-commerce order?","description":"0 = Not at all, 10 = Extremely likely","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-fb-7-r1","sourceFieldId":"tpl-fb-7-f3","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-fb-7-f5"}]},{"id":"tpl-fb-7-f4","type":"rating","label":"Overall satisfaction","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-fb-7-r2","sourceFieldId":"tpl-fb-7-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-7-f5"}],"max":5},{"id":"tpl-fb-7-f5","type":"textarea","label":"What can we improve?","placeholder":"Be specific — we read everything...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-7-f6","type":"checkbox","label":"May we contact you about your feedback?","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-7-f6-opt1","label":"Yes, by email","value":"yes-by-email","isCorrect":false},{"id":"tpl-fb-7-f6-opt2","label":"Yes, by phone","value":"yes-by-phone","isCorrect":false},{"id":"tpl-fb-7-f6-opt3","label":"No thanks","value":"no-thanks","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'E-commerce Order Survey' AND t.category = 'Feedback'
);

-- 008 | Feedback | tpl-fb-8 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Mobile App Review Form',
       'Star ratings, aspect scores and photo-friendly review flow for mobile app.',
       'Feedback',
       false,
       '⭐',
       '[{"id":"tpl-fb-8-f1","type":"text","label":"Name","placeholder":"Your name","required":false,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-8-f2","type":"rating","label":"Quality","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-8-r1","sourceFieldId":"tpl-fb-8-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-8-f6"}],"max":5},{"id":"tpl-fb-8-f3","type":"rating","label":"Value for money","required":true,"order":3,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-8-f4","type":"rating","label":"Support experience","required":true,"order":4,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-8-f5","type":"select","label":"How often do you use it?","required":true,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-8-f5-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-fb-8-f5-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-fb-8-f5-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-fb-8-f5-opt4","label":"First time","value":"first-time","isCorrect":false}]},{"id":"tpl-fb-8-f6","type":"textarea","label":"Tell us more","placeholder":"What stood out?","required":false,"order":6,"page":1,"logicRules":[]},{"id":"tpl-fb-8-f7","type":"file","label":"Attach a screenshot (optional)","required":false,"order":7,"page":1,"logicRules":[],"acceptedFileTypes":".png,.jpg,.pdf","maxFileSizeMb":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Mobile App Review Form' AND t.category = 'Feedback'
);

-- 009 | Feedback | tpl-fb-9 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Online Course Support Check',
       'Support reason routing with priority follow-up for online course.',
       'Feedback',
       false,
       '💬',
       '[{"id":"tpl-fb-9-f1","type":"email","label":"Email","placeholder":"you@example.com","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-9-f2","type":"select","label":"Topic","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-9-r1","sourceFieldId":"tpl-fb-9-f2","operator":"equals","targetValue":"billing","action":"show","targetFieldId":"tpl-fb-9-f3"}],"options":[{"id":"tpl-fb-9-f2-opt1","label":"Billing","value":"billing","isCorrect":false},{"id":"tpl-fb-9-f2-opt2","label":"Technical issue","value":"technical-issue","isCorrect":false},{"id":"tpl-fb-9-f2-opt3","label":"Account access","value":"account-access","isCorrect":false},{"id":"tpl-fb-9-f2-opt4","label":"Something else","value":"something-else","isCorrect":false}]},{"id":"tpl-fb-9-f3","type":"text","label":"Account ID (billing only)","placeholder":"e.g. ACC-1234","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-fb-9-f4","type":"scale","label":"Urgency (1-10)","required":true,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-fb-9-f5","type":"textarea","label":"Describe the issue","placeholder":"What happened?","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-9-f6","type":"terms","label":"I agree to be contacted about this ticket","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Online Course Support Check' AND t.category = 'Feedback'
);

-- 010 | Feedback | tpl-fb-10 | 6 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Event Experience Survey',
       'Measure satisfaction for event experience with NPS, ratings and smart follow-ups.',
       'Feedback',
       false,
       '😊',
       '[{"id":"tpl-fb-10-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-10-f2","type":"email","label":"Email Address","placeholder":"you@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-fb-10-f3","type":"nps","label":"How likely are you to recommend our event experience?","description":"0 = Not at all, 10 = Extremely likely","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-fb-10-r1","sourceFieldId":"tpl-fb-10-f3","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-fb-10-f5"}]},{"id":"tpl-fb-10-f4","type":"rating","label":"Overall satisfaction","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-fb-10-r2","sourceFieldId":"tpl-fb-10-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-10-f5"}],"max":5},{"id":"tpl-fb-10-f5","type":"textarea","label":"What can we improve?","placeholder":"Be specific — we read everything...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-10-f6","type":"checkbox","label":"May we contact you about your feedback?","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-10-f6-opt1","label":"Yes, by email","value":"yes-by-email","isCorrect":false},{"id":"tpl-fb-10-f6-opt2","label":"Yes, by phone","value":"yes-by-phone","isCorrect":false},{"id":"tpl-fb-10-f6-opt3","label":"No thanks","value":"no-thanks","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Event Experience Survey' AND t.category = 'Feedback'
);

-- 011 | Feedback | tpl-fb-11 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'SaaS Onboarding Review Form',
       'Star ratings, aspect scores and photo-friendly review flow for saas onboarding.',
       'Feedback',
       false,
       '⭐',
       '[{"id":"tpl-fb-11-f1","type":"text","label":"Name","placeholder":"Your name","required":false,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-11-f2","type":"rating","label":"Quality","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-11-r1","sourceFieldId":"tpl-fb-11-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-11-f6"}],"max":5},{"id":"tpl-fb-11-f3","type":"rating","label":"Value for money","required":true,"order":3,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-11-f4","type":"rating","label":"Support experience","required":true,"order":4,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-11-f5","type":"select","label":"How often do you use it?","required":true,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-11-f5-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-fb-11-f5-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-fb-11-f5-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-fb-11-f5-opt4","label":"First time","value":"first-time","isCorrect":false}]},{"id":"tpl-fb-11-f6","type":"textarea","label":"Tell us more","placeholder":"What stood out?","required":false,"order":6,"page":1,"logicRules":[]},{"id":"tpl-fb-11-f7","type":"file","label":"Attach a screenshot (optional)","required":false,"order":7,"page":1,"logicRules":[],"acceptedFileTypes":".png,.jpg,.pdf","maxFileSizeMb":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'SaaS Onboarding Review Form' AND t.category = 'Feedback'
);

-- 012 | Feedback | tpl-fb-12 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Delivery Service Support Check',
       'Support reason routing with priority follow-up for delivery service.',
       'Feedback',
       false,
       '💬',
       '[{"id":"tpl-fb-12-f1","type":"email","label":"Email","placeholder":"you@example.com","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-12-f2","type":"select","label":"Topic","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-12-r1","sourceFieldId":"tpl-fb-12-f2","operator":"equals","targetValue":"billing","action":"show","targetFieldId":"tpl-fb-12-f3"}],"options":[{"id":"tpl-fb-12-f2-opt1","label":"Billing","value":"billing","isCorrect":false},{"id":"tpl-fb-12-f2-opt2","label":"Technical issue","value":"technical-issue","isCorrect":false},{"id":"tpl-fb-12-f2-opt3","label":"Account access","value":"account-access","isCorrect":false},{"id":"tpl-fb-12-f2-opt4","label":"Something else","value":"something-else","isCorrect":false}]},{"id":"tpl-fb-12-f3","type":"text","label":"Account ID (billing only)","placeholder":"e.g. ACC-1234","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-fb-12-f4","type":"scale","label":"Urgency (1-10)","required":true,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-fb-12-f5","type":"textarea","label":"Describe the issue","placeholder":"What happened?","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-12-f6","type":"terms","label":"I agree to be contacted about this ticket","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Delivery Service Support Check' AND t.category = 'Feedback'
);

-- 013 | Feedback | tpl-fb-13 | 6 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Banking Service Survey',
       'Measure satisfaction for banking service with NPS, ratings and smart follow-ups.',
       'Feedback',
       false,
       '😊',
       '[{"id":"tpl-fb-13-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-13-f2","type":"email","label":"Email Address","placeholder":"you@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-fb-13-f3","type":"nps","label":"How likely are you to recommend our banking service?","description":"0 = Not at all, 10 = Extremely likely","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-fb-13-r1","sourceFieldId":"tpl-fb-13-f3","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-fb-13-f5"}]},{"id":"tpl-fb-13-f4","type":"rating","label":"Overall satisfaction","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-fb-13-r2","sourceFieldId":"tpl-fb-13-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-13-f5"}],"max":5},{"id":"tpl-fb-13-f5","type":"textarea","label":"What can we improve?","placeholder":"Be specific — we read everything...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-13-f6","type":"checkbox","label":"May we contact you about your feedback?","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-13-f6-opt1","label":"Yes, by email","value":"yes-by-email","isCorrect":false},{"id":"tpl-fb-13-f6-opt2","label":"Yes, by phone","value":"yes-by-phone","isCorrect":false},{"id":"tpl-fb-13-f6-opt3","label":"No thanks","value":"no-thanks","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Banking Service Survey' AND t.category = 'Feedback'
);

-- 014 | Feedback | tpl-fb-14 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Healthcare Visit Review Form',
       'Star ratings, aspect scores and photo-friendly review flow for healthcare visit.',
       'Feedback',
       false,
       '⭐',
       '[{"id":"tpl-fb-14-f1","type":"text","label":"Name","placeholder":"Your name","required":false,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-14-f2","type":"rating","label":"Quality","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-14-r1","sourceFieldId":"tpl-fb-14-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-14-f6"}],"max":5},{"id":"tpl-fb-14-f3","type":"rating","label":"Value for money","required":true,"order":3,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-14-f4","type":"rating","label":"Support experience","required":true,"order":4,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-14-f5","type":"select","label":"How often do you use it?","required":true,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-14-f5-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-fb-14-f5-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-fb-14-f5-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-fb-14-f5-opt4","label":"First time","value":"first-time","isCorrect":false}]},{"id":"tpl-fb-14-f6","type":"textarea","label":"Tell us more","placeholder":"What stood out?","required":false,"order":6,"page":1,"logicRules":[]},{"id":"tpl-fb-14-f7","type":"file","label":"Attach a screenshot (optional)","required":false,"order":7,"page":1,"logicRules":[],"acceptedFileTypes":".png,.jpg,.pdf","maxFileSizeMb":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Healthcare Visit Review Form' AND t.category = 'Feedback'
);

-- 015 | Feedback | tpl-fb-15 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Gym Membership Support Check',
       'Support reason routing with priority follow-up for gym membership.',
       'Feedback',
       false,
       '💬',
       '[{"id":"tpl-fb-15-f1","type":"email","label":"Email","placeholder":"you@example.com","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-15-f2","type":"select","label":"Topic","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-15-r1","sourceFieldId":"tpl-fb-15-f2","operator":"equals","targetValue":"billing","action":"show","targetFieldId":"tpl-fb-15-f3"}],"options":[{"id":"tpl-fb-15-f2-opt1","label":"Billing","value":"billing","isCorrect":false},{"id":"tpl-fb-15-f2-opt2","label":"Technical issue","value":"technical-issue","isCorrect":false},{"id":"tpl-fb-15-f2-opt3","label":"Account access","value":"account-access","isCorrect":false},{"id":"tpl-fb-15-f2-opt4","label":"Something else","value":"something-else","isCorrect":false}]},{"id":"tpl-fb-15-f3","type":"text","label":"Account ID (billing only)","placeholder":"e.g. ACC-1234","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-fb-15-f4","type":"scale","label":"Urgency (1-10)","required":true,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-fb-15-f5","type":"textarea","label":"Describe the issue","placeholder":"What happened?","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-15-f6","type":"terms","label":"I agree to be contacted about this ticket","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Gym Membership Support Check' AND t.category = 'Feedback'
);

-- 016 | Feedback | tpl-fb-16 | 6 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Airline Travel Survey',
       'Measure satisfaction for airline travel with NPS, ratings and smart follow-ups.',
       'Feedback',
       false,
       '😊',
       '[{"id":"tpl-fb-16-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-16-f2","type":"email","label":"Email Address","placeholder":"you@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-fb-16-f3","type":"nps","label":"How likely are you to recommend our airline travel?","description":"0 = Not at all, 10 = Extremely likely","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-fb-16-r1","sourceFieldId":"tpl-fb-16-f3","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-fb-16-f5"}]},{"id":"tpl-fb-16-f4","type":"rating","label":"Overall satisfaction","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-fb-16-r2","sourceFieldId":"tpl-fb-16-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-16-f5"}],"max":5},{"id":"tpl-fb-16-f5","type":"textarea","label":"What can we improve?","placeholder":"Be specific — we read everything...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-16-f6","type":"checkbox","label":"May we contact you about your feedback?","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-16-f6-opt1","label":"Yes, by email","value":"yes-by-email","isCorrect":false},{"id":"tpl-fb-16-f6-opt2","label":"Yes, by phone","value":"yes-by-phone","isCorrect":false},{"id":"tpl-fb-16-f6-opt3","label":"No thanks","value":"no-thanks","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Airline Travel Survey' AND t.category = 'Feedback'
);

-- 017 | Feedback | tpl-fb-17 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Bug Report Review Form',
       'Star ratings, aspect scores and photo-friendly review flow for bug report.',
       'Feedback',
       false,
       '⭐',
       '[{"id":"tpl-fb-17-f1","type":"text","label":"Name","placeholder":"Your name","required":false,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-17-f2","type":"rating","label":"Quality","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-17-r1","sourceFieldId":"tpl-fb-17-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-17-f6"}],"max":5},{"id":"tpl-fb-17-f3","type":"rating","label":"Value for money","required":true,"order":3,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-17-f4","type":"rating","label":"Support experience","required":true,"order":4,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-17-f5","type":"select","label":"How often do you use it?","required":true,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-17-f5-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-fb-17-f5-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-fb-17-f5-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-fb-17-f5-opt4","label":"First time","value":"first-time","isCorrect":false}]},{"id":"tpl-fb-17-f6","type":"textarea","label":"Tell us more","placeholder":"What stood out?","required":false,"order":6,"page":1,"logicRules":[]},{"id":"tpl-fb-17-f7","type":"file","label":"Attach a screenshot (optional)","required":false,"order":7,"page":1,"logicRules":[],"acceptedFileTypes":".png,.jpg,.pdf","maxFileSizeMb":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Bug Report Review Form' AND t.category = 'Feedback'
);

-- 018 | Feedback | tpl-fb-18 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Feature Request Support Check',
       'Support reason routing with priority follow-up for feature request.',
       'Feedback',
       false,
       '💬',
       '[{"id":"tpl-fb-18-f1","type":"email","label":"Email","placeholder":"you@example.com","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-18-f2","type":"select","label":"Topic","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-18-r1","sourceFieldId":"tpl-fb-18-f2","operator":"equals","targetValue":"billing","action":"show","targetFieldId":"tpl-fb-18-f3"}],"options":[{"id":"tpl-fb-18-f2-opt1","label":"Billing","value":"billing","isCorrect":false},{"id":"tpl-fb-18-f2-opt2","label":"Technical issue","value":"technical-issue","isCorrect":false},{"id":"tpl-fb-18-f2-opt3","label":"Account access","value":"account-access","isCorrect":false},{"id":"tpl-fb-18-f2-opt4","label":"Something else","value":"something-else","isCorrect":false}]},{"id":"tpl-fb-18-f3","type":"text","label":"Account ID (billing only)","placeholder":"e.g. ACC-1234","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-fb-18-f4","type":"scale","label":"Urgency (1-10)","required":true,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-fb-18-f5","type":"textarea","label":"Describe the issue","placeholder":"What happened?","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-18-f6","type":"terms","label":"I agree to be contacted about this ticket","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Feature Request Support Check' AND t.category = 'Feedback'
);

-- 019 | Feedback | tpl-fb-19 | 6 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Webinar Feedback Survey',
       'Measure satisfaction for webinar feedback with NPS, ratings and smart follow-ups.',
       'Feedback',
       false,
       '😊',
       '[{"id":"tpl-fb-19-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-19-f2","type":"email","label":"Email Address","placeholder":"you@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-fb-19-f3","type":"nps","label":"How likely are you to recommend our webinar feedback?","description":"0 = Not at all, 10 = Extremely likely","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-fb-19-r1","sourceFieldId":"tpl-fb-19-f3","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-fb-19-f5"}]},{"id":"tpl-fb-19-f4","type":"rating","label":"Overall satisfaction","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-fb-19-r2","sourceFieldId":"tpl-fb-19-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-19-f5"}],"max":5},{"id":"tpl-fb-19-f5","type":"textarea","label":"What can we improve?","placeholder":"Be specific — we read everything...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-19-f6","type":"checkbox","label":"May we contact you about your feedback?","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-19-f6-opt1","label":"Yes, by email","value":"yes-by-email","isCorrect":false},{"id":"tpl-fb-19-f6-opt2","label":"Yes, by phone","value":"yes-by-phone","isCorrect":false},{"id":"tpl-fb-19-f6-opt3","label":"No thanks","value":"no-thanks","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Webinar Feedback Survey' AND t.category = 'Feedback'
);

-- 020 | Feedback | tpl-fb-20 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Subscription Cancellation Review Form',
       'Star ratings, aspect scores and photo-friendly review flow for subscription cancellation.',
       'Feedback',
       false,
       '⭐',
       '[{"id":"tpl-fb-20-f1","type":"text","label":"Name","placeholder":"Your name","required":false,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-20-f2","type":"rating","label":"Quality","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-20-r1","sourceFieldId":"tpl-fb-20-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-fb-20-f6"}],"max":5},{"id":"tpl-fb-20-f3","type":"rating","label":"Value for money","required":true,"order":3,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-20-f4","type":"rating","label":"Support experience","required":true,"order":4,"page":1,"logicRules":[],"max":5},{"id":"tpl-fb-20-f5","type":"select","label":"How often do you use it?","required":true,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-fb-20-f5-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-fb-20-f5-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-fb-20-f5-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-fb-20-f5-opt4","label":"First time","value":"first-time","isCorrect":false}]},{"id":"tpl-fb-20-f6","type":"textarea","label":"Tell us more","placeholder":"What stood out?","required":false,"order":6,"page":1,"logicRules":[]},{"id":"tpl-fb-20-f7","type":"file","label":"Attach a screenshot (optional)","required":false,"order":7,"page":1,"logicRules":[],"acceptedFileTypes":".png,.jpg,.pdf","maxFileSizeMb":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Subscription Cancellation Review Form' AND t.category = 'Feedback'
);

-- 021 | Feedback | tpl-fb-21 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Community Forum Support Check',
       'Support reason routing with priority follow-up for community forum.',
       'Feedback',
       false,
       '💬',
       '[{"id":"tpl-fb-21-f1","type":"email","label":"Email","placeholder":"you@example.com","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-fb-21-f2","type":"select","label":"Topic","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-fb-21-r1","sourceFieldId":"tpl-fb-21-f2","operator":"equals","targetValue":"billing","action":"show","targetFieldId":"tpl-fb-21-f3"}],"options":[{"id":"tpl-fb-21-f2-opt1","label":"Billing","value":"billing","isCorrect":false},{"id":"tpl-fb-21-f2-opt2","label":"Technical issue","value":"technical-issue","isCorrect":false},{"id":"tpl-fb-21-f2-opt3","label":"Account access","value":"account-access","isCorrect":false},{"id":"tpl-fb-21-f2-opt4","label":"Something else","value":"something-else","isCorrect":false}]},{"id":"tpl-fb-21-f3","type":"text","label":"Account ID (billing only)","placeholder":"e.g. ACC-1234","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-fb-21-f4","type":"scale","label":"Urgency (1-10)","required":true,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-fb-21-f5","type":"textarea","label":"Describe the issue","placeholder":"What happened?","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-fb-21-f6","type":"terms","label":"I agree to be contacted about this ticket","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Community Forum Support Check' AND t.category = 'Feedback'
);

-- 022 | Quiz | tpl-qz-1 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'React Fundamentals Quiz',
       'Graded react fundamentals assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-1-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-1-f2","type":"quiz_mcq","label":"Which hook handles side effects in function components?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-1-f2-opt1","label":"useState","value":"usestate","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-1-f2-opt2","label":"useEffect","value":"useeffect","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-1-f2-opt3","label":"useContext","value":"usecontext","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-1-f2-opt4","label":"useRef","value":"useref","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-1-f3","type":"quiz_mcq","label":"Which method updates state in class components?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-1-f3-opt1","label":"this.updateState()","value":"this-updatestate-","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-1-f3-opt2","label":"this.setState()","value":"this-setstate-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-1-f3-opt3","label":"this.modifyState()","value":"this-modifystate-","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-1-f3-opt4","label":"this.changeState()","value":"this-changestate-","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-1-f4","type":"quiz_tf","label":"React Fundamentals rewards consistent practice over cramming.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-1-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-1-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-1-f5","type":"quiz_short","label":"In one line, what is the single most important react fundamentals concept?","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-1-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified React Fundamentals Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'React Fundamentals Quiz' AND t.category = 'Quiz'
);

-- 023 | Quiz | tpl-qz-2 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'TypeScript Basics Quiz',
       'Graded typescript basics assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-2-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-2-f2","type":"quiz_mcq","label":"What does the keyof operator do?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-2-f2-opt1","label":"Returns keys of an object type","value":"returns-keys-of-an-object-type","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-2-f2-opt2","label":"Returns values of an object","value":"returns-values-of-an-object","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-2-f2-opt3","label":"Creates a new key","value":"creates-a-new-key","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-2-f2-opt4","label":"Deletes a key","value":"deletes-a-key","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-2-f3","type":"quiz_mcq","label":"Which utility type makes all properties optional?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-2-f3-opt1","label":"Required<T>","value":"required-t-","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-2-f3-opt2","label":"Partial<T>","value":"partial-t-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-2-f3-opt3","label":"Readonly<T>","value":"readonly-t-","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-2-f3-opt4","label":"Pick<T>","value":"pick-t-","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-2-f4","type":"quiz_tf","label":"TypeScript Basics rewards consistent practice over cramming.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-2-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-2-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-2-f5","type":"quiz_short","label":"In one line, what is the single most important typescript basics concept?","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-2-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified TypeScript Basics Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'TypeScript Basics Quiz' AND t.category = 'Quiz'
);

-- 024 | Quiz | tpl-qz-3 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Python Essentials Quiz',
       'Graded python essentials assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-3-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-3-f2","type":"quiz_mcq","label":"Which keyword defines a function in Python?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-3-f2-opt1","label":"func","value":"func","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-3-f2-opt2","label":"def","value":"def","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-3-f2-opt3","label":"function","value":"function","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-3-f2-opt4","label":"lambda-def","value":"lambda-def","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-3-f3","type":"quiz_mcq","label":"What does len([1,2,3]) return?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-3-f3-opt1","label":"2","value":"2","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-3-f3-opt2","label":"3","value":"3","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-3-f3-opt3","label":"6","value":"6","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-3-f3-opt4","label":"Error","value":"error","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-3-f4","type":"quiz_tf","label":"Python Essentials rewards consistent practice over cramming.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-3-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-3-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-3-f5","type":"quiz_short","label":"In one line, what is the single most important python essentials concept?","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-3-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Python Essentials Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Python Essentials Quiz' AND t.category = 'Quiz'
);

-- 025 | Quiz | tpl-qz-4 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'JavaScript Mastery Quiz',
       'Graded javascript mastery assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-4-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-4-f2","type":"quiz_mcq","label":"Which of these is NOT a primitive type?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-4-f2-opt1","label":"string","value":"string","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-4-f2-opt2","label":"number","value":"number","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-4-f2-opt3","label":"object","value":"object","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-4-f2-opt4","label":"boolean","value":"boolean","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-4-f3","type":"quiz_mcq","label":"What does === compare?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-4-f3-opt1","label":"Value only","value":"value-only","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-4-f3-opt2","label":"Value and type","value":"value-and-type","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-4-f3-opt3","label":"Reference only","value":"reference-only","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-4-f3-opt4","label":"Nothing","value":"nothing","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-4-f4","type":"quiz_tf","label":"JavaScript Mastery rewards consistent practice over cramming.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-4-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-4-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-4-f5","type":"quiz_short","label":"In one line, what is the single most important javascript mastery concept?","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-4-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified JavaScript Mastery Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'JavaScript Mastery Quiz' AND t.category = 'Quiz'
);

-- 026 | Quiz | tpl-qz-5 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'CSS Layouts Quiz',
       'Graded css layouts assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-5-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-5-f2","type":"quiz_mcq","label":"Which property creates a flex container?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-5-f2-opt1","label":"display: grid","value":"display-grid","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-5-f2-opt2","label":"display: flex","value":"display-flex","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-5-f2-opt3","label":"position: flex","value":"position-flex","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-5-f2-opt4","label":"float: flex","value":"float-flex","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-5-f3","type":"quiz_mcq","label":"Which unit is relative to the root font size?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-5-f3-opt1","label":"px","value":"px","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-5-f3-opt2","label":"em","value":"em","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-5-f3-opt3","label":"rem","value":"rem","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-5-f3-opt4","label":"%","value":"-","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-5-f4","type":"quiz_tf","label":"CSS Layouts rewards consistent practice over cramming.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-5-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-5-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-5-f5","type":"quiz_short","label":"In one line, what is the single most important css layouts concept?","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-5-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified CSS Layouts Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'CSS Layouts Quiz' AND t.category = 'Quiz'
);

-- 027 | Quiz | tpl-qz-6 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'HTML Semantics Quiz',
       'Graded html semantics assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-6-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-6-f2","type":"quiz_mcq","label":"Which statement best captures html semantics fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-6-f2-opt1","label":"Core HTML Semantics principle A (correct)","value":"core-html-semantics-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-6-f2-opt2","label":"HTML Semantics misconception B","value":"html-semantics-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-6-f2-opt3","label":"HTML Semantics myth C","value":"html-semantics-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-6-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-6-f3","type":"quiz_mcq","label":"You face a typical html semantics problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-6-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-6-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-6-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-6-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-6-f4","type":"quiz_tf","label":"HTML Semantics mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-6-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-6-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-6-f5","type":"quiz_short","label":"Define one key html semantics term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-6-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified HTML Semantics Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'HTML Semantics Quiz' AND t.category = 'Quiz'
);

-- 028 | Quiz | tpl-qz-7 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'SQL Queries Quiz',
       'Graded sql queries assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-7-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-7-f2","type":"quiz_mcq","label":"Which clause filters grouped rows?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-7-f2-opt1","label":"WHERE","value":"where","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-7-f2-opt2","label":"HAVING","value":"having","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-7-f2-opt3","label":"FILTER","value":"filter","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-7-f2-opt4","label":"GROUP","value":"group","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-7-f3","type":"quiz_mcq","label":"Which JOIN returns all rows from both tables?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-7-f3-opt1","label":"INNER JOIN","value":"inner-join","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-7-f3-opt2","label":"LEFT JOIN","value":"left-join","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-7-f3-opt3","label":"FULL OUTER JOIN","value":"full-outer-join","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-7-f3-opt4","label":"CROSS APPLY","value":"cross-apply","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-7-f4","type":"quiz_tf","label":"SQL Queries rewards consistent practice over cramming.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-7-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-7-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-7-f5","type":"quiz_short","label":"In one line, what is the single most important sql queries concept?","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-7-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified SQL Queries Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'SQL Queries Quiz' AND t.category = 'Quiz'
);

-- 029 | Quiz | tpl-qz-8 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Git Workflow Quiz',
       'Graded git workflow assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-8-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-8-f2","type":"quiz_mcq","label":"Which command stages all changes?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-8-f2-opt1","label":"git commit -a","value":"git-commit-a","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-8-f2-opt2","label":"git add .","value":"git-add-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-8-f2-opt3","label":"git stage --all!","value":"git-stage-all-","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-8-f2-opt4","label":"git push","value":"git-push","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-8-f3","type":"quiz_mcq","label":"What does git pull do?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-8-f3-opt1","label":"Push only","value":"push-only","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-8-f3-opt2","label":"Fetch + merge","value":"fetch-merge","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-8-f3-opt3","label":"Delete branches","value":"delete-branches","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-8-f3-opt4","label":"Stash changes","value":"stash-changes","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-8-f4","type":"quiz_tf","label":"Git Workflow rewards consistent practice over cramming.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-8-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-8-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-8-f5","type":"quiz_short","label":"In one line, what is the single most important git workflow concept?","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-8-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Git Workflow Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Git Workflow Quiz' AND t.category = 'Quiz'
);

-- 030 | Quiz | tpl-qz-9 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Math Challenge Quiz',
       'Graded math challenge assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-9-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-9-f2","type":"quiz_mcq","label":"Which statement best captures math challenge fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-9-f2-opt1","label":"Core Math Challenge principle A (correct)","value":"core-math-challenge-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-9-f2-opt2","label":"Math Challenge misconception B","value":"math-challenge-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-9-f2-opt3","label":"Math Challenge myth C","value":"math-challenge-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-9-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-9-f3","type":"quiz_mcq","label":"You face a typical math challenge problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-9-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-9-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-9-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-9-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-9-f4","type":"quiz_tf","label":"Math Challenge mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-9-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-9-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-9-f5","type":"quiz_short","label":"Define one key math challenge term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-9-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Math Challenge Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Math Challenge Quiz' AND t.category = 'Quiz'
);

-- 031 | Quiz | tpl-qz-10 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Science Explorer Quiz',
       'Graded science explorer assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-10-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-10-f2","type":"quiz_mcq","label":"Which statement best captures science explorer fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-10-f2-opt1","label":"Core Science Explorer principle A (correct)","value":"core-science-explorer-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-10-f2-opt2","label":"Science Explorer misconception B","value":"science-explorer-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-10-f2-opt3","label":"Science Explorer myth C","value":"science-explorer-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-10-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-10-f3","type":"quiz_mcq","label":"You face a typical science explorer problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-10-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-10-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-10-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-10-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-10-f4","type":"quiz_tf","label":"Science Explorer mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-10-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-10-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-10-f5","type":"quiz_short","label":"Define one key science explorer term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-10-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Science Explorer Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Science Explorer Quiz' AND t.category = 'Quiz'
);

-- 032 | Quiz | tpl-qz-11 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'World History Quiz',
       'Graded world history assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-11-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-11-f2","type":"quiz_mcq","label":"Which statement best captures world history fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-11-f2-opt1","label":"Core World History principle A (correct)","value":"core-world-history-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-11-f2-opt2","label":"World History misconception B","value":"world-history-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-11-f2-opt3","label":"World History myth C","value":"world-history-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-11-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-11-f3","type":"quiz_mcq","label":"You face a typical world history problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-11-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-11-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-11-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-11-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-11-f4","type":"quiz_tf","label":"World History mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-11-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-11-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-11-f5","type":"quiz_short","label":"Define one key world history term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-11-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified World History Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'World History Quiz' AND t.category = 'Quiz'
);

-- 033 | Quiz | tpl-qz-12 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Geography Quest Quiz',
       'Graded geography quest assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-12-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-12-f2","type":"quiz_mcq","label":"Which statement best captures geography quest fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-12-f2-opt1","label":"Core Geography Quest principle A (correct)","value":"core-geography-quest-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-12-f2-opt2","label":"Geography Quest misconception B","value":"geography-quest-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-12-f2-opt3","label":"Geography Quest myth C","value":"geography-quest-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-12-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-12-f3","type":"quiz_mcq","label":"You face a typical geography quest problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-12-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-12-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-12-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-12-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-12-f4","type":"quiz_tf","label":"Geography Quest mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-12-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-12-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-12-f5","type":"quiz_short","label":"Define one key geography quest term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-12-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Geography Quest Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Geography Quest Quiz' AND t.category = 'Quiz'
);

-- 034 | Quiz | tpl-qz-13 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'English Grammar Quiz',
       'Graded english grammar assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-13-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-13-f2","type":"quiz_mcq","label":"Which statement best captures english grammar fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-13-f2-opt1","label":"Core English Grammar principle A (correct)","value":"core-english-grammar-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-13-f2-opt2","label":"English Grammar misconception B","value":"english-grammar-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-13-f2-opt3","label":"English Grammar myth C","value":"english-grammar-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-13-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-13-f3","type":"quiz_mcq","label":"You face a typical english grammar problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-13-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-13-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-13-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-13-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-13-f4","type":"quiz_tf","label":"English Grammar mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-13-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-13-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-13-f5","type":"quiz_short","label":"Define one key english grammar term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-13-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified English Grammar Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'English Grammar Quiz' AND t.category = 'Quiz'
);

-- 035 | Quiz | tpl-qz-14 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'General Knowledge Quiz',
       'Graded general knowledge assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-14-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-14-f2","type":"quiz_mcq","label":"Which statement best captures general knowledge fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-14-f2-opt1","label":"Core General Knowledge principle A (correct)","value":"core-general-knowledge-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-14-f2-opt2","label":"General Knowledge misconception B","value":"general-knowledge-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-14-f2-opt3","label":"General Knowledge myth C","value":"general-knowledge-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-14-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-14-f3","type":"quiz_mcq","label":"You face a typical general knowledge problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-14-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-14-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-14-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-14-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-14-f4","type":"quiz_tf","label":"General Knowledge mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-14-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-14-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-14-f5","type":"quiz_short","label":"Define one key general knowledge term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-14-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified General Knowledge Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'General Knowledge Quiz' AND t.category = 'Quiz'
);

-- 036 | Quiz | tpl-qz-15 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Digital Marketing Quiz',
       'Graded digital marketing assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-15-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-15-f2","type":"quiz_mcq","label":"Which statement best captures digital marketing fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-15-f2-opt1","label":"Core Digital Marketing principle A (correct)","value":"core-digital-marketing-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-15-f2-opt2","label":"Digital Marketing misconception B","value":"digital-marketing-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-15-f2-opt3","label":"Digital Marketing myth C","value":"digital-marketing-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-15-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-15-f3","type":"quiz_mcq","label":"You face a typical digital marketing problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-15-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-15-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-15-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-15-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-15-f4","type":"quiz_tf","label":"Digital Marketing mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-15-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-15-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-15-f5","type":"quiz_short","label":"Define one key digital marketing term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-15-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Digital Marketing Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Digital Marketing Quiz' AND t.category = 'Quiz'
);

-- 037 | Quiz | tpl-qz-16 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Cyber Security Quiz',
       'Graded cyber security assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-16-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-16-f2","type":"quiz_mcq","label":"Which statement best captures cyber security fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-16-f2-opt1","label":"Core Cyber Security principle A (correct)","value":"core-cyber-security-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-16-f2-opt2","label":"Cyber Security misconception B","value":"cyber-security-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-16-f2-opt3","label":"Cyber Security myth C","value":"cyber-security-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-16-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-16-f3","type":"quiz_mcq","label":"You face a typical cyber security problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-16-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-16-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-16-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-16-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-16-f4","type":"quiz_tf","label":"Cyber Security mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-16-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-16-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-16-f5","type":"quiz_short","label":"Define one key cyber security term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-16-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Cyber Security Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Cyber Security Quiz' AND t.category = 'Quiz'
);

-- 038 | Quiz | tpl-qz-17 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Networking Basics Quiz',
       'Graded networking basics assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-17-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-17-f2","type":"quiz_mcq","label":"Which statement best captures networking basics fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-17-f2-opt1","label":"Core Networking Basics principle A (correct)","value":"core-networking-basics-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-17-f2-opt2","label":"Networking Basics misconception B","value":"networking-basics-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-17-f2-opt3","label":"Networking Basics myth C","value":"networking-basics-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-17-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-17-f3","type":"quiz_mcq","label":"You face a typical networking basics problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-17-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-17-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-17-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-17-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-17-f4","type":"quiz_tf","label":"Networking Basics mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-17-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-17-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-17-f5","type":"quiz_short","label":"Define one key networking basics term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-17-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Networking Basics Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Networking Basics Quiz' AND t.category = 'Quiz'
);

-- 039 | Quiz | tpl-qz-18 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Machine Learning Intro Quiz',
       'Graded machine learning intro assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-18-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-18-f2","type":"quiz_mcq","label":"Which statement best captures machine learning intro fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-18-f2-opt1","label":"Core Machine Learning Intro principle A (correct)","value":"core-machine-learning-intro-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-18-f2-opt2","label":"Machine Learning Intro misconception B","value":"machine-learning-intro-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-18-f2-opt3","label":"Machine Learning Intro myth C","value":"machine-learning-intro-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-18-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-18-f3","type":"quiz_mcq","label":"You face a typical machine learning intro problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-18-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-18-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-18-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-18-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-18-f4","type":"quiz_tf","label":"Machine Learning Intro mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-18-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-18-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-18-f5","type":"quiz_short","label":"Define one key machine learning intro term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-18-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Machine Learning Intro Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Machine Learning Intro Quiz' AND t.category = 'Quiz'
);

-- 040 | Quiz | tpl-qz-19 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Finance Literacy Quiz',
       'Graded finance literacy assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-19-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-19-f2","type":"quiz_mcq","label":"Which statement best captures finance literacy fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-19-f2-opt1","label":"Core Finance Literacy principle A (correct)","value":"core-finance-literacy-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-19-f2-opt2","label":"Finance Literacy misconception B","value":"finance-literacy-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-19-f2-opt3","label":"Finance Literacy myth C","value":"finance-literacy-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-19-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-19-f3","type":"quiz_mcq","label":"You face a typical finance literacy problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-19-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-19-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-19-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-19-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-19-f4","type":"quiz_tf","label":"Finance Literacy mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-19-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-19-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-19-f5","type":"quiz_short","label":"Define one key finance literacy term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-19-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Finance Literacy Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Finance Literacy Quiz' AND t.category = 'Quiz'
);

-- 041 | Quiz | tpl-qz-20 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Sports Trivia Quiz',
       'Graded sports trivia assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-20-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-20-f2","type":"quiz_mcq","label":"Which statement best captures sports trivia fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-20-f2-opt1","label":"Core Sports Trivia principle A (correct)","value":"core-sports-trivia-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-20-f2-opt2","label":"Sports Trivia misconception B","value":"sports-trivia-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-20-f2-opt3","label":"Sports Trivia myth C","value":"sports-trivia-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-20-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-20-f3","type":"quiz_mcq","label":"You face a typical sports trivia problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-20-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-20-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-20-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-20-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-20-f4","type":"quiz_tf","label":"Sports Trivia mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-20-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-20-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-20-f5","type":"quiz_short","label":"Define one key sports trivia term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-20-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Sports Trivia Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Sports Trivia Quiz' AND t.category = 'Quiz'
);

-- 042 | Quiz | tpl-qz-21 | 6 fields | 0 logic rule(s) | quiz=true
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Data Structures Quiz',
       'Graded data structures assessment with auto-scoring, timer, anti-cheat and certificates.',
       'Quiz',
       true,
       '🧠',
       '[{"id":"tpl-qz-21-f1","type":"text","label":"Your Name","placeholder":"Full name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-qz-21-f2","type":"quiz_mcq","label":"Which statement best captures data structures fundamentals?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-21-f2-opt1","label":"Core Data Structures principle A (correct)","value":"core-data-structures-principle-a-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-21-f2-opt2","label":"Data Structures misconception B","value":"data-structures-misconception-b","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-21-f2-opt3","label":"Data Structures myth C","value":"data-structures-myth-c","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-21-f2-opt4","label":"Unrelated option D","value":"unrelated-option-d","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-21-f3","type":"quiz_mcq","label":"You face a typical data structures problem. What do you do first?","required":true,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-21-f3-opt1","label":"Define the problem clearly (correct)","value":"define-the-problem-clearly-correct-","isCorrect":true,"scorePoints":10},{"id":"tpl-qz-21-f3-opt2","label":"Guess randomly","value":"guess-randomly","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-21-f3-opt3","label":"Skip it entirely","value":"skip-it-entirely","isCorrect":false,"scorePoints":0},{"id":"tpl-qz-21-f3-opt4","label":"Copy an unrelated answer","value":"copy-an-unrelated-answer","isCorrect":false,"scorePoints":0}],"points":10},{"id":"tpl-qz-21-f4","type":"quiz_tf","label":"Data Structures mastery comes from deliberate practice.","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-qz-21-f4-opt1","label":"True","value":"true","isCorrect":true},{"id":"tpl-qz-21-f4-opt2","label":"False","value":"false","isCorrect":false}],"points":5,"correctAnswer":"true"},{"id":"tpl-qz-21-f5","type":"quiz_short","label":"Define one key data structures term in your own words.","required":true,"order":5,"page":1,"logicRules":[],"points":10},{"id":"tpl-qz-21-f6","type":"rating","label":"Rate your confidence before submitting","required":false,"order":6,"page":1,"logicRules":[],"max":5}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":true,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certified Data Structures Achiever"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Data Structures Quiz' AND t.category = 'Quiz'
);

-- 043 | Survey | tpl-sv-1 | 5 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Employee Engagement Survey',
       'Agreement-scale employee engagement survey with conditional deep-dives.',
       'Survey',
       false,
       '📊',
       '[{"id":"tpl-sv-1-f1","type":"select","label":"Which best describes you?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-1-f1-opt1","label":"Student","value":"student","isCorrect":false},{"id":"tpl-sv-1-f1-opt2","label":"Professional","value":"professional","isCorrect":false},{"id":"tpl-sv-1-f1-opt3","label":"Manager","value":"manager","isCorrect":false},{"id":"tpl-sv-1-f1-opt4","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-sv-1-f2","type":"radio","label":"Overall, employee engagement meets my expectations","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-1-r1","sourceFieldId":"tpl-sv-1-f2","operator":"contains","targetValue":"disagree","action":"show","targetFieldId":"tpl-sv-1-f4"}],"options":[{"id":"tpl-sv-1-f2-opt1","label":"Strongly agree","value":"strongly-agree","isCorrect":false},{"id":"tpl-sv-1-f2-opt2","label":"Agree","value":"agree","isCorrect":false},{"id":"tpl-sv-1-f2-opt3","label":"Neutral","value":"neutral","isCorrect":false},{"id":"tpl-sv-1-f2-opt4","label":"Disagree","value":"disagree","isCorrect":false},{"id":"tpl-sv-1-f2-opt5","label":"Strongly disagree","value":"strongly-disagree","isCorrect":false}]},{"id":"tpl-sv-1-f3","type":"scale","label":"Rate the experience (1-10)","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-sv-1-r2","sourceFieldId":"tpl-sv-1-f3","operator":"less_than","targetValue":"6","action":"show","targetFieldId":"tpl-sv-1-f4"}],"min":1,"max":10},{"id":"tpl-sv-1-f4","type":"textarea","label":"What should we do differently?","placeholder":"Your honest take...","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-sv-1-f5","type":"checkbox","label":"Topics you care about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-1-f5-opt1","label":"Quality","value":"quality","isCorrect":false},{"id":"tpl-sv-1-f5-opt2","label":"Speed","value":"speed","isCorrect":false},{"id":"tpl-sv-1-f5-opt3","label":"Price","value":"price","isCorrect":false},{"id":"tpl-sv-1-f5-opt4","label":"Support","value":"support","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Employee Engagement Survey' AND t.category = 'Survey'
);

-- 044 | Survey | tpl-sv-2 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Market Research Research Poll',
       'Demographics + behavior poll for market research insights.',
       'Survey',
       false,
       '🔍',
       '[{"id":"tpl-sv-2-f1","type":"select","label":"Age group","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-2-f1-opt1","label":"Under 18","value":"under-18","isCorrect":false},{"id":"tpl-sv-2-f1-opt2","label":"18-24","value":"18-24","isCorrect":false},{"id":"tpl-sv-2-f1-opt3","label":"25-34","value":"25-34","isCorrect":false},{"id":"tpl-sv-2-f1-opt4","label":"35-44","value":"35-44","isCorrect":false},{"id":"tpl-sv-2-f1-opt5","label":"45+","value":"45-","isCorrect":false}]},{"id":"tpl-sv-2-f2","type":"radio","label":"How often does this topic come up for you?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-2-f2-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-sv-2-f2-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-sv-2-f2-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-sv-2-f2-opt4","label":"Rarely","value":"rarely","isCorrect":false}]},{"id":"tpl-sv-2-f3","type":"checkbox","label":"Where do you encounter it?","required":false,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-2-f3-opt1","label":"Work","value":"work","isCorrect":false},{"id":"tpl-sv-2-f3-opt2","label":"School","value":"school","isCorrect":false},{"id":"tpl-sv-2-f3-opt3","label":"Home","value":"home","isCorrect":false},{"id":"tpl-sv-2-f3-opt4","label":"On the go","value":"on-the-go","isCorrect":false}]},{"id":"tpl-sv-2-f4","type":"nps","label":"How likely are you to recommend our approach?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-sv-2-r1","sourceFieldId":"tpl-sv-2-f4","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-sv-2-f5"}]},{"id":"tpl-sv-2-f5","type":"textarea","label":"Anything we missed?","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Market Research Research Poll' AND t.category = 'Survey'
);

-- 045 | Survey | tpl-sv-3 | 4 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Customer Needs Quick Pulse',
       'Two-minute customer needs pulse with rating + open text.',
       'Survey',
       false,
       '⚡',
       '[{"id":"tpl-sv-3-f1","type":"rating","label":"Rate customer needs this week","required":true,"order":1,"page":1,"logicRules":[],"max":5},{"id":"tpl-sv-3-f2","type":"radio","label":"Trend vs last week?","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-3-r1","sourceFieldId":"tpl-sv-3-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-sv-3-f3"}],"options":[{"id":"tpl-sv-3-f2-opt1","label":"Better","value":"better","isCorrect":false},{"id":"tpl-sv-3-f2-opt2","label":"Same","value":"same","isCorrect":false},{"id":"tpl-sv-3-f2-opt3","label":"Worse","value":"worse","isCorrect":false}]},{"id":"tpl-sv-3-f3","type":"textarea","label":"One thing to improve?","placeholder":"Just one...","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-sv-3-f4","type":"email","label":"Email for follow-up (optional)","placeholder":"you@example.com","required":false,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Customer Needs Quick Pulse' AND t.category = 'Survey'
);

-- 046 | Survey | tpl-sv-4 | 5 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'UX Research Survey',
       'Agreement-scale ux research survey with conditional deep-dives.',
       'Survey',
       false,
       '📊',
       '[{"id":"tpl-sv-4-f1","type":"select","label":"Which best describes you?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-4-f1-opt1","label":"Student","value":"student","isCorrect":false},{"id":"tpl-sv-4-f1-opt2","label":"Professional","value":"professional","isCorrect":false},{"id":"tpl-sv-4-f1-opt3","label":"Manager","value":"manager","isCorrect":false},{"id":"tpl-sv-4-f1-opt4","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-sv-4-f2","type":"radio","label":"Overall, ux research meets my expectations","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-4-r1","sourceFieldId":"tpl-sv-4-f2","operator":"contains","targetValue":"disagree","action":"show","targetFieldId":"tpl-sv-4-f4"}],"options":[{"id":"tpl-sv-4-f2-opt1","label":"Strongly agree","value":"strongly-agree","isCorrect":false},{"id":"tpl-sv-4-f2-opt2","label":"Agree","value":"agree","isCorrect":false},{"id":"tpl-sv-4-f2-opt3","label":"Neutral","value":"neutral","isCorrect":false},{"id":"tpl-sv-4-f2-opt4","label":"Disagree","value":"disagree","isCorrect":false},{"id":"tpl-sv-4-f2-opt5","label":"Strongly disagree","value":"strongly-disagree","isCorrect":false}]},{"id":"tpl-sv-4-f3","type":"scale","label":"Rate the experience (1-10)","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-sv-4-r2","sourceFieldId":"tpl-sv-4-f3","operator":"less_than","targetValue":"6","action":"show","targetFieldId":"tpl-sv-4-f4"}],"min":1,"max":10},{"id":"tpl-sv-4-f4","type":"textarea","label":"What should we do differently?","placeholder":"Your honest take...","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-sv-4-f5","type":"checkbox","label":"Topics you care about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-4-f5-opt1","label":"Quality","value":"quality","isCorrect":false},{"id":"tpl-sv-4-f5-opt2","label":"Speed","value":"speed","isCorrect":false},{"id":"tpl-sv-4-f5-opt3","label":"Price","value":"price","isCorrect":false},{"id":"tpl-sv-4-f5-opt4","label":"Support","value":"support","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'UX Research Survey' AND t.category = 'Survey'
);

-- 047 | Survey | tpl-sv-5 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Workplace Wellness Research Poll',
       'Demographics + behavior poll for workplace wellness insights.',
       'Survey',
       false,
       '🔍',
       '[{"id":"tpl-sv-5-f1","type":"select","label":"Age group","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-5-f1-opt1","label":"Under 18","value":"under-18","isCorrect":false},{"id":"tpl-sv-5-f1-opt2","label":"18-24","value":"18-24","isCorrect":false},{"id":"tpl-sv-5-f1-opt3","label":"25-34","value":"25-34","isCorrect":false},{"id":"tpl-sv-5-f1-opt4","label":"35-44","value":"35-44","isCorrect":false},{"id":"tpl-sv-5-f1-opt5","label":"45+","value":"45-","isCorrect":false}]},{"id":"tpl-sv-5-f2","type":"radio","label":"How often does this topic come up for you?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-5-f2-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-sv-5-f2-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-sv-5-f2-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-sv-5-f2-opt4","label":"Rarely","value":"rarely","isCorrect":false}]},{"id":"tpl-sv-5-f3","type":"checkbox","label":"Where do you encounter it?","required":false,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-5-f3-opt1","label":"Work","value":"work","isCorrect":false},{"id":"tpl-sv-5-f3-opt2","label":"School","value":"school","isCorrect":false},{"id":"tpl-sv-5-f3-opt3","label":"Home","value":"home","isCorrect":false},{"id":"tpl-sv-5-f3-opt4","label":"On the go","value":"on-the-go","isCorrect":false}]},{"id":"tpl-sv-5-f4","type":"nps","label":"How likely are you to recommend our approach?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-sv-5-r1","sourceFieldId":"tpl-sv-5-f4","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-sv-5-f5"}]},{"id":"tpl-sv-5-f5","type":"textarea","label":"Anything we missed?","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Workplace Wellness Research Poll' AND t.category = 'Survey'
);

-- 048 | Survey | tpl-sv-6 | 4 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Student Satisfaction Quick Pulse',
       'Two-minute student satisfaction pulse with rating + open text.',
       'Survey',
       false,
       '⚡',
       '[{"id":"tpl-sv-6-f1","type":"rating","label":"Rate student satisfaction this week","required":true,"order":1,"page":1,"logicRules":[],"max":5},{"id":"tpl-sv-6-f2","type":"radio","label":"Trend vs last week?","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-6-r1","sourceFieldId":"tpl-sv-6-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-sv-6-f3"}],"options":[{"id":"tpl-sv-6-f2-opt1","label":"Better","value":"better","isCorrect":false},{"id":"tpl-sv-6-f2-opt2","label":"Same","value":"same","isCorrect":false},{"id":"tpl-sv-6-f2-opt3","label":"Worse","value":"worse","isCorrect":false}]},{"id":"tpl-sv-6-f3","type":"textarea","label":"One thing to improve?","placeholder":"Just one...","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-sv-6-f4","type":"email","label":"Email for follow-up (optional)","placeholder":"you@example.com","required":false,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Student Satisfaction Quick Pulse' AND t.category = 'Survey'
);

-- 049 | Survey | tpl-sv-7 | 5 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Course Evaluation Survey',
       'Agreement-scale course evaluation survey with conditional deep-dives.',
       'Survey',
       false,
       '📊',
       '[{"id":"tpl-sv-7-f1","type":"select","label":"Which best describes you?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-7-f1-opt1","label":"Student","value":"student","isCorrect":false},{"id":"tpl-sv-7-f1-opt2","label":"Professional","value":"professional","isCorrect":false},{"id":"tpl-sv-7-f1-opt3","label":"Manager","value":"manager","isCorrect":false},{"id":"tpl-sv-7-f1-opt4","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-sv-7-f2","type":"radio","label":"Overall, course evaluation meets my expectations","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-7-r1","sourceFieldId":"tpl-sv-7-f2","operator":"contains","targetValue":"disagree","action":"show","targetFieldId":"tpl-sv-7-f4"}],"options":[{"id":"tpl-sv-7-f2-opt1","label":"Strongly agree","value":"strongly-agree","isCorrect":false},{"id":"tpl-sv-7-f2-opt2","label":"Agree","value":"agree","isCorrect":false},{"id":"tpl-sv-7-f2-opt3","label":"Neutral","value":"neutral","isCorrect":false},{"id":"tpl-sv-7-f2-opt4","label":"Disagree","value":"disagree","isCorrect":false},{"id":"tpl-sv-7-f2-opt5","label":"Strongly disagree","value":"strongly-disagree","isCorrect":false}]},{"id":"tpl-sv-7-f3","type":"scale","label":"Rate the experience (1-10)","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-sv-7-r2","sourceFieldId":"tpl-sv-7-f3","operator":"less_than","targetValue":"6","action":"show","targetFieldId":"tpl-sv-7-f4"}],"min":1,"max":10},{"id":"tpl-sv-7-f4","type":"textarea","label":"What should we do differently?","placeholder":"Your honest take...","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-sv-7-f5","type":"checkbox","label":"Topics you care about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-7-f5-opt1","label":"Quality","value":"quality","isCorrect":false},{"id":"tpl-sv-7-f5-opt2","label":"Speed","value":"speed","isCorrect":false},{"id":"tpl-sv-7-f5-opt3","label":"Price","value":"price","isCorrect":false},{"id":"tpl-sv-7-f5-opt4","label":"Support","value":"support","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Course Evaluation Survey' AND t.category = 'Survey'
);

-- 050 | Survey | tpl-sv-8 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Brand Awareness Research Poll',
       'Demographics + behavior poll for brand awareness insights.',
       'Survey',
       false,
       '🔍',
       '[{"id":"tpl-sv-8-f1","type":"select","label":"Age group","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-8-f1-opt1","label":"Under 18","value":"under-18","isCorrect":false},{"id":"tpl-sv-8-f1-opt2","label":"18-24","value":"18-24","isCorrect":false},{"id":"tpl-sv-8-f1-opt3","label":"25-34","value":"25-34","isCorrect":false},{"id":"tpl-sv-8-f1-opt4","label":"35-44","value":"35-44","isCorrect":false},{"id":"tpl-sv-8-f1-opt5","label":"45+","value":"45-","isCorrect":false}]},{"id":"tpl-sv-8-f2","type":"radio","label":"How often does this topic come up for you?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-8-f2-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-sv-8-f2-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-sv-8-f2-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-sv-8-f2-opt4","label":"Rarely","value":"rarely","isCorrect":false}]},{"id":"tpl-sv-8-f3","type":"checkbox","label":"Where do you encounter it?","required":false,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-8-f3-opt1","label":"Work","value":"work","isCorrect":false},{"id":"tpl-sv-8-f3-opt2","label":"School","value":"school","isCorrect":false},{"id":"tpl-sv-8-f3-opt3","label":"Home","value":"home","isCorrect":false},{"id":"tpl-sv-8-f3-opt4","label":"On the go","value":"on-the-go","isCorrect":false}]},{"id":"tpl-sv-8-f4","type":"nps","label":"How likely are you to recommend our approach?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-sv-8-r1","sourceFieldId":"tpl-sv-8-f4","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-sv-8-f5"}]},{"id":"tpl-sv-8-f5","type":"textarea","label":"Anything we missed?","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Brand Awareness Research Poll' AND t.category = 'Survey'
);

-- 051 | Survey | tpl-sv-9 | 4 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Product-Market Fit Quick Pulse',
       'Two-minute product-market fit pulse with rating + open text.',
       'Survey',
       false,
       '⚡',
       '[{"id":"tpl-sv-9-f1","type":"rating","label":"Rate product-market fit this week","required":true,"order":1,"page":1,"logicRules":[],"max":5},{"id":"tpl-sv-9-f2","type":"radio","label":"Trend vs last week?","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-9-r1","sourceFieldId":"tpl-sv-9-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-sv-9-f3"}],"options":[{"id":"tpl-sv-9-f2-opt1","label":"Better","value":"better","isCorrect":false},{"id":"tpl-sv-9-f2-opt2","label":"Same","value":"same","isCorrect":false},{"id":"tpl-sv-9-f2-opt3","label":"Worse","value":"worse","isCorrect":false}]},{"id":"tpl-sv-9-f3","type":"textarea","label":"One thing to improve?","placeholder":"Just one...","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-sv-9-f4","type":"email","label":"Email for follow-up (optional)","placeholder":"you@example.com","required":false,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Product-Market Fit Quick Pulse' AND t.category = 'Survey'
);

-- 052 | Survey | tpl-sv-10 | 5 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Remote Work Survey',
       'Agreement-scale remote work survey with conditional deep-dives.',
       'Survey',
       false,
       '📊',
       '[{"id":"tpl-sv-10-f1","type":"select","label":"Which best describes you?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-10-f1-opt1","label":"Student","value":"student","isCorrect":false},{"id":"tpl-sv-10-f1-opt2","label":"Professional","value":"professional","isCorrect":false},{"id":"tpl-sv-10-f1-opt3","label":"Manager","value":"manager","isCorrect":false},{"id":"tpl-sv-10-f1-opt4","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-sv-10-f2","type":"radio","label":"Overall, remote work meets my expectations","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-10-r1","sourceFieldId":"tpl-sv-10-f2","operator":"contains","targetValue":"disagree","action":"show","targetFieldId":"tpl-sv-10-f4"}],"options":[{"id":"tpl-sv-10-f2-opt1","label":"Strongly agree","value":"strongly-agree","isCorrect":false},{"id":"tpl-sv-10-f2-opt2","label":"Agree","value":"agree","isCorrect":false},{"id":"tpl-sv-10-f2-opt3","label":"Neutral","value":"neutral","isCorrect":false},{"id":"tpl-sv-10-f2-opt4","label":"Disagree","value":"disagree","isCorrect":false},{"id":"tpl-sv-10-f2-opt5","label":"Strongly disagree","value":"strongly-disagree","isCorrect":false}]},{"id":"tpl-sv-10-f3","type":"scale","label":"Rate the experience (1-10)","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-sv-10-r2","sourceFieldId":"tpl-sv-10-f3","operator":"less_than","targetValue":"6","action":"show","targetFieldId":"tpl-sv-10-f4"}],"min":1,"max":10},{"id":"tpl-sv-10-f4","type":"textarea","label":"What should we do differently?","placeholder":"Your honest take...","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-sv-10-f5","type":"checkbox","label":"Topics you care about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-10-f5-opt1","label":"Quality","value":"quality","isCorrect":false},{"id":"tpl-sv-10-f5-opt2","label":"Speed","value":"speed","isCorrect":false},{"id":"tpl-sv-10-f5-opt3","label":"Price","value":"price","isCorrect":false},{"id":"tpl-sv-10-f5-opt4","label":"Support","value":"support","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Remote Work Survey' AND t.category = 'Survey'
);

-- 053 | Survey | tpl-sv-11 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Diversity & Inclusion Research Poll',
       'Demographics + behavior poll for diversity & inclusion insights.',
       'Survey',
       false,
       '🔍',
       '[{"id":"tpl-sv-11-f1","type":"select","label":"Age group","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-11-f1-opt1","label":"Under 18","value":"under-18","isCorrect":false},{"id":"tpl-sv-11-f1-opt2","label":"18-24","value":"18-24","isCorrect":false},{"id":"tpl-sv-11-f1-opt3","label":"25-34","value":"25-34","isCorrect":false},{"id":"tpl-sv-11-f1-opt4","label":"35-44","value":"35-44","isCorrect":false},{"id":"tpl-sv-11-f1-opt5","label":"45+","value":"45-","isCorrect":false}]},{"id":"tpl-sv-11-f2","type":"radio","label":"How often does this topic come up for you?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-11-f2-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-sv-11-f2-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-sv-11-f2-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-sv-11-f2-opt4","label":"Rarely","value":"rarely","isCorrect":false}]},{"id":"tpl-sv-11-f3","type":"checkbox","label":"Where do you encounter it?","required":false,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-11-f3-opt1","label":"Work","value":"work","isCorrect":false},{"id":"tpl-sv-11-f3-opt2","label":"School","value":"school","isCorrect":false},{"id":"tpl-sv-11-f3-opt3","label":"Home","value":"home","isCorrect":false},{"id":"tpl-sv-11-f3-opt4","label":"On the go","value":"on-the-go","isCorrect":false}]},{"id":"tpl-sv-11-f4","type":"nps","label":"How likely are you to recommend our approach?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-sv-11-r1","sourceFieldId":"tpl-sv-11-f4","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-sv-11-f5"}]},{"id":"tpl-sv-11-f5","type":"textarea","label":"Anything we missed?","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Diversity & Inclusion Research Poll' AND t.category = 'Survey'
);

-- 054 | Survey | tpl-sv-12 | 4 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Training Effectiveness Quick Pulse',
       'Two-minute training effectiveness pulse with rating + open text.',
       'Survey',
       false,
       '⚡',
       '[{"id":"tpl-sv-12-f1","type":"rating","label":"Rate training effectiveness this week","required":true,"order":1,"page":1,"logicRules":[],"max":5},{"id":"tpl-sv-12-f2","type":"radio","label":"Trend vs last week?","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-12-r1","sourceFieldId":"tpl-sv-12-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-sv-12-f3"}],"options":[{"id":"tpl-sv-12-f2-opt1","label":"Better","value":"better","isCorrect":false},{"id":"tpl-sv-12-f2-opt2","label":"Same","value":"same","isCorrect":false},{"id":"tpl-sv-12-f2-opt3","label":"Worse","value":"worse","isCorrect":false}]},{"id":"tpl-sv-12-f3","type":"textarea","label":"One thing to improve?","placeholder":"Just one...","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-sv-12-f4","type":"email","label":"Email for follow-up (optional)","placeholder":"you@example.com","required":false,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Training Effectiveness Quick Pulse' AND t.category = 'Survey'
);

-- 055 | Survey | tpl-sv-13 | 5 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Community Needs Survey',
       'Agreement-scale community needs survey with conditional deep-dives.',
       'Survey',
       false,
       '📊',
       '[{"id":"tpl-sv-13-f1","type":"select","label":"Which best describes you?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-13-f1-opt1","label":"Student","value":"student","isCorrect":false},{"id":"tpl-sv-13-f1-opt2","label":"Professional","value":"professional","isCorrect":false},{"id":"tpl-sv-13-f1-opt3","label":"Manager","value":"manager","isCorrect":false},{"id":"tpl-sv-13-f1-opt4","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-sv-13-f2","type":"radio","label":"Overall, community needs meets my expectations","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-13-r1","sourceFieldId":"tpl-sv-13-f2","operator":"contains","targetValue":"disagree","action":"show","targetFieldId":"tpl-sv-13-f4"}],"options":[{"id":"tpl-sv-13-f2-opt1","label":"Strongly agree","value":"strongly-agree","isCorrect":false},{"id":"tpl-sv-13-f2-opt2","label":"Agree","value":"agree","isCorrect":false},{"id":"tpl-sv-13-f2-opt3","label":"Neutral","value":"neutral","isCorrect":false},{"id":"tpl-sv-13-f2-opt4","label":"Disagree","value":"disagree","isCorrect":false},{"id":"tpl-sv-13-f2-opt5","label":"Strongly disagree","value":"strongly-disagree","isCorrect":false}]},{"id":"tpl-sv-13-f3","type":"scale","label":"Rate the experience (1-10)","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-sv-13-r2","sourceFieldId":"tpl-sv-13-f3","operator":"less_than","targetValue":"6","action":"show","targetFieldId":"tpl-sv-13-f4"}],"min":1,"max":10},{"id":"tpl-sv-13-f4","type":"textarea","label":"What should we do differently?","placeholder":"Your honest take...","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-sv-13-f5","type":"checkbox","label":"Topics you care about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-13-f5-opt1","label":"Quality","value":"quality","isCorrect":false},{"id":"tpl-sv-13-f5-opt2","label":"Speed","value":"speed","isCorrect":false},{"id":"tpl-sv-13-f5-opt3","label":"Price","value":"price","isCorrect":false},{"id":"tpl-sv-13-f5-opt4","label":"Support","value":"support","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Community Needs Survey' AND t.category = 'Survey'
);

-- 056 | Survey | tpl-sv-14 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Health & Lifestyle Research Poll',
       'Demographics + behavior poll for health & lifestyle insights.',
       'Survey',
       false,
       '🔍',
       '[{"id":"tpl-sv-14-f1","type":"select","label":"Age group","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-14-f1-opt1","label":"Under 18","value":"under-18","isCorrect":false},{"id":"tpl-sv-14-f1-opt2","label":"18-24","value":"18-24","isCorrect":false},{"id":"tpl-sv-14-f1-opt3","label":"25-34","value":"25-34","isCorrect":false},{"id":"tpl-sv-14-f1-opt4","label":"35-44","value":"35-44","isCorrect":false},{"id":"tpl-sv-14-f1-opt5","label":"45+","value":"45-","isCorrect":false}]},{"id":"tpl-sv-14-f2","type":"radio","label":"How often does this topic come up for you?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-14-f2-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-sv-14-f2-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-sv-14-f2-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-sv-14-f2-opt4","label":"Rarely","value":"rarely","isCorrect":false}]},{"id":"tpl-sv-14-f3","type":"checkbox","label":"Where do you encounter it?","required":false,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-14-f3-opt1","label":"Work","value":"work","isCorrect":false},{"id":"tpl-sv-14-f3-opt2","label":"School","value":"school","isCorrect":false},{"id":"tpl-sv-14-f3-opt3","label":"Home","value":"home","isCorrect":false},{"id":"tpl-sv-14-f3-opt4","label":"On the go","value":"on-the-go","isCorrect":false}]},{"id":"tpl-sv-14-f4","type":"nps","label":"How likely are you to recommend our approach?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-sv-14-r1","sourceFieldId":"tpl-sv-14-f4","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-sv-14-f5"}]},{"id":"tpl-sv-14-f5","type":"textarea","label":"Anything we missed?","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Health & Lifestyle Research Poll' AND t.category = 'Survey'
);

-- 057 | Survey | tpl-sv-15 | 4 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Travel Preferences Quick Pulse',
       'Two-minute travel preferences pulse with rating + open text.',
       'Survey',
       false,
       '⚡',
       '[{"id":"tpl-sv-15-f1","type":"rating","label":"Rate travel preferences this week","required":true,"order":1,"page":1,"logicRules":[],"max":5},{"id":"tpl-sv-15-f2","type":"radio","label":"Trend vs last week?","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-15-r1","sourceFieldId":"tpl-sv-15-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-sv-15-f3"}],"options":[{"id":"tpl-sv-15-f2-opt1","label":"Better","value":"better","isCorrect":false},{"id":"tpl-sv-15-f2-opt2","label":"Same","value":"same","isCorrect":false},{"id":"tpl-sv-15-f2-opt3","label":"Worse","value":"worse","isCorrect":false}]},{"id":"tpl-sv-15-f3","type":"textarea","label":"One thing to improve?","placeholder":"Just one...","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-sv-15-f4","type":"email","label":"Email for follow-up (optional)","placeholder":"you@example.com","required":false,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Travel Preferences Quick Pulse' AND t.category = 'Survey'
);

-- 058 | Survey | tpl-sv-16 | 5 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Food Habits Survey',
       'Agreement-scale food habits survey with conditional deep-dives.',
       'Survey',
       false,
       '📊',
       '[{"id":"tpl-sv-16-f1","type":"select","label":"Which best describes you?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-16-f1-opt1","label":"Student","value":"student","isCorrect":false},{"id":"tpl-sv-16-f1-opt2","label":"Professional","value":"professional","isCorrect":false},{"id":"tpl-sv-16-f1-opt3","label":"Manager","value":"manager","isCorrect":false},{"id":"tpl-sv-16-f1-opt4","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-sv-16-f2","type":"radio","label":"Overall, food habits meets my expectations","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-16-r1","sourceFieldId":"tpl-sv-16-f2","operator":"contains","targetValue":"disagree","action":"show","targetFieldId":"tpl-sv-16-f4"}],"options":[{"id":"tpl-sv-16-f2-opt1","label":"Strongly agree","value":"strongly-agree","isCorrect":false},{"id":"tpl-sv-16-f2-opt2","label":"Agree","value":"agree","isCorrect":false},{"id":"tpl-sv-16-f2-opt3","label":"Neutral","value":"neutral","isCorrect":false},{"id":"tpl-sv-16-f2-opt4","label":"Disagree","value":"disagree","isCorrect":false},{"id":"tpl-sv-16-f2-opt5","label":"Strongly disagree","value":"strongly-disagree","isCorrect":false}]},{"id":"tpl-sv-16-f3","type":"scale","label":"Rate the experience (1-10)","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-sv-16-r2","sourceFieldId":"tpl-sv-16-f3","operator":"less_than","targetValue":"6","action":"show","targetFieldId":"tpl-sv-16-f4"}],"min":1,"max":10},{"id":"tpl-sv-16-f4","type":"textarea","label":"What should we do differently?","placeholder":"Your honest take...","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-sv-16-f5","type":"checkbox","label":"Topics you care about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-16-f5-opt1","label":"Quality","value":"quality","isCorrect":false},{"id":"tpl-sv-16-f5-opt2","label":"Speed","value":"speed","isCorrect":false},{"id":"tpl-sv-16-f5-opt3","label":"Price","value":"price","isCorrect":false},{"id":"tpl-sv-16-f5-opt4","label":"Support","value":"support","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Food Habits Survey' AND t.category = 'Survey'
);

-- 059 | Survey | tpl-sv-17 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Shopping Behavior Research Poll',
       'Demographics + behavior poll for shopping behavior insights.',
       'Survey',
       false,
       '🔍',
       '[{"id":"tpl-sv-17-f1","type":"select","label":"Age group","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-17-f1-opt1","label":"Under 18","value":"under-18","isCorrect":false},{"id":"tpl-sv-17-f1-opt2","label":"18-24","value":"18-24","isCorrect":false},{"id":"tpl-sv-17-f1-opt3","label":"25-34","value":"25-34","isCorrect":false},{"id":"tpl-sv-17-f1-opt4","label":"35-44","value":"35-44","isCorrect":false},{"id":"tpl-sv-17-f1-opt5","label":"45+","value":"45-","isCorrect":false}]},{"id":"tpl-sv-17-f2","type":"radio","label":"How often does this topic come up for you?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-17-f2-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-sv-17-f2-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-sv-17-f2-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-sv-17-f2-opt4","label":"Rarely","value":"rarely","isCorrect":false}]},{"id":"tpl-sv-17-f3","type":"checkbox","label":"Where do you encounter it?","required":false,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-17-f3-opt1","label":"Work","value":"work","isCorrect":false},{"id":"tpl-sv-17-f3-opt2","label":"School","value":"school","isCorrect":false},{"id":"tpl-sv-17-f3-opt3","label":"Home","value":"home","isCorrect":false},{"id":"tpl-sv-17-f3-opt4","label":"On the go","value":"on-the-go","isCorrect":false}]},{"id":"tpl-sv-17-f4","type":"nps","label":"How likely are you to recommend our approach?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-sv-17-r1","sourceFieldId":"tpl-sv-17-f4","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-sv-17-f5"}]},{"id":"tpl-sv-17-f5","type":"textarea","label":"Anything we missed?","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Shopping Behavior Research Poll' AND t.category = 'Survey'
);

-- 060 | Survey | tpl-sv-18 | 4 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Social Media Use Quick Pulse',
       'Two-minute social media use pulse with rating + open text.',
       'Survey',
       false,
       '⚡',
       '[{"id":"tpl-sv-18-f1","type":"rating","label":"Rate social media use this week","required":true,"order":1,"page":1,"logicRules":[],"max":5},{"id":"tpl-sv-18-f2","type":"radio","label":"Trend vs last week?","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-18-r1","sourceFieldId":"tpl-sv-18-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-sv-18-f3"}],"options":[{"id":"tpl-sv-18-f2-opt1","label":"Better","value":"better","isCorrect":false},{"id":"tpl-sv-18-f2-opt2","label":"Same","value":"same","isCorrect":false},{"id":"tpl-sv-18-f2-opt3","label":"Worse","value":"worse","isCorrect":false}]},{"id":"tpl-sv-18-f3","type":"textarea","label":"One thing to improve?","placeholder":"Just one...","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-sv-18-f4","type":"email","label":"Email for follow-up (optional)","placeholder":"you@example.com","required":false,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Social Media Use Quick Pulse' AND t.category = 'Survey'
);

-- 061 | Survey | tpl-sv-19 | 5 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Environmental Attitudes Survey',
       'Agreement-scale environmental attitudes survey with conditional deep-dives.',
       'Survey',
       false,
       '📊',
       '[{"id":"tpl-sv-19-f1","type":"select","label":"Which best describes you?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-19-f1-opt1","label":"Student","value":"student","isCorrect":false},{"id":"tpl-sv-19-f1-opt2","label":"Professional","value":"professional","isCorrect":false},{"id":"tpl-sv-19-f1-opt3","label":"Manager","value":"manager","isCorrect":false},{"id":"tpl-sv-19-f1-opt4","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-sv-19-f2","type":"radio","label":"Overall, environmental attitudes meets my expectations","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-19-r1","sourceFieldId":"tpl-sv-19-f2","operator":"contains","targetValue":"disagree","action":"show","targetFieldId":"tpl-sv-19-f4"}],"options":[{"id":"tpl-sv-19-f2-opt1","label":"Strongly agree","value":"strongly-agree","isCorrect":false},{"id":"tpl-sv-19-f2-opt2","label":"Agree","value":"agree","isCorrect":false},{"id":"tpl-sv-19-f2-opt3","label":"Neutral","value":"neutral","isCorrect":false},{"id":"tpl-sv-19-f2-opt4","label":"Disagree","value":"disagree","isCorrect":false},{"id":"tpl-sv-19-f2-opt5","label":"Strongly disagree","value":"strongly-disagree","isCorrect":false}]},{"id":"tpl-sv-19-f3","type":"scale","label":"Rate the experience (1-10)","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-sv-19-r2","sourceFieldId":"tpl-sv-19-f3","operator":"less_than","targetValue":"6","action":"show","targetFieldId":"tpl-sv-19-f4"}],"min":1,"max":10},{"id":"tpl-sv-19-f4","type":"textarea","label":"What should we do differently?","placeholder":"Your honest take...","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-sv-19-f5","type":"checkbox","label":"Topics you care about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-19-f5-opt1","label":"Quality","value":"quality","isCorrect":false},{"id":"tpl-sv-19-f5-opt2","label":"Speed","value":"speed","isCorrect":false},{"id":"tpl-sv-19-f5-opt3","label":"Price","value":"price","isCorrect":false},{"id":"tpl-sv-19-f5-opt4","label":"Support","value":"support","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Environmental Attitudes Survey' AND t.category = 'Survey'
);

-- 062 | Survey | tpl-sv-20 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Event Planning Research Poll',
       'Demographics + behavior poll for event planning insights.',
       'Survey',
       false,
       '🔍',
       '[{"id":"tpl-sv-20-f1","type":"select","label":"Age group","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-20-f1-opt1","label":"Under 18","value":"under-18","isCorrect":false},{"id":"tpl-sv-20-f1-opt2","label":"18-24","value":"18-24","isCorrect":false},{"id":"tpl-sv-20-f1-opt3","label":"25-34","value":"25-34","isCorrect":false},{"id":"tpl-sv-20-f1-opt4","label":"35-44","value":"35-44","isCorrect":false},{"id":"tpl-sv-20-f1-opt5","label":"45+","value":"45-","isCorrect":false}]},{"id":"tpl-sv-20-f2","type":"radio","label":"How often does this topic come up for you?","required":true,"order":2,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-20-f2-opt1","label":"Daily","value":"daily","isCorrect":false},{"id":"tpl-sv-20-f2-opt2","label":"Weekly","value":"weekly","isCorrect":false},{"id":"tpl-sv-20-f2-opt3","label":"Monthly","value":"monthly","isCorrect":false},{"id":"tpl-sv-20-f2-opt4","label":"Rarely","value":"rarely","isCorrect":false}]},{"id":"tpl-sv-20-f3","type":"checkbox","label":"Where do you encounter it?","required":false,"order":3,"page":1,"logicRules":[],"options":[{"id":"tpl-sv-20-f3-opt1","label":"Work","value":"work","isCorrect":false},{"id":"tpl-sv-20-f3-opt2","label":"School","value":"school","isCorrect":false},{"id":"tpl-sv-20-f3-opt3","label":"Home","value":"home","isCorrect":false},{"id":"tpl-sv-20-f3-opt4","label":"On the go","value":"on-the-go","isCorrect":false}]},{"id":"tpl-sv-20-f4","type":"nps","label":"How likely are you to recommend our approach?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-sv-20-r1","sourceFieldId":"tpl-sv-20-f4","operator":"less_than","targetValue":"7","action":"show","targetFieldId":"tpl-sv-20-f5"}]},{"id":"tpl-sv-20-f5","type":"textarea","label":"Anything we missed?","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Event Planning Research Poll' AND t.category = 'Survey'
);

-- 063 | Survey | tpl-sv-21 | 4 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Pricing Sensitivity Quick Pulse',
       'Two-minute pricing sensitivity pulse with rating + open text.',
       'Survey',
       false,
       '⚡',
       '[{"id":"tpl-sv-21-f1","type":"rating","label":"Rate pricing sensitivity this week","required":true,"order":1,"page":1,"logicRules":[],"max":5},{"id":"tpl-sv-21-f2","type":"radio","label":"Trend vs last week?","required":true,"order":2,"page":1,"logicRules":[{"id":"tpl-sv-21-r1","sourceFieldId":"tpl-sv-21-f2","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-sv-21-f3"}],"options":[{"id":"tpl-sv-21-f2-opt1","label":"Better","value":"better","isCorrect":false},{"id":"tpl-sv-21-f2-opt2","label":"Same","value":"same","isCorrect":false},{"id":"tpl-sv-21-f2-opt3","label":"Worse","value":"worse","isCorrect":false}]},{"id":"tpl-sv-21-f3","type":"textarea","label":"One thing to improve?","placeholder":"Just one...","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-sv-21-f4","type":"email","label":"Email for follow-up (optional)","placeholder":"you@example.com","required":false,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Pricing Sensitivity Quick Pulse' AND t.category = 'Survey'
);

-- 064 | Registration | tpl-rg-1 | 8 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Tech Conference Registration',
       'Attendee signup for tech conference with tickets, meals and consent.',
       'Registration',
       false,
       '🎟️',
       '[{"id":"tpl-rg-1-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-1-f2","type":"email","label":"Email Address","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-1-f3","type":"phone","label":"Phone Number","placeholder":"+1 (555) 000-0000","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-rg-1-f4","type":"select","label":"Ticket Type","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-rg-1-r1","sourceFieldId":"tpl-rg-1-f4","operator":"equals","targetValue":"vip","action":"show","targetFieldId":"tpl-rg-1-f5"}],"options":[{"id":"tpl-rg-1-f4-opt1","label":"General Admission","value":"general-admission","isCorrect":false},{"id":"tpl-rg-1-f4-opt2","label":"VIP","value":"vip","isCorrect":false},{"id":"tpl-rg-1-f4-opt3","label":"Student","value":"student","isCorrect":false},{"id":"tpl-rg-1-f4-opt4","label":"Speaker","value":"speaker","isCorrect":false}]},{"id":"tpl-rg-1-f5","type":"select","label":"VIP Lounge Access","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-1-f5-opt1","label":"Evening mixer","value":"evening-mixer","isCorrect":false},{"id":"tpl-rg-1-f5-opt2","label":"Green room","value":"green-room","isCorrect":false},{"id":"tpl-rg-1-f5-opt3","label":"Both","value":"both","isCorrect":false}]},{"id":"tpl-rg-1-f6","type":"radio","label":"Dietary Requirements","required":false,"order":6,"page":1,"logicRules":[{"id":"tpl-rg-1-r2","sourceFieldId":"tpl-rg-1-f6","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-rg-1-f7"}],"options":[{"id":"tpl-rg-1-f6-opt1","label":"None","value":"none","isCorrect":false},{"id":"tpl-rg-1-f6-opt2","label":"Vegetarian","value":"vegetarian","isCorrect":false},{"id":"tpl-rg-1-f6-opt3","label":"Vegan","value":"vegan","isCorrect":false},{"id":"tpl-rg-1-f6-opt4","label":"Gluten-Free","value":"gluten-free","isCorrect":false},{"id":"tpl-rg-1-f6-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-rg-1-f7","type":"text","label":"Please specify dietary needs","placeholder":"e.g. nut allergy","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-rg-1-f8","type":"terms","label":"I agree to the event terms and photo policy","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Tech Conference Registration' AND t.category = 'Registration'
);

-- 065 | Registration | tpl-rg-2 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Design Workshop Signup',
       'Skill-matched signup for design workshop with session picks.',
       'Registration',
       false,
       '📅',
       '[{"id":"tpl-rg-2-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-2-f2","type":"email","label":"Email","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-2-f3","type":"select","label":"Skill Level","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-2-r1","sourceFieldId":"tpl-rg-2-f3","operator":"equals","targetValue":"beginner","action":"show","targetFieldId":"tpl-rg-2-f5"}],"options":[{"id":"tpl-rg-2-f3-opt1","label":"Beginner","value":"beginner","isCorrect":false},{"id":"tpl-rg-2-f3-opt2","label":"Intermediate","value":"intermediate","isCorrect":false},{"id":"tpl-rg-2-f3-opt3","label":"Advanced","value":"advanced","isCorrect":false}]},{"id":"tpl-rg-2-f4","type":"checkbox","label":"Sessions to attend","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-2-f4-opt1","label":"Morning","value":"morning","isCorrect":false},{"id":"tpl-rg-2-f4-opt2","label":"Afternoon","value":"afternoon","isCorrect":false},{"id":"tpl-rg-2-f4-opt3","label":"Evening","value":"evening","isCorrect":false},{"id":"tpl-rg-2-f4-opt4","label":"Full day","value":"full-day","isCorrect":false}]},{"id":"tpl-rg-2-f5","type":"textarea","label":"Goals for the day","placeholder":"What do you want to learn?","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-rg-2-f6","type":"terms","label":"I agree to the code of conduct","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Design Workshop Signup' AND t.category = 'Registration'
);

-- 066 | Registration | tpl-rg-3 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Live Webinar RSVP',
       'Fast RSVP for live webinar with guest count and notes.',
       'Registration',
       false,
       '✉️',
       '[{"id":"tpl-rg-3-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-3-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-3-f3","type":"radio","label":"Will you attend?","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-3-r1","sourceFieldId":"tpl-rg-3-f3","operator":"equals","targetValue":"yes,-attending","action":"show","targetFieldId":"tpl-rg-3-f4"}],"options":[{"id":"tpl-rg-3-f3-opt1","label":"Yes, attending","value":"yes-attending","isCorrect":false},{"id":"tpl-rg-3-f3-opt2","label":"Maybe","value":"maybe","isCorrect":false},{"id":"tpl-rg-3-f3-opt3","label":"Cannot attend","value":"cannot-attend","isCorrect":false}]},{"id":"tpl-rg-3-f4","type":"number","label":"Guests (including you)","required":false,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-rg-3-f5","type":"textarea","label":"Notes for organizers","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Live Webinar RSVP' AND t.category = 'Registration'
);

-- 067 | Registration | tpl-rg-4 | 8 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'City Marathon Registration',
       'Attendee signup for city marathon with tickets, meals and consent.',
       'Registration',
       false,
       '🎟️',
       '[{"id":"tpl-rg-4-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-4-f2","type":"email","label":"Email Address","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-4-f3","type":"phone","label":"Phone Number","placeholder":"+1 (555) 000-0000","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-rg-4-f4","type":"select","label":"Ticket Type","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-rg-4-r1","sourceFieldId":"tpl-rg-4-f4","operator":"equals","targetValue":"vip","action":"show","targetFieldId":"tpl-rg-4-f5"}],"options":[{"id":"tpl-rg-4-f4-opt1","label":"General Admission","value":"general-admission","isCorrect":false},{"id":"tpl-rg-4-f4-opt2","label":"VIP","value":"vip","isCorrect":false},{"id":"tpl-rg-4-f4-opt3","label":"Student","value":"student","isCorrect":false},{"id":"tpl-rg-4-f4-opt4","label":"Speaker","value":"speaker","isCorrect":false}]},{"id":"tpl-rg-4-f5","type":"select","label":"VIP Lounge Access","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-4-f5-opt1","label":"Evening mixer","value":"evening-mixer","isCorrect":false},{"id":"tpl-rg-4-f5-opt2","label":"Green room","value":"green-room","isCorrect":false},{"id":"tpl-rg-4-f5-opt3","label":"Both","value":"both","isCorrect":false}]},{"id":"tpl-rg-4-f6","type":"radio","label":"Dietary Requirements","required":false,"order":6,"page":1,"logicRules":[{"id":"tpl-rg-4-r2","sourceFieldId":"tpl-rg-4-f6","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-rg-4-f7"}],"options":[{"id":"tpl-rg-4-f6-opt1","label":"None","value":"none","isCorrect":false},{"id":"tpl-rg-4-f6-opt2","label":"Vegetarian","value":"vegetarian","isCorrect":false},{"id":"tpl-rg-4-f6-opt3","label":"Vegan","value":"vegan","isCorrect":false},{"id":"tpl-rg-4-f6-opt4","label":"Gluten-Free","value":"gluten-free","isCorrect":false},{"id":"tpl-rg-4-f6-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-rg-4-f7","type":"text","label":"Please specify dietary needs","placeholder":"e.g. nut allergy","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-rg-4-f8","type":"terms","label":"I agree to the event terms and photo policy","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'City Marathon Registration' AND t.category = 'Registration'
);

-- 068 | Registration | tpl-rg-5 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Hackathon Signup',
       'Skill-matched signup for hackathon with session picks.',
       'Registration',
       false,
       '📅',
       '[{"id":"tpl-rg-5-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-5-f2","type":"email","label":"Email","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-5-f3","type":"select","label":"Skill Level","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-5-r1","sourceFieldId":"tpl-rg-5-f3","operator":"equals","targetValue":"beginner","action":"show","targetFieldId":"tpl-rg-5-f5"}],"options":[{"id":"tpl-rg-5-f3-opt1","label":"Beginner","value":"beginner","isCorrect":false},{"id":"tpl-rg-5-f3-opt2","label":"Intermediate","value":"intermediate","isCorrect":false},{"id":"tpl-rg-5-f3-opt3","label":"Advanced","value":"advanced","isCorrect":false}]},{"id":"tpl-rg-5-f4","type":"checkbox","label":"Sessions to attend","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-5-f4-opt1","label":"Morning","value":"morning","isCorrect":false},{"id":"tpl-rg-5-f4-opt2","label":"Afternoon","value":"afternoon","isCorrect":false},{"id":"tpl-rg-5-f4-opt3","label":"Evening","value":"evening","isCorrect":false},{"id":"tpl-rg-5-f4-opt4","label":"Full day","value":"full-day","isCorrect":false}]},{"id":"tpl-rg-5-f5","type":"textarea","label":"Goals for the day","placeholder":"What do you want to learn?","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-rg-5-f6","type":"terms","label":"I agree to the code of conduct","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Hackathon Signup' AND t.category = 'Registration'
);

-- 069 | Registration | tpl-rg-6 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Volunteer Drive RSVP',
       'Fast RSVP for volunteer drive with guest count and notes.',
       'Registration',
       false,
       '✉️',
       '[{"id":"tpl-rg-6-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-6-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-6-f3","type":"radio","label":"Will you attend?","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-6-r1","sourceFieldId":"tpl-rg-6-f3","operator":"equals","targetValue":"yes,-attending","action":"show","targetFieldId":"tpl-rg-6-f4"}],"options":[{"id":"tpl-rg-6-f3-opt1","label":"Yes, attending","value":"yes-attending","isCorrect":false},{"id":"tpl-rg-6-f3-opt2","label":"Maybe","value":"maybe","isCorrect":false},{"id":"tpl-rg-6-f3-opt3","label":"Cannot attend","value":"cannot-attend","isCorrect":false}]},{"id":"tpl-rg-6-f4","type":"number","label":"Guests (including you)","required":false,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-rg-6-f5","type":"textarea","label":"Notes for organizers","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Volunteer Drive RSVP' AND t.category = 'Registration'
);

-- 070 | Registration | tpl-rg-7 | 8 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Music Festival Registration',
       'Attendee signup for music festival with tickets, meals and consent.',
       'Registration',
       false,
       '🎟️',
       '[{"id":"tpl-rg-7-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-7-f2","type":"email","label":"Email Address","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-7-f3","type":"phone","label":"Phone Number","placeholder":"+1 (555) 000-0000","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-rg-7-f4","type":"select","label":"Ticket Type","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-rg-7-r1","sourceFieldId":"tpl-rg-7-f4","operator":"equals","targetValue":"vip","action":"show","targetFieldId":"tpl-rg-7-f5"}],"options":[{"id":"tpl-rg-7-f4-opt1","label":"General Admission","value":"general-admission","isCorrect":false},{"id":"tpl-rg-7-f4-opt2","label":"VIP","value":"vip","isCorrect":false},{"id":"tpl-rg-7-f4-opt3","label":"Student","value":"student","isCorrect":false},{"id":"tpl-rg-7-f4-opt4","label":"Speaker","value":"speaker","isCorrect":false}]},{"id":"tpl-rg-7-f5","type":"select","label":"VIP Lounge Access","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-7-f5-opt1","label":"Evening mixer","value":"evening-mixer","isCorrect":false},{"id":"tpl-rg-7-f5-opt2","label":"Green room","value":"green-room","isCorrect":false},{"id":"tpl-rg-7-f5-opt3","label":"Both","value":"both","isCorrect":false}]},{"id":"tpl-rg-7-f6","type":"radio","label":"Dietary Requirements","required":false,"order":6,"page":1,"logicRules":[{"id":"tpl-rg-7-r2","sourceFieldId":"tpl-rg-7-f6","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-rg-7-f7"}],"options":[{"id":"tpl-rg-7-f6-opt1","label":"None","value":"none","isCorrect":false},{"id":"tpl-rg-7-f6-opt2","label":"Vegetarian","value":"vegetarian","isCorrect":false},{"id":"tpl-rg-7-f6-opt3","label":"Vegan","value":"vegan","isCorrect":false},{"id":"tpl-rg-7-f6-opt4","label":"Gluten-Free","value":"gluten-free","isCorrect":false},{"id":"tpl-rg-7-f6-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-rg-7-f7","type":"text","label":"Please specify dietary needs","placeholder":"e.g. nut allergy","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-rg-7-f8","type":"terms","label":"I agree to the event terms and photo policy","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Music Festival Registration' AND t.category = 'Registration'
);

-- 071 | Registration | tpl-rg-8 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Art Class Signup',
       'Skill-matched signup for art class with session picks.',
       'Registration',
       false,
       '📅',
       '[{"id":"tpl-rg-8-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-8-f2","type":"email","label":"Email","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-8-f3","type":"select","label":"Skill Level","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-8-r1","sourceFieldId":"tpl-rg-8-f3","operator":"equals","targetValue":"beginner","action":"show","targetFieldId":"tpl-rg-8-f5"}],"options":[{"id":"tpl-rg-8-f3-opt1","label":"Beginner","value":"beginner","isCorrect":false},{"id":"tpl-rg-8-f3-opt2","label":"Intermediate","value":"intermediate","isCorrect":false},{"id":"tpl-rg-8-f3-opt3","label":"Advanced","value":"advanced","isCorrect":false}]},{"id":"tpl-rg-8-f4","type":"checkbox","label":"Sessions to attend","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-8-f4-opt1","label":"Morning","value":"morning","isCorrect":false},{"id":"tpl-rg-8-f4-opt2","label":"Afternoon","value":"afternoon","isCorrect":false},{"id":"tpl-rg-8-f4-opt3","label":"Evening","value":"evening","isCorrect":false},{"id":"tpl-rg-8-f4-opt4","label":"Full day","value":"full-day","isCorrect":false}]},{"id":"tpl-rg-8-f5","type":"textarea","label":"Goals for the day","placeholder":"What do you want to learn?","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-rg-8-f6","type":"terms","label":"I agree to the code of conduct","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Art Class Signup' AND t.category = 'Registration'
);

-- 072 | Registration | tpl-rg-9 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Cooking Workshop RSVP',
       'Fast RSVP for cooking workshop with guest count and notes.',
       'Registration',
       false,
       '✉️',
       '[{"id":"tpl-rg-9-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-9-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-9-f3","type":"radio","label":"Will you attend?","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-9-r1","sourceFieldId":"tpl-rg-9-f3","operator":"equals","targetValue":"yes,-attending","action":"show","targetFieldId":"tpl-rg-9-f4"}],"options":[{"id":"tpl-rg-9-f3-opt1","label":"Yes, attending","value":"yes-attending","isCorrect":false},{"id":"tpl-rg-9-f3-opt2","label":"Maybe","value":"maybe","isCorrect":false},{"id":"tpl-rg-9-f3-opt3","label":"Cannot attend","value":"cannot-attend","isCorrect":false}]},{"id":"tpl-rg-9-f4","type":"number","label":"Guests (including you)","required":false,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-rg-9-f5","type":"textarea","label":"Notes for organizers","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Cooking Workshop RSVP' AND t.category = 'Registration'
);

-- 073 | Registration | tpl-rg-10 | 8 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Yoga Retreat Registration',
       'Attendee signup for yoga retreat with tickets, meals and consent.',
       'Registration',
       false,
       '🎟️',
       '[{"id":"tpl-rg-10-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-10-f2","type":"email","label":"Email Address","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-10-f3","type":"phone","label":"Phone Number","placeholder":"+1 (555) 000-0000","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-rg-10-f4","type":"select","label":"Ticket Type","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-rg-10-r1","sourceFieldId":"tpl-rg-10-f4","operator":"equals","targetValue":"vip","action":"show","targetFieldId":"tpl-rg-10-f5"}],"options":[{"id":"tpl-rg-10-f4-opt1","label":"General Admission","value":"general-admission","isCorrect":false},{"id":"tpl-rg-10-f4-opt2","label":"VIP","value":"vip","isCorrect":false},{"id":"tpl-rg-10-f4-opt3","label":"Student","value":"student","isCorrect":false},{"id":"tpl-rg-10-f4-opt4","label":"Speaker","value":"speaker","isCorrect":false}]},{"id":"tpl-rg-10-f5","type":"select","label":"VIP Lounge Access","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-10-f5-opt1","label":"Evening mixer","value":"evening-mixer","isCorrect":false},{"id":"tpl-rg-10-f5-opt2","label":"Green room","value":"green-room","isCorrect":false},{"id":"tpl-rg-10-f5-opt3","label":"Both","value":"both","isCorrect":false}]},{"id":"tpl-rg-10-f6","type":"radio","label":"Dietary Requirements","required":false,"order":6,"page":1,"logicRules":[{"id":"tpl-rg-10-r2","sourceFieldId":"tpl-rg-10-f6","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-rg-10-f7"}],"options":[{"id":"tpl-rg-10-f6-opt1","label":"None","value":"none","isCorrect":false},{"id":"tpl-rg-10-f6-opt2","label":"Vegetarian","value":"vegetarian","isCorrect":false},{"id":"tpl-rg-10-f6-opt3","label":"Vegan","value":"vegan","isCorrect":false},{"id":"tpl-rg-10-f6-opt4","label":"Gluten-Free","value":"gluten-free","isCorrect":false},{"id":"tpl-rg-10-f6-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-rg-10-f7","type":"text","label":"Please specify dietary needs","placeholder":"e.g. nut allergy","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-rg-10-f8","type":"terms","label":"I agree to the event terms and photo policy","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Yoga Retreat Registration' AND t.category = 'Registration'
);

-- 074 | Registration | tpl-rg-11 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Career Fair Signup',
       'Skill-matched signup for career fair with session picks.',
       'Registration',
       false,
       '📅',
       '[{"id":"tpl-rg-11-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-11-f2","type":"email","label":"Email","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-11-f3","type":"select","label":"Skill Level","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-11-r1","sourceFieldId":"tpl-rg-11-f3","operator":"equals","targetValue":"beginner","action":"show","targetFieldId":"tpl-rg-11-f5"}],"options":[{"id":"tpl-rg-11-f3-opt1","label":"Beginner","value":"beginner","isCorrect":false},{"id":"tpl-rg-11-f3-opt2","label":"Intermediate","value":"intermediate","isCorrect":false},{"id":"tpl-rg-11-f3-opt3","label":"Advanced","value":"advanced","isCorrect":false}]},{"id":"tpl-rg-11-f4","type":"checkbox","label":"Sessions to attend","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-11-f4-opt1","label":"Morning","value":"morning","isCorrect":false},{"id":"tpl-rg-11-f4-opt2","label":"Afternoon","value":"afternoon","isCorrect":false},{"id":"tpl-rg-11-f4-opt3","label":"Evening","value":"evening","isCorrect":false},{"id":"tpl-rg-11-f4-opt4","label":"Full day","value":"full-day","isCorrect":false}]},{"id":"tpl-rg-11-f5","type":"textarea","label":"Goals for the day","placeholder":"What do you want to learn?","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-rg-11-f6","type":"terms","label":"I agree to the code of conduct","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Career Fair Signup' AND t.category = 'Registration'
);

-- 075 | Registration | tpl-rg-12 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Book Club RSVP',
       'Fast RSVP for book club with guest count and notes.',
       'Registration',
       false,
       '✉️',
       '[{"id":"tpl-rg-12-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-12-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-12-f3","type":"radio","label":"Will you attend?","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-12-r1","sourceFieldId":"tpl-rg-12-f3","operator":"equals","targetValue":"yes,-attending","action":"show","targetFieldId":"tpl-rg-12-f4"}],"options":[{"id":"tpl-rg-12-f3-opt1","label":"Yes, attending","value":"yes-attending","isCorrect":false},{"id":"tpl-rg-12-f3-opt2","label":"Maybe","value":"maybe","isCorrect":false},{"id":"tpl-rg-12-f3-opt3","label":"Cannot attend","value":"cannot-attend","isCorrect":false}]},{"id":"tpl-rg-12-f4","type":"number","label":"Guests (including you)","required":false,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-rg-12-f5","type":"textarea","label":"Notes for organizers","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Book Club RSVP' AND t.category = 'Registration'
);

-- 076 | Registration | tpl-rg-13 | 8 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Gaming Tournament Registration',
       'Attendee signup for gaming tournament with tickets, meals and consent.',
       'Registration',
       false,
       '🎟️',
       '[{"id":"tpl-rg-13-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-13-f2","type":"email","label":"Email Address","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-13-f3","type":"phone","label":"Phone Number","placeholder":"+1 (555) 000-0000","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-rg-13-f4","type":"select","label":"Ticket Type","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-rg-13-r1","sourceFieldId":"tpl-rg-13-f4","operator":"equals","targetValue":"vip","action":"show","targetFieldId":"tpl-rg-13-f5"}],"options":[{"id":"tpl-rg-13-f4-opt1","label":"General Admission","value":"general-admission","isCorrect":false},{"id":"tpl-rg-13-f4-opt2","label":"VIP","value":"vip","isCorrect":false},{"id":"tpl-rg-13-f4-opt3","label":"Student","value":"student","isCorrect":false},{"id":"tpl-rg-13-f4-opt4","label":"Speaker","value":"speaker","isCorrect":false}]},{"id":"tpl-rg-13-f5","type":"select","label":"VIP Lounge Access","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-13-f5-opt1","label":"Evening mixer","value":"evening-mixer","isCorrect":false},{"id":"tpl-rg-13-f5-opt2","label":"Green room","value":"green-room","isCorrect":false},{"id":"tpl-rg-13-f5-opt3","label":"Both","value":"both","isCorrect":false}]},{"id":"tpl-rg-13-f6","type":"radio","label":"Dietary Requirements","required":false,"order":6,"page":1,"logicRules":[{"id":"tpl-rg-13-r2","sourceFieldId":"tpl-rg-13-f6","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-rg-13-f7"}],"options":[{"id":"tpl-rg-13-f6-opt1","label":"None","value":"none","isCorrect":false},{"id":"tpl-rg-13-f6-opt2","label":"Vegetarian","value":"vegetarian","isCorrect":false},{"id":"tpl-rg-13-f6-opt3","label":"Vegan","value":"vegan","isCorrect":false},{"id":"tpl-rg-13-f6-opt4","label":"Gluten-Free","value":"gluten-free","isCorrect":false},{"id":"tpl-rg-13-f6-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-rg-13-f7","type":"text","label":"Please specify dietary needs","placeholder":"e.g. nut allergy","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-rg-13-f8","type":"terms","label":"I agree to the event terms and photo policy","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Gaming Tournament Registration' AND t.category = 'Registration'
);

-- 077 | Registration | tpl-rg-14 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Photography Walk Signup',
       'Skill-matched signup for photography walk with session picks.',
       'Registration',
       false,
       '📅',
       '[{"id":"tpl-rg-14-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-14-f2","type":"email","label":"Email","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-14-f3","type":"select","label":"Skill Level","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-14-r1","sourceFieldId":"tpl-rg-14-f3","operator":"equals","targetValue":"beginner","action":"show","targetFieldId":"tpl-rg-14-f5"}],"options":[{"id":"tpl-rg-14-f3-opt1","label":"Beginner","value":"beginner","isCorrect":false},{"id":"tpl-rg-14-f3-opt2","label":"Intermediate","value":"intermediate","isCorrect":false},{"id":"tpl-rg-14-f3-opt3","label":"Advanced","value":"advanced","isCorrect":false}]},{"id":"tpl-rg-14-f4","type":"checkbox","label":"Sessions to attend","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-14-f4-opt1","label":"Morning","value":"morning","isCorrect":false},{"id":"tpl-rg-14-f4-opt2","label":"Afternoon","value":"afternoon","isCorrect":false},{"id":"tpl-rg-14-f4-opt3","label":"Evening","value":"evening","isCorrect":false},{"id":"tpl-rg-14-f4-opt4","label":"Full day","value":"full-day","isCorrect":false}]},{"id":"tpl-rg-14-f5","type":"textarea","label":"Goals for the day","placeholder":"What do you want to learn?","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-rg-14-f6","type":"terms","label":"I agree to the code of conduct","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Photography Walk Signup' AND t.category = 'Registration'
);

-- 078 | Registration | tpl-rg-15 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Language Exchange RSVP',
       'Fast RSVP for language exchange with guest count and notes.',
       'Registration',
       false,
       '✉️',
       '[{"id":"tpl-rg-15-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-15-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-15-f3","type":"radio","label":"Will you attend?","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-15-r1","sourceFieldId":"tpl-rg-15-f3","operator":"equals","targetValue":"yes,-attending","action":"show","targetFieldId":"tpl-rg-15-f4"}],"options":[{"id":"tpl-rg-15-f3-opt1","label":"Yes, attending","value":"yes-attending","isCorrect":false},{"id":"tpl-rg-15-f3-opt2","label":"Maybe","value":"maybe","isCorrect":false},{"id":"tpl-rg-15-f3-opt3","label":"Cannot attend","value":"cannot-attend","isCorrect":false}]},{"id":"tpl-rg-15-f4","type":"number","label":"Guests (including you)","required":false,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-rg-15-f5","type":"textarea","label":"Notes for organizers","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Language Exchange RSVP' AND t.category = 'Registration'
);

-- 079 | Registration | tpl-rg-16 | 8 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Startup Pitch Night Registration',
       'Attendee signup for startup pitch night with tickets, meals and consent.',
       'Registration',
       false,
       '🎟️',
       '[{"id":"tpl-rg-16-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-16-f2","type":"email","label":"Email Address","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-16-f3","type":"phone","label":"Phone Number","placeholder":"+1 (555) 000-0000","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-rg-16-f4","type":"select","label":"Ticket Type","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-rg-16-r1","sourceFieldId":"tpl-rg-16-f4","operator":"equals","targetValue":"vip","action":"show","targetFieldId":"tpl-rg-16-f5"}],"options":[{"id":"tpl-rg-16-f4-opt1","label":"General Admission","value":"general-admission","isCorrect":false},{"id":"tpl-rg-16-f4-opt2","label":"VIP","value":"vip","isCorrect":false},{"id":"tpl-rg-16-f4-opt3","label":"Student","value":"student","isCorrect":false},{"id":"tpl-rg-16-f4-opt4","label":"Speaker","value":"speaker","isCorrect":false}]},{"id":"tpl-rg-16-f5","type":"select","label":"VIP Lounge Access","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-16-f5-opt1","label":"Evening mixer","value":"evening-mixer","isCorrect":false},{"id":"tpl-rg-16-f5-opt2","label":"Green room","value":"green-room","isCorrect":false},{"id":"tpl-rg-16-f5-opt3","label":"Both","value":"both","isCorrect":false}]},{"id":"tpl-rg-16-f6","type":"radio","label":"Dietary Requirements","required":false,"order":6,"page":1,"logicRules":[{"id":"tpl-rg-16-r2","sourceFieldId":"tpl-rg-16-f6","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-rg-16-f7"}],"options":[{"id":"tpl-rg-16-f6-opt1","label":"None","value":"none","isCorrect":false},{"id":"tpl-rg-16-f6-opt2","label":"Vegetarian","value":"vegetarian","isCorrect":false},{"id":"tpl-rg-16-f6-opt3","label":"Vegan","value":"vegan","isCorrect":false},{"id":"tpl-rg-16-f6-opt4","label":"Gluten-Free","value":"gluten-free","isCorrect":false},{"id":"tpl-rg-16-f6-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-rg-16-f7","type":"text","label":"Please specify dietary needs","placeholder":"e.g. nut allergy","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-rg-16-f8","type":"terms","label":"I agree to the event terms and photo policy","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Startup Pitch Night Registration' AND t.category = 'Registration'
);

-- 080 | Registration | tpl-rg-17 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Alumni Meetup Signup',
       'Skill-matched signup for alumni meetup with session picks.',
       'Registration',
       false,
       '📅',
       '[{"id":"tpl-rg-17-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-17-f2","type":"email","label":"Email","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-17-f3","type":"select","label":"Skill Level","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-17-r1","sourceFieldId":"tpl-rg-17-f3","operator":"equals","targetValue":"beginner","action":"show","targetFieldId":"tpl-rg-17-f5"}],"options":[{"id":"tpl-rg-17-f3-opt1","label":"Beginner","value":"beginner","isCorrect":false},{"id":"tpl-rg-17-f3-opt2","label":"Intermediate","value":"intermediate","isCorrect":false},{"id":"tpl-rg-17-f3-opt3","label":"Advanced","value":"advanced","isCorrect":false}]},{"id":"tpl-rg-17-f4","type":"checkbox","label":"Sessions to attend","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-17-f4-opt1","label":"Morning","value":"morning","isCorrect":false},{"id":"tpl-rg-17-f4-opt2","label":"Afternoon","value":"afternoon","isCorrect":false},{"id":"tpl-rg-17-f4-opt3","label":"Evening","value":"evening","isCorrect":false},{"id":"tpl-rg-17-f4-opt4","label":"Full day","value":"full-day","isCorrect":false}]},{"id":"tpl-rg-17-f5","type":"textarea","label":"Goals for the day","placeholder":"What do you want to learn?","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-rg-17-f6","type":"terms","label":"I agree to the code of conduct","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Alumni Meetup Signup' AND t.category = 'Registration'
);

-- 081 | Registration | tpl-rg-18 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Charity Gala RSVP',
       'Fast RSVP for charity gala with guest count and notes.',
       'Registration',
       false,
       '✉️',
       '[{"id":"tpl-rg-18-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-18-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-18-f3","type":"radio","label":"Will you attend?","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-18-r1","sourceFieldId":"tpl-rg-18-f3","operator":"equals","targetValue":"yes,-attending","action":"show","targetFieldId":"tpl-rg-18-f4"}],"options":[{"id":"tpl-rg-18-f3-opt1","label":"Yes, attending","value":"yes-attending","isCorrect":false},{"id":"tpl-rg-18-f3-opt2","label":"Maybe","value":"maybe","isCorrect":false},{"id":"tpl-rg-18-f3-opt3","label":"Cannot attend","value":"cannot-attend","isCorrect":false}]},{"id":"tpl-rg-18-f4","type":"number","label":"Guests (including you)","required":false,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-rg-18-f5","type":"textarea","label":"Notes for organizers","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Charity Gala RSVP' AND t.category = 'Registration'
);

-- 082 | Registration | tpl-rg-19 | 8 fields | 2 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Science Fair Registration',
       'Attendee signup for science fair with tickets, meals and consent.',
       'Registration',
       false,
       '🎟️',
       '[{"id":"tpl-rg-19-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-19-f2","type":"email","label":"Email Address","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-19-f3","type":"phone","label":"Phone Number","placeholder":"+1 (555) 000-0000","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-rg-19-f4","type":"select","label":"Ticket Type","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-rg-19-r1","sourceFieldId":"tpl-rg-19-f4","operator":"equals","targetValue":"vip","action":"show","targetFieldId":"tpl-rg-19-f5"}],"options":[{"id":"tpl-rg-19-f4-opt1","label":"General Admission","value":"general-admission","isCorrect":false},{"id":"tpl-rg-19-f4-opt2","label":"VIP","value":"vip","isCorrect":false},{"id":"tpl-rg-19-f4-opt3","label":"Student","value":"student","isCorrect":false},{"id":"tpl-rg-19-f4-opt4","label":"Speaker","value":"speaker","isCorrect":false}]},{"id":"tpl-rg-19-f5","type":"select","label":"VIP Lounge Access","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-19-f5-opt1","label":"Evening mixer","value":"evening-mixer","isCorrect":false},{"id":"tpl-rg-19-f5-opt2","label":"Green room","value":"green-room","isCorrect":false},{"id":"tpl-rg-19-f5-opt3","label":"Both","value":"both","isCorrect":false}]},{"id":"tpl-rg-19-f6","type":"radio","label":"Dietary Requirements","required":false,"order":6,"page":1,"logicRules":[{"id":"tpl-rg-19-r2","sourceFieldId":"tpl-rg-19-f6","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-rg-19-f7"}],"options":[{"id":"tpl-rg-19-f6-opt1","label":"None","value":"none","isCorrect":false},{"id":"tpl-rg-19-f6-opt2","label":"Vegetarian","value":"vegetarian","isCorrect":false},{"id":"tpl-rg-19-f6-opt3","label":"Vegan","value":"vegan","isCorrect":false},{"id":"tpl-rg-19-f6-opt4","label":"Gluten-Free","value":"gluten-free","isCorrect":false},{"id":"tpl-rg-19-f6-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-rg-19-f7","type":"text","label":"Please specify dietary needs","placeholder":"e.g. nut allergy","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-rg-19-f8","type":"terms","label":"I agree to the event terms and photo policy","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Science Fair Registration' AND t.category = 'Registration'
);

-- 083 | Registration | tpl-rg-20 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Adoption Day Signup',
       'Skill-matched signup for adoption day with session picks.',
       'Registration',
       false,
       '📅',
       '[{"id":"tpl-rg-20-f1","type":"text","label":"Full Name","placeholder":"Jane Doe","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-20-f2","type":"email","label":"Email","placeholder":"jane@example.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-20-f3","type":"select","label":"Skill Level","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-20-r1","sourceFieldId":"tpl-rg-20-f3","operator":"equals","targetValue":"beginner","action":"show","targetFieldId":"tpl-rg-20-f5"}],"options":[{"id":"tpl-rg-20-f3-opt1","label":"Beginner","value":"beginner","isCorrect":false},{"id":"tpl-rg-20-f3-opt2","label":"Intermediate","value":"intermediate","isCorrect":false},{"id":"tpl-rg-20-f3-opt3","label":"Advanced","value":"advanced","isCorrect":false}]},{"id":"tpl-rg-20-f4","type":"checkbox","label":"Sessions to attend","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-rg-20-f4-opt1","label":"Morning","value":"morning","isCorrect":false},{"id":"tpl-rg-20-f4-opt2","label":"Afternoon","value":"afternoon","isCorrect":false},{"id":"tpl-rg-20-f4-opt3","label":"Evening","value":"evening","isCorrect":false},{"id":"tpl-rg-20-f4-opt4","label":"Full day","value":"full-day","isCorrect":false}]},{"id":"tpl-rg-20-f5","type":"textarea","label":"Goals for the day","placeholder":"What do you want to learn?","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-rg-20-f6","type":"terms","label":"I agree to the code of conduct","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Adoption Day Signup' AND t.category = 'Registration'
);

-- 084 | Registration | tpl-rg-21 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Blood Donation RSVP',
       'Fast RSVP for blood donation with guest count and notes.',
       'Registration',
       false,
       '✉️',
       '[{"id":"tpl-rg-21-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-rg-21-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-rg-21-f3","type":"radio","label":"Will you attend?","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-rg-21-r1","sourceFieldId":"tpl-rg-21-f3","operator":"equals","targetValue":"yes,-attending","action":"show","targetFieldId":"tpl-rg-21-f4"}],"options":[{"id":"tpl-rg-21-f3-opt1","label":"Yes, attending","value":"yes-attending","isCorrect":false},{"id":"tpl-rg-21-f3-opt2","label":"Maybe","value":"maybe","isCorrect":false},{"id":"tpl-rg-21-f3-opt3","label":"Cannot attend","value":"cannot-attend","isCorrect":false}]},{"id":"tpl-rg-21-f4","type":"number","label":"Guests (including you)","required":false,"order":4,"page":1,"logicRules":[],"min":1,"max":10},{"id":"tpl-rg-21-f5","type":"textarea","label":"Notes for organizers","required":false,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Blood Donation RSVP' AND t.category = 'Registration'
);

-- 085 | Lead Generation | tpl-ld-1 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Product Demo — Capture',
       'Qualify product demo interest with budget routing.',
       'Lead Generation',
       false,
       '🎯',
       '[{"id":"tpl-ld-1-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-1-f2","type":"email","label":"Business Email","placeholder":"you@company.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-1-f3","type":"text","label":"Company Name","placeholder":"Acme Inc.","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-1-f4","type":"select","label":"Company Size","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-1-f4-opt1","label":"1-10","value":"1-10","isCorrect":false},{"id":"tpl-ld-1-f4-opt2","label":"11-50","value":"11-50","isCorrect":false},{"id":"tpl-ld-1-f4-opt3","label":"51-200","value":"51-200","isCorrect":false},{"id":"tpl-ld-1-f4-opt4","label":"201-1000","value":"201-1000","isCorrect":false},{"id":"tpl-ld-1-f4-opt5","label":"1000+","value":"1000-","isCorrect":false}]},{"id":"tpl-ld-1-f5","type":"radio","label":"What brings you here?","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-ld-1-r1","sourceFieldId":"tpl-ld-1-f5","operator":"equals","targetValue":"pricing","action":"show","targetFieldId":"tpl-ld-1-f6"}],"options":[{"id":"tpl-ld-1-f5-opt1","label":"Pricing","value":"pricing","isCorrect":false},{"id":"tpl-ld-1-f5-opt2","label":"Live demo","value":"live-demo","isCorrect":false},{"id":"tpl-ld-1-f5-opt3","label":"Free trial","value":"free-trial","isCorrect":false},{"id":"tpl-ld-1-f5-opt4","label":"Just researching","value":"just-researching","isCorrect":false}]},{"id":"tpl-ld-1-f6","type":"select","label":"Monthly budget range","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-1-f6-opt1","label":"Under $500","value":"under-500","isCorrect":false},{"id":"tpl-ld-1-f6-opt2","label":"$500-$2k","value":"-500-2k","isCorrect":false},{"id":"tpl-ld-1-f6-opt3","label":"$2k-$10k","value":"-2k-10k","isCorrect":false},{"id":"tpl-ld-1-f6-opt4","label":"$10k+","value":"-10k-","isCorrect":false}]},{"id":"tpl-ld-1-f7","type":"textarea","label":"What problem are you solving?","required":false,"order":7,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Product Demo — Capture' AND t.category = 'Lead Generation'
);

-- 086 | Lead Generation | tpl-ld-2 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Free Trial Signup',
       'Low-friction free trial signup with role context.',
       'Lead Generation',
       false,
       '🚀',
       '[{"id":"tpl-ld-2-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-2-f2","type":"email","label":"Work Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-2-f3","type":"select","label":"Your Role","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-ld-2-r1","sourceFieldId":"tpl-ld-2-f3","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-ld-2-f4"}],"options":[{"id":"tpl-ld-2-f3-opt1","label":"Founder","value":"founder","isCorrect":false},{"id":"tpl-ld-2-f3-opt2","label":"Marketer","value":"marketer","isCorrect":false},{"id":"tpl-ld-2-f3-opt3","label":"Engineer","value":"engineer","isCorrect":false},{"id":"tpl-ld-2-f3-opt4","label":"Operations","value":"operations","isCorrect":false},{"id":"tpl-ld-2-f3-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-ld-2-f4","type":"text","label":"Tell us your role","placeholder":"e.g. Growth lead","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-ld-2-f5","type":"checkbox","label":"I want updates about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-2-f5-opt1","label":"New features","value":"new-features","isCorrect":false},{"id":"tpl-ld-2-f5-opt2","label":"Webinars","value":"webinars","isCorrect":false},{"id":"tpl-ld-2-f5-opt3","label":"Case studies","value":"case-studies","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Free Trial Signup' AND t.category = 'Lead Generation'
);

-- 087 | Lead Generation | tpl-ld-3 | 4 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Consultation Call Express',
       'Three-field consultation call express capture with consent.',
       'Lead Generation',
       false,
       '⚡',
       '[{"id":"tpl-ld-3-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-3-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-3-f3","type":"phone","label":"Phone (for faster response)","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-3-f4","type":"terms","label":"I agree to be contacted about this inquiry","required":true,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Consultation Call Express' AND t.category = 'Lead Generation'
);

-- 088 | Lead Generation | tpl-ld-4 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Ebook Download — Capture',
       'Qualify ebook download interest with budget routing.',
       'Lead Generation',
       false,
       '🎯',
       '[{"id":"tpl-ld-4-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-4-f2","type":"email","label":"Business Email","placeholder":"you@company.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-4-f3","type":"text","label":"Company Name","placeholder":"Acme Inc.","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-4-f4","type":"select","label":"Company Size","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-4-f4-opt1","label":"1-10","value":"1-10","isCorrect":false},{"id":"tpl-ld-4-f4-opt2","label":"11-50","value":"11-50","isCorrect":false},{"id":"tpl-ld-4-f4-opt3","label":"51-200","value":"51-200","isCorrect":false},{"id":"tpl-ld-4-f4-opt4","label":"201-1000","value":"201-1000","isCorrect":false},{"id":"tpl-ld-4-f4-opt5","label":"1000+","value":"1000-","isCorrect":false}]},{"id":"tpl-ld-4-f5","type":"radio","label":"What brings you here?","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-ld-4-r1","sourceFieldId":"tpl-ld-4-f5","operator":"equals","targetValue":"pricing","action":"show","targetFieldId":"tpl-ld-4-f6"}],"options":[{"id":"tpl-ld-4-f5-opt1","label":"Pricing","value":"pricing","isCorrect":false},{"id":"tpl-ld-4-f5-opt2","label":"Live demo","value":"live-demo","isCorrect":false},{"id":"tpl-ld-4-f5-opt3","label":"Free trial","value":"free-trial","isCorrect":false},{"id":"tpl-ld-4-f5-opt4","label":"Just researching","value":"just-researching","isCorrect":false}]},{"id":"tpl-ld-4-f6","type":"select","label":"Monthly budget range","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-4-f6-opt1","label":"Under $500","value":"under-500","isCorrect":false},{"id":"tpl-ld-4-f6-opt2","label":"$500-$2k","value":"-500-2k","isCorrect":false},{"id":"tpl-ld-4-f6-opt3","label":"$2k-$10k","value":"-2k-10k","isCorrect":false},{"id":"tpl-ld-4-f6-opt4","label":"$10k+","value":"-10k-","isCorrect":false}]},{"id":"tpl-ld-4-f7","type":"textarea","label":"What problem are you solving?","required":false,"order":7,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Ebook Download — Capture' AND t.category = 'Lead Generation'
);

-- 089 | Lead Generation | tpl-ld-5 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Webinar Signup Signup',
       'Low-friction webinar signup signup with role context.',
       'Lead Generation',
       false,
       '🚀',
       '[{"id":"tpl-ld-5-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-5-f2","type":"email","label":"Work Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-5-f3","type":"select","label":"Your Role","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-ld-5-r1","sourceFieldId":"tpl-ld-5-f3","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-ld-5-f4"}],"options":[{"id":"tpl-ld-5-f3-opt1","label":"Founder","value":"founder","isCorrect":false},{"id":"tpl-ld-5-f3-opt2","label":"Marketer","value":"marketer","isCorrect":false},{"id":"tpl-ld-5-f3-opt3","label":"Engineer","value":"engineer","isCorrect":false},{"id":"tpl-ld-5-f3-opt4","label":"Operations","value":"operations","isCorrect":false},{"id":"tpl-ld-5-f3-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-ld-5-f4","type":"text","label":"Tell us your role","placeholder":"e.g. Growth lead","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-ld-5-f5","type":"checkbox","label":"I want updates about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-5-f5-opt1","label":"New features","value":"new-features","isCorrect":false},{"id":"tpl-ld-5-f5-opt2","label":"Webinars","value":"webinars","isCorrect":false},{"id":"tpl-ld-5-f5-opt3","label":"Case studies","value":"case-studies","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Webinar Signup Signup' AND t.category = 'Lead Generation'
);

-- 090 | Lead Generation | tpl-ld-6 | 4 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Pricing Quote Express',
       'Three-field pricing quote express capture with consent.',
       'Lead Generation',
       false,
       '⚡',
       '[{"id":"tpl-ld-6-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-6-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-6-f3","type":"phone","label":"Phone (for faster response)","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-6-f4","type":"terms","label":"I agree to be contacted about this inquiry","required":true,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Pricing Quote Express' AND t.category = 'Lead Generation'
);

-- 091 | Lead Generation | tpl-ld-7 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'ROI Calculator — Capture',
       'Qualify roi calculator interest with budget routing.',
       'Lead Generation',
       false,
       '🎯',
       '[{"id":"tpl-ld-7-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-7-f2","type":"email","label":"Business Email","placeholder":"you@company.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-7-f3","type":"text","label":"Company Name","placeholder":"Acme Inc.","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-7-f4","type":"select","label":"Company Size","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-7-f4-opt1","label":"1-10","value":"1-10","isCorrect":false},{"id":"tpl-ld-7-f4-opt2","label":"11-50","value":"11-50","isCorrect":false},{"id":"tpl-ld-7-f4-opt3","label":"51-200","value":"51-200","isCorrect":false},{"id":"tpl-ld-7-f4-opt4","label":"201-1000","value":"201-1000","isCorrect":false},{"id":"tpl-ld-7-f4-opt5","label":"1000+","value":"1000-","isCorrect":false}]},{"id":"tpl-ld-7-f5","type":"radio","label":"What brings you here?","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-ld-7-r1","sourceFieldId":"tpl-ld-7-f5","operator":"equals","targetValue":"pricing","action":"show","targetFieldId":"tpl-ld-7-f6"}],"options":[{"id":"tpl-ld-7-f5-opt1","label":"Pricing","value":"pricing","isCorrect":false},{"id":"tpl-ld-7-f5-opt2","label":"Live demo","value":"live-demo","isCorrect":false},{"id":"tpl-ld-7-f5-opt3","label":"Free trial","value":"free-trial","isCorrect":false},{"id":"tpl-ld-7-f5-opt4","label":"Just researching","value":"just-researching","isCorrect":false}]},{"id":"tpl-ld-7-f6","type":"select","label":"Monthly budget range","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-7-f6-opt1","label":"Under $500","value":"under-500","isCorrect":false},{"id":"tpl-ld-7-f6-opt2","label":"$500-$2k","value":"-500-2k","isCorrect":false},{"id":"tpl-ld-7-f6-opt3","label":"$2k-$10k","value":"-2k-10k","isCorrect":false},{"id":"tpl-ld-7-f6-opt4","label":"$10k+","value":"-10k-","isCorrect":false}]},{"id":"tpl-ld-7-f7","type":"textarea","label":"What problem are you solving?","required":false,"order":7,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'ROI Calculator — Capture' AND t.category = 'Lead Generation'
);

-- 092 | Lead Generation | tpl-ld-8 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Newsletter Signup',
       'Low-friction newsletter signup with role context.',
       'Lead Generation',
       false,
       '🚀',
       '[{"id":"tpl-ld-8-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-8-f2","type":"email","label":"Work Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-8-f3","type":"select","label":"Your Role","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-ld-8-r1","sourceFieldId":"tpl-ld-8-f3","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-ld-8-f4"}],"options":[{"id":"tpl-ld-8-f3-opt1","label":"Founder","value":"founder","isCorrect":false},{"id":"tpl-ld-8-f3-opt2","label":"Marketer","value":"marketer","isCorrect":false},{"id":"tpl-ld-8-f3-opt3","label":"Engineer","value":"engineer","isCorrect":false},{"id":"tpl-ld-8-f3-opt4","label":"Operations","value":"operations","isCorrect":false},{"id":"tpl-ld-8-f3-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-ld-8-f4","type":"text","label":"Tell us your role","placeholder":"e.g. Growth lead","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-ld-8-f5","type":"checkbox","label":"I want updates about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-8-f5-opt1","label":"New features","value":"new-features","isCorrect":false},{"id":"tpl-ld-8-f5-opt2","label":"Webinars","value":"webinars","isCorrect":false},{"id":"tpl-ld-8-f5-opt3","label":"Case studies","value":"case-studies","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Newsletter Signup' AND t.category = 'Lead Generation'
);

-- 093 | Lead Generation | tpl-ld-9 | 4 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Partner Program Express',
       'Three-field partner program express capture with consent.',
       'Lead Generation',
       false,
       '⚡',
       '[{"id":"tpl-ld-9-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-9-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-9-f3","type":"phone","label":"Phone (for faster response)","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-9-f4","type":"terms","label":"I agree to be contacted about this inquiry","required":true,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Partner Program Express' AND t.category = 'Lead Generation'
);

-- 094 | Lead Generation | tpl-ld-10 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Affiliate Signup — Capture',
       'Qualify affiliate signup interest with budget routing.',
       'Lead Generation',
       false,
       '🎯',
       '[{"id":"tpl-ld-10-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-10-f2","type":"email","label":"Business Email","placeholder":"you@company.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-10-f3","type":"text","label":"Company Name","placeholder":"Acme Inc.","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-10-f4","type":"select","label":"Company Size","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-10-f4-opt1","label":"1-10","value":"1-10","isCorrect":false},{"id":"tpl-ld-10-f4-opt2","label":"11-50","value":"11-50","isCorrect":false},{"id":"tpl-ld-10-f4-opt3","label":"51-200","value":"51-200","isCorrect":false},{"id":"tpl-ld-10-f4-opt4","label":"201-1000","value":"201-1000","isCorrect":false},{"id":"tpl-ld-10-f4-opt5","label":"1000+","value":"1000-","isCorrect":false}]},{"id":"tpl-ld-10-f5","type":"radio","label":"What brings you here?","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-ld-10-r1","sourceFieldId":"tpl-ld-10-f5","operator":"equals","targetValue":"pricing","action":"show","targetFieldId":"tpl-ld-10-f6"}],"options":[{"id":"tpl-ld-10-f5-opt1","label":"Pricing","value":"pricing","isCorrect":false},{"id":"tpl-ld-10-f5-opt2","label":"Live demo","value":"live-demo","isCorrect":false},{"id":"tpl-ld-10-f5-opt3","label":"Free trial","value":"free-trial","isCorrect":false},{"id":"tpl-ld-10-f5-opt4","label":"Just researching","value":"just-researching","isCorrect":false}]},{"id":"tpl-ld-10-f6","type":"select","label":"Monthly budget range","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-10-f6-opt1","label":"Under $500","value":"under-500","isCorrect":false},{"id":"tpl-ld-10-f6-opt2","label":"$500-$2k","value":"-500-2k","isCorrect":false},{"id":"tpl-ld-10-f6-opt3","label":"$2k-$10k","value":"-2k-10k","isCorrect":false},{"id":"tpl-ld-10-f6-opt4","label":"$10k+","value":"-10k-","isCorrect":false}]},{"id":"tpl-ld-10-f7","type":"textarea","label":"What problem are you solving?","required":false,"order":7,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Affiliate Signup — Capture' AND t.category = 'Lead Generation'
);

-- 095 | Lead Generation | tpl-ld-11 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Beta Access Signup',
       'Low-friction beta access signup with role context.',
       'Lead Generation',
       false,
       '🚀',
       '[{"id":"tpl-ld-11-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-11-f2","type":"email","label":"Work Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-11-f3","type":"select","label":"Your Role","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-ld-11-r1","sourceFieldId":"tpl-ld-11-f3","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-ld-11-f4"}],"options":[{"id":"tpl-ld-11-f3-opt1","label":"Founder","value":"founder","isCorrect":false},{"id":"tpl-ld-11-f3-opt2","label":"Marketer","value":"marketer","isCorrect":false},{"id":"tpl-ld-11-f3-opt3","label":"Engineer","value":"engineer","isCorrect":false},{"id":"tpl-ld-11-f3-opt4","label":"Operations","value":"operations","isCorrect":false},{"id":"tpl-ld-11-f3-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-ld-11-f4","type":"text","label":"Tell us your role","placeholder":"e.g. Growth lead","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-ld-11-f5","type":"checkbox","label":"I want updates about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-11-f5-opt1","label":"New features","value":"new-features","isCorrect":false},{"id":"tpl-ld-11-f5-opt2","label":"Webinars","value":"webinars","isCorrect":false},{"id":"tpl-ld-11-f5-opt3","label":"Case studies","value":"case-studies","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Beta Access Signup' AND t.category = 'Lead Generation'
);

-- 096 | Lead Generation | tpl-ld-12 | 4 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Audit Request Express',
       'Three-field audit request express capture with consent.',
       'Lead Generation',
       false,
       '⚡',
       '[{"id":"tpl-ld-12-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-12-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-12-f3","type":"phone","label":"Phone (for faster response)","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-12-f4","type":"terms","label":"I agree to be contacted about this inquiry","required":true,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Audit Request Express' AND t.category = 'Lead Generation'
);

-- 097 | Lead Generation | tpl-ld-13 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Migration Assessment — Capture',
       'Qualify migration assessment interest with budget routing.',
       'Lead Generation',
       false,
       '🎯',
       '[{"id":"tpl-ld-13-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-13-f2","type":"email","label":"Business Email","placeholder":"you@company.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-13-f3","type":"text","label":"Company Name","placeholder":"Acme Inc.","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-13-f4","type":"select","label":"Company Size","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-13-f4-opt1","label":"1-10","value":"1-10","isCorrect":false},{"id":"tpl-ld-13-f4-opt2","label":"11-50","value":"11-50","isCorrect":false},{"id":"tpl-ld-13-f4-opt3","label":"51-200","value":"51-200","isCorrect":false},{"id":"tpl-ld-13-f4-opt4","label":"201-1000","value":"201-1000","isCorrect":false},{"id":"tpl-ld-13-f4-opt5","label":"1000+","value":"1000-","isCorrect":false}]},{"id":"tpl-ld-13-f5","type":"radio","label":"What brings you here?","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-ld-13-r1","sourceFieldId":"tpl-ld-13-f5","operator":"equals","targetValue":"pricing","action":"show","targetFieldId":"tpl-ld-13-f6"}],"options":[{"id":"tpl-ld-13-f5-opt1","label":"Pricing","value":"pricing","isCorrect":false},{"id":"tpl-ld-13-f5-opt2","label":"Live demo","value":"live-demo","isCorrect":false},{"id":"tpl-ld-13-f5-opt3","label":"Free trial","value":"free-trial","isCorrect":false},{"id":"tpl-ld-13-f5-opt4","label":"Just researching","value":"just-researching","isCorrect":false}]},{"id":"tpl-ld-13-f6","type":"select","label":"Monthly budget range","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-13-f6-opt1","label":"Under $500","value":"under-500","isCorrect":false},{"id":"tpl-ld-13-f6-opt2","label":"$500-$2k","value":"-500-2k","isCorrect":false},{"id":"tpl-ld-13-f6-opt3","label":"$2k-$10k","value":"-2k-10k","isCorrect":false},{"id":"tpl-ld-13-f6-opt4","label":"$10k+","value":"-10k-","isCorrect":false}]},{"id":"tpl-ld-13-f7","type":"textarea","label":"What problem are you solving?","required":false,"order":7,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Migration Assessment — Capture' AND t.category = 'Lead Generation'
);

-- 098 | Lead Generation | tpl-ld-14 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Security Review Signup',
       'Low-friction security review signup with role context.',
       'Lead Generation',
       false,
       '🚀',
       '[{"id":"tpl-ld-14-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-14-f2","type":"email","label":"Work Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-14-f3","type":"select","label":"Your Role","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-ld-14-r1","sourceFieldId":"tpl-ld-14-f3","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-ld-14-f4"}],"options":[{"id":"tpl-ld-14-f3-opt1","label":"Founder","value":"founder","isCorrect":false},{"id":"tpl-ld-14-f3-opt2","label":"Marketer","value":"marketer","isCorrect":false},{"id":"tpl-ld-14-f3-opt3","label":"Engineer","value":"engineer","isCorrect":false},{"id":"tpl-ld-14-f3-opt4","label":"Operations","value":"operations","isCorrect":false},{"id":"tpl-ld-14-f3-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-ld-14-f4","type":"text","label":"Tell us your role","placeholder":"e.g. Growth lead","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-ld-14-f5","type":"checkbox","label":"I want updates about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-14-f5-opt1","label":"New features","value":"new-features","isCorrect":false},{"id":"tpl-ld-14-f5-opt2","label":"Webinars","value":"webinars","isCorrect":false},{"id":"tpl-ld-14-f5-opt3","label":"Case studies","value":"case-studies","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Security Review Signup' AND t.category = 'Lead Generation'
);

-- 099 | Lead Generation | tpl-ld-15 | 4 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Training Inquiry Express',
       'Three-field training inquiry express capture with consent.',
       'Lead Generation',
       false,
       '⚡',
       '[{"id":"tpl-ld-15-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-15-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-15-f3","type":"phone","label":"Phone (for faster response)","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-15-f4","type":"terms","label":"I agree to be contacted about this inquiry","required":true,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Training Inquiry Express' AND t.category = 'Lead Generation'
);

-- 100 | Lead Generation | tpl-ld-16 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Support Plan — Capture',
       'Qualify support plan interest with budget routing.',
       'Lead Generation',
       false,
       '🎯',
       '[{"id":"tpl-ld-16-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-16-f2","type":"email","label":"Business Email","placeholder":"you@company.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-16-f3","type":"text","label":"Company Name","placeholder":"Acme Inc.","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-16-f4","type":"select","label":"Company Size","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-16-f4-opt1","label":"1-10","value":"1-10","isCorrect":false},{"id":"tpl-ld-16-f4-opt2","label":"11-50","value":"11-50","isCorrect":false},{"id":"tpl-ld-16-f4-opt3","label":"51-200","value":"51-200","isCorrect":false},{"id":"tpl-ld-16-f4-opt4","label":"201-1000","value":"201-1000","isCorrect":false},{"id":"tpl-ld-16-f4-opt5","label":"1000+","value":"1000-","isCorrect":false}]},{"id":"tpl-ld-16-f5","type":"radio","label":"What brings you here?","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-ld-16-r1","sourceFieldId":"tpl-ld-16-f5","operator":"equals","targetValue":"pricing","action":"show","targetFieldId":"tpl-ld-16-f6"}],"options":[{"id":"tpl-ld-16-f5-opt1","label":"Pricing","value":"pricing","isCorrect":false},{"id":"tpl-ld-16-f5-opt2","label":"Live demo","value":"live-demo","isCorrect":false},{"id":"tpl-ld-16-f5-opt3","label":"Free trial","value":"free-trial","isCorrect":false},{"id":"tpl-ld-16-f5-opt4","label":"Just researching","value":"just-researching","isCorrect":false}]},{"id":"tpl-ld-16-f6","type":"select","label":"Monthly budget range","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-16-f6-opt1","label":"Under $500","value":"under-500","isCorrect":false},{"id":"tpl-ld-16-f6-opt2","label":"$500-$2k","value":"-500-2k","isCorrect":false},{"id":"tpl-ld-16-f6-opt3","label":"$2k-$10k","value":"-2k-10k","isCorrect":false},{"id":"tpl-ld-16-f6-opt4","label":"$10k+","value":"-10k-","isCorrect":false}]},{"id":"tpl-ld-16-f7","type":"textarea","label":"What problem are you solving?","required":false,"order":7,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Support Plan — Capture' AND t.category = 'Lead Generation'
);

-- 101 | Lead Generation | tpl-ld-17 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Enterprise Contact Signup',
       'Low-friction enterprise contact signup with role context.',
       'Lead Generation',
       false,
       '🚀',
       '[{"id":"tpl-ld-17-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-17-f2","type":"email","label":"Work Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-17-f3","type":"select","label":"Your Role","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-ld-17-r1","sourceFieldId":"tpl-ld-17-f3","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-ld-17-f4"}],"options":[{"id":"tpl-ld-17-f3-opt1","label":"Founder","value":"founder","isCorrect":false},{"id":"tpl-ld-17-f3-opt2","label":"Marketer","value":"marketer","isCorrect":false},{"id":"tpl-ld-17-f3-opt3","label":"Engineer","value":"engineer","isCorrect":false},{"id":"tpl-ld-17-f3-opt4","label":"Operations","value":"operations","isCorrect":false},{"id":"tpl-ld-17-f3-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-ld-17-f4","type":"text","label":"Tell us your role","placeholder":"e.g. Growth lead","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-ld-17-f5","type":"checkbox","label":"I want updates about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-17-f5-opt1","label":"New features","value":"new-features","isCorrect":false},{"id":"tpl-ld-17-f5-opt2","label":"Webinars","value":"webinars","isCorrect":false},{"id":"tpl-ld-17-f5-opt3","label":"Case studies","value":"case-studies","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Enterprise Contact Signup' AND t.category = 'Lead Generation'
);

-- 102 | Lead Generation | tpl-ld-18 | 4 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Startup Program Express',
       'Three-field startup program express capture with consent.',
       'Lead Generation',
       false,
       '⚡',
       '[{"id":"tpl-ld-18-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-18-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-18-f3","type":"phone","label":"Phone (for faster response)","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-18-f4","type":"terms","label":"I agree to be contacted about this inquiry","required":true,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Startup Program Express' AND t.category = 'Lead Generation'
);

-- 103 | Lead Generation | tpl-ld-19 | 7 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Nonprofit Discount — Capture',
       'Qualify nonprofit discount interest with budget routing.',
       'Lead Generation',
       false,
       '🎯',
       '[{"id":"tpl-ld-19-f1","type":"text","label":"Full Name","placeholder":"Your name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-19-f2","type":"email","label":"Business Email","placeholder":"you@company.com","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-19-f3","type":"text","label":"Company Name","placeholder":"Acme Inc.","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-19-f4","type":"select","label":"Company Size","required":true,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-19-f4-opt1","label":"1-10","value":"1-10","isCorrect":false},{"id":"tpl-ld-19-f4-opt2","label":"11-50","value":"11-50","isCorrect":false},{"id":"tpl-ld-19-f4-opt3","label":"51-200","value":"51-200","isCorrect":false},{"id":"tpl-ld-19-f4-opt4","label":"201-1000","value":"201-1000","isCorrect":false},{"id":"tpl-ld-19-f4-opt5","label":"1000+","value":"1000-","isCorrect":false}]},{"id":"tpl-ld-19-f5","type":"radio","label":"What brings you here?","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-ld-19-r1","sourceFieldId":"tpl-ld-19-f5","operator":"equals","targetValue":"pricing","action":"show","targetFieldId":"tpl-ld-19-f6"}],"options":[{"id":"tpl-ld-19-f5-opt1","label":"Pricing","value":"pricing","isCorrect":false},{"id":"tpl-ld-19-f5-opt2","label":"Live demo","value":"live-demo","isCorrect":false},{"id":"tpl-ld-19-f5-opt3","label":"Free trial","value":"free-trial","isCorrect":false},{"id":"tpl-ld-19-f5-opt4","label":"Just researching","value":"just-researching","isCorrect":false}]},{"id":"tpl-ld-19-f6","type":"select","label":"Monthly budget range","required":false,"order":6,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-19-f6-opt1","label":"Under $500","value":"under-500","isCorrect":false},{"id":"tpl-ld-19-f6-opt2","label":"$500-$2k","value":"-500-2k","isCorrect":false},{"id":"tpl-ld-19-f6-opt3","label":"$2k-$10k","value":"-2k-10k","isCorrect":false},{"id":"tpl-ld-19-f6-opt4","label":"$10k+","value":"-10k-","isCorrect":false}]},{"id":"tpl-ld-19-f7","type":"textarea","label":"What problem are you solving?","required":false,"order":7,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Nonprofit Discount — Capture' AND t.category = 'Lead Generation'
);

-- 104 | Lead Generation | tpl-ld-20 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Referral Signup Signup',
       'Low-friction referral signup signup with role context.',
       'Lead Generation',
       false,
       '🚀',
       '[{"id":"tpl-ld-20-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-20-f2","type":"email","label":"Work Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-20-f3","type":"select","label":"Your Role","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-ld-20-r1","sourceFieldId":"tpl-ld-20-f3","operator":"equals","targetValue":"other","action":"show","targetFieldId":"tpl-ld-20-f4"}],"options":[{"id":"tpl-ld-20-f3-opt1","label":"Founder","value":"founder","isCorrect":false},{"id":"tpl-ld-20-f3-opt2","label":"Marketer","value":"marketer","isCorrect":false},{"id":"tpl-ld-20-f3-opt3","label":"Engineer","value":"engineer","isCorrect":false},{"id":"tpl-ld-20-f3-opt4","label":"Operations","value":"operations","isCorrect":false},{"id":"tpl-ld-20-f3-opt5","label":"Other","value":"other","isCorrect":false}]},{"id":"tpl-ld-20-f4","type":"text","label":"Tell us your role","placeholder":"e.g. Growth lead","required":false,"order":4,"page":1,"logicRules":[]},{"id":"tpl-ld-20-f5","type":"checkbox","label":"I want updates about","required":false,"order":5,"page":1,"logicRules":[],"options":[{"id":"tpl-ld-20-f5-opt1","label":"New features","value":"new-features","isCorrect":false},{"id":"tpl-ld-20-f5-opt2","label":"Webinars","value":"webinars","isCorrect":false},{"id":"tpl-ld-20-f5-opt3","label":"Case studies","value":"case-studies","isCorrect":false}]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Referral Signup Signup' AND t.category = 'Lead Generation'
);

-- 105 | Lead Generation | tpl-ld-21 | 4 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Comparison Guide Express',
       'Three-field comparison guide express capture with consent.',
       'Lead Generation',
       false,
       '⚡',
       '[{"id":"tpl-ld-21-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ld-21-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ld-21-f3","type":"phone","label":"Phone (for faster response)","required":false,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ld-21-f4","type":"terms","label":"I agree to be contacted about this inquiry","required":true,"order":4,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Comparison Guide Express' AND t.category = 'Lead Generation'
);

-- 106 | Application | tpl-ap-1 | 8 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Job Application',
       'Structured job application with screening, files and senior-track routing.',
       'Application',
       false,
       '📋',
       '[{"id":"tpl-ap-1-f1","type":"text","label":"Full Name","placeholder":"Jane Smith","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-1-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-1-f3","type":"phone","label":"Phone","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-1-f4","type":"select","label":"Years of Experience","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-1-r1","sourceFieldId":"tpl-ap-1-f4","operator":"equals","targetValue":"8+-years","action":"show","targetFieldId":"tpl-ap-1-f5"}],"options":[{"id":"tpl-ap-1-f4-opt1","label":"0-1 years","value":"0-1-years","isCorrect":false},{"id":"tpl-ap-1-f4-opt2","label":"2-4 years","value":"2-4-years","isCorrect":false},{"id":"tpl-ap-1-f4-opt3","label":"5-8 years","value":"5-8-years","isCorrect":false},{"id":"tpl-ap-1-f4-opt4","label":"8+ years","value":"8-years","isCorrect":false}]},{"id":"tpl-ap-1-f5","type":"number","label":"Expected compensation (annual)","placeholder":"e.g. 80000","required":false,"order":5,"page":1,"logicRules":[],"min":0},{"id":"tpl-ap-1-f6","type":"file","label":"Upload Resume (PDF)","required":true,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx","maxFileSizeMb":5},{"id":"tpl-ap-1-f7","type":"url","label":"Portfolio / LinkedIn URL","placeholder":"https://...","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-ap-1-f8","type":"textarea","label":"Why are you a great fit?","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Job Application' AND t.category = 'Application'
);

-- 107 | Application | tpl-ap-2 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Internship',
       'Essay-based internship with academic context.',
       'Application',
       false,
       '🎓',
       '[{"id":"tpl-ap-2-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-2-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-2-f3","type":"text","label":"School / Organization","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-2-f4","type":"number","label":"GPA (0-4 scale)","required":false,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-2-r1","sourceFieldId":"tpl-ap-2-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-ap-2-f6"}],"min":0,"max":4,"step":0.1},{"id":"tpl-ap-2-f5","type":"textarea","label":"Personal statement (300 words)","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-2-f6","type":"file","label":"Supporting documents","required":false,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx"}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Internship' AND t.category = 'Application'
);

-- 108 | Application | tpl-ap-3 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Scholarship',
       'Logistics-aware scholarship with dates and details.',
       'Application',
       false,
       '📝',
       '[{"id":"tpl-ap-3-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-3-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-3-f3","type":"date","label":"Preferred start date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-3-f4","type":"radio","label":"Do you need special arrangements?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-3-r1","sourceFieldId":"tpl-ap-3-f4","operator":"equals","targetValue":"yes","action":"show","targetFieldId":"tpl-ap-3-f5"}],"options":[{"id":"tpl-ap-3-f4-opt1","label":"Yes","value":"yes","isCorrect":false},{"id":"tpl-ap-3-f4-opt2","label":"No","value":"no","isCorrect":false}]},{"id":"tpl-ap-3-f5","type":"textarea","label":"Arrangement details","placeholder":"Tell us what you need...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-3-f6","type":"terms","label":"I confirm the details above are accurate","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Scholarship' AND t.category = 'Application'
);

-- 109 | Application | tpl-ap-4 | 8 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'University Admission',
       'Structured university admission with screening, files and senior-track routing.',
       'Application',
       false,
       '📋',
       '[{"id":"tpl-ap-4-f1","type":"text","label":"Full Name","placeholder":"Jane Smith","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-4-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-4-f3","type":"phone","label":"Phone","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-4-f4","type":"select","label":"Years of Experience","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-4-r1","sourceFieldId":"tpl-ap-4-f4","operator":"equals","targetValue":"8+-years","action":"show","targetFieldId":"tpl-ap-4-f5"}],"options":[{"id":"tpl-ap-4-f4-opt1","label":"0-1 years","value":"0-1-years","isCorrect":false},{"id":"tpl-ap-4-f4-opt2","label":"2-4 years","value":"2-4-years","isCorrect":false},{"id":"tpl-ap-4-f4-opt3","label":"5-8 years","value":"5-8-years","isCorrect":false},{"id":"tpl-ap-4-f4-opt4","label":"8+ years","value":"8-years","isCorrect":false}]},{"id":"tpl-ap-4-f5","type":"number","label":"Expected compensation (annual)","placeholder":"e.g. 80000","required":false,"order":5,"page":1,"logicRules":[],"min":0},{"id":"tpl-ap-4-f6","type":"file","label":"Upload Resume (PDF)","required":true,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx","maxFileSizeMb":5},{"id":"tpl-ap-4-f7","type":"url","label":"Portfolio / LinkedIn URL","placeholder":"https://...","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-ap-4-f8","type":"textarea","label":"Why are you a great fit?","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'University Admission' AND t.category = 'Application'
);

-- 110 | Application | tpl-ap-5 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Personal Loan',
       'Essay-based personal loan with academic context.',
       'Application',
       false,
       '🎓',
       '[{"id":"tpl-ap-5-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-5-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-5-f3","type":"text","label":"School / Organization","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-5-f4","type":"number","label":"GPA (0-4 scale)","required":false,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-5-r1","sourceFieldId":"tpl-ap-5-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-ap-5-f6"}],"min":0,"max":4,"step":0.1},{"id":"tpl-ap-5-f5","type":"textarea","label":"Personal statement (300 words)","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-5-f6","type":"file","label":"Supporting documents","required":false,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx"}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Personal Loan' AND t.category = 'Application'
);

-- 111 | Application | tpl-ap-6 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Apartment Rental',
       'Logistics-aware apartment rental with dates and details.',
       'Application',
       false,
       '📝',
       '[{"id":"tpl-ap-6-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-6-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-6-f3","type":"date","label":"Preferred start date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-6-f4","type":"radio","label":"Do you need special arrangements?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-6-r1","sourceFieldId":"tpl-ap-6-f4","operator":"equals","targetValue":"yes","action":"show","targetFieldId":"tpl-ap-6-f5"}],"options":[{"id":"tpl-ap-6-f4-opt1","label":"Yes","value":"yes","isCorrect":false},{"id":"tpl-ap-6-f4-opt2","label":"No","value":"no","isCorrect":false}]},{"id":"tpl-ap-6-f5","type":"textarea","label":"Arrangement details","placeholder":"Tell us what you need...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-6-f6","type":"terms","label":"I confirm the details above are accurate","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Apartment Rental' AND t.category = 'Application'
);

-- 112 | Application | tpl-ap-7 | 8 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Volunteer Role',
       'Structured volunteer role with screening, files and senior-track routing.',
       'Application',
       false,
       '📋',
       '[{"id":"tpl-ap-7-f1","type":"text","label":"Full Name","placeholder":"Jane Smith","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-7-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-7-f3","type":"phone","label":"Phone","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-7-f4","type":"select","label":"Years of Experience","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-7-r1","sourceFieldId":"tpl-ap-7-f4","operator":"equals","targetValue":"8+-years","action":"show","targetFieldId":"tpl-ap-7-f5"}],"options":[{"id":"tpl-ap-7-f4-opt1","label":"0-1 years","value":"0-1-years","isCorrect":false},{"id":"tpl-ap-7-f4-opt2","label":"2-4 years","value":"2-4-years","isCorrect":false},{"id":"tpl-ap-7-f4-opt3","label":"5-8 years","value":"5-8-years","isCorrect":false},{"id":"tpl-ap-7-f4-opt4","label":"8+ years","value":"8-years","isCorrect":false}]},{"id":"tpl-ap-7-f5","type":"number","label":"Expected compensation (annual)","placeholder":"e.g. 80000","required":false,"order":5,"page":1,"logicRules":[],"min":0},{"id":"tpl-ap-7-f6","type":"file","label":"Upload Resume (PDF)","required":true,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx","maxFileSizeMb":5},{"id":"tpl-ap-7-f7","type":"url","label":"Portfolio / LinkedIn URL","placeholder":"https://...","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-ap-7-f8","type":"textarea","label":"Why are you a great fit?","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Volunteer Role' AND t.category = 'Application'
);

-- 113 | Application | tpl-ap-8 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Grant Proposal',
       'Essay-based grant proposal with academic context.',
       'Application',
       false,
       '🎓',
       '[{"id":"tpl-ap-8-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-8-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-8-f3","type":"text","label":"School / Organization","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-8-f4","type":"number","label":"GPA (0-4 scale)","required":false,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-8-r1","sourceFieldId":"tpl-ap-8-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-ap-8-f6"}],"min":0,"max":4,"step":0.1},{"id":"tpl-ap-8-f5","type":"textarea","label":"Personal statement (300 words)","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-8-f6","type":"file","label":"Supporting documents","required":false,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx"}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Grant Proposal' AND t.category = 'Application'
);

-- 114 | Application | tpl-ap-9 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Fellowship',
       'Logistics-aware fellowship with dates and details.',
       'Application',
       false,
       '📝',
       '[{"id":"tpl-ap-9-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-9-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-9-f3","type":"date","label":"Preferred start date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-9-f4","type":"radio","label":"Do you need special arrangements?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-9-r1","sourceFieldId":"tpl-ap-9-f4","operator":"equals","targetValue":"yes","action":"show","targetFieldId":"tpl-ap-9-f5"}],"options":[{"id":"tpl-ap-9-f4-opt1","label":"Yes","value":"yes","isCorrect":false},{"id":"tpl-ap-9-f4-opt2","label":"No","value":"no","isCorrect":false}]},{"id":"tpl-ap-9-f5","type":"textarea","label":"Arrangement details","placeholder":"Tell us what you need...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-9-f6","type":"terms","label":"I confirm the details above are accurate","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Fellowship' AND t.category = 'Application'
);

-- 115 | Application | tpl-ap-10 | 8 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Accelerator',
       'Structured accelerator with screening, files and senior-track routing.',
       'Application',
       false,
       '📋',
       '[{"id":"tpl-ap-10-f1","type":"text","label":"Full Name","placeholder":"Jane Smith","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-10-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-10-f3","type":"phone","label":"Phone","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-10-f4","type":"select","label":"Years of Experience","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-10-r1","sourceFieldId":"tpl-ap-10-f4","operator":"equals","targetValue":"8+-years","action":"show","targetFieldId":"tpl-ap-10-f5"}],"options":[{"id":"tpl-ap-10-f4-opt1","label":"0-1 years","value":"0-1-years","isCorrect":false},{"id":"tpl-ap-10-f4-opt2","label":"2-4 years","value":"2-4-years","isCorrect":false},{"id":"tpl-ap-10-f4-opt3","label":"5-8 years","value":"5-8-years","isCorrect":false},{"id":"tpl-ap-10-f4-opt4","label":"8+ years","value":"8-years","isCorrect":false}]},{"id":"tpl-ap-10-f5","type":"number","label":"Expected compensation (annual)","placeholder":"e.g. 80000","required":false,"order":5,"page":1,"logicRules":[],"min":0},{"id":"tpl-ap-10-f6","type":"file","label":"Upload Resume (PDF)","required":true,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx","maxFileSizeMb":5},{"id":"tpl-ap-10-f7","type":"url","label":"Portfolio / LinkedIn URL","placeholder":"https://...","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-ap-10-f8","type":"textarea","label":"Why are you a great fit?","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Accelerator' AND t.category = 'Application'
);

-- 116 | Application | tpl-ap-11 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Mentorship',
       'Essay-based mentorship with academic context.',
       'Application',
       false,
       '🎓',
       '[{"id":"tpl-ap-11-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-11-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-11-f3","type":"text","label":"School / Organization","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-11-f4","type":"number","label":"GPA (0-4 scale)","required":false,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-11-r1","sourceFieldId":"tpl-ap-11-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-ap-11-f6"}],"min":0,"max":4,"step":0.1},{"id":"tpl-ap-11-f5","type":"textarea","label":"Personal statement (300 words)","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-11-f6","type":"file","label":"Supporting documents","required":false,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx"}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Mentorship' AND t.category = 'Application'
);

-- 117 | Application | tpl-ap-12 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Freelance Gig',
       'Logistics-aware freelance gig with dates and details.',
       'Application',
       false,
       '📝',
       '[{"id":"tpl-ap-12-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-12-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-12-f3","type":"date","label":"Preferred start date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-12-f4","type":"radio","label":"Do you need special arrangements?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-12-r1","sourceFieldId":"tpl-ap-12-f4","operator":"equals","targetValue":"yes","action":"show","targetFieldId":"tpl-ap-12-f5"}],"options":[{"id":"tpl-ap-12-f4-opt1","label":"Yes","value":"yes","isCorrect":false},{"id":"tpl-ap-12-f4-opt2","label":"No","value":"no","isCorrect":false}]},{"id":"tpl-ap-12-f5","type":"textarea","label":"Arrangement details","placeholder":"Tell us what you need...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-12-f6","type":"terms","label":"I confirm the details above are accurate","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Freelance Gig' AND t.category = 'Application'
);

-- 118 | Application | tpl-ap-13 | 8 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Board Membership',
       'Structured board membership with screening, files and senior-track routing.',
       'Application',
       false,
       '📋',
       '[{"id":"tpl-ap-13-f1","type":"text","label":"Full Name","placeholder":"Jane Smith","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-13-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-13-f3","type":"phone","label":"Phone","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-13-f4","type":"select","label":"Years of Experience","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-13-r1","sourceFieldId":"tpl-ap-13-f4","operator":"equals","targetValue":"8+-years","action":"show","targetFieldId":"tpl-ap-13-f5"}],"options":[{"id":"tpl-ap-13-f4-opt1","label":"0-1 years","value":"0-1-years","isCorrect":false},{"id":"tpl-ap-13-f4-opt2","label":"2-4 years","value":"2-4-years","isCorrect":false},{"id":"tpl-ap-13-f4-opt3","label":"5-8 years","value":"5-8-years","isCorrect":false},{"id":"tpl-ap-13-f4-opt4","label":"8+ years","value":"8-years","isCorrect":false}]},{"id":"tpl-ap-13-f5","type":"number","label":"Expected compensation (annual)","placeholder":"e.g. 80000","required":false,"order":5,"page":1,"logicRules":[],"min":0},{"id":"tpl-ap-13-f6","type":"file","label":"Upload Resume (PDF)","required":true,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx","maxFileSizeMb":5},{"id":"tpl-ap-13-f7","type":"url","label":"Portfolio / LinkedIn URL","placeholder":"https://...","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-ap-13-f8","type":"textarea","label":"Why are you a great fit?","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Board Membership' AND t.category = 'Application'
);

-- 119 | Application | tpl-ap-14 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Pet Adoption',
       'Essay-based pet adoption with academic context.',
       'Application',
       false,
       '🎓',
       '[{"id":"tpl-ap-14-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-14-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-14-f3","type":"text","label":"School / Organization","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-14-f4","type":"number","label":"GPA (0-4 scale)","required":false,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-14-r1","sourceFieldId":"tpl-ap-14-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-ap-14-f6"}],"min":0,"max":4,"step":0.1},{"id":"tpl-ap-14-f5","type":"textarea","label":"Personal statement (300 words)","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-14-f6","type":"file","label":"Supporting documents","required":false,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx"}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Pet Adoption' AND t.category = 'Application'
);

-- 120 | Application | tpl-ap-15 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Vendor Registration',
       'Logistics-aware vendor registration with dates and details.',
       'Application',
       false,
       '📝',
       '[{"id":"tpl-ap-15-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-15-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-15-f3","type":"date","label":"Preferred start date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-15-f4","type":"radio","label":"Do you need special arrangements?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-15-r1","sourceFieldId":"tpl-ap-15-f4","operator":"equals","targetValue":"yes","action":"show","targetFieldId":"tpl-ap-15-f5"}],"options":[{"id":"tpl-ap-15-f4-opt1","label":"Yes","value":"yes","isCorrect":false},{"id":"tpl-ap-15-f4-opt2","label":"No","value":"no","isCorrect":false}]},{"id":"tpl-ap-15-f5","type":"textarea","label":"Arrangement details","placeholder":"Tell us what you need...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-15-f6","type":"terms","label":"I confirm the details above are accurate","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Vendor Registration' AND t.category = 'Application'
);

-- 121 | Application | tpl-ap-16 | 8 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Press Pass',
       'Structured press pass with screening, files and senior-track routing.',
       'Application',
       false,
       '📋',
       '[{"id":"tpl-ap-16-f1","type":"text","label":"Full Name","placeholder":"Jane Smith","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-16-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-16-f3","type":"phone","label":"Phone","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-16-f4","type":"select","label":"Years of Experience","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-16-r1","sourceFieldId":"tpl-ap-16-f4","operator":"equals","targetValue":"8+-years","action":"show","targetFieldId":"tpl-ap-16-f5"}],"options":[{"id":"tpl-ap-16-f4-opt1","label":"0-1 years","value":"0-1-years","isCorrect":false},{"id":"tpl-ap-16-f4-opt2","label":"2-4 years","value":"2-4-years","isCorrect":false},{"id":"tpl-ap-16-f4-opt3","label":"5-8 years","value":"5-8-years","isCorrect":false},{"id":"tpl-ap-16-f4-opt4","label":"8+ years","value":"8-years","isCorrect":false}]},{"id":"tpl-ap-16-f5","type":"number","label":"Expected compensation (annual)","placeholder":"e.g. 80000","required":false,"order":5,"page":1,"logicRules":[],"min":0},{"id":"tpl-ap-16-f6","type":"file","label":"Upload Resume (PDF)","required":true,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx","maxFileSizeMb":5},{"id":"tpl-ap-16-f7","type":"url","label":"Portfolio / LinkedIn URL","placeholder":"https://...","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-ap-16-f8","type":"textarea","label":"Why are you a great fit?","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Press Pass' AND t.category = 'Application'
);

-- 122 | Application | tpl-ap-17 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Research Grant',
       'Essay-based research grant with academic context.',
       'Application',
       false,
       '🎓',
       '[{"id":"tpl-ap-17-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-17-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-17-f3","type":"text","label":"School / Organization","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-17-f4","type":"number","label":"GPA (0-4 scale)","required":false,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-17-r1","sourceFieldId":"tpl-ap-17-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-ap-17-f6"}],"min":0,"max":4,"step":0.1},{"id":"tpl-ap-17-f5","type":"textarea","label":"Personal statement (300 words)","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-17-f6","type":"file","label":"Supporting documents","required":false,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx"}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Research Grant' AND t.category = 'Application'
);

-- 123 | Application | tpl-ap-18 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Art Residency',
       'Logistics-aware art residency with dates and details.',
       'Application',
       false,
       '📝',
       '[{"id":"tpl-ap-18-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-18-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-18-f3","type":"date","label":"Preferred start date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-18-f4","type":"radio","label":"Do you need special arrangements?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-18-r1","sourceFieldId":"tpl-ap-18-f4","operator":"equals","targetValue":"yes","action":"show","targetFieldId":"tpl-ap-18-f5"}],"options":[{"id":"tpl-ap-18-f4-opt1","label":"Yes","value":"yes","isCorrect":false},{"id":"tpl-ap-18-f4-opt2","label":"No","value":"no","isCorrect":false}]},{"id":"tpl-ap-18-f5","type":"textarea","label":"Arrangement details","placeholder":"Tell us what you need...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-18-f6","type":"terms","label":"I confirm the details above are accurate","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Art Residency' AND t.category = 'Application'
);

-- 124 | Application | tpl-ap-19 | 8 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Coaching Program',
       'Structured coaching program with screening, files and senior-track routing.',
       'Application',
       false,
       '📋',
       '[{"id":"tpl-ap-19-f1","type":"text","label":"Full Name","placeholder":"Jane Smith","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-19-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-19-f3","type":"phone","label":"Phone","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-19-f4","type":"select","label":"Years of Experience","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-19-r1","sourceFieldId":"tpl-ap-19-f4","operator":"equals","targetValue":"8+-years","action":"show","targetFieldId":"tpl-ap-19-f5"}],"options":[{"id":"tpl-ap-19-f4-opt1","label":"0-1 years","value":"0-1-years","isCorrect":false},{"id":"tpl-ap-19-f4-opt2","label":"2-4 years","value":"2-4-years","isCorrect":false},{"id":"tpl-ap-19-f4-opt3","label":"5-8 years","value":"5-8-years","isCorrect":false},{"id":"tpl-ap-19-f4-opt4","label":"8+ years","value":"8-years","isCorrect":false}]},{"id":"tpl-ap-19-f5","type":"number","label":"Expected compensation (annual)","placeholder":"e.g. 80000","required":false,"order":5,"page":1,"logicRules":[],"min":0},{"id":"tpl-ap-19-f6","type":"file","label":"Upload Resume (PDF)","required":true,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx","maxFileSizeMb":5},{"id":"tpl-ap-19-f7","type":"url","label":"Portfolio / LinkedIn URL","placeholder":"https://...","required":false,"order":7,"page":1,"logicRules":[]},{"id":"tpl-ap-19-f8","type":"textarea","label":"Why are you a great fit?","required":true,"order":8,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Coaching Program' AND t.category = 'Application'
);

-- 125 | Application | tpl-ap-20 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Visa Support',
       'Essay-based visa support with academic context.',
       'Application',
       false,
       '🎓',
       '[{"id":"tpl-ap-20-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-20-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-20-f3","type":"text","label":"School / Organization","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-20-f4","type":"number","label":"GPA (0-4 scale)","required":false,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-20-r1","sourceFieldId":"tpl-ap-20-f4","operator":"less_than","targetValue":"3","action":"show","targetFieldId":"tpl-ap-20-f6"}],"min":0,"max":4,"step":0.1},{"id":"tpl-ap-20-f5","type":"textarea","label":"Personal statement (300 words)","required":true,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-20-f6","type":"file","label":"Supporting documents","required":false,"order":6,"page":1,"logicRules":[],"acceptedFileTypes":".pdf,.doc,.docx"}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Visa Support' AND t.category = 'Application'
);

-- 126 | Application | tpl-ap-21 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Equipment Loan',
       'Logistics-aware equipment loan with dates and details.',
       'Application',
       false,
       '📝',
       '[{"id":"tpl-ap-21-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-ap-21-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-ap-21-f3","type":"date","label":"Preferred start date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-ap-21-f4","type":"radio","label":"Do you need special arrangements?","required":true,"order":4,"page":1,"logicRules":[{"id":"tpl-ap-21-r1","sourceFieldId":"tpl-ap-21-f4","operator":"equals","targetValue":"yes","action":"show","targetFieldId":"tpl-ap-21-f5"}],"options":[{"id":"tpl-ap-21-f4-opt1","label":"Yes","value":"yes","isCorrect":false},{"id":"tpl-ap-21-f4-opt2","label":"No","value":"no","isCorrect":false}]},{"id":"tpl-ap-21-f5","type":"textarea","label":"Arrangement details","placeholder":"Tell us what you need...","required":false,"order":5,"page":1,"logicRules":[]},{"id":"tpl-ap-21-f6","type":"terms","label":"I confirm the details above are accurate","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Equipment Loan' AND t.category = 'Application'
);

-- 127 | General | tpl-gn-1 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Contact Us',
       'Contact Us with topic routing and priority follow-up.',
       'General',
       false,
       '📨',
       '[{"id":"tpl-gn-1-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-1-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-1-f3","type":"select","label":"Topic","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-1-r1","sourceFieldId":"tpl-gn-1-f3","operator":"equals","targetValue":"support","action":"show","targetFieldId":"tpl-gn-1-f4"}],"options":[{"id":"tpl-gn-1-f3-opt1","label":"General question","value":"general-question","isCorrect":false},{"id":"tpl-gn-1-f3-opt2","label":"Support","value":"support","isCorrect":false},{"id":"tpl-gn-1-f3-opt3","label":"Sales","value":"sales","isCorrect":false},{"id":"tpl-gn-1-f3-opt4","label":"Press","value":"press","isCorrect":false}]},{"id":"tpl-gn-1-f4","type":"radio","label":"Priority","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-1-f4-opt1","label":"Low","value":"low","isCorrect":false},{"id":"tpl-gn-1-f4-opt2","label":"Normal","value":"normal","isCorrect":false},{"id":"tpl-gn-1-f4-opt3","label":"Urgent","value":"urgent","isCorrect":false}]},{"id":"tpl-gn-1-f5","type":"textarea","label":"Message","placeholder":"How can we help?","required":true,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Contact Us' AND t.category = 'General'
);

-- 128 | General | tpl-gn-2 | 3 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Quick Poll',
       'One-question quick poll poll with optional comment.',
       'General',
       false,
       '📊',
       '[{"id":"tpl-gn-2-f1","type":"radio","label":"Your take on quick poll?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-2-f1-opt1","label":"Love it","value":"love-it","isCorrect":false},{"id":"tpl-gn-2-f1-opt2","label":"It is fine","value":"it-is-fine","isCorrect":false},{"id":"tpl-gn-2-f1-opt3","label":"Needs work","value":"needs-work","isCorrect":false},{"id":"tpl-gn-2-f1-opt4","label":"No opinion","value":"no-opinion","isCorrect":false}]},{"id":"tpl-gn-2-f2","type":"textarea","label":"Add a comment (optional)","required":false,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-2-f3","type":"email","label":"Email for results (optional)","required":false,"order":3,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Quick Poll' AND t.category = 'General'
);

-- 129 | General | tpl-gn-3 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Table Booking',
       'Date-based table booking booking with party details.',
       'General',
       false,
       '📅',
       '[{"id":"tpl-gn-3-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-3-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-3-f3","type":"date","label":"Preferred date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-gn-3-f4","type":"time","label":"Preferred time","required":true,"order":4,"page":1,"logicRules":[]},{"id":"tpl-gn-3-f5","type":"number","label":"Number of guests","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-gn-3-r1","sourceFieldId":"tpl-gn-3-f5","operator":"greater_than","targetValue":"6","action":"show","targetFieldId":"tpl-gn-3-f6"}],"min":1,"max":20},{"id":"tpl-gn-3-f6","type":"textarea","label":"Special requests","required":false,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Table Booking' AND t.category = 'General'
);

-- 130 | General | tpl-gn-4 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Service Booking',
       'Order-style service booking with item, quantity and address.',
       'General',
       false,
       '🛒',
       '[{"id":"tpl-gn-4-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-4-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-4-f3","type":"select","label":"Item","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-4-r1","sourceFieldId":"tpl-gn-4-f3","operator":"equals","targetValue":"custom","action":"show","targetFieldId":"tpl-gn-4-f4"}],"options":[{"id":"tpl-gn-4-f3-opt1","label":"Standard","value":"standard","isCorrect":false},{"id":"tpl-gn-4-f3-opt2","label":"Premium","value":"premium","isCorrect":false},{"id":"tpl-gn-4-f3-opt3","label":"Deluxe","value":"deluxe","isCorrect":false},{"id":"tpl-gn-4-f3-opt4","label":"Custom","value":"custom","isCorrect":false}]},{"id":"tpl-gn-4-f4","type":"select","label":"Customization notes","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-4-f4-opt1","label":"Gift wrap","value":"gift-wrap","isCorrect":false},{"id":"tpl-gn-4-f4-opt2","label":"Express handling","value":"express-handling","isCorrect":false},{"id":"tpl-gn-4-f4-opt3","label":"None","value":"none","isCorrect":false}]},{"id":"tpl-gn-4-f5","type":"number","label":"Quantity","required":true,"order":5,"page":1,"logicRules":[],"min":1,"max":99},{"id":"tpl-gn-4-f6","type":"textarea","label":"Delivery address","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Service Booking' AND t.category = 'General'
);

-- 131 | General | tpl-gn-5 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Product Order',
       'Product Order with topic routing and priority follow-up.',
       'General',
       false,
       '📨',
       '[{"id":"tpl-gn-5-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-5-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-5-f3","type":"select","label":"Topic","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-5-r1","sourceFieldId":"tpl-gn-5-f3","operator":"equals","targetValue":"support","action":"show","targetFieldId":"tpl-gn-5-f4"}],"options":[{"id":"tpl-gn-5-f3-opt1","label":"General question","value":"general-question","isCorrect":false},{"id":"tpl-gn-5-f3-opt2","label":"Support","value":"support","isCorrect":false},{"id":"tpl-gn-5-f3-opt3","label":"Sales","value":"sales","isCorrect":false},{"id":"tpl-gn-5-f3-opt4","label":"Press","value":"press","isCorrect":false}]},{"id":"tpl-gn-5-f4","type":"radio","label":"Priority","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-5-f4-opt1","label":"Low","value":"low","isCorrect":false},{"id":"tpl-gn-5-f4-opt2","label":"Normal","value":"normal","isCorrect":false},{"id":"tpl-gn-5-f4-opt3","label":"Urgent","value":"urgent","isCorrect":false}]},{"id":"tpl-gn-5-f5","type":"textarea","label":"Message","placeholder":"How can we help?","required":true,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Product Order' AND t.category = 'General'
);

-- 132 | General | tpl-gn-6 | 3 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Event RSVP',
       'One-question event rsvp poll with optional comment.',
       'General',
       false,
       '📊',
       '[{"id":"tpl-gn-6-f1","type":"radio","label":"Your take on event rsvp?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-6-f1-opt1","label":"Love it","value":"love-it","isCorrect":false},{"id":"tpl-gn-6-f1-opt2","label":"It is fine","value":"it-is-fine","isCorrect":false},{"id":"tpl-gn-6-f1-opt3","label":"Needs work","value":"needs-work","isCorrect":false},{"id":"tpl-gn-6-f1-opt4","label":"No opinion","value":"no-opinion","isCorrect":false}]},{"id":"tpl-gn-6-f2","type":"textarea","label":"Add a comment (optional)","required":false,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-6-f3","type":"email","label":"Email for results (optional)","required":false,"order":3,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Event RSVP' AND t.category = 'General'
);

-- 133 | General | tpl-gn-7 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Appointment',
       'Date-based appointment booking with party details.',
       'General',
       false,
       '📅',
       '[{"id":"tpl-gn-7-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-7-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-7-f3","type":"date","label":"Preferred date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-gn-7-f4","type":"time","label":"Preferred time","required":true,"order":4,"page":1,"logicRules":[]},{"id":"tpl-gn-7-f5","type":"number","label":"Number of guests","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-gn-7-r1","sourceFieldId":"tpl-gn-7-f5","operator":"greater_than","targetValue":"6","action":"show","targetFieldId":"tpl-gn-7-f6"}],"min":1,"max":20},{"id":"tpl-gn-7-f6","type":"textarea","label":"Special requests","required":false,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Appointment' AND t.category = 'General'
);

-- 134 | General | tpl-gn-8 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Feedback Short',
       'Order-style feedback short with item, quantity and address.',
       'General',
       false,
       '🛒',
       '[{"id":"tpl-gn-8-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-8-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-8-f3","type":"select","label":"Item","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-8-r1","sourceFieldId":"tpl-gn-8-f3","operator":"equals","targetValue":"custom","action":"show","targetFieldId":"tpl-gn-8-f4"}],"options":[{"id":"tpl-gn-8-f3-opt1","label":"Standard","value":"standard","isCorrect":false},{"id":"tpl-gn-8-f3-opt2","label":"Premium","value":"premium","isCorrect":false},{"id":"tpl-gn-8-f3-opt3","label":"Deluxe","value":"deluxe","isCorrect":false},{"id":"tpl-gn-8-f3-opt4","label":"Custom","value":"custom","isCorrect":false}]},{"id":"tpl-gn-8-f4","type":"select","label":"Customization notes","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-8-f4-opt1","label":"Gift wrap","value":"gift-wrap","isCorrect":false},{"id":"tpl-gn-8-f4-opt2","label":"Express handling","value":"express-handling","isCorrect":false},{"id":"tpl-gn-8-f4-opt3","label":"None","value":"none","isCorrect":false}]},{"id":"tpl-gn-8-f5","type":"number","label":"Quantity","required":true,"order":5,"page":1,"logicRules":[],"min":1,"max":99},{"id":"tpl-gn-8-f6","type":"textarea","label":"Delivery address","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Feedback Short' AND t.category = 'General'
);

-- 135 | General | tpl-gn-9 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Complaint',
       'Complaint with topic routing and priority follow-up.',
       'General',
       false,
       '📨',
       '[{"id":"tpl-gn-9-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-9-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-9-f3","type":"select","label":"Topic","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-9-r1","sourceFieldId":"tpl-gn-9-f3","operator":"equals","targetValue":"support","action":"show","targetFieldId":"tpl-gn-9-f4"}],"options":[{"id":"tpl-gn-9-f3-opt1","label":"General question","value":"general-question","isCorrect":false},{"id":"tpl-gn-9-f3-opt2","label":"Support","value":"support","isCorrect":false},{"id":"tpl-gn-9-f3-opt3","label":"Sales","value":"sales","isCorrect":false},{"id":"tpl-gn-9-f3-opt4","label":"Press","value":"press","isCorrect":false}]},{"id":"tpl-gn-9-f4","type":"radio","label":"Priority","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-9-f4-opt1","label":"Low","value":"low","isCorrect":false},{"id":"tpl-gn-9-f4-opt2","label":"Normal","value":"normal","isCorrect":false},{"id":"tpl-gn-9-f4-opt3","label":"Urgent","value":"urgent","isCorrect":false}]},{"id":"tpl-gn-9-f5","type":"textarea","label":"Message","placeholder":"How can we help?","required":true,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Complaint' AND t.category = 'General'
);

-- 136 | General | tpl-gn-10 | 3 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Suggestion Box',
       'One-question suggestion box poll with optional comment.',
       'General',
       false,
       '📊',
       '[{"id":"tpl-gn-10-f1","type":"radio","label":"Your take on suggestion box?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-10-f1-opt1","label":"Love it","value":"love-it","isCorrect":false},{"id":"tpl-gn-10-f1-opt2","label":"It is fine","value":"it-is-fine","isCorrect":false},{"id":"tpl-gn-10-f1-opt3","label":"Needs work","value":"needs-work","isCorrect":false},{"id":"tpl-gn-10-f1-opt4","label":"No opinion","value":"no-opinion","isCorrect":false}]},{"id":"tpl-gn-10-f2","type":"textarea","label":"Add a comment (optional)","required":false,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-10-f3","type":"email","label":"Email for results (optional)","required":false,"order":3,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Suggestion Box' AND t.category = 'General'
);

-- 137 | General | tpl-gn-11 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Lost & Found',
       'Date-based lost & found booking with party details.',
       'General',
       false,
       '📅',
       '[{"id":"tpl-gn-11-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-11-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-11-f3","type":"date","label":"Preferred date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-gn-11-f4","type":"time","label":"Preferred time","required":true,"order":4,"page":1,"logicRules":[]},{"id":"tpl-gn-11-f5","type":"number","label":"Number of guests","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-gn-11-r1","sourceFieldId":"tpl-gn-11-f5","operator":"greater_than","targetValue":"6","action":"show","targetFieldId":"tpl-gn-11-f6"}],"min":1,"max":20},{"id":"tpl-gn-11-f6","type":"textarea","label":"Special requests","required":false,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Lost & Found' AND t.category = 'General'
);

-- 138 | General | tpl-gn-12 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Quote Request',
       'Order-style quote request with item, quantity and address.',
       'General',
       false,
       '🛒',
       '[{"id":"tpl-gn-12-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-12-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-12-f3","type":"select","label":"Item","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-12-r1","sourceFieldId":"tpl-gn-12-f3","operator":"equals","targetValue":"custom","action":"show","targetFieldId":"tpl-gn-12-f4"}],"options":[{"id":"tpl-gn-12-f3-opt1","label":"Standard","value":"standard","isCorrect":false},{"id":"tpl-gn-12-f3-opt2","label":"Premium","value":"premium","isCorrect":false},{"id":"tpl-gn-12-f3-opt3","label":"Deluxe","value":"deluxe","isCorrect":false},{"id":"tpl-gn-12-f3-opt4","label":"Custom","value":"custom","isCorrect":false}]},{"id":"tpl-gn-12-f4","type":"select","label":"Customization notes","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-12-f4-opt1","label":"Gift wrap","value":"gift-wrap","isCorrect":false},{"id":"tpl-gn-12-f4-opt2","label":"Express handling","value":"express-handling","isCorrect":false},{"id":"tpl-gn-12-f4-opt3","label":"None","value":"none","isCorrect":false}]},{"id":"tpl-gn-12-f5","type":"number","label":"Quantity","required":true,"order":5,"page":1,"logicRules":[],"min":1,"max":99},{"id":"tpl-gn-12-f6","type":"textarea","label":"Delivery address","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Quote Request' AND t.category = 'General'
);

-- 139 | General | tpl-gn-13 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Callback Request',
       'Callback Request with topic routing and priority follow-up.',
       'General',
       false,
       '📨',
       '[{"id":"tpl-gn-13-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-13-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-13-f3","type":"select","label":"Topic","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-13-r1","sourceFieldId":"tpl-gn-13-f3","operator":"equals","targetValue":"support","action":"show","targetFieldId":"tpl-gn-13-f4"}],"options":[{"id":"tpl-gn-13-f3-opt1","label":"General question","value":"general-question","isCorrect":false},{"id":"tpl-gn-13-f3-opt2","label":"Support","value":"support","isCorrect":false},{"id":"tpl-gn-13-f3-opt3","label":"Sales","value":"sales","isCorrect":false},{"id":"tpl-gn-13-f3-opt4","label":"Press","value":"press","isCorrect":false}]},{"id":"tpl-gn-13-f4","type":"radio","label":"Priority","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-13-f4-opt1","label":"Low","value":"low","isCorrect":false},{"id":"tpl-gn-13-f4-opt2","label":"Normal","value":"normal","isCorrect":false},{"id":"tpl-gn-13-f4-opt3","label":"Urgent","value":"urgent","isCorrect":false}]},{"id":"tpl-gn-13-f5","type":"textarea","label":"Message","placeholder":"How can we help?","required":true,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Callback Request' AND t.category = 'General'
);

-- 140 | General | tpl-gn-14 | 3 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Newsletter Signup',
       'One-question newsletter signup poll with optional comment.',
       'General',
       false,
       '📊',
       '[{"id":"tpl-gn-14-f1","type":"radio","label":"Your take on newsletter signup?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-14-f1-opt1","label":"Love it","value":"love-it","isCorrect":false},{"id":"tpl-gn-14-f1-opt2","label":"It is fine","value":"it-is-fine","isCorrect":false},{"id":"tpl-gn-14-f1-opt3","label":"Needs work","value":"needs-work","isCorrect":false},{"id":"tpl-gn-14-f1-opt4","label":"No opinion","value":"no-opinion","isCorrect":false}]},{"id":"tpl-gn-14-f2","type":"textarea","label":"Add a comment (optional)","required":false,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-14-f3","type":"email","label":"Email for results (optional)","required":false,"order":3,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Newsletter Signup' AND t.category = 'General'
);

-- 141 | General | tpl-gn-15 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Waitlist',
       'Date-based waitlist booking with party details.',
       'General',
       false,
       '📅',
       '[{"id":"tpl-gn-15-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-15-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-15-f3","type":"date","label":"Preferred date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-gn-15-f4","type":"time","label":"Preferred time","required":true,"order":4,"page":1,"logicRules":[]},{"id":"tpl-gn-15-f5","type":"number","label":"Number of guests","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-gn-15-r1","sourceFieldId":"tpl-gn-15-f5","operator":"greater_than","targetValue":"6","action":"show","targetFieldId":"tpl-gn-15-f6"}],"min":1,"max":20},{"id":"tpl-gn-15-f6","type":"textarea","label":"Special requests","required":false,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Waitlist' AND t.category = 'General'
);

-- 142 | General | tpl-gn-16 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Donation',
       'Order-style donation with item, quantity and address.',
       'General',
       false,
       '🛒',
       '[{"id":"tpl-gn-16-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-16-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-16-f3","type":"select","label":"Item","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-16-r1","sourceFieldId":"tpl-gn-16-f3","operator":"equals","targetValue":"custom","action":"show","targetFieldId":"tpl-gn-16-f4"}],"options":[{"id":"tpl-gn-16-f3-opt1","label":"Standard","value":"standard","isCorrect":false},{"id":"tpl-gn-16-f3-opt2","label":"Premium","value":"premium","isCorrect":false},{"id":"tpl-gn-16-f3-opt3","label":"Deluxe","value":"deluxe","isCorrect":false},{"id":"tpl-gn-16-f3-opt4","label":"Custom","value":"custom","isCorrect":false}]},{"id":"tpl-gn-16-f4","type":"select","label":"Customization notes","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-16-f4-opt1","label":"Gift wrap","value":"gift-wrap","isCorrect":false},{"id":"tpl-gn-16-f4-opt2","label":"Express handling","value":"express-handling","isCorrect":false},{"id":"tpl-gn-16-f4-opt3","label":"None","value":"none","isCorrect":false}]},{"id":"tpl-gn-16-f5","type":"number","label":"Quantity","required":true,"order":5,"page":1,"logicRules":[],"min":1,"max":99},{"id":"tpl-gn-16-f6","type":"textarea","label":"Delivery address","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Donation' AND t.category = 'General'
);

-- 143 | General | tpl-gn-17 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Test Drive',
       'Test Drive with topic routing and priority follow-up.',
       'General',
       false,
       '📨',
       '[{"id":"tpl-gn-17-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-17-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-17-f3","type":"select","label":"Topic","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-17-r1","sourceFieldId":"tpl-gn-17-f3","operator":"equals","targetValue":"support","action":"show","targetFieldId":"tpl-gn-17-f4"}],"options":[{"id":"tpl-gn-17-f3-opt1","label":"General question","value":"general-question","isCorrect":false},{"id":"tpl-gn-17-f3-opt2","label":"Support","value":"support","isCorrect":false},{"id":"tpl-gn-17-f3-opt3","label":"Sales","value":"sales","isCorrect":false},{"id":"tpl-gn-17-f3-opt4","label":"Press","value":"press","isCorrect":false}]},{"id":"tpl-gn-17-f4","type":"radio","label":"Priority","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-17-f4-opt1","label":"Low","value":"low","isCorrect":false},{"id":"tpl-gn-17-f4-opt2","label":"Normal","value":"normal","isCorrect":false},{"id":"tpl-gn-17-f4-opt3","label":"Urgent","value":"urgent","isCorrect":false}]},{"id":"tpl-gn-17-f5","type":"textarea","label":"Message","placeholder":"How can we help?","required":true,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Test Drive' AND t.category = 'General'
);

-- 144 | General | tpl-gn-18 | 3 fields | 0 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Site Visit',
       'One-question site visit poll with optional comment.',
       'General',
       false,
       '📊',
       '[{"id":"tpl-gn-18-f1","type":"radio","label":"Your take on site visit?","required":true,"order":1,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-18-f1-opt1","label":"Love it","value":"love-it","isCorrect":false},{"id":"tpl-gn-18-f1-opt2","label":"It is fine","value":"it-is-fine","isCorrect":false},{"id":"tpl-gn-18-f1-opt3","label":"Needs work","value":"needs-work","isCorrect":false},{"id":"tpl-gn-18-f1-opt4","label":"No opinion","value":"no-opinion","isCorrect":false}]},{"id":"tpl-gn-18-f2","type":"textarea","label":"Add a comment (optional)","required":false,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-18-f3","type":"email","label":"Email for results (optional)","required":false,"order":3,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Site Visit' AND t.category = 'General'
);

-- 145 | General | tpl-gn-19 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Maintenance Request',
       'Date-based maintenance request booking with party details.',
       'General',
       false,
       '📅',
       '[{"id":"tpl-gn-19-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-19-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-19-f3","type":"date","label":"Preferred date","required":true,"order":3,"page":1,"logicRules":[]},{"id":"tpl-gn-19-f4","type":"time","label":"Preferred time","required":true,"order":4,"page":1,"logicRules":[]},{"id":"tpl-gn-19-f5","type":"number","label":"Number of guests","required":true,"order":5,"page":1,"logicRules":[{"id":"tpl-gn-19-r1","sourceFieldId":"tpl-gn-19-f5","operator":"greater_than","targetValue":"6","action":"show","targetFieldId":"tpl-gn-19-f6"}],"min":1,"max":20},{"id":"tpl-gn-19-f6","type":"textarea","label":"Special requests","required":false,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Maintenance Request' AND t.category = 'General'
);

-- 146 | General | tpl-gn-20 | 6 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Return Request',
       'Order-style return request with item, quantity and address.',
       'General',
       false,
       '🛒',
       '[{"id":"tpl-gn-20-f1","type":"text","label":"Full Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-20-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-20-f3","type":"select","label":"Item","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-20-r1","sourceFieldId":"tpl-gn-20-f3","operator":"equals","targetValue":"custom","action":"show","targetFieldId":"tpl-gn-20-f4"}],"options":[{"id":"tpl-gn-20-f3-opt1","label":"Standard","value":"standard","isCorrect":false},{"id":"tpl-gn-20-f3-opt2","label":"Premium","value":"premium","isCorrect":false},{"id":"tpl-gn-20-f3-opt3","label":"Deluxe","value":"deluxe","isCorrect":false},{"id":"tpl-gn-20-f3-opt4","label":"Custom","value":"custom","isCorrect":false}]},{"id":"tpl-gn-20-f4","type":"select","label":"Customization notes","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-20-f4-opt1","label":"Gift wrap","value":"gift-wrap","isCorrect":false},{"id":"tpl-gn-20-f4-opt2","label":"Express handling","value":"express-handling","isCorrect":false},{"id":"tpl-gn-20-f4-opt3","label":"None","value":"none","isCorrect":false}]},{"id":"tpl-gn-20-f5","type":"number","label":"Quantity","required":true,"order":5,"page":1,"logicRules":[],"min":1,"max":99},{"id":"tpl-gn-20-f6","type":"textarea","label":"Delivery address","required":true,"order":6,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Return Request' AND t.category = 'General'
);

-- 147 | General | tpl-gn-21 | 5 fields | 1 logic rule(s) | quiz=false
INSERT INTO public.templates (title, description, category, is_quiz, icon, fields, settings, is_public)
SELECT 'Refer-a-Friend',
       'Refer-a-Friend with topic routing and priority follow-up.',
       'General',
       false,
       '📨',
       '[{"id":"tpl-gn-21-f1","type":"text","label":"Name","required":true,"order":1,"page":1,"logicRules":[]},{"id":"tpl-gn-21-f2","type":"email","label":"Email","required":true,"order":2,"page":1,"logicRules":[]},{"id":"tpl-gn-21-f3","type":"select","label":"Topic","required":true,"order":3,"page":1,"logicRules":[{"id":"tpl-gn-21-r1","sourceFieldId":"tpl-gn-21-f3","operator":"equals","targetValue":"support","action":"show","targetFieldId":"tpl-gn-21-f4"}],"options":[{"id":"tpl-gn-21-f3-opt1","label":"General question","value":"general-question","isCorrect":false},{"id":"tpl-gn-21-f3-opt2","label":"Support","value":"support","isCorrect":false},{"id":"tpl-gn-21-f3-opt3","label":"Sales","value":"sales","isCorrect":false},{"id":"tpl-gn-21-f3-opt4","label":"Press","value":"press","isCorrect":false}]},{"id":"tpl-gn-21-f4","type":"radio","label":"Priority","required":false,"order":4,"page":1,"logicRules":[],"options":[{"id":"tpl-gn-21-f4-opt1","label":"Low","value":"low","isCorrect":false},{"id":"tpl-gn-21-f4-opt2","label":"Normal","value":"normal","isCorrect":false},{"id":"tpl-gn-21-f4-opt3","label":"Urgent","value":"urgent","isCorrect":false}]},{"id":"tpl-gn-21-f5","type":"textarea","label":"Message","placeholder":"How can we help?","required":true,"order":5,"page":1,"logicRules":[]}]'::jsonb,
       '{"requireLogin":false,"showTimerCountdown":false,"customThankYouTitle":"Response Submitted!","customThankYouMessage":"Thank you for filling out this form.","thankYouPages":[],"aiSentimentEnabled":true,"enableCaptcha":false,"enableDuplicateDetection":true,"totalPages":1,"quiz":{"enabled":false,"timeLimitMinutes":10,"showLeaderboard":true,"showImmediateFeedback":true,"antiCheatTabDetection":true,"antiCheatDisableCopyPaste":true,"passPercentage":70,"generateCertificate":true,"certificateTitle":"Certificate of Achievement"},"theme":{"primaryColor":"#2563EB","secondaryColor":"#64748B","accentColor":"#06B6D4","backgroundColor":"#F8FAFC","surfaceColor":"#FFFFFF","textColor":"#0F172A","gradientStart":"#60A5FA","gradientEnd":"#22D3EE","fontFamily":"Poppins","borderRadius":"8px"}}'::jsonb,
       true
WHERE NOT EXISTS (
    SELECT 1 FROM public.templates t
    WHERE t.title = 'Refer-a-Friend' AND t.category = 'General'
);
