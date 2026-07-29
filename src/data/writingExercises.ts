import type { Track } from '@/types/practice'

export interface WritingExercise {
  id: string
  track: Track
  topic: string
  promptPt: string
  targetEn: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const writingExercises: WritingExercise[] = [
  {
    id: 'w-everyday-001',
    track: 'everyday',
    topic: 'Restaurant',
    promptPt: 'Eu gostaria de pedir um café, por favor.',
    targetEn: 'I would like to order a coffee, please.',
    difficulty: 'beginner',
  },
  {
    id: 'w-everyday-002',
    track: 'everyday',
    topic: 'Small talk',
    promptPt: 'O tempo está muito bom essa semana.',
    targetEn: 'The weather has been really nice this week.',
    difficulty: 'beginner',
  },
  {
    id: 'w-everyday-003',
    track: 'everyday',
    topic: 'Travel',
    promptPt: 'Onde fica a estação de trem mais próxima?',
    targetEn: 'Where is the nearest train station?',
    difficulty: 'beginner',
  },
  {
    id: 'w-everyday-004',
    track: 'everyday',
    topic: 'Shopping',
    promptPt: 'Quanto custa essa camisa azul?',
    targetEn: 'How much does this blue shirt cost?',
    difficulty: 'beginner',
  },
  {
    id: 'w-tech-001',
    track: 'tech',
    topic: 'Project description',
    promptPt: 'Eu construí esse projeto usando React, TypeScript e Supabase.',
    targetEn: 'I built this project using React, TypeScript and Supabase.',
    difficulty: 'intermediate',
  },
  {
    id: 'w-tech-002',
    track: 'tech',
    topic: 'Interview',
    promptPt: 'Eu sou uma desenvolvedora front-end focada em criar interfaces limpas e acessíveis.',
    targetEn: 'I am a front-end developer focused on building clean and accessible interfaces.',
    difficulty: 'intermediate',
  },
  {
    id: 'w-tech-003',
    track: 'tech',
    topic: 'Debugging',
    promptPt: 'Eu encontrei um bug na função de autenticação.',
    targetEn: 'I found a bug in the authentication function.',
    difficulty: 'intermediate',
  },
  {
    id: 'w-tech-004',
    track: 'tech',
    topic: 'Code review',
    promptPt: 'Você poderia revisar minha pull request, por favor?',
    targetEn: 'Could you review my pull request, please?',
    difficulty: 'intermediate',
  },
]