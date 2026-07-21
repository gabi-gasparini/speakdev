import { supabase } from '@/lib/supabaseClient'
import type {
  NewPracticeSession,
  NewVocabularyWord,
  PracticeSessionRow,
  Track,
  VocabularyWordRow,
} from '@/types/practice'

// ----------------------------
// practice_sessions
// ----------------------------

export async function createPracticeSession(
  userId: string,
  session: NewPracticeSession
): Promise<PracticeSessionRow> {
  const { data, error } = await supabase
    .from('practice_sessions')
    .insert({ ...session, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPracticeSessions(
  userId: string,
  track?: Track,
  limit = 20
): Promise<PracticeSessionRow[]> {
  let query = supabase
    .from('practice_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (track) {
    query = query.eq('track', track)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

// ----------------------------
// vocabulary_words
// ----------------------------

export async function addVocabularyWord(
  userId: string,
  word: NewVocabularyWord
): Promise<VocabularyWordRow> {
  const { data, error } = await supabase
    .from('vocabulary_words')
    .insert({ ...word, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getVocabularyWords(
  userId: string,
  track?: Track
): Promise<VocabularyWordRow[]> {
  let query = supabase
    .from('vocabulary_words')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (track) {
    query = query.eq('track', track)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function deleteVocabularyWord(wordId: string): Promise<void> {
  const { error } = await supabase.from('vocabulary_words').delete().eq('id', wordId)
  if (error) throw error
}