import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MascotState {
  lastPettedDate: string | null // formato YYYY-MM-DD
  petMascot: () => void
  hasPettedToday: () => boolean
  resetMascot: () => void
}

function todayString(): string {
  return new Date().toISOString().split('T')[0]
}

export const useMascotStore = create<MascotState>()(
  persist(
    (set, get) => ({
      lastPettedDate: null,
      petMascot: () => set({ lastPettedDate: todayString() }),
      hasPettedToday: () => get().lastPettedDate === todayString(),
      resetMascot: () => set({ lastPettedDate: null }),
    }),
    { name: 'speakdev-mascot' }
  )
)