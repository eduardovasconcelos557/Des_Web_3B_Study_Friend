import { useEffect, useRef, useState } from 'react'

// Controla um popover: fecha ao clicar fora ou com Esc (devolvendo o foco
// ao botão) e leva o foco para a primeira opção quando abre.
export default function usarPopover() {
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef(null)
  const botaoRef = useRef(null)
  const painelRef = useRef(null)

  useEffect(() => {
    if (!aberto) return undefined

    const fecharFora = (evento) => {
      if (!containerRef.current?.contains(evento.target)) setAberto(false)
    }
    const fecharEscape = (evento) => {
      if (evento.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }

    painelRef.current?.querySelector('button')?.focus()
    document.addEventListener('pointerdown', fecharFora)
    document.addEventListener('keydown', fecharEscape)
    return () => {
      document.removeEventListener('pointerdown', fecharFora)
      document.removeEventListener('keydown', fecharEscape)
    }
  }, [aberto])

  return { aberto, setAberto, containerRef, botaoRef, painelRef }
}
