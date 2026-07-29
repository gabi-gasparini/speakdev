import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { track, mode, promptPt, userAnswer, targetEn } = await req.json()

    if (!mode) {
      return new Response(
        JSON.stringify({ error: 'Missing mode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let prompt = ''

    if (mode === 'dialogue') {
      prompt = buildDialoguePrompt(track)
    } else if (mode === 'writing') {
      prompt = buildWritingPrompt(track)
    } else if (mode === 'evaluate') {
      prompt = buildEvaluationPrompt(promptPt, userAnswer, targetEn)
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid mode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function buildDialoguePrompt(track: string): string {
  const context = track === 'everyday'
    ? 'everyday life situations like restaurants, travel, shopping, small talk, or social interactions'
    : 'software development topics like job interviews, explaining projects, code reviews, debugging, or team communication'

  return `Generate a realistic English conversation dialogue about ${context}.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "topic": "short topic name",
  "description": "one sentence describing the scenario",
  "userRole": "name of the role the user plays",
  "otherRole": "name of the other character",
  "lines": [
    {
      "id": "l1",
      "speaker": "other",
      "speakerName": "Character Name",
      "text": "What the other character says",
      "translation": "Tradução em português"
    },
    {
      "id": "l2",
      "speaker": "user",
      "speakerName": "User Role Name",
      "text": "What the user should say",
      "translation": "Tradução em português"
    }
  ]
}

Rules:
- Alternate between "other" and "user" speakers, starting with "other"
- Include exactly 8 lines total (4 per speaker)
- Make it natural and realistic
- Translations must be accurate Brazilian Portuguese
- Return ONLY the JSON, nothing else`
}

function buildWritingPrompt(track: string): string {
  const context = track === 'everyday'
    ? 'everyday life situations like restaurants, travel, shopping, small talk, or social interactions'
    : 'software development topics like explaining features, describing bugs, code reviews, or team communication'

  return `Generate 4 Portuguese sentences that a Brazilian developer would need to translate into English in ${context}.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "id": "w1",
    "topic": "short topic name",
    "promptPt": "Frase em português que o usuário deve traduzir",
    "targetEn": "The correct English translation",
    "difficulty": "beginner"
  }
]

Rules:
- Generate exactly 4 sentences
- difficulty can be "beginner", "intermediate", or "advanced"
- Make the Portuguese sentences natural
- The English translation should be natural English, not literal
- Return ONLY the JSON array, nothing else`
}

function buildEvaluationPrompt(promptPt: string, userAnswer: string, targetEn: string): string {
  return `You are an English teacher evaluating a translation exercise.

Original Portuguese sentence: "${promptPt}"
Expected English translation: "${targetEn}"
Student's answer: "${userAnswer}"

Evaluate if the student's answer is correct. Accept any natural English translation that conveys the same meaning — contractions, synonyms, and different sentence structures are all acceptable as long as the meaning is preserved.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "accuracy": 85,
  "isCorrect": true,
  "feedback": "Great job! Your translation is natural and correct.",
  "suggestion": "You could also say: I'd like to order a coffee, please.",
  "missedWords": []
}

Rules:
- "accuracy" is a number from 0 to 100
- "isCorrect" is true if the meaning is preserved and the English is grammatically correct
- "feedback" is a short encouraging message in English (max 1 sentence)
- "suggestion" is an alternative correct translation (always provide one, even if the answer was perfect)
- "missedWords" is an array of important words or concepts that were missing (empty array if correct)
- Return ONLY the JSON, nothing else`
}