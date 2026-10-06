import { createClient } from '@supabase/supabase-js';
import { getAuthRedirectUrl } from './config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qzyuvxrojzlrqezkmxne.supabase.co';
// createClient() requires a non-empty key; a placeholder keeps module import safe when
// the env is not configured (all Supabase paths are gated by isSupabaseConfigured).
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'not-configured';

export const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('xyzcompany')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase Auth Helper Functions
export const signUpUser = async (email: string, pass: string, fullName: string) => {
    if (!isSupabaseConfigured) {
        return { data: { user: { id: `usr-${Date.now()}`, email, user_metadata: { full_name: fullName } } }, error: null };
    }
    const res = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
            data: { full_name: fullName }
        }
    });
    return res;
};

export const signInUser = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
        return { data: { user: { id: 'usr-1', email, user_metadata: { full_name: 'Sahil Dev' } } }, error: null };
    }
    return await supabase.auth.signInWithPassword({ email, password: pass });
};

export const signInWithMagicLink = async (email: string) => {
    if (!isSupabaseConfigured) {
        return { data: {}, error: null };
    }
    return await supabase.auth.signInWithOtp({
        email,
        options: {
            // Return to this deployed app URL after the link is clicked (e.g. Vercel, Netlify)
            emailRedirectTo: getAuthRedirectUrl(),
        },
    });
};

export const signInWithOAuth = async (provider: 'google' | 'github') => {
    if (!isSupabaseConfigured) {
        return { data: { url: window.location.href }, error: null };
    }
    return await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: getAuthRedirectUrl(),
        },
    });
};

export const signOutUser = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
};

export const getCurrentSession = async () => {
    if (!isSupabaseConfigured) return { session: null };
    const { data } = await supabase.auth.getSession();
    return data;
};

export const getCurrentUser = async () => {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
};

export const syncProfileToDb = async (userId: string, email: string, fullName: string, avatarUrl = '') => {
    if (!isSupabaseConfigured) return;
    try {
        await supabase.from('profiles').upsert({
            id: userId,
            email,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
    } catch (e) {
        console.warn('Profile sync failed:', e);
    }
};

export const onAuthChange = (callback: (event: string, session: any) => void) => {
    if (!isSupabaseConfigured) return { data: { subscription: { unsubscribe: () => { } } } };
    return supabase.auth.onAuthStateChange(callback);
};
