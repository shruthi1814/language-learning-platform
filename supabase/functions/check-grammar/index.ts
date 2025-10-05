import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text provided');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a grammar expert. Analyze the text for grammar mistakes and provide detailed corrections. Return as JSON with an array of errors, where each error has: wrongSentence (the original incorrect text), correctSentence (the corrected version), message (brief description of the issue), and explanation (why it\'s wrong and how it\'s fixed). If no errors, return empty errors array.'
          },
          {
            role: 'user',
            content: `Check this text for grammar mistakes: "${text}"`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status, await response.text());
      throw new Error('Grammar check failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch {
      // If parsing fails, create a basic structure
      result = {
        errors: []
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in check-grammar:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
