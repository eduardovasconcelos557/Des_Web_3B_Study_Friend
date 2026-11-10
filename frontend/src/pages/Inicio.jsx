import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import IconeDisciplina from '../components/IconeDisciplina'
import { corArea, agruparPorArea } from '../utilidades/areas'
import { usarIdioma } from '../i18n/IdiomaContexto'

export default function Inicio({ aoNavegar }) {
  const { t, tDisciplina, tArea } = usarIdioma()
  const [disciplinas, setDisciplinas] = useState([])

  useEffect(() => {
    api.get('/disciplinas').then(({ data }) => {
      if (data.sucesso) setDisciplinas(data.dados)
    })
  }, [])

  const areas = agruparPorArea(disciplinas)

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">{t('inicio.tagline')}</p>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight font-display">
            {t('inicio.titulo')}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            {t('inicio.subtitulo')}
          </p>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button onClick={() => aoNavegar('disciplinas')} className="btn-primary">
              {t('inicio.explorarDisciplinas')}
            </button>
            <button onClick={() => aoNavegar('exercicios')} className="btn-secondary">
              {t('inicio.bancoQuestoes')}
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white font-display">{t('navbar.disciplinas')}</h2>
          <p className="text-sm text-slate-300 mt-1">
            {disciplinas.length} {t(disciplinas.length === 1 ? 'inicio.materiaSingular' : 'inicio.materiaPlural')}{t('inicio.organizadasPorArea')}
          </p>
        </div>

        <div className="space-y-10">
          {areas.map(({ area, disciplinas: lista }) => {
            const cores = corArea(area)
            const nomeArea = tArea(area)
            return (
              <section key={area}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2.5 h-2.5 rounded-full ${cores.ponto}`}></span>
                  <h3 className="text-lg font-bold text-white">{nomeArea}</h3>
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
                      <h4 className="text-white font-semibold">{tDisciplina(d.nome)}</h4>
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </section>
    </div>
  )
}