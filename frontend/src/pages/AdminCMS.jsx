import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import { usarIdioma } from '../i18n/IdiomaContexto'

const ABAS = ['Visão geral', 'Disciplinas', 'Tópicos', 'Resumos', 'Flashcards', 'Questões']
const ROTAS_ABA = {
  'Visão geral': 'metricas',
  Disciplinas: 'disciplinas',
  'Tópicos': 'topicos',
  Resumos: 'resumos',
  Flashcards: 'flashcards',
  'Questões': 'questoes',
}
const ROTULOS_PAGINAS = {
  inicio: 'navbar.inicio',
  disciplinas: 'navbar.disciplinas',
  topicos: 'topicos.titulo',
  resumos: 'admin.aba.resumos',
  flashcards: 'admin.aba.flashcards',
  exercicios: 'navbar.exercicios',
  dashboard: 'navbar.dashboard',
  login: 'login.titulo',
  registrar: 'registrar.titulo',
  admin: 'navbar.admin',
}

export default function AdminCMS({ aoNavegar }) {
  const { ehAdmin, autenticado } = usarAutenticacao()
  const { t, tDisciplina, tArea, tConteudo } = usarIdioma()
  const [aba, setAba] = useState('Visão geral')
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [metricas, setMetricas] = useState(null)
  const [erroMetricas, setErroMetricas] = useState(false)
  const [carregandoMetricas, setCarregandoMetricas] = useState(false)
  const [msg, setMsg] = useState('')

  const carregarDados = () => {
    setCarregando(true)
    api.get(`/admin/${ROTAS_ABA[aba]}`).then(({ data }) => {
      setDados(data.sucesso ? data.dados : [])
      setCarregando(false)
    }).catch(() => setCarregando(false))
  }

  useEffect(() => {
    if (!autenticado || !ehAdmin) return
    if (aba === 'Visão geral') {
      setCarregandoMetricas(true)
      setErroMetricas(false)
      api.get('/admin/metricas')
        .then(({ data }) => {
          if (!data.sucesso) throw new Error('Não foi possível carregar as métricas.')
          setMetricas(data.dados)
        })
        .catch(() => setErroMetricas(true))
        .finally(() => setCarregandoMetricas(false))
      return
    }
    carregarDados()
  }, [aba, autenticado, ehAdmin])

  if (!autenticado || !ehAdmin) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="card p-10 text-center space-y-4 max-w-md w-full">
          <h2 className="text-xl font-bold text-tinta">{t('admin.restritoTitulo')}</h2>
          <p className="text-sm text-suave">{t('admin.restritoTexto')}</p>
        </div>
      </div>
    )
  }

  const excluir = async (id) => {
    if (!confirm(t('admin.confirmExcluir'))) return
    await api.delete(`/admin/${ROTAS_ABA[aba]}/${id}`)
    setMsg('admin.excluido')
    carregarDados()
  }

  const valorLocalizado = (item, coluna) => {
    if (coluna === 'area_conhecimento') return tArea(item[coluna])
    if (coluna === 'disciplina' || (coluna === 'nome' && aba === 'Disciplinas')) return tDisciplina(item[coluna])
    if (coluna === 'topico') return tConteudo('topicos', item.topico_id, 'titulo', item[coluna])

    const tipo = {
      'Tópicos': 'topicos',
      Resumos: 'resumos',
      Flashcards: 'flashcards',
      'Questões': 'questoes',
    }[aba]
    if (!tipo) return item[coluna]
    if (coluna === 'titulo') return tConteudo(tipo, item.id, coluna, item[coluna])
    if (['conteudo', 'frente', 'verso', 'enunciado', 'gabarito_comentado'].includes(coluna)) {
      return tConteudo(tipo, item.id, coluna, item[coluna])
    }
    if (coluna === 'opcoes') {
      const opcoes = typeof item.opcoes === 'string' ? JSON.parse(item.opcoes) : item.opcoes
      return tConteudo(tipo, item.id, coluna, opcoes)
    }
    return item[coluna]
  }

  const renderTabela = () => {
    if (carregando) return <div role="status" aria-label={t('comum.carregando')} className="py-10 text-center text-suave"><div className="carregando mb-0"></div></div>
    if (dados.length === 0) return <div className="py-10 text-center text-suave">{t('admin.nenhum')}</div>

    const colunas = Object.keys(dados[0]).filter((k) => k !== 'total_resumos' && k !== 'total_flashcards' && k !== 'total_questoes')

    return (
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-suave border-b border-borda">
            <tr>
              {colunas.map((c) => <th key={c} className="py-3 px-4 font-medium">{t(`admin.col.${c}`)}</th>)}
              <th className="py-3 px-4 font-medium">{t('admin.acoes')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borda">
            {dados.map((item, i) => (
              <tr key={item.id || i} className="hover:bg-elevada transition">
                {colunas.map((c) => (
                  <td key={c} className="py-2.5 px-4 text-suave max-w-xs truncate">
                    {String(valorLocalizado(item, c) ?? '').substring(0, 80)}
                  </td>
                ))}
                <td className="py-2.5 px-4">
                  <button onClick={() => excluir(item.id)} className="text-erro hover:underline text-xs font-semibold">
                    {t('admin.excluir')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderVisaoGeral = () => {
    if (carregandoMetricas) {
      return <div role="status" aria-label={t('comum.carregando')} className="py-16 text-center text-suave"><div className="carregando mb-0"></div></div>
    }
    if (erroMetricas || !metricas) {
      return <div role="alert" className="card p-6 text-center text-erro">{t('admin.metricas.erro')}</div>
    }

    const cards = [
      { titulo: t('admin.metricas.perfis'), valor: metricas.total_perfis, detalhe: t('admin.metricas.estudantes', { total: metricas.total_estudantes }) },
      { titulo: t('admin.metricas.novosPerfis'), valor: metricas.novos_perfis_7_dias, detalhe: t('admin.metricas.ultimos7Dias') },
      { titulo: t('admin.metricas.acessos'), valor: metricas.acessos_7_dias, detalhe: t('admin.metricas.acessosDetalhe') },
      { titulo: t('admin.metricas.cliques'), valor: metricas.cliques_7_dias, detalhe: t('admin.metricas.cliquesDetalhe') },
      { titulo: t('admin.metricas.ativos'), valor: metricas.usuarios_ativos_7_dias, detalhe: t('admin.metricas.ultimos7Dias') },
      { titulo: t('admin.metricas.questoesRespondidas'), valor: metricas.questoes_respondidas, detalhe: t('admin.metricas.participacao') },
      { titulo: t('admin.metricas.conteudos'), valor: metricas.total_disciplinas + metricas.total_topicos + metricas.total_resumos + metricas.total_flashcards + metricas.total_questoes, detalhe: t('admin.metricas.conteudosDetalhe', { disciplinas: metricas.total_disciplinas, topicos: metricas.total_topicos, resumos: metricas.total_resumos, flashcards: metricas.total_flashcards, questoes: metricas.total_questoes }) },
    ]
    const maiorAtividade = Math.max(1, ...metricas.atividade_diaria.flatMap((dia) => [
      dia.acessos,
      dia.cadastros,
      dia.cliques,
      dia.visualizacoes,
    ]))
    const maiorUsoFuncao = Math.max(1, ...metricas.funcoes_mais_utilizadas.map((funcao) => funcao.interacoes))

    return (
      <section aria-label={t('admin.metricas.titulo')} className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.titulo} className="card p-5">
              <p className="text-sm font-medium text-suave">{card.titulo}</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-tinta">{card.valor.toLocaleString()}</p>
              <p className="mt-2 text-xs leading-relaxed text-suave">{card.detalhe}</p>
            </article>
          ))}
        </div>

        <div className="card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-lg font-bold">{t('admin.metricas.atividade')}</h2>
            <p className="mt-1 text-xs text-suave">{t('admin.metricas.atividadeDetalhe')}</p>
          </div>
          <div className="mb-4 flex flex-wrap gap-4 text-xs text-suave">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-marca" />{t('admin.metricas.acessos')}</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-roxo" />{t('admin.metricas.cadastros')}</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sucesso" />{t('admin.metricas.cliques')}</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-estrela" />{t('admin.metricas.visualizacoes')}</span>
          </div>
          <div className="grid grid-cols-7 gap-2 sm:gap-4" role="img" aria-label={t('admin.metricas.graficoDescricao')}>
            {metricas.atividade_diaria.map((dia) => (
              <div key={dia.data} className="flex min-w-0 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end justify-center gap-0.5 border-b border-borda sm:gap-1">
                  {[
                    ['acessos', 'bg-marca'],
                    ['cadastros', 'bg-roxo'],
                    ['cliques', 'bg-sucesso'],
                    ['visualizacoes', 'bg-estrela'],
                  ].map(([tipo, cor]) => (
                    <div
                      key={tipo}
                      title={`${t(`admin.metricas.${tipo}`)}: ${dia[tipo]}`}
                      className={`w-1/5 rounded-t transition-all sm:max-w-8 ${cor}`}
                      style={{ height: `${Math.max(dia[tipo] ? 8 : 0, (dia[tipo] / maiorAtividade) * 100)}%` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-suave sm:text-xs">{dia.data}</span>
                <span className="sr-only">{t('admin.metricas.diaResumo', { data: dia.data, acessos: dia.acessos, cadastros: dia.cadastros, cliques: dia.cliques, visualizacoes: dia.visualizacoes })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-lg font-bold">{t('admin.metricas.funcoes')}</h2>
            <p className="mt-1 text-xs text-suave">{t('admin.metricas.funcoesDetalhe')}</p>
          </div>
          {metricas.funcoes_mais_utilizadas.length === 0 ? (
            <p className="py-6 text-center text-sm text-suave">{t('admin.metricas.semDadosUso')}</p>
          ) : (
            <ol className="space-y-4">
              {metricas.funcoes_mais_utilizadas.map((funcao, indice) => (
                <li key={funcao.pagina} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold tabular-nums text-suave">{indice + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-tinta">{t(ROTULOS_PAGINAS[funcao.pagina])}</span>
                      <span className="shrink-0 text-xs tabular-nums text-suave">{funcao.visualizacoes.toLocaleString()} {t('admin.metricas.visualizacoes')} · {funcao.cliques.toLocaleString()} {t('admin.metricas.cliques')}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-elevada">
                      <div className="h-full rounded-full bg-gradient-to-r from-marca to-roxo" style={{ width: `${(funcao.interacoes / maiorUsoFuncao) * 100}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-tinta">{t('admin.titulo')}</h1>
        <p className="text-sm text-suave mt-1">{t('admin.subtitulo')}</p>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-2xl bg-sucesso/10 border border-sucesso/40 text-sucesso text-xs flex items-center justify-between">
          {t(msg)}
          <button onClick={() => setMsg('')} aria-label={t('admin.fecharMensagem')} className="font-bold ml-3">✕</button>
        </div>
      )}

      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {ABAS.map((a) => (
          <button key={a} onClick={() => setAba(a)}
            aria-pressed={aba === a}
            className={`chip whitespace-nowrap ${aba === a ? 'bg-marca/10 text-marca-texto' : ''}`}>
            {a === 'Visão geral' ? t('admin.aba.metricas') : t(`admin.aba.${ROTAS_ABA[a]}`)}
          </button>
        ))}
      </div>

      {aba === 'Visão geral' ? renderVisaoGeral() : renderTabela()}
    </div>
  )
}