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
        const { question, fieldType } = await req.json();

        const prompt = `Rephrase this form question to be clearer, more engaging, and professional. Question: "${question}" (Type: ${fieldType}). Return JSON: {"improvedLabel": "...", "suggestion": "..."}`;

        let result = null;

        if (Deno.env.get('GEMINI_API_KEY')) {
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    const match = text?.match(/\{[\s\S]*\}/);
                    if (match) {
                        result = JSON.parse(match[0]);
                    }
                }
            } catch (e) {
                console.warn('Gemini failed:', e);
            }
        }

        if (!result) {
            result = {
                improvedLabel: `Could you please share ${question.toLowerCase().replace('?', '')}?`,
                suggestion: 'Rephrased to be more polite, concise, and clear for form respondents.'
            };
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
