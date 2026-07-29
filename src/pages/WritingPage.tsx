import { useState } from 'react'
import { WritingExerciseCard } from '@/components/writing/WritingExerciseCard'
import { Mascot } from '@/components/common/Mascot'
import { generateWritingExercises } from '@/services/aiService'
import { writingExercises as fallbackExercises } from '@/data/writingExercises'
import type { WritingExercise } from '@/data/writingExercises'
import type { Track } from '@/types/practice'

const cardStyles: Record<Track, string> = {
  everyday: 'bg-accent-everyday',
  tech: 'bg-accent-tech',
}

const accentTextClass: Record<Track, string> = {
  everyday: 'text-accent-everyday',
  tech: 'text-accent-tech',
}

export function WritingPage() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [exercises, setExercises] = useState<WritingExercise[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSelectTrack(track: Track) {
    setSelectedTrack(track)
    setCurrentIndex(0)
    setError(null)
    setIsGenerating(true)

    try {
      const generated = await generateWritingExercises(track)
      setExercises(generated)
    } catch (err) {
      console.error(err)
      setExercises(fallbackExercises.filter((e) => e.track === track))
      setError('Could not generate AI exercises. Using default exercises instead.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleGenerateMore() {
    if (!selectedTrack) return
    setIsGenerating(true)
    setError(null)

    try {
      const generated = await generateWritingExercises(selectedTrack)
      setExercises(generated)
      setCurrentIndex(0)
    } catch (err) {
      console.error(err)
      setError('Could not generate new exercises. Try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleNext() {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      handleGenerateMore()
    }
  }

  function handleBack() {
    setSelectedTrack(null)
    setExercises([])
    setCurrentIndex(0)
  }

  const currentExercise = exercises[currentIndex]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold">Writing</h1>
        <p className="text-text-secondary">
          Translate Portuguese sentences into English to practice your writing.
        </p>
      </div>

      {!selectedTrack && (
        <div className="grid gap-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleSelectTrack('everyday')}
            className={`rounded-2xl border-2 border-text-primary p-6 text-left text-white shadow-[0_4px_0_0_rgba(38,38,40,1)] transition-transform active:translate-y-1 active:shadow-none ${cardStyles.everyday}`}
          >
            <p className="text-sm font-extrabold uppercase tracking-wide opacity-90">Everyday</p>
            <p className="mt-1 text-xl font-extrabold">Real-life sentences</p>
            <p className="mt-1 text-sm opacity-90">
              Translate everyday Portuguese sentences into English.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTrack('tech')}
            className={`rounded-2xl border-2 border-text-primary p-6 text-left text-white shadow-[0_4px_0_0_rgba(38,38,40,1)] transition-transform active:translate-y-1 active:shadow-none ${cardStyles.tech}`}
          >
            <p className="text-sm font-extrabold uppercase tracking-wide opacity-90">Tech</p>
            <p className="mt-1 text-xl font-extrabold">Tech sentences</p>
            <p className="mt-1 text-sm opacity-90">
              Translate tech-related Portuguese sentences into English.
            </p>
          </button>
        </div>
      )}

      {selectedTrack && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-bold text-text-secondary hover:text-text-primary"
            >
              ← Back to tracks
            </button>

            {!isGenerating && exercises.length > 0 && (
              <p className={`text-xs font-bold ${accentTextClass[selectedTrack]}`}>
                {currentIndex + 1} / {exercises.length}
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
              {error}
            </p>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-surface py-12">
              <Mascot mood="thinking" size={80} />
              <p className="font-bold text-text-secondary">Generating exercises with AI...</p>
            </div>
          )}

          {!isGenerating && currentExercise && (
            <WritingExerciseCard
              key={currentExercise.id}
              exercise={currentExercise}
              accentColor={selectedTrack}
              onNext={handleNext}
              hasNext={true}
            />
          )}
        </div>
      )}
    </div>
  )
}