// Regra de XP do app: cada sessão de prática concede XP proporcional
// à acurácia obtida. 100% de acurácia = XP_PER_PERFECT_SESSION pontos.
const XP_PER_PERFECT_SESSION = 10

export function calculateSessionXp(accuracy: number | null): number {
  if (accuracy === null) return 0
  return Math.round((accuracy / 100) * XP_PER_PERFECT_SESSION)
}

// Nível simples baseado em XP total acumulado: cada nível exige um
// pouco mais de XP que o anterior (escala leve, não agressiva).
const LEVEL_TITLES = ['Newbie', 'Learner', 'Speaker', 'Fluent', 'Master']

export function calculateLevel(totalXp: number): { level: number; title: string } {
  // 0-49 XP = nível 1, 50-149 = nível 2, 150-299 = nível 3, etc.
  const thresholds = [0, 50, 150, 300, 500]
  let level = 1
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXp >= thresholds[i]) {
      level = i + 1
      break
    }
  }
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  return { level, title }
}