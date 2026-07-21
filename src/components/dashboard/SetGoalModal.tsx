import { useState } from 'react'

interface SetGoalModalProps {
  currentGoal: number
  onClose: () => void
  onSave: (goal: number) => void
}

const goalOptions = [
  { xp: 10, label: 'Casual', description: '~5 min a day' },
  { xp: 20, label: 'Regular', description: '~10 min a day' },
  { xp: 40, label: 'Serious', description: '~20 min a day' },
  { xp: 60, label: 'Intense', description: '~30 min a day' },
]

export function SetGoalModal({ currentGoal, onClose, onSave }: SetGoalModalProps) {
  const [selected, setSelected] = useState(currentGoal)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border-2 border-text-primary bg-surface p-6 shadow-[0_4px_0_0_rgba(38,38,40,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold">Set your daily goal</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Choose how much you want to practice each day.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {goalOptions.map((option) => (
            <button
              key={option.xp}
              type="button"
              onClick={() => setSelected(option.xp)}
              className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                selected === option.xp
                  ? 'border-accent-everyday bg-accent-everyday/10'
                  : 'border-border hover:bg-bg'
              }`}
            >
              <div>
                <p className="font-extrabold">{option.label}</p>
                <p className="text-xs text-text-secondary">{option.description}</p>
              </div>
              <span className="font-extrabold text-accent-everyday">{option.xp} XP</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-border py-2.5 text-sm font-extrabold text-text-secondary transition-colors hover:bg-bg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(selected)}
            className="flex-1 rounded-xl bg-accent-everyday py-2.5 text-sm font-extrabold text-white transition-transform active:scale-[0.98]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}