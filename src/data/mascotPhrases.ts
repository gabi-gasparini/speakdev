export const homePhrases = [
  "Ready to practice today?",
  "Let's level up your English!",
  "Pick a track and let's go!",
  "I missed you! Let's practice.",
  "One step closer to fluency!",
]

export const everydayPhrases = [
  "Let's talk like a local!",
  "Real conversations, real progress.",
  "Speak it out loud, don't be shy!",
]

export const techPhrases = [
  "Let's talk code in English!",
  "Time to nail that interview!",
  "Explain your projects like a pro!",
]

export const successPhrases = [
  "Great job!",
  "You nailed it!",
  "Awesome pronunciation!",
  "Keep it up!",
]

export const encouragingPhrases = [
  "Almost there, try again!",
  "Practice makes perfect!",
  "You'll get it next time!",
  "Don't give up!",
]

// Retorna uma frase aleatória de uma lista
export function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)]
}

export const sadMascotPhrases = [
  "I'm feeling a bit lonely...",
  "I missed you today.",
  "Could use some attention here.",
  "Will you pet me, please?",
]

export const pettedMascotPhrases = [
  "Yay! Thank you!",
  "I feel so much better now!",
  "Let's practice together!",
  "Best part of my day!",
]