import React, { useState, useEffect } from 'react'
import api from '../servicos/api'

export default function VisualizadorResumos({ topicoId, topicoTitulo, disciplinaNome, aoNavegar }) {
  const [resumos, setResumos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get(`/topicos/${topicoId}/resumos`).then(({ data }) => {
      if (data.sucesso) setResumos(data.dados)
      setCarregando(false)
    }).catch(() => { setErro('Erro ao carregar resumos.'); setCarregando(false) })
  }, [topicoId])

  const renderizarMarkdown = (texto) => {
    if (!texto) return null
    return texto.split('\n').map((linha, i) => {
      let conteudo = linha
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/^- /, '<span class="text-slate-500 mr-1">•</span>')
      return <p key={i} className="mb-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: conteudo }} />
    })
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <button onClick={() => aoNavegar('topicos', { disciplinaId: null, disciplinaNome })} className="text-sm text-slate-400 hover:text-white transition mb-6 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Tópicos
      </button>

      <div className="mb-8">
        <p className="text-xs text-cyan-400 font-semibold mb-1">{disciplinaNome}</p>
        <h1 className="text-2xl font-bold text-white">{topicoTitulo}</h1>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Carregando...
        </div>
      ) : erro ? (
        <div className="py-12 text-center text-rose-400 card">{erro}</div>
      ) : resumos.length === 0 ? (
        <div className="py-12 text-center text-slate-500 card">Nenhum resumo disponível para este tópico.</div>
      ) : (
        <div className="space-y-6">
          {resumos.map((r) => (
            <div key={r.id} className="card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <h2 className="text-white font-semibold text-lg">{r.titulo}</h2>
                {r.url_pdf && (
                  <a
                    href={r.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg hover:text-white hover:border-slate-500 transition whitespace-nowrap"
                  >
                    Mapa mental (PDF)
                  </a>
                )}
              </div>

              <div className="text-slate-300 text-sm space-y-0.5">
                {renderizarMarkdown(r.conteudo)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}