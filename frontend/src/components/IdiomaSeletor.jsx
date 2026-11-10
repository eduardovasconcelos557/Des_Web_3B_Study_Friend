import React, { useEffect, useRef, useState } from 'react'
import { BR, CA, MX } from 'country-flag-icons/react/3x2'
import { IDIOMAS } from '../i18n/dicionarios'
import { usarIdioma } from '../i18n/IdiomaContexto'

const COMPONENTES_BANDEIRA = { 'pt-BR': BR, 'en-CA': CA, 'es-419': MX }

function Bandeira({ codigo }) {
  const ComponenteBandeira = COMPONENTES_BANDEIRA[codigo] || BR
  return <ComponenteBandeira aria-hidden="true" focusable="false" className="h-4 w-6 rounded-[3px] shadow-sm" />
}

export default function IdiomaSeletor({ compacto = false, abrirAcima = false }) {
  const { idioma, definirIdioma, t } = usarIdioma()
  const [aberto, setAberto] = useState(false)
  const seletorRef = useRef(null)
  const botaoRef = useRef(null)
  const idiomaAtual = IDIOMAS.find((opcao) => opcao.codigo === idioma) || IDIOMAS[0]

  useEffect(() => {
    if (!aberto) return undefined

    const fecharFora = (evento) => {
      if (!seletorRef.current?.contains(evento.target)) setAberto(false)
    }
    const fecharEscape = (evento) => {
      if (evento.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', fecharFora)
    document.addEventListener('keydown', fecharEscape)
    return () => {
      document.removeEventListener('pointerdown', fecharFora)
      document.removeEventListener('keydown', fecharEscape)
    }
  }, [aberto])

  return (
    <div ref={seletorRef} className="relative w-fit">
      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-label={`${t('idioma.selecionar')}: ${idiomaAtual.rotulo}`}
        aria-expanded={aberto}
        aria-controls="opcoes-idioma"
        title={`${t('idioma.selecionar')}: ${idiomaAtual.rotulo}`}
        className={`inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/10 hover:text-white ${compacto ? 'min-w-11 justify-center px-2' : ''}`}
      >
        <Bandeira codigo={idioma} />
        <span className={compacto ? 'sr-only' : 'hidden lg:inline'}>{idiomaAtual.rotulo}</span>
        {!compacto && <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="m5.5 7.5 4.5 4 4.5-4" />
        </svg>}
      </button>

      {aberto && (
        <div
          id="opcoes-idioma"
          role="group"
          aria-label={t('idioma.opcoes')}
          className={`language-popover absolute z-[60] min-w-56 border border-white/20 bg-slate-900/75 p-1 backdrop-blur-2xl ${
            abrirAcima ? 'bottom-full right-0 mb-3' : 'left-0 top-full mt-2 md:left-auto md:right-0'
          }`}
        >
          {IDIOMAS.map((opcao) => (
            <button
              key={opcao.codigo}
              type="button"
              onClick={() => {
                definirIdioma(opcao.codigo)
                setAberto(false)
              }}
              aria-pressed={idioma === opcao.codigo}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800 aria-pressed:bg-slate-800"
            >
              <Bandeira codigo={opcao.codigo} />
              <span>{opcao.rotulo}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}