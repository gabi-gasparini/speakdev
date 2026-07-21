export interface ComparisonResult {
  accuracy: number // 0-100
  missedWords: string[] // estavam no alvo, não foram ditas
  extraWords: string[] // foram ditas, não estavam no alvo
  wordsPerMinute: number
}

// Normaliza uma frase para comparação: minúsculas, sem pontuação, sem espaços extras
function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()-]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

export function compareSpeechToTarget(
  spokenText: string,
  targetText: string,
  durationMs: number
): ComparisonResult {
  const spokenWords = normalize(spokenText)
  const targetWords = normalize(targetText)

  // Conta quantas vezes cada palavra aparece no texto falado,
  // para lidar corretamente com palavras repetidas.
  const spokenCount = new Map<string, number>()
  for (const word of spokenWords) {
    spokenCount.set(word, (spokenCount.get(word) ?? 0) + 1)
  }

  const missedWords: string[] = []
  let matchedCount = 0

  for (const word of targetWords) {
    const remaining = spokenCount.get(word) ?? 0
    if (remaining > 0) {
      spokenCount.set(word, remaining - 1)
      matchedCount += 1
    } else {
      missedWords.push(word)
    }
  }

  // O que sobrou no mapa são palavras ditas que não estavam no alvo
  const extraWords: string[] = []
  for (const [word, count] of spokenCount.entries()) {
    for (let i = 0; i < count; i++) {
      extraWords.push(word)
    }
  }

  const accuracy = targetWords.length === 0 ? 0 : Math.round((matchedCount / targetWords.length) * 100)

  const minutes = durationMs / 60000
  const wordsPerMinute = minutes > 0 ? Math.round(spokenWords.length / minutes) : 0

  return { accuracy, missedWords, extraWords, wordsPerMinute }
}