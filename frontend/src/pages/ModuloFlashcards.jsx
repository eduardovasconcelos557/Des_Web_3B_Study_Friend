import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarIdioma } from '../i18n/IdiomaContexto'

export default function ModuloFlashcards({ topicoId, topicoTitulo, disciplinaNome, aoNavegar }) {
  const { t, tDisciplina, tConteudo } = usarIdioma()
  const [flashcards, setFlashcards] = useState([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [virado, setVirado] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get(`/topicos/${topicoId}/flashcards`).then(({ data }) => {
      if (data.sucesso) setFlashcards(data.dados)
      setCarregando(false)
    }).catch(() => setCarregando(false))
  }, [topicoId])

  const card = flashcards[indiceAtual]
  const total = flashcards.length

  const proximo = () => { setIndiceAtual((i) => (i + 1) % total); setVirado(false) }
  const anterior = () => { setIndiceAtual((i) => (i - 1 + total) % total); setVirado(false) }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <button onClick={() => aoNavegar('topicos', { disciplinaId: null, disciplinaNome })} className="text-sm text-slate-400 hover:text-white transition mb-6 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {t('comum.voltarTopicos')}
      </button>

      <div className="mb-8 text-center">
        <p className="text-xs text-slate-400 mb-1">{tDisciplina(disciplinaNome)}</p>
        <h1 className="text-2xl font-bold text-white">{tConteudo('topicos', topicoId, 'titulo', topicoTitulo)}</h1>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          {t('comum.carregando')}
        </div>
      ) : total === 0 ? (
        <div className="py-12 text-center text-slate-400 card">{t('flashcards.nenhum')}</div>
      ) : (
        <div className="space-y-6">
          <div className="text-center" role="status" aria-live="polite">
            <span className="text-sm text-slate-400">{t('flashcards.contador', { atual: indiceAtual + 1, total })}</span>
          </div>

          <button
            type="button"
            className="block w-full text-left focus-visible:rounded-xl"
            onClick={() => setVirado(!virado)}
            aria-label={t(virado ? 'flashcards.mostrarPergunta' : 'flashcards.mostrarResposta')}
            aria-pressed={virado}
          >
            <div
              className="relative w-full h-64 sm:h-72 transition-transform duration-300"
              style={{ transformStyle: 'preserve-3d', transform: virado ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div
                className="absolute inset-0 card p-8 flex flex-col items-center justify-center text-center"
                style={{ backfaceVisibility: 'hidden' }}
                aria-hidden={virado}
              >
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">{t('flashcards.pergunta')}</p>
                <p className="text-white text-lg font-semibold leading-relaxed">{tConteudo('flashcards', card.id, 'frente', card.frente)}</p>
              </div>

              <div
                className="absolute inset-0 card p-8 flex flex-col items-center justify-center text-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                aria-hidden={!virado}
              >
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">{t('flashcards.resposta')}</p>
                <p className="text-emerald-300 text-base font-medium leading-relaxed">{tConteudo('flashcards', card.id, 'verso', card.verso)}</p>
              </div>
            </div>
          </button>

          <div className="flex items-center justify-center gap-3">
            <button onClick={anterior} className="btn-secondary">
              {t('flashcards.anterior')}
            </button>
            <button onClick={proximo} className="btn-primary">
              {t('flashcards.proximo')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}