import { supabase } from '../lib/supabaseClient';

export const supabaseStorage = {
    async uploadFile(bucket: string, path: string, file: File): Promise<string> {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;
        return data.path;
    },

    async uploadCertificate(path: string, blob: Blob): Promise<string> {
        const { data, error } = await supabase.storage
            .from('certificates')
            .upload(path, blob, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'application/pdf'
            });

        if (error) throw error;
        return data.path;
    },

    async uploadExport(path: string, blob: Blob): Promise<string> {
        const { data, error } = await supabase.storage
            .from('exports')
            .upload(path, blob, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;
        return data.path;
    },

    async uploadFormAttachment(path: string, file: File): Promise<string> {
        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;
        return data.path;
    },

    async getPublicUrl(bucket: string, path: string): Promise<string> {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
        return data.publicUrl;
    },

    async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) throw error;
        return data.signedUrl;
    },

    async deleteFile(bucket: string, path: string): Promise<void> {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    },

    async listFiles(bucket: string, prefix: string = ''): Promise<any[]> {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(prefix);

        if (error) throw error;
        return data || [];
    }
};
