import { useCallback, useState } from 'react'
import { createPracticeSession } from '@/services/practiceService'
import { useAuthStore } from '@/store/authStore'
import type { NewPracticeSession, PracticeSessionRow } from '@/types/practice'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function usePracticeSession() {
  const user = useAuthStore((state) => state.user)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  const saveSession = useCallback(
    async (session: NewPracticeSession): Promise<PracticeSessionRow | null> => {
      if (!user) {
        setSaveStatus('error')
        setSaveError('No authenticated user found.')
        return null
      }

      setSaveStatus('saving')
      setSaveError(null)

      try {
        const saved = await createPracticeSession(user.id, session)
        setSaveStatus('saved')
        return saved
      } catch (error) {
        setSaveStatus('error')
        setSaveError(error instanceof Error ? error.message : 'Could not save session.')
        return null
      }
    },
    [user]
  )

  return { saveSession, saveStatus, saveError }
}