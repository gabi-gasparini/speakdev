import { useCallback, useEffect, useRef, useState } from 'react'

// A Web Speech API não tem types oficiais no TS por padrão.
// Declaramos o mínimo necessário aqui.
interface SpeechRecognitionResultLike {
  transcript: string
}

interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<ArrayLike<SpeechRecognitionResultLike> & { isFinal: boolean }>
  resultIndex: number
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

// idle -> nada acontecendo
// listening -> microfone ativo, capturando fala
// finalizing -> stop() foi chamado, esperando o navegador confirmar o fim (onend)
// done -> onend disparou, transcript final está pronto para uso
export type SpeechRecognitionStatus = 'idle' | 'listening' | 'finalizing' | 'done' | 'error'

interface UseSpeechRecognitionOptions {
  lang?: string
}

export function useSpeechRecognition({ lang = 'en-US' }: UseSpeechRecognitionOptions = {}) {
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState<SpeechRecognitionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [durationMs, setDurationMs] = useState(0)

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const startedAtRef = useRef<number | null>(null)
  // Guarda o transcript mais atual fora do React state, para o onend
  // conseguir ler o valor definitivo sem depender de closures desatualizadas.
  const transcriptRef = useRef('')

  const isSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognitionImpl = window.SpeechRecognition ?? window.webkitSpeechRecognition!
    const recognition = new SpeechRecognitionImpl()
    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const resultList = event.results[i]
        const result = resultList[0]
        if (!result) continue

        if (resultList.isFinal) {
          finalText += `${result.transcript} `
        } else {
          interimText += result.transcript
        }
      }

      const combined = (finalText + interimText).trim()
      transcriptRef.current = combined
      setTranscript(combined)
    }

    recognition.onerror = () => {
      setErrorMessage('Could not access the microphone. Please check your permissions.')
      setStatus('error')
    }

    // Só aqui sabemos com certeza que o navegador parou de processar.
    // É o único momento seguro para considerar o resultado "definitivo".
    recognition.onend = () => {
      setDurationMs(startedAtRef.current ? Date.now() - startedAtRef.current : 0)
      setStatus('done')
    }

    recognitionRef.current = recognition

    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
    }
  }, [lang, isSupported])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    transcriptRef.current = ''
    setTranscript('')
    setErrorMessage(null)
    startedAtRef.current = Date.now()
    setStatus('listening')
    recognitionRef.current.start()
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    // Marca "finalizing" imediatamente para a UI já reagir (ex: desabilitar
    // o botão), mas o status real só vira "done" quando onend confirmar.
    setStatus('finalizing')
    recognitionRef.current.stop()
  }, [])

  const reset = useCallback(() => {
    transcriptRef.current = ''
    setTranscript('')
    setErrorMessage(null)
    setStatus('idle')
    setDurationMs(0)
    startedAtRef.current = null
  }, [])

  return {
    isSupported,
    status,
    transcript,
    errorMessage,
    durationMs,
    startListening,
    stopListening,
    reset,
  }
}