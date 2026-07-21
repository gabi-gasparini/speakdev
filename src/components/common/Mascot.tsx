import happyImage from '@/assets/mascot/raccoon-mascot.png'
import sadImage from '@/assets/mascot/raccoon-mascot-sad.png'
import thinkingImage from '@/assets/mascot/raccoon-mascot-thinking.png'

export type MascotMood = 'happy' | 'sad' | 'thinking' | 'encouraging' | 'neutral'

interface MascotProps {
  mood?: MascotMood
  size?: number
  className?: string
}

// Mapeia cada humor para sua imagem real. "encouraging" e "neutral" usam
// a pose "thinking" como aproximação até existirem artes dedicadas.
const moodImages: Record<MascotMood, string> = {
  happy: happyImage,
  sad: sadImage,
  thinking: thinkingImage,
  encouraging: thinkingImage,
  neutral: thinkingImage,
}

// Mascote do SpeakDev: o guaxinim dev "Code. Learn. Speak. English."
export function Mascot({ mood = 'happy', size = 96, className = '' }: MascotProps) {
  return (
    <img
      src={moodImages[mood]}
      alt={`SpeakDev mascot, mood: ${mood}`}
      style={{ width: size, height: 'auto' }}
      className={className}
    />
  )
}