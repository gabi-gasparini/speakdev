import { useState } from 'react'
import { DialoguePlayer } from '@/components/speaking/DialoguePlayer'
import { dialogueExercises } from '@/data/dialogueExercises'

const dialogues = dialogueExercises.filter((dialogue) => dialogue.track === 'everyday')

export function EverydayPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const dialogue = dialogues[currentIndex]

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % dialogues.length)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-accent-everyday">Everyday English</h1>
        <p className="text-text-secondary">
          Practice real-life conversations: travel, small talk, restaurants and more.
        </p>
      </div>

      {dialogue && (
        <DialoguePlayer key={dialogue.id} dialogue={dialogue} accentColor="everyday" />
      )}

      {dialogues.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="self-center rounded-full border-2 border-border px-6 py-2 font-bold text-text-secondary transition-colors hover:bg-surface"
        >
          Next dialogue
        </button>
      )}
    </div>
  )
}