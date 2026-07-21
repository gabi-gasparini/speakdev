// Espelha os valores aceitos pelos `check` constraints do banco
export type Track = 'everyday' | 'tech'
export type PracticeMode = 'speaking' | 'writing'

// ----------------------------
// Linha bruta da tabela practice_sessions (snake_case, igual ao Supabase)
// ----------------------------
export interface PracticeSessionRow {
  id: string
  user_id: string
  track: Track
  mode: PracticeMode
  topic: string
  prompt: string
  target_text: string | null
  user_input: string
  accuracy: number | null
  words_per_minute: number | null
  feedback: WritingFeedback | SpeechFeedback | null
  created_at: string
}

// Dados necessários para criar uma sessão nova (sem campos gerados pelo banco)
export interface NewPracticeSession {
  track: Track
  mode: PracticeMode
  topic: string
  prompt: string
  target_text?: string | null
  user_input: string
  accuracy?: number | null
  words_per_minute?: number | null
  feedback?: WritingFeedback | SpeechFeedback | null
}

// ----------------------------
// Resultado de uma tentativa de fala (Web Speech API)
// ----------------------------
export interface SpeechFeedback {
  spokenText: string
  targetText: string
  missedWords: string[]
  extraWords: string[]
  durationMs: number
}

// ----------------------------
// Resultado de uma correção de escrita
// ----------------------------
export interface WritingFeedback {
  correctedText: string
  issues: WritingIssue[]
  overallScore: number
}

export interface WritingIssue {
  original: string
  suggestion: string
  explanation: string
  type: 'grammar' | 'vocabulary' | 'style' | 'punctuation'
}

// ----------------------------
// vocabulary_words
// ----------------------------
export interface VocabularyWordRow {
  id: string
  user_id: string
  track: Track
  word: string
  translation: string | null
  example_sentence: string | null
  created_at: string
}

export interface NewVocabularyWord {
  track: Track
  word: string
  translation?: string | null
  example_sentence?: string | null
}

// ----------------------------
// user_progress
// ----------------------------
export interface UserProgressRow {
  user_id: string
  track: Track
  total_sessions: number
  average_accuracy: number
  current_streak: number
  last_practiced_at: string | null
}

// ----------------------------
// Conteúdo estático (banco de exercícios em data/)
// ----------------------------
export interface PracticeItem {
  id: string
  track: Track
  mode: PracticeMode
  topic: string
  prompt: string
  targetText?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// ----------------------------
// Diálogos de conversação (aula de conversação real)
// ----------------------------
export type Speaker = 'user' | 'other'

export interface DialogueLine {
  id: string
  speaker: Speaker
  speakerName: string
  text: string
  translation: string
}

export interface DialogueExercise {
  id: string
  track: Track
  topic: string
  description: string
  userRole: string // nome do personagem que o usuário vai interpretar
  otherRole: string // nome do outro personagem
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lines: DialogueLine[]
}

// Resultado de uma fala individual dentro do diálogo
export interface DialogueLineResult {
  lineId: string
  spokenText: string
  accuracy: number
  missedWords: string[]
  extraWords: string[]
  wordsPerMinute: number
}