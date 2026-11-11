import React from 'react'
// Bandeiras em SVG detalhado (pacote flag-icons, licença MIT)
import bandeiraBR from 'flag-icons/flags/4x3/br.svg'
import bandeiraCA from 'flag-icons/flags/4x3/ca.svg'
import bandeiraMX from 'flag-icons/flags/4x3/mx.svg'
import { IDIOMAS } from '../i18n/dicionarios'
import { usarIdioma } from '../i18n/IdiomaContexto'
import usarPopover from './usarPopover'

const ARQUIVOS_BANDEIRA = { 'pt-BR': bandeiraBR, 'en-CA': bandeiraCA, 'es-419': bandeiraMX }

export function Bandeira({ codigo, circular = false, tamanho = 22 }) {
  const arquivo = ARQUIVOS_BANDEIRA[codigo] || bandeiraBR
  const largura = circular ? tamanho : Math.round(tamanho * (4 / 3))
  return (
    <span
      aria-hidden="true"
      className={`bandeira ${circular ? 'bandeira--circular' : ''}`}
      style={{ width: largura, height: tamanho }}
    >
      <img src={arquivo} alt="" width={largura} height={tamanho} decoding="async" draggable="false" />
    </span>
  )
}

// Lista de idiomas reutilizada no seletor da barra e no menu do celular
export function ListaIdiomas({ aoEscolher }) {
  const { idioma, definirIdioma, t } = usarIdioma()
  return (
    <div role="group" aria-label={t('idioma.opcoes')} className="flex flex-col gap-0.5">
      {IDIOMAS.map((opcao) => (
        <button
          key={opcao.codigo}
          type="button"
          onClick={() => {
            definirIdioma(opcao.codigo)
            aoEscolher?.()
          }}
          aria-pressed={idioma === opcao.codigo}
          className="opcao-menu"
        >
          <Bandeira codigo={opcao.codigo} tamanho={18} />
          <span className="flex-1">{opcao.rotulo}</span>
          {idioma === opcao.codigo && (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-marca-texto" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          )}
        </button>
      ))}
    </div>
  )
}

// Botão circular de vidro com a bandeira do idioma atual
export default function IdiomaSeletor({ className = '' }) {
  const { idioma, t } = usarIdioma()
  const { aberto, setAberto, containerRef, botaoRef, painelRef } = usarPopover()
  const idiomaAtual = IDIOMAS.find((opcao) => opcao.codigo === idioma) || IDIOMAS[0]

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-label={`${t('idioma.selecionar')}: ${idiomaAtual.rotulo}`}
        aria-expanded={aberto}
        aria-controls="opcoes-idioma"
        title={`${t('idioma.selecionar')}: ${idiomaAtual.rotulo}`}
        className="vidro botao-circular"
      >
        <Bandeira codigo={idioma} circular tamanho={30} />
      </button>

      {aberto && (
        <div id="opcoes-idioma" ref={painelRef} className="vidro popover-vidro">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-suave">
            {t('idioma.selecionar')}
          </p>
          <ListaIdiomas aoEscolher={() => setAberto(false)} />
        </div>
      )}
    </div>
  )
}
