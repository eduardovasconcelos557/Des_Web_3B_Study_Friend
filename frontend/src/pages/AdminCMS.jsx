import React, { useState, useEffect } from 'react'
import api from '../servicos/api'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import { usarIdioma } from '../i18n/IdiomaContexto'

const ABAS = ['Disciplinas', 'Tópicos', 'Resumos', 'Flashcards', 'Questões']
const ROTAS_ABA = {
  Disciplinas: 'disciplinas',
  'Tópicos': 'topicos',
  Resumos: 'resumos',
  Flashcards: 'flashcards',
  'Questões': 'questoes',
}

export default function AdminCMS({ aoNavegar }) {
  const { ehAdmin, autenticado } = usarAutenticacao()
  const { t, tDisciplina, tArea, tConteudo } = usarIdioma()
  const [aba, setAba] = useState('Disciplinas')
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [msg, setMsg] = useState('')

  const carregarDados = () => {
    setCarregando(true)
    api.get(`/admin/${ROTAS_ABA[aba]}`).then(({ data }) => {
      setDados(data.sucesso ? data.dados : [])
      setCarregando(false)
    }).catch(() => setCarregando(false))
  }

  useEffect(() => {
    if (autenticado && ehAdmin) carregarDados()
  }, [aba, autenticado, ehAdmin])

  if (!autenticado || !ehAdmin) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="card p-10 text-center space-y-4 max-w-md w-full">
          <h2 className="text-xl font-bold text-white">{t('admin.restritoTitulo')}</h2>
          <p className="text-sm text-slate-400">{t('admin.restritoTexto')}</p>
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
    if (carregando) return <div role="status" aria-label={t('comum.carregando')} className="py-10 text-center text-slate-400"><div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
    if (dados.length === 0) return <div className="py-10 text-center text-slate-400">{t('admin.nenhum')}</div>

    const colunas = Object.keys(dados[0]).filter((k) => k !== 'total_resumos' && k !== 'total_flashcards' && k !== 'total_questoes')

    return (
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              {colunas.map((c) => <th key={c} className="py-3 px-4 font-medium">{t(`admin.col.${c}`)}</th>)}
              <th className="py-3 px-4 font-medium">{t('admin.acoes')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {dados.map((item, i) => (
              <tr key={item.id || i} className="hover:bg-slate-800/30 transition">
                {colunas.map((c) => (
                  <td key={c} className="py-2.5 px-4 text-slate-300 max-w-xs truncate">
                    {String(valorLocalizado(item, c) ?? '').substring(0, 80)}
                  </td>
                ))}
                <td className="py-2.5 px-4">
                  <button onClick={() => excluir(item.id)} className="text-rose-400 hover:text-rose-300 text-xs">
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

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('admin.titulo')}</h1>
        <p className="text-sm text-slate-400 mt-1">{t('admin.subtitulo')}</p>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
          {t(msg)}
          <button onClick={() => setMsg('')} aria-label={t('admin.fecharMensagem')} className="font-bold ml-3">✕</button>
        </div>
      )}

      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {ABAS.map((a) => (
          <button key={a} onClick={() => setAba(a)}
            aria-pressed={aba === a}
            className={`text-sm px-4 py-1.5 rounded-lg border whitespace-nowrap transition ${
              aba === a ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-semibold' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
            }`}>
            {t(`admin.aba.${ROTAS_ABA[a]}`)}
          </button>
        ))}
      </div>

      {renderTabela()}
    </div>
  )
}