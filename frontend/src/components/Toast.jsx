import React, { useEffect } from 'react'

export default function Toast({ mensagem, tipo, visivel, aoFechar }) {
  useEffect(() => {
    if (visivel) {
      const temporizador = setTimeout(() => {
        if (aoFechar) aoFechar()
      }, 4000)
      return () => clearTimeout(temporizador)
    }
  }, [visivel, aoFechar])

  if (!visivel) return null

  const sucesso = tipo === 'sucesso'

  return (
    <div
      role="status"
      aria-live="polite"
      className="animar-deslizar fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-borda bg-superficie py-3 pl-4 pr-5 text-sm font-semibold text-tinta shadow-cartao-hover sm:left-auto sm:right-6 sm:translate-x-0"
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${sucesso ? 'bg-sucesso' : 'bg-erro'} text-white dark:text-fundo`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          {sucesso ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <path d="M12 7v6M12 17h.01" />}
        </svg>
      </span>
      {mensagem}
    </div>
  )
}
