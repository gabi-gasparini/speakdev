import { useState } from 'react'
import { DialoguePlayer } from '@/components/speaking/DialoguePlayer'
import { Mascot } from '@/components/common/Mascot'
import { generateDialogue } from '@/services/aiService'
import { dialogueExercises } from '@/data/dialogueExercises'
import type { DialogueExercise } from '@/types/practice'

const fallbackDialogue = dialogueExercises.find((d) => d.track === 'tech')!

export function TechPage() {
  const [dialogue, setDialogue] = useState<DialogueExercise>(fallbackDialogue)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setIsGenerating(true)
    setError(null)
    try {
      const generated = await generateDialogue('tech')
      setDialogue(generated)
    } catch (err) {
      setError('Could not generate a dialogue. Check your connection and try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-accent-tech">Tech English</h1>
          <p className="text-text-secondary">
            Practice explaining your projects, interview questions and technical vocabulary.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl bg-accent-tech px-5 py-2.5 font-bold text-white transition-transform active:scale-95 disabled:opacity-60"
        >
          {isGenerating ? 'Generating...' : '✨ New dialogue'}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
          {error}
        </p>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-surface py-16">
          <Mascot mood="thinking" size={80} />
          <p className="font-bold text-text-secondary">Generating dialogue with AI...</p>
        </div>
      )}

      {!isGenerating && (
        <DialoguePlayer key={dialogue.id} dialogue={dialogue} accentColor="tech" />
      )}
    </div>
  )
}