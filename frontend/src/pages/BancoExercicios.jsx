import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import { usarIdioma } from '../i18n/IdiomaContexto'
import { EstadoVazio } from '../components/Ilustracao'

export default function BancoExercicios({ aoNavegar, topicoIdFiltro, disciplinaNomeFiltro, origem }) {
  const { autenticado } = usarAutenticacao()
  const { t, tDisciplina, tConteudo } = usarIdioma()
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
        ? 'bg-marca/10 border-marca text-tinta'
        : 'bg-superficie border-borda text-tinta hover:border-marca/50 hover:bg-marca/5'
    }
    const correta = resultados[qId].alternativa_correta === letra
    const selecionada = respostasEnviadas[qId] === letra
    if (correta) return 'bg-sucesso/10 border-sucesso text-tinta'
    if (selecionada && !correta) return 'bg-erro/10 border-erro text-tinta'
    return 'bg-elevada/60 border-borda text-suave'
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {topicoIdFiltro && origem?.disciplinaId && (
        <button onClick={() => aoNavegar('topicos', origem)} className="btn-voltar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('comum.voltarTopicos')}
        </button>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tinta mb-1">
          {topicoIdFiltro
            ? t('exercicios.tituloTopico', { nome: tDisciplina(disciplinaNomeFiltro || t('exercicios.topicoFallback')) })
            : t('exercicios.tituloBanco')}
        </h1>
        <p className="text-sm text-suave">
          {autenticado ? t('exercicios.subAutenticado') : t('exercicios.subDesautenticado')}
        </p>
      </div>

      {!topicoIdFiltro && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {['', 'FACIL', 'MEDIO', 'DIFICIL'].map((n) => (
            <button
              key={n}
              onClick={() => setNivelFiltro(n)}
              aria-pressed={nivelFiltro === n}
              className="chip"
            >
              {n === '' ? t('comum.todos') : n === 'FACIL' ? t('exercicios.facil') : n === 'MEDIO' ? t('exercicios.medio') : t('exercicios.dificil')}
            </button>
          ))}
        </div>
      )}

      {carregando ? (
        <div className="py-20 text-center text-suave">
          <div className="carregando"></div>
          {t('comum.carregando')}
        </div>
      ) : questoes.length === 0 ? (
        <EstadoVazio><p>{t('exercicios.nenhuma')}</p></EstadoVazio>
      ) : (
        <div className="space-y-5">
          {questoes.map((q) => {
            const opcoesOriginais = typeof q.opcoes === 'string' ? JSON.parse(q.opcoes) : q.opcoes
            const opcoes = tConteudo('questoes', q.id, 'opcoes', opcoesOriginais)
            return (
              <div key={q.id} className="card p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 text-xs text-suave">
                  <span className="selo uppercase">
                    {t(({ FACIL: 'exercicios.facil', MEDIO: 'exercicios.medio', DIFICIL: 'exercicios.dificil' })[q.nivel_dificuldade] || q.nivel_dificuldade)}
                  </span>
                  <span>{tDisciplina(q.disciplina)} · {tConteudo('topicos', q.topico_id, 'titulo', q.topico)}</span>
                </div>

                <p className="text-tinta font-medium text-sm sm:text-base leading-relaxed">
                  {tConteudo('questoes', q.id, 'enunciado', q.enunciado)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {opcoes.map((opcao, i) => {
                    const letra = String.fromCharCode(65 + i)
                    const enviada = respostasEnviadas[q.id]
                    return (
                      <button
                        key={letra}
                        onClick={() => enviarResposta(q.id, letra)}
                        disabled={!!enviada}
                        className={`text-left p-3.5 rounded-2xl border text-sm transition ${corAlternativa(q.id, letra)} ${enviada ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className="font-semibold mr-2">{letra})</span> {opcao}
                      </button>
                    )
                  })}
                </div>

                {resultados[q.id] && (
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    resultados[q.id].correta
                      ? 'bg-sucesso/10 border border-sucesso/40 text-tinta [&>p:first-child]:text-sucesso'
                      : 'bg-erro/10 border border-erro/40 text-tinta [&>p:first-child]:text-erro'
                  }`}>
                    <p className="font-semibold">
                      {resultados[q.id].correta ? t('exercicios.correto') : t('exercicios.incorreto')}
                      {!resultados[q.id].correta && <span>{t('exercicios.respostaCorreta', { letra: resultados[q.id].alternativa_correta })}</span>}
                    </p>
                    {resultados[q.id].gabarito_comentado && (
                      <p className="mt-1 text-xs opacity-90">
                        {tConteudo('questoes', q.id, 'gabarito_comentado', resultados[q.id].gabarito_comentado)}
                      </p>
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