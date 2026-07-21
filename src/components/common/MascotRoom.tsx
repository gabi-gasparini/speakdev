import { useMemo, useState } from 'react'
import { Mascot } from './Mascot'
import { SpeechBubble } from './SpeechBubble'
import { RoomBackground } from './RoomBackground'
import { useMascotStore } from '@/store/mascotStore'
import {
  sadMascotPhrases,
  pettedMascotPhrases,
  getRandomPhrase,
} from '@/data/mascotPhrases'

// Cena do "quarto" do mascote: ele aparece triste e sentado/cansado até o
// usuário fazer carinho nele (uma vez por dia), o que cria um pequeno
// ritual diário de abrir o app, parecido com cuidar de um bichinho virtual.
export function MascotRoom() {
  const hasPettedToday = useMascotStore((state) => state.hasPettedToday())
  const petMascot = useMascotStore((state) => state.petMascot)
  const resetMascot = useMascotStore((state) => state.resetMascot)

  const [justPetted, setJustPetted] = useState(false)
  const isHappy = hasPettedToday || justPetted

  const phrase = useMemo(
    () =>
      isHappy
        ? getRandomPhrase(pettedMascotPhrases)
        : getRandomPhrase(sadMascotPhrases),
    [isHappy]
  )

  function handlePet() {
    petMascot()
    setJustPetted(true)
  }

  function handleReset() {
    resetMascot()
    setJustPetted(false)
  }

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-3xl border-2 border-text-primary shadow-[0_4px_0_0_rgba(43,42,40,1)]">
      <RoomBackground />

      {/* A pose triste é sentada (mais baixa e larga), então o balão
          fica posicionado um pouco mais alto e à esquerda do centro
          para não sobrepor a cabeça do guaxinim em nenhuma das poses. */}
      <div className="absolute inset-0 flex flex-col items-center">
        <div className={isHappy ? 'mt-6' : 'mt-10'}>
          <SpeechBubble text={phrase} />
        </div>

        <div className="flex flex-1 items-end justify-center pb-4">
          <Mascot mood={isHappy ? 'happy' : 'sad'} size={isHappy ? 150 : 140} />
        </div>
      </div>

      {!isHappy && (
        <button
          type="button"
          onClick={handlePet}
          className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border-2 border-text-primary bg-white px-4 py-2 text-sm font-extrabold text-text-primary shadow-[0_3px_0_0_rgba(43,42,40,1)] transition-transform active:translate-y-1 active:shadow-none"
        >
          <span>🤚</span>
          Pet him
        </button>
      )}

      {/* Botão de desenvolvimento: nunca aparece em build de produção */}
      {import.meta.env.DEV && isHappy && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute bottom-5 right-5 rounded-full border-2 border-text-secondary bg-white px-3 py-1.5 text-xs font-bold text-text-secondary opacity-70 transition-opacity hover:opacity-100"
        >
          🔧 Reset (dev)
        </button>
      )}
    </div>
  )
}