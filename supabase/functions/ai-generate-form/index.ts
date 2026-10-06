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
        const { prompt, isQuiz } = await req.json();

        const systemPrompt = `You are Collectly AI, an expert form & quiz generator.
Return ONLY valid JSON matching this structure:
{
  "title": string,
  "description": string,
  "category": "Survey" | "Quiz" | "Registration" | "Feedback" | "Application" | "Lead Generation" | "General",
  "isQuiz": boolean,
  "fields": Array<{
    "id": string,
    "type": "text" | "textarea" | "email" | "number" | "phone" | "select" | "radio" | "checkbox" | "rating" | "nps" | "quiz_mcq" | "quiz_tf" | "quiz_short",
    "label": string,
    "placeholder"?: string,
    "description"?: string,
    "required": boolean,
    "order": number,
    "points"?: number,
    "correctAnswer"?: string,
    "options"?: Array<{ "id": string, "label": string, "value": string, "isCorrect"?: boolean }>
  }>
}`;

        const userPrompt = `User Prompt: "${prompt}". ${isQuiz ? 'Must be a quiz with correct answers and points.' : ''}`;

        let result = null;

        // Try Gemini
        if (Deno.env.get('GEMINI_API_KEY')) {
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }]
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            result = JSON.parse(jsonMatch[0]);
                        }
                    }
                }
            } catch (e) {
                console.warn('Gemini failed:', e);
            }
        }

        // Try OpenRouter
        if (!result && Deno.env.get('OPENROUTER_API_KEY')) {
            try {
                const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'meta-llama/llama-3.3-70b-instruct:free',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const text = data.choices?.[0]?.message?.content;
                    if (text) {
                        const jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            result = JSON.parse(jsonMatch[0]);
                        }
                    }
                }
            } catch (e) {
                console.warn('OpenRouter failed:', e);
            }
        }

        // Try Groq
        if (!result && Deno.env.get('GROQ_API_KEY')) {
            try {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'llama-3.1-8b-instant',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    const text = data.choices?.[0]?.message?.content;
                    if (text) {
                        const jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            result = JSON.parse(jsonMatch[0]);
                        }
                    }
                }
            } catch (e) {
                console.warn('Groq failed:', e);
            }
        }

        if (!result) {
            return new Response(JSON.stringify({ error: 'No AI provider available' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
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
