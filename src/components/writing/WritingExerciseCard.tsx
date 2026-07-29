import { useState } from 'react'
import { evaluateWritingAnswer } from '@/services/aiService'
import type { AIEvaluationResult } from '@/services/aiService'
import { usePracticeSession } from '@/hooks/usePracticeSession'
import { Mascot } from '@/components/common/Mascot'
import type { WritingExercise } from '@/data/writingExercises'
import type { Track } from '@/types/practice'

interface WritingExerciseCardProps {
  exercise: WritingExercise
  accentColor: Track
  onNext: () => void
  hasNext: boolean
}

const accentTextClass: Record<Track, string> = {
  everyday: 'text-accent-everyday',
  tech: 'text-accent-tech',
}

const accentBgClass: Record<Track, string> = {
  everyday: 'bg-accent-everyday hover:bg-accent-everyday-dark',
  tech: 'bg-accent-tech hover:bg-accent-tech-dark',
}

export function WritingExerciseCard({
  exercise,
  accentColor,
  onNext,
  hasNext,
}: WritingExerciseCardProps) {
  const [answer, setAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<AIEvaluationResult | null>(null)
  const { saveSession } = usePracticeSession()

  async function handleCheck() {
    if (!answer.trim()) return
    setIsEvaluating(true)

    try {
      const evaluation = await evaluateWritingAnswer(
        exercise.promptPt,
        answer,
        exercise.targetEn
      )

      setResult(evaluation)

      saveSession({
        track: exercise.track,
        mode: 'writing',
        topic: exercise.topic,
        prompt: exercise.promptPt,
        target_text: exercise.targetEn,
        user_input: answer,
        accuracy: evaluation.accuracy,
        feedback: {
          correctedText: evaluation.suggestion,
          issues: evaluation.missedWords.map((word) => ({
            original: word,
            suggestion: word,
            explanation: `The word "${word}" was missing from your answer.`,
            type: 'vocabulary' as const,
          })),
          overallScore: evaluation.accuracy,
        },
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsEvaluating(false)
    }
  }

  function handleNext() {
    setAnswer('')
    setResult(null)
    onNext()
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-6">
      <p className={`text-sm font-bold uppercase tracking-wide ${accentTextClass[accentColor]}`}>
        {exercise.topic}
      </p>
      <p className="mt-1 text-text-secondary">Translate the sentence below into English.</p>

      <p className="mt-4 text-xl font-bold leading-relaxed">{exercise.promptPt}</p>

      <textarea
        value={answer}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
        disabled={!!result || isEvaluating}
        placeholder="Type your translation here..."
        rows={3}
        className="mt-4 w-full rounded-xl border-2 border-border bg-bg p-3 text-base outline-none focus:border-text-primary disabled:opacity-70"
      />

      {!result && !isEvaluating && (
        <button
          type="button"
          onClick={handleCheck}
          disabled={answer.trim().length === 0}
          className={`mt-4 w-full rounded-xl py-3 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-40 ${accentBgClass[accentColor]}`}
        >
          Check
        </button>
      )}

      {isEvaluating && (
        <div className="mt-4 flex flex-col items-center gap-3 py-4">
          <Mascot mood="thinking" size={64} />
          <p className="text-sm font-bold text-text-secondary">Evaluating your answer...</p>
        </div>
      )}

      {result && (
        <div className="mt-4 flex flex-col items-center gap-3 text-center">
          <Mascot mood={result.accuracy >= 80 ? 'happy' : 'encouraging'} size={72} />

          <p className="text-3xl font-extrabold">{result.accuracy}%</p>

          <p className={`text-sm font-bold ${result.isCorrect ? 'text-accent-everyday' : 'text-danger'}`}>
            {result.feedback}
          </p>

          <div className="w-full rounded-xl bg-bg p-3 text-left text-sm">
            <p>
              <span className="font-bold">You wrote: </span>
              {answer}
            </p>
            <p className="mt-1">
              <span className="font-bold">Suggestion: </span>
              {result.suggestion}
            </p>
          </div>

          {result.missedWords.length > 0 && (
            <p className="text-sm text-danger">
              Missed: {result.missedWords.join(', ')}
            </p>
          )}

          {hasNext && (
            <button
              type="button"
              onClick={handleNext}
              className={`mt-2 rounded-full px-6 py-2 font-bold text-white transition-transform active:scale-95 ${accentBgClass[accentColor]}`}
            >
              Next sentence
            </button>
          )}
        </div>
      )}
    </div>
  )
}