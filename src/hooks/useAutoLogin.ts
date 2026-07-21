import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'

const APP_USER_EMAIL = import.meta.env.VITE_APP_USER_EMAIL
const APP_USER_PASSWORD = import.meta.env.VITE_APP_USER_PASSWORD

// Faz login automático com as credenciais fixas do app assim que ele carrega.
// Como é um app de uso pessoal, não existe tela de login: a sessão é
// estabelecida silenciosamente em segundo plano.
export function useAutoLogin() {
  const { user, status, errorMessage, setUser, setStatus, setError } = useAuthStore()

  useEffect(() => {
    // Evita logar de novo se já tiver um usuário em memória
    if (user) return

    if (!APP_USER_EMAIL || !APP_USER_PASSWORD) {
      setError(
        'Credenciais de login não configuradas. Confira VITE_APP_USER_EMAIL e VITE_APP_USER_PASSWORD no .env'
      )
      return
    }

    async function login() {
      setStatus('loading')

      // Primeiro verifica se já existe uma sessão válida salva (evita
      // logar de novo a cada refresh da página)
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.user) {
        setUser(sessionData.session.user)
        setStatus('authenticated')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: APP_USER_EMAIL,
        password: APP_USER_PASSWORD,
      })

      if (error) {
        setError(error.message)
        return
      }

      setUser(data.user)
      setStatus('authenticated')
    }

    login()
  }, [user, setUser, setStatus, setError])

  return { user, status, errorMessage }
}