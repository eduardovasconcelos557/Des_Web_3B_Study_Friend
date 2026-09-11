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

  const corFundo = tipo === 'sucesso' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2.5 rounded-lg shadow-lg font-semibold text-sm transition-all duration-300 z-50 ${corFundo}`}
    >
      {mensagem}
    </div>
  )
}
