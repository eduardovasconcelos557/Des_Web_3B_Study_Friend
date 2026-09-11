import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import IconeDisciplina from '../components/IconeDisciplina'

export default function PaginaTopicos({ disciplinaId, disciplinaNome, area, disciplinaIcone, aoNavegar }) {
  const [topicos, setTopicos] = useState([])
  const [anoFiltro, setAnoFiltro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    setCarregando(true)
    const url = anoFiltro
      ? `/disciplinas/${disciplinaId}/topicos?ano_escolar=${anoFiltro}`
      : `/disciplinas/${disciplinaId}/topicos`
    api.get(url).then(({ data }) => {
      if (data.sucesso) setTopicos(data.dados)
      setCarregando(false)
    }).catch(() => setCarregando(false))
  }, [disciplinaId, anoFiltro])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <button onClick={() => aoNavegar('disciplinas')} className="text-sm text-slate-400 hover:text-white transition mb-6 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Disciplinas
      </button>

      <div className="mb-8 flex items-center gap-4">
        <span className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-center shrink-0">
          <IconeDisciplina icone={disciplinaIcone} tamanho={24} className="text-cyan-400" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-white">{disciplinaNome}</h1>
          <p className="text-sm text-slate-400 mt-1">{area}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { valor: '', rotulo: 'Todos' },
          { valor: '1', rotulo: '1º Ano' },
          { valor: '2', rotulo: '2º Ano' },
          { valor: '3', rotulo: '3º Ano' },
          { valor: 'ENEM', rotulo: 'ENEM' },
        ].map((a) => (
          <button
            key={a.valor}
            onClick={() => setAnoFiltro(a.valor)}
            className={`text-sm px-4 py-1.5 rounded-lg border transition ${
              anoFiltro === a.valor
                ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-semibold'
                : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
            }`}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Carregando...
        </div>
      ) : topicos.length === 0 ? (
        <div className="py-12 text-center text-slate-500 card">
          Nenhum tópico encontrado para este filtro.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topicos.map((t) => (
            <div key={t.id} className="card p-5 space-y-4">
              <div>
                <span className="text-xs text-slate-500">
                  {t.ano_escolar === 'ENEM' ? 'ENEM' : `${t.ano_escolar}º Ano`}
                </span>
                <h3 className="text-white font-semibold mt-1">{t.titulo}</h3>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {t.total_resumos > 0 && (
                  <button
                    onClick={() => aoNavegar('resumos', { topicoId: t.id, topicoTitulo: t.titulo, disciplinaNome })}
                    className="text-slate-400 hover:text-white transition"
                  >
                    Resumos · {t.total_resumos}
                  </button>
                )}
                {t.total_flashcards > 0 && (
                  <button
                    onClick={() => aoNavegar('flashcards', { topicoId: t.id, topicoTitulo: t.titulo, disciplinaNome })}
                    className="text-slate-400 hover:text-white transition"
                  >
                    Flashcards · {t.total_flashcards}
                  </button>
                )}
                {t.total_questoes > 0 && (
                  <button
                    onClick={() => aoNavegar('exercicios', { topicoId: t.id, disciplinaNome })}
                    className="text-slate-400 hover:text-white transition"
                  >
                    Questões · {t.total_questoes}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}