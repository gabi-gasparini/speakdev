import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getAllUserProgress } from '@/services/progressService'
import { getPracticeSessions } from '@/services/practiceService'
import { calculateSessionXp, calculateLevel } from '@/lib/xp'

interface HomeStats {
  dayStreak: number
  lessonsDone: number
  totalXp: number
  level: number
  levelTitle: string
  everydayProgressPercent: number
  techProgressPercent: number
  xpByDay: number[] // domingo a sábado seguido, mas exibido como Mon-Sun
  xpThisWeek: number
  isLoading: boolean
  error: string | null
}

// Cada trilha "completa" visualmente a cada N sessões — usado só para
// dar uma noção de progresso na barra do card, não é um limite real.
const SESSIONS_FOR_FULL_BAR = 20

function getXpByWeekday(sessions: { created_at: string; accuracy: number | null }[]): number[] {
  const now = new Date()
  const startOfWeek = new Date(now)
  // Recua até a segunda-feira mais recente (getDay: 0=domingo, 1=segunda...)
  const dayOfWeek = now.getDay()
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startOfWeek.setDate(now.getDate() - daysSinceMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  const xpByDay = [0, 0, 0, 0, 0, 0, 0] // Mon..Sun

  for (const session of sessions) {
    const sessionDate = new Date(session.created_at)
    if (sessionDate < startOfWeek) continue

    const diffDays = Math.floor(
      (sessionDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffDays < 0 || diffDays > 6) continue

    xpByDay[diffDays] += calculateSessionXp(session.accuracy)
  }

  return xpByDay
}

export function useHomeStats(): HomeStats {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState<Omit<HomeStats, 'isLoading' | 'error'>>({
    dayStreak: 0,
    lessonsDone: 0,
    totalXp: 0,
    level: 1,
    levelTitle: 'Newbie',
    everydayProgressPercent: 0,
    techProgressPercent: 0,
    xpByDay: [0, 0, 0, 0, 0, 0, 0],
    xpThisWeek: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const userId = user.id
    let isCancelled = false

    async function loadStats() {
      setIsLoading(true)
      setError(null)

      try {
        const [progress, sessions] = await Promise.all([
          getAllUserProgress(userId),
          getPracticeSessions(userId, undefined, 200),
        ])

        if (isCancelled) return

        const everyday = progress.find((p) => p.track === 'everyday')
        const tech = progress.find((p) => p.track === 'tech')

        const lessonsDone = (everyday?.total_sessions ?? 0) + (tech?.total_sessions ?? 0)
        const dayStreak = Math.max(everyday?.current_streak ?? 0, tech?.current_streak ?? 0)

        const totalXp = sessions.reduce(
          (sum, session) => sum + calculateSessionXp(session.accuracy),
          0
        )
        const { level, title } = calculateLevel(totalXp)

        const xpByDay = getXpByWeekday(sessions)
        const xpThisWeek = xpByDay.reduce((a, b) => a + b, 0)

        setStats({
          dayStreak,
          lessonsDone,
          totalXp,
          level,
          levelTitle: title,
          everydayProgressPercent: Math.min(
            Math.round(((everyday?.total_sessions ?? 0) / SESSIONS_FOR_FULL_BAR) * 100),
            100
          ),
          techProgressPercent: Math.min(
            Math.round(((tech?.total_sessions ?? 0) / SESSIONS_FOR_FULL_BAR) * 100),
            100
          ),
          xpByDay,
          xpThisWeek,
        })
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Could not load stats.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      isCancelled = true
    }
  }, [user])

  return { ...stats, isLoading, error }
}