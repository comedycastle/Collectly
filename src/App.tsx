import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { DashboardPage } from './pages/DashboardPage';
import { FormBuilderPage } from './pages/FormBuilderPage';
import { ResponsesPage } from './pages/ResponsesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { QuizHubPage } from './pages/QuizHubPage';
import { AIGeneratorPage } from './pages/AIGeneratorPage';
import { BrandingPage } from './pages/BrandingPage';
import { PublicFormViewPage } from './pages/PublicFormViewPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { restoreSavedTheme } from './pages/SettingsPage';
import { AuthModal } from './components/AuthModal';
import { useCollectlyStore } from './store/useCollectlyStore';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { Form } from './types';
import { FormTemplate } from './services/templateService';

export function App() {
    const [activeTab, setActiveTab] = useState<ActiveTab | 'public_preview' | 'landing'>('landing');
    const [previewFormId, setPreviewFormId] = useState<string | undefined>(undefined);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { forms, setActiveForm, responses, createForm, user, loadAllFromSupabase, loadFormsFromSupabase, loadResponsesFromSupabase, loadProfileFromSupabase } = useCollectlyStore();

    const isAuthenticated = user.id !== 'usr-1' || user.email !== 'admin@collectly.app';

    // Refs so auth callbacks always see the latest view state
    const activeTabRef = useRef(activeTab);
    useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
    const lastEnterRef = useRef(0);

    useEffect(() => {
        restoreSavedTheme();
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/form/')) {
                const id = hash.replace('#/form/', '');
                setPreviewFormId(id);
                setActiveTab('public_preview');
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Load all Supabase data when entering app (forms, responses, templates, profile, settings, branding, analytics)
    useEffect(() => {
        if (activeTab !== 'landing' && activeTab !== 'public_preview') {
            loadAllFromSupabase();
            loadResponsesFromSupabase();
        }
    }, [activeTab]);

    // Realtime: refresh forms list when DB changes
    useEffect(() => {
        let channel: any = null;
        if (activeTab !== 'landing') {
            import('./services/formService').then(({ formService }) => {
                channel = formService.subscribeToForms(() => {
                    loadFormsFromSupabase();
                });
            });
        }
        return () => {
            if (channel) {
                import('./lib/supabaseClient').then(({ supabase }) => {
                    supabase.removeChannel(channel);
                });
            }
        };
    }, [activeTab]);

    const handleEditForm = (form: Form) => {
        setActiveForm(form);
        setActiveTab('builder');
    };

    const handleCreateBlankForm = () => {
        const newForm = createForm({ title: 'Untitled Form', category: 'General' });
        setActiveForm(newForm);
        setActiveTab('builder');
    };

    const handlePreviewPublicForm = (formId: string) => {
        setPreviewFormId(formId);
        setActiveTab('public_preview');
    };

    const handleGetStarted = () => {
        setIsAuthOpen(true);
    };

    const handleSignIn = () => {
        setIsAuthOpen(true);
    };

    const handleAuthSuccess = useCallback(async () => {
        // The modal callback and the auth listener can both fire for one sign-in —
        // dedupe so data only loads once.
        const now = Date.now();
        if (now - lastEnterRef.current < 1500) return;
        lastEnterRef.current = now;
        setIsAuthOpen(false);
        setActiveTab('dashboard');
        restoreSavedTheme();
        await loadProfileFromSupabase();
        await loadAllFromSupabase();
        await loadResponsesFromSupabase();
    }, [loadProfileFromSupabase, loadAllFromSupabase, loadResponsesFromSupabase]);

    // Magic-link / OAuth redirect / returning user: supabase-js establishes the
    // session from the URL (or storage) — enter the app instead of showing landing.
    useEffect(() => {
        if (!isSupabaseConfigured) return;
        let alive = true;
        const tryEnter = async () => {
            if (!alive) return;
            // Never hijack a public form share link
            if (window.location.hash.startsWith('#/form/')) return;
            if (activeTabRef.current !== 'landing') return;
            const { data } = await supabase.auth.getSession();
            if (!alive || !data.session) return;
            if (activeTabRef.current !== 'landing') return;
            handleAuthSuccess();
        };
        tryEnter();
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') tryEnter();
        });
        return () => {
            alive = false;
            sub.subscription.unsubscribe();
        };
    }, [handleAuthSuccess]);

    const handleSignOut = () => {
        setActiveTab('landing');
    };

    if (activeTab === 'public_preview') {
        return (
            <PublicFormViewPage
                formId={previewFormId}
                onBackToDashboard={() => {
                    window.location.hash = '';
                    setActiveTab(isAuthenticated ? 'dashboard' : 'landing');
                }}
            />
        );
    }

    if (activeTab === 'landing') {
        return (
            <>
                <LandingPage
                    onGetStarted={handleGetStarted}
                    onSignIn={handleSignIn}
                />
                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col selection:bg-brand-primary selection:text-white">
            <Navbar
                onOpenAIGenerator={() => setActiveTab('ai')}
                onCreateNewForm={handleCreateBlankForm}
                onSignOut={handleSignOut}
                onToggleMobileMenu={() => setIsMobileNavOpen(true)}
                onLogoClick={() => setActiveTab('dashboard')}
            />

            <MobileNav
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
                activeTab={activeTab as ActiveTab}
                onSelect={(tab) => {
                    setActiveTab(tab);
                    setIsMobileNavOpen(false);
                }}
                formCount={forms.length}
                responseCount={responses.length}
            />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar
                    activeTab={activeTab as ActiveTab}
                    setActiveTab={(tab) => setActiveTab(tab)}
                    formCount={forms.length}
                    responseCount={responses.length}
                />

                <main className="flex-1 overflow-y-auto bg-brand-bg">
                    {activeTab === 'dashboard' && (
                        <DashboardPage
                            onEditForm={handleEditForm}
                            onOpenAIGenerator={() => setActiveTab('ai')}
                            onNavigateTab={(tab) => setActiveTab(tab)}
                        />
                    )}

                    {activeTab === 'builder' && (
                        <FormBuilderPage
                            onBackToDashboard={() => setActiveTab('dashboard')}
                            onPreviewPublicForm={handlePreviewPublicForm}
                        />
                    )}

                    {activeTab === 'responses' && <ResponsesPage />}

                    {activeTab === 'analytics' && <AnalyticsPage />}

                    {activeTab === 'quizzes' && (
                        <QuizHubPage
                            onEditForm={handleEditForm}
                            onOpenAIGenerator={() => setActiveTab('ai')}
                            onPreviewPublicForm={handlePreviewPublicForm}
                            onNavigateTab={(tab) => setActiveTab(tab)}
                        />
                    )}

                    {activeTab === 'ai' && (
                        <AIGeneratorPage
                            onFormGenerated={() => setActiveTab('builder')}
                        />
                    )}

                    {activeTab === 'branding' && <BrandingPage />}

                    {activeTab === 'templates' && (
                        <TemplatesPage
                            onTemplateSelect={() => setActiveTab('builder')}
                            onOpenAIGenerator={() => setActiveTab('ai')}
                        />
                    )}

                    {activeTab === 'settings' && <SettingsPage />}
                </main>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
        </div>
    );
}

export default App;