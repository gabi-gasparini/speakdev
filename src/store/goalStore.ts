import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GoalState {
  dailyXpGoal: number
  setDailyXpGoal: (goal: number) => void
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      dailyXpGoal: 10,
      setDailyXpGoal: (goal) => set({ dailyXpGoal: goal }),
    }),
    { name: 'speakdev-goal' }
  )
)