import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'

export default function Dashboard({ aoNavegar }) {
  const { usuario, autenticado } = usarAutenticacao()
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
          <h2 className="text-xl font-bold text-white">Acesse seu dashboard</h2>
          <p className="text-sm text-slate-400">Faça login para acompanhar seu desempenho.</p>
          <button onClick={() => aoNavegar('login')} className="btn-primary">
            Entrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Meu desempenho</h1>
        <p className="text-sm text-slate-400 mt-1">Olá, {usuario.nome}.</p>
      </div>

      {carregando ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Carregando...
        </div>
      ) : !stats ? (
        <div className="py-12 text-center text-slate-500 card">Erro ao carregar estatísticas.</div>
      ) : stats.total_resolvidas === 0 ? (
        <div className="py-12 text-center text-slate-500 card space-y-4">
          <p>Você ainda não resolveu nenhuma questão.</p>
          <button onClick={() => aoNavegar('exercicios')} className="btn-primary">
            Começar agora
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { titulo: 'Questões', valor: stats.total_resolvidas, cor: 'text-white' },
              { titulo: 'Acertos', valor: stats.total_acertos, cor: 'text-emerald-400' },
              { titulo: 'Erros', valor: stats.total_erros, cor: 'text-rose-400' },
              { titulo: 'Taxa de acerto', valor: `${stats.taxa_acerto}%`, cor: 'text-white' },
            ].map((c, i) => (
              <div key={i} className="card p-5 text-center">
                <p className="text-xs text-slate-500 mb-1">{c.titulo}</p>
                <p className={`text-2xl font-bold ${c.cor}`}>{c.valor}</p>
              </div>
            ))}
          </div>

          {stats.por_disciplina.length > 0 && (
            <div className="card p-6">
              <h3 className="text-white font-semibold mb-4">Por disciplina</h3>
              <div className="space-y-3">
                {stats.por_disciplina.map((d, i) => {
                  const taxa = d.resolvidas > 0 ? Math.round((d.acertos / d.resolvidas) * 100) : 0
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm text-slate-300 w-36 truncate">{d.disciplina}</span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${taxa}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500 w-16 text-right">{taxa}% · {d.acertos}/{d.resolvidas}</span>
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