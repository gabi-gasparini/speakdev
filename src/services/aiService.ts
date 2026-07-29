import { supabase } from '@/lib/supabaseClient'
import type { DialogueExercise } from '@/types/practice'
import type { WritingExercise } from '@/data/writingExercises'
import type { Track } from '@/types/practice'

export interface AIEvaluationResult {
  accuracy: number
  isCorrect: boolean
  feedback: string
  suggestion: string
  missedWords: string[]
}

async function callEdgeFunction(body: Record<string, unknown>) {
  const { data: { session } } = await supabase.auth.getSession()

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-dialogue`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error ?? 'Failed to call AI')
  }

  return response.json()
}

export async function generateDialogue(track: Track): Promise<DialogueExercise> {
  const data = await callEdgeFunction({ track, mode: 'dialogue' })
  return {
    ...data,
    id: `ai-${track}-${Date.now()}`,
    track,
    difficulty: 'intermediate',
  }
}

export async function generateWritingExercises(track: Track): Promise<WritingExercise[]> {
  const data = await callEdgeFunction({ track, mode: 'writing' })
  return (data as WritingExercise[]).map((item, index) => ({
    ...item,
    id: `ai-${track}-${Date.now()}-${index}`,
    track,
  }))
}

export async function evaluateWritingAnswer(
  promptPt: string,
  userAnswer: string,
  targetEn: string
): Promise<AIEvaluationResult> {
  return callEdgeFunction({ mode: 'evaluate', promptPt, userAnswer, targetEn })
}