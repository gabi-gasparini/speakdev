import { useState } from 'react'
import mascotLaptop from '@/assets/mascot/raccoon-mascot-laptop.png'
import { useGoalStore } from '@/store/goalStore'
import { SetGoalModal } from './SetGoalModal'

interface DailyGoalCardProps {
  currentXp: number
}

export function DailyGoalCard({ currentXp }: DailyGoalCardProps) {
  const dailyXpGoal = useGoalStore((state) => state.dailyXpGoal)
  const setDailyXpGoal = useGoalStore((state) => state.setDailyXpGoal)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const progress = Math.min(currentXp / dailyXpGoal, 1)
  const circumference = 2 * Math.PI * 30

  function handleSaveGoal(goal: number) {
    setDailyXpGoal(goal)
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col rounded-2xl border-2 border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎯</span>
        <div>
          <p className="font-extrabold">Daily goal</p>
          <p className="text-xs text-text-secondary">Keep it up! Small steps every day.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-1 items-center justify-between gap-3">
        <img src={mascotLaptop} alt="Mascot working" className="h-28 w-28 rounded-2xl object-cover object-top" />

        <div className="relative flex h-20 w-20 flex-none items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r="30" fill="none" stroke="#f0e3d3" strokeWidth="6" />
            <circle
              cx="34"
              cy="34"
              r="30"
              fill="none"
              stroke="#fe8609"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <p className="text-center text-xs font-extrabold leading-tight text-accent-everyday">
            {currentXp}
            <br />
            <span className="text-[10px] text-text-secondary">/{dailyXpGoal} XP</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full rounded-xl bg-accent-everyday py-2 text-sm font-extrabold text-white transition-transform active:scale-[0.98]"
      >
        Set goal
      </button>

      {isModalOpen && (
        <SetGoalModal
          currentGoal={dailyXpGoal}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  )
}