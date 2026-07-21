import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'authenticated' | 'error'
  errorMessage: string | null
  setUser: (user: User | null) => void
  setStatus: (status: AuthState['status']) => void
  setError: (message: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  errorMessage: null,
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  setError: (message) => set({ status: 'error', errorMessage: message }),
}))