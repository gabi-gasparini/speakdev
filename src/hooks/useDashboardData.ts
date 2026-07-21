import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getAllUserProgress } from '@/services/progressService'
import { getPracticeSessions } from '@/services/practiceService'
import type { PracticeSessionRow, UserProgressRow } from '@/types/practice'

interface DashboardData {
  progress: UserProgressRow[]
  recentSessions: PracticeSessionRow[]
  isLoading: boolean
  error: string | null
}

export function useDashboardData(): DashboardData {
  const user = useAuthStore((state) => state.user)
  const [progress, setProgress] = useState<UserProgressRow[]>([])
  const [recentSessions, setRecentSessions] = useState<PracticeSessionRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    const userId = user.id

    let isCancelled = false

    async function loadData() {
      setIsLoading(true)
      setError(null)

      try {
        const [progressData, sessionsData] = await Promise.all([
          getAllUserProgress(userId),
          getPracticeSessions(userId, undefined, 50),
        ])

        if (!isCancelled) {
          setProgress(progressData)
          setRecentSessions(sessionsData)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Could not load dashboard data.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isCancelled = true
    }
  }, [user])

  return { progress, recentSessions, isLoading, error }
}