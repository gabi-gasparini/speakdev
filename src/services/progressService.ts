import { supabase } from '@/lib/supabaseClient'
import type { Track, UserProgressRow } from '@/types/practice'

// Busca o progresso de uma trilha específica.
// Retorna null se o usuário ainda não praticou nada nessa trilha
// (a linha só é criada pelo trigger após a primeira sessão).
export async function getUserProgress(
  userId: string,
  track: Track
): Promise<UserProgressRow | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('track', track)
    .maybeSingle()

  if (error) throw error
  return data
}

// Busca o progresso das duas trilhas de uma vez (útil para o Dashboard)
export async function getAllUserProgress(userId: string): Promise<UserProgressRow[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data ?? []
}