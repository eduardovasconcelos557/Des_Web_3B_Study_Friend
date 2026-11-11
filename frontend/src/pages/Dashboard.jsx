import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import { usarIdioma } from '../i18n/IdiomaContexto'
import Ilustracao, { EstadoVazio } from '../components/Ilustracao'

export default function Dashboard({ aoNavegar }) {
  const { usuario, autenticado } = usarAutenticacao()
  const { t, tDisciplina } = usarIdioma()
  const [stats, setStats] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!autenticado) { setCarregando(false); return }
    api.get('/aluno/estatisticas').then(({ data }) => {
      if (data.sucesso) setStats(data.dados)
      setCarregando(false)
    }).catch(() => setCarregando(false))
  }, [autenticado])

  if (!autenticado) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="card p-10 text-center space-y-4 max-w-md w-full">
          <Ilustracao tipo="progresso" className="mx-auto h-28 w-40" />
          <h2 className="text-xl font-bold text-tinta">{t('dashboard.acessoTitulo')}</h2>
          <p className="text-sm text-suave">{t('dashboard.acessoTexto')}</p>
          <button onClick={() => aoNavegar('login')} className="btn-primary">
            {t('login.entrar')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tinta">{t('dashboard.titulo')}</h1>
        <p className="text-sm text-suave mt-1">{t('dashboard.ola', { nome: usuario.nome })}</p>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-suave">
          <div className="carregando"></div>
          {t('comum.carregando')}
        </div>
      ) : !stats ? (
        <div className="py-12 text-center text-suave card">{t('dashboard.erro')}</div>
      ) : stats.total_resolvidas === 0 ? (
        <EstadoVazio tipo="progresso">
          <p>{t('dashboard.vazio')}</p>
          <button onClick={() => aoNavegar('exercicios')} className="btn-primary">
            {t('dashboard.comecar')}
          </button>
        </EstadoVazio>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { titulo: t('dashboard.cardQuestoes'), valor: stats.total_resolvidas, cor: 'text-tinta' },
              { titulo: t('dashboard.cardAcertos'), valor: stats.total_acertos, cor: 'text-sucesso' },
              { titulo: t('dashboard.cardErros'), valor: stats.total_erros, cor: 'text-erro' },
              { titulo: t('dashboard.cardTaxa'), valor: `${stats.taxa_acerto}%`, cor: 'text-tinta' },
            ].map((c, i) => (
              <div key={i} className="card p-5 text-center">
                <p className="text-xs text-suave mb-1">{c.titulo}</p>
                <p className={`text-2xl font-bold ${c.cor}`}>{c.valor}</p>
              </div>
            ))}
          </div>

          {stats.por_disciplina.length > 0 && (
            <div className="card p-6">
              <h3 className="text-tinta font-semibold mb-4">{t('dashboard.porDisciplina')}</h3>
              <div className="space-y-3">
                {stats.por_disciplina.map((d, i) => {
                  const taxa = d.resolvidas > 0 ? Math.round((d.acertos / d.resolvidas) * 100) : 0
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-suave w-36 truncate">{tDisciplina(d.disciplina)}</span>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-elevada">
                        <div className="h-full rounded-full bg-gradient-to-r from-marca to-roxo transition-all" style={{ width: `${taxa}%` }}></div>
                      </div>
                      <span className="text-xs text-suave w-20 text-right tabular-nums">{taxa}% · {d.acertos}/{d.resolvidas}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}