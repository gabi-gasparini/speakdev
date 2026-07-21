interface SpeechBubbleProps {
  text: string
  className?: string
}

// Balão de fala estilo "comic", aponta para baixo (em direção ao mascote)
export function SpeechBubble({ text, className = '' }: SpeechBubbleProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="rounded-2xl border-2 border-text-primary bg-white px-5 py-3 shadow-[0_3px_0_0_rgba(38,38,40,1)]">
        <p className="text-sm font-extrabold text-text-primary">{text}</p>
      </div>
      {/* Rabicho do balão apontando para baixo */}
      <svg
        className="absolute -bottom-3 left-1/2 -translate-x-1/2"
        width="24"
        height="14"
        viewBox="0 0 24 14"
      >
        <path d="M0 0 L12 14 L24 0 Z" fill="white" stroke="#262628" strokeWidth="2" />
      </svg>
    </div>
  )
}