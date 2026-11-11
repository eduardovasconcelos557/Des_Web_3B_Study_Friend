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
        <h1 className="text-2xl font-bold text-tinta">{t('navbar.disciplinas')}</h1>
        <p className="text-sm text-suave mt-1">
          {disciplinas.length} {t(disciplinas.length === 1 ? 'inicio.materiaSingular' : 'inicio.materiaPlural')}{t('inicio.organizadasPorArea')}
        </p>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-suave">
          <div className="carregando"></div>
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
                  <span className={`h-2.5 w-2.5 rounded-full ${cores.ponto}`}></span>
                  <h2 className="text-lg font-bold text-tinta">{nomeArea}</h2>
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
                      <h3 className="text-tinta font-semibold">{tDisciplina(d.nome)}</h3>
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