import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { formId, format } = await req.json();

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        const formsRes = await fetch(`${supabaseUrl}/rest/v1/forms?id=eq.${formId}&select=*`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const forms = await formsRes.json();
        const form = forms[0];

        if (!form) {
            return new Response(JSON.stringify({ error: 'Form not found' }), {
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const responsesRes = await fetch(`${supabaseUrl}/rest/v1/responses?form_id=eq.${formId}&select=*`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const responses = await responsesRes.json();

        const report = {
            formTitle: form.title,
            generatedAt: new Date().toISOString(),
            totalResponses: responses.length,
            responses: responses,
            summary: {
                averageScore: responses.length > 0
                    ? responses.reduce((acc: number, r: any) => acc + (r.score || 0), 0) / responses.length
                    : 0,
                passRate: responses.length > 0
                    ? (responses.filter((r: any) => r.passed).length / responses.length) * 100
                    : 0
            }
        };

        return new Response(JSON.stringify(report), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
