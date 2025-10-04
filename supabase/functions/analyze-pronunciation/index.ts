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
    const { audio } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // For demonstration, we'll return mock data
    // In production, you would transcribe the audio first, then analyze it
    const mockTranscription = "Hello, how are you today?";
    
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
            content: 'You are a pronunciation coach. Analyze the transcribed text and provide pronunciation feedback with an accuracy score (0-100), the transcription, and specific improvement suggestions. Return as JSON with fields: score, transcription, suggestions (array of strings).'
          },
          {
            role: 'user',
            content: `Analyze this transcribed speech: "${mockTranscription}". Provide pronunciation feedback.`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status, await response.text());
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    // Try to parse as JSON, or create structured response
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch {
      result = {
        score: 85,
        transcription: mockTranscription,
        suggestions: [
          "Focus on clear enunciation of consonants",
          "Practice vowel sounds",
          "Maintain consistent pace"
        ]
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-pronunciation:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
