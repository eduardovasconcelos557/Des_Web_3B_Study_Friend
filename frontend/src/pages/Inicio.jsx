import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import IconeDisciplina from '../components/IconeDisciplina'
import { corArea, agruparPorArea } from '../utilidades/areas'
import { usarIdioma } from '../i18n/IdiomaContexto'
import Logo from '../components/Logo'
import Ilustracao from '../components/Ilustracao'

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

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pt-10 lg:px-8 lg:pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="space-y-5 text-center lg:text-left">
            <div className="flex justify-center lg:hidden">
              <Logo className="h-24" />
            </div>

            <p className="inline-flex items-center gap-2 rounded-full bg-roxo/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-roxo-texto">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-estrela-viva stroke-estrela-contorno" strokeWidth="1"><path d="M12 2c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" /></svg>
              {t('inicio.tagline')}
            </p>

            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-tinta text-balance sm:text-5xl">
              {t('inicio.titulo')}
            </h1>

            <p className="mx-auto max-w-xl text-base text-suave sm:text-lg lg:mx-0">
              {t('inicio.subtitulo')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
              <button onClick={() => aoNavegar('disciplinas')} className="btn-primary px-6 py-3">
                {t('inicio.explorarDisciplinas')}
              </button>
              <button onClick={() => aoNavegar('exercicios')} className="btn-secondary px-6 py-3">
                {t('inicio.bancoQuestoes')}
              </button>
            </div>
          </div>

          <Ilustracao tipo="estudos" className="mx-auto w-full max-w-[22rem] sm:max-w-md lg:max-w-none" />
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-tinta font-display">{t('navbar.disciplinas')}</h2>
          <p className="text-sm text-suave mt-1">
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
                  <span className={`h-2.5 w-2.5 rounded-full ${cores.ponto}`}></span>
                  <h3 className="text-lg font-bold text-tinta">{nomeArea}</h3>
                  <span className="text-xs text-suave">{lista.length} {t(lista.length === 1 ? 'comum.disciplina' : 'comum.disciplinas')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lista.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => aoNavegar('topicos', { disciplinaId: d.id, disciplinaNome: d.nome, area: d.area_conhecimento, icone: d.icone })}
                      className="card card-interativo p-5 text-left"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className={`pastilha ${cores.azulejo}`}>
                          <IconeDisciplina icone={d.icone} tamanho={22} />
                        </span>
                        <span className="selo">
                          {d.total_topicos} {t(d.total_topicos === 1 ? 'comum.topico' : 'comum.topicos')}
                        </span>
                      </div>
                      <h4 className="text-tinta font-semibold">{tDisciplina(d.nome)}</h4>
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