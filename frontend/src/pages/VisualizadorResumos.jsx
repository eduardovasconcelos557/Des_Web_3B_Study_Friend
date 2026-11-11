import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarIdioma } from '../i18n/IdiomaContexto'
import { EstadoVazio } from '../components/Ilustracao'

export default function VisualizadorResumos({ topicoId, topicoTitulo, disciplinaNome, origem, aoNavegar }) {
  const { t, tDisciplina, tConteudo } = usarIdioma()
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
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-tinta font-semibold bg-estrela/30 rounded px-0.5">$1</strong>')
        .replace(/^- /, '<span class="text-marca mr-1">•</span>')
      return <p key={i} className="mb-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: conteudo }} />
    })
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <button onClick={() => (origem?.disciplinaId ? aoNavegar('topicos', origem) : aoNavegar('disciplinas'))} className="btn-voltar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {t('comum.voltarTopicos')}
      </button>

      <div className="mb-8">
        <p className="text-xs text-marca-texto font-semibold mb-1">{tDisciplina(disciplinaNome)}</p>
        <h1 className="text-2xl font-bold text-tinta">{tConteudo('topicos', topicoId, 'titulo', topicoTitulo)}</h1>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-suave">
          <div className="carregando"></div>
          {t('comum.carregando')}
        </div>
      ) : erro ? (
        <div className="py-12 text-center text-erro card">{t('resumos.erro')}</div>
      ) : resumos.length === 0 ? (
        <EstadoVazio><p>{t('resumos.nenhum')}</p></EstadoVazio>
      ) : (
        <div className="space-y-6">
          {resumos.map((r) => (
            <div key={r.id} className="card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-borda">
                <h2 className="text-tinta font-semibold text-lg">{tConteudo('resumos', r.id, 'titulo', r.titulo)}</h2>
                {r.url_pdf && (
                  <a
                    href={r.url_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip"
                  >
                    {t('resumos.mapaMental')}
                  </a>
                )}
              </div>

              <div className="text-suave text-sm space-y-0.5">
                {renderizarMarkdown(tConteudo('resumos', r.id, 'conteudo', r.conteudo))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}