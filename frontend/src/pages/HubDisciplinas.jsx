import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import IconeDisciplina from '../components/IconeDisciplina'
import { corArea, agruparPorArea } from '../utilidades/areas'
import { usarIdioma } from '../i18n/IdiomaContexto'

export default function HubDisciplinas({ aoNavegar }) {
  const { t, tDisciplina, tArea } = usarIdioma()
  const [disciplinas, setDisciplinas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/disciplinas').then(({ data }) => {
      if (data.sucesso) setDisciplinas(data.dados)
      setCarregando(false)
    }).catch(() => setCarregando(false))
  }, [])

  const areas = agruparPorArea(disciplinas)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t('navbar.disciplinas')}</h1>
        <p className="text-sm text-slate-300 mt-1">
          {disciplinas.length} {t(disciplinas.length === 1 ? 'inicio.materiaSingular' : 'inicio.materiaPlural')}{t('inicio.organizadasPorArea')}
        </p>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Carregando...
        </div>
      ) : (
        <div className="space-y-10">
          {areas.map(({ area, disciplinas: lista }) => {
            const cores = corArea(area)
            const nomeArea = tArea(area)
            return (
              <section key={area}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2.5 h-2.5 rounded-full ${cores.ponto}`}></span>
                  <h2 className="text-lg font-bold text-white">{nomeArea}</h2>
                  <span className="text-xs text-slate-400">{lista.length} {t(lista.length === 1 ? 'comum.disciplina' : 'comum.disciplinas')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lista.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => aoNavegar('topicos', { disciplinaId: d.id, disciplinaNome: d.nome, area: d.area_conhecimento, icone: d.icone })}
                      className="card p-5 text-left hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${cores.azulejo}`}>
                          <IconeDisciplina icone={d.icone} tamanho={22} className="text-white" />
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-800/60 rounded-full px-2 py-0.5">
                          {d.total_topicos} {t(d.total_topicos === 1 ? 'comum.topico' : 'comum.topicos')}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold">{tDisciplina(d.nome)}</h3>
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}