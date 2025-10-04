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
    const { word } = await req.json();

    if (!word || word.trim().length === 0) {
      throw new Error('No word provided');
    }

    // First try the Free Dictionary API
    try {
      const dictResponse = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`
      );

      if (dictResponse.ok) {
        const dictData = await dictResponse.json();
        const entry = dictData[0];

        // Format the response
        const result = {
          word: entry.word,
          phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
          meanings: entry.meanings?.map((meaning: any) => ({
            partOfSpeech: meaning.partOfSpeech,
            definitions: meaning.definitions?.map((def: any) => ({
              definition: def.definition,
              example: def.example,
            })),
          })),
          synonyms: entry.meanings?.[0]?.synonyms || [],
        };

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      console.log('Dictionary API failed, falling back to AI:', error);
    }

    // Fallback to AI if dictionary API fails
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('Unable to look up word');
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
            content: 'You are a dictionary. Provide word definitions in JSON format with: word, phonetic, meanings (array with partOfSpeech and definitions array with definition and example), synonyms (array). Be concise.'
          },
          {
            role: 'user',
            content: `Define the word: "${word.trim()}"`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status, await response.text());
      throw new Error('Word lookup failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch {
      throw new Error('Could not parse definition');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in lookup-word:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
