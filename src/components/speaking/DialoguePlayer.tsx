import { useEffect, useMemo, useState } from 'react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { usePracticeSession } from '@/hooks/usePracticeSession'
import { compareSpeechToTarget } from '@/lib/textComparison'
import { Mascot } from '@/components/common/Mascot'
import type { DialogueExercise, SpeechFeedback, Track } from '@/types/practice'

interface DialoguePlayerProps {
  dialogue: DialogueExercise
  accentColor: Track
}

const accentTextClass: Record<Track, string> = {
  everyday: 'text-accent-everyday',
  tech: 'text-accent-tech',
}

const accentBgClass: Record<Track, string> = {
  everyday: 'bg-accent-everyday hover:bg-accent-everyday-dark',
  tech: 'bg-accent-tech hover:bg-accent-tech-dark',
}

export function DialoguePlayer({ dialogue, accentColor }: DialoguePlayerProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const line = dialogue.lines[lineIndex]
  const isLastLine = lineIndex === dialogue.lines.length - 1

  const {
    isSupported,
    status,
    transcript,
    errorMessage,
    durationMs,
    startListening,
    stopListening,
    reset,
  } = useSpeechRecognition()

  const { saveSession } = usePracticeSession()

  // Resultado só é calculado quando o navegador confirma o fim da gravação (status "done")
  const result = useMemo(() => {
    if (status !== 'done' || line.speaker !== 'user') return null
    return compareSpeechToTarget(transcript, line.text, durationMs)
  }, [status, transcript, line, durationMs])

  // Salva a sessão dessa fala no Supabase assim que o resultado fica pronto
  useEffect(() => {
    if (!result) return

    const feedback: SpeechFeedback = {
      spokenText: transcript,
      targetText: line.text,
      missedWords: result.missedWords,
      extraWords: result.extraWords,
      durationMs,
    }

    saveSession({
      track: dialogue.track,
      mode: 'speaking',
      topic: dialogue.topic,
      prompt: `Dialogue line: ${line.speakerName}`,
      target_text: line.text,
      user_input: transcript,
      accuracy: result.accuracy,
      words_per_minute: result.wordsPerMinute,
      feedback,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  function goToNextLine() {
    reset()
    setLineIndex((prev) => Math.min(prev + 1, dialogue.lines.length - 1))
  }

  function restartDialogue() {
    reset()
    setLineIndex(0)
  }

  function handleTryLineAgain() {
    reset()
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <p className={`text-sm font-bold uppercase tracking-wide ${accentTextClass[accentColor]}`}>
          {dialogue.topic}
        </p>
        <p className="text-xs text-text-secondary">
          Line {lineIndex + 1} / {dialogue.lines.length}
        </p>
      </div>
      <p className="mt-1 text-sm text-text-secondary">{dialogue.description}</p>

      {/* Barra de progresso simples */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg">
        <div
          className={`h-full rounded-full ${accentColor === 'everyday' ? 'bg-accent-everyday' : 'bg-accent-tech'}`}
          style={{ width: `${((lineIndex + 1) / dialogue.lines.length) * 100}%` }}
        />
      </div>

      {/* Fala atual */}
      <div className="mt-6 rounded-xl bg-bg p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          {line.speakerName} {line.speaker === 'user' ? '(you)' : ''}
        </p>
        <p className="mt-2 text-xl font-bold leading-relaxed">{line.text}</p>
        <p className="mt-1 text-sm text-text-secondary">{line.translation}</p>
      </div>

      {/* Falas do outro personagem: só "Next" */}
      {line.speaker === 'other' && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={goToNextLine}
            className={`rounded-full px-8 py-3 font-bold text-white transition-transform active:scale-95 ${accentBgClass[accentColor]}`}
          >
            {isLastLine ? 'Finish dialogue' : 'Next'}
          </button>
        </div>
      )}

      {/* Falas do usuário: fluxo de fala */}
      {line.speaker === 'user' && !isSupported && (
        <div className="mt-6 text-center">
          <Mascot mood="encouraging" size={64} className="mx-auto" />
          <p className="mt-3 font-bold text-danger">Speech recognition not available</p>
          <p className="mt-1 text-sm text-text-secondary">Try using Google Chrome.</p>
        </div>
      )}

      {line.speaker === 'user' && isSupported && status !== 'done' && (
        <div className="mt-6 flex flex-col items-center gap-3">
          {status === 'listening' ? (
            <button
              type="button"
              onClick={stopListening}
              className="rounded-full bg-danger px-8 py-3 font-bold text-white transition-transform active:scale-95"
            >
              Stop recording
            </button>
          ) : (
            <button
              type="button"
              onClick={startListening}
              disabled={status === 'finalizing'}
              className={`rounded-full px-8 py-3 font-bold text-white transition-transform active:scale-95 disabled:opacity-50 ${accentBgClass[accentColor]}`}
            >
              {status === 'finalizing' ? 'Processing...' : 'Start speaking'}
            </button>
          )}

          {status === 'listening' && (
            <p className="text-sm text-text-secondary">Listening... speak now</p>
          )}

          {transcript && (status === 'listening' || status === 'finalizing') && (
            <p className="rounded-xl bg-bg p-3 text-sm text-text-secondary">{transcript}</p>
          )}

          {errorMessage && <p className="text-sm font-bold text-danger">{errorMessage}</p>}
        </div>
      )}

      {line.speaker === 'user' && status === 'done' && result && (
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <Mascot mood={result.accuracy >= 80 ? 'happy' : 'encouraging'} size={64} />

          <p className="text-2xl font-extrabold">{result.accuracy}%</p>

          <p className="rounded-xl bg-bg p-3 text-sm">
            <span className="font-bold">You said: </span>
            {transcript || '(nothing detected)'}
          </p>

          {result.missedWords.length > 0 && (
            <p className="text-sm text-danger">Missed: {result.missedWords.join(', ')}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleTryLineAgain}
              className="rounded-full border-2 border-border px-5 py-2 text-sm font-bold text-text-primary transition-colors hover:bg-bg"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={goToNextLine}
              className={`rounded-full px-5 py-2 text-sm font-bold text-white transition-transform active:scale-95 ${accentBgClass[accentColor]}`}
            >
              {isLastLine ? 'Finish dialogue' : 'Next line'}
            </button>
          </div>
        </div>
      )}

      {isLastLine && line.speaker === 'user' && status === 'done' && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={restartDialogue}
            className="text-sm font-bold text-text-secondary underline"
          >
            Restart dialogue
          </button>
        </div>
      )}
    </div>
  )
}