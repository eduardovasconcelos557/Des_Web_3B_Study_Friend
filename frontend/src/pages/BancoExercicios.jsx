import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'

export default function BancoExercicios({ aoNavegar, topicoIdFiltro, disciplinaNomeFiltro }) {
  const { autenticado } = usarAutenticacao()
  const [questoes, setQuestoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [nivelFiltro, setNivelFiltro] = useState('')
  const [respostasEnviadas, setRespostasEnviadas] = useState({})
  const [resultados, setResultados] = useState({})

  useEffect(() => {
    setCarregando(true)
    const params = new URLSearchParams()
    if (topicoIdFiltro) params.set('topico_id', topicoIdFiltro)
    if (nivelFiltro) params.set('nivel_dificuldade', nivelFiltro)
    api.get(`/questoes?${params.toString()}`).then(({ data }) => {
      if (data.sucesso) setQuestoes(data.dados)
      setCarregando(false)
    }).catch(() => setCarregando(false))
  }, [nivelFiltro, topicoIdFiltro])

  const enviarResposta = async (questaoId, alternativa) => {
    if (!autenticado || respostasEnviadas[questaoId]) return
    try {
      const { data } = await api.post('/questoes/responder', { questao_id: questaoId, alternativa })
      if (data.sucesso) {
        setRespostasEnviadas((prev) => ({ ...prev, [questaoId]: alternativa }))
        setResultados((prev) => ({ ...prev, [questaoId]: data }))
      }
    } catch (err) {
      if (err.response?.status === 401) aoNavegar('login')
    }
  }

  const corAlternativa = (qId, letra) => {
    if (!resultados[qId]) {
      return respostasEnviadas[qId] === letra
        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
    }
    const correta = resultados[qId].alternativa_correta === letra
    const selecionada = respostasEnviadas[qId] === letra
    if (correta) return 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
    if (selecionada && !correta) return 'bg-rose-500/15 border-rose-500 text-rose-300'
    return 'bg-slate-950 border-slate-800 text-slate-500'
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {topicoIdFiltro ? `Exercícios — ${disciplinaNomeFiltro || 'Tópico'}` : 'Banco de Exercícios'}
        </h1>
        <p className="text-sm text-slate-400">
          {autenticado ? 'Resolva as questões e acompanhe seu progresso.' : 'Faça login para salvar seu progresso.'}
        </p>
      </div>

      {!topicoIdFiltro && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {['', 'FACIL', 'MEDIO', 'DIFICIL'].map((n) => (
            <button
              key={n}
              onClick={() => setNivelFiltro(n)}
              className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                nivelFiltro === n
                  ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-semibold'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              {n === '' ? 'Todos' : n === 'FACIL' ? 'Fácil' : n === 'MEDIO' ? 'Médio' : 'Difícil'}
            </button>
          ))}
        </div>
      )}

      {carregando ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Carregando...
        </div>
      ) : questoes.length === 0 ? (
        <div className="py-12 text-center text-slate-500 card">Nenhuma questão encontrada.</div>
      ) : (
        <div className="space-y-5">
          {questoes.map((q) => {
            const opcoes = typeof q.opcoes === 'string' ? JSON.parse(q.opcoes) : q.opcoes
            return (
              <div key={q.id} className="card p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span className="uppercase">{q.nivel_dificuldade}</span>
                  <span>{q.disciplina} · {q.topico}</span>
                </div>

                <p className="text-white font-medium text-sm sm:text-base leading-relaxed">{q.enunciado}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {opcoes.map((opcao, i) => {
                    const letra = String.fromCharCode(65 + i)
                    const enviada = respostasEnviadas[q.id]
                    return (
                      <button
                        key={letra}
                        onClick={() => enviarResposta(q.id, letra)}
                        disabled={!!enviada}
                        className={`text-left p-3 rounded-lg border text-sm transition ${corAlternativa(q.id, letra)} ${enviada ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className="font-semibold mr-2">{letra})</span> {opcao}
                      </button>
                    )
                  })}
                </div>

                {resultados[q.id] && (
                  <div className={`p-4 rounded-lg text-sm leading-relaxed ${
                    resultados[q.id].correta
                      ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/40 text-rose-300'
                  }`}>
                    <p className="font-semibold">
                      {resultados[q.id].correta ? 'Correto.' : 'Incorreto.'}
                      {!resultados[q.id].correta && <span> Resposta correta: {resultados[q.id].alternativa_correta}.</span>}
                    </p>
                    {resultados[q.id].gabarito_comentado && (
                      <p className="mt-1 text-xs opacity-90">{resultados[q.id].gabarito_comentado}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}