import React, { createContext, useContext, useState, useEffect } from 'react'
import { dicionarios, NOMES_DISCIPLINAS, ROTULOS_AREAS } from './dicionarios'

const CHAVE_IDIOMA = 'idioma_study_friend'
const IDIOMA_PADRAO = 'pt-BR'

const IdiomaContexto = createContext(null)

function lerIdiomaSalvo() {
  try {
    const salvo = localStorage.getItem(CHAVE_IDIOMA)
    if (salvo && dicionarios[salvo]) return salvo
  } catch {
    // localStorage indisponível — usa o padrão
  }
  return IDIOMA_PADRAO
}

export function ProvedorIdioma({ children }) {
  const [idioma, setIdiomaState] = useState(lerIdiomaSalvo)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_IDIOMA, idioma)
    } catch {
      // ignora falha de persistência
    }
    document.documentElement.lang = idioma
  }, [idioma])

  const dicionario = dicionarios[idioma] || dicionarios[IDIOMA_PADRAO]

  const t = (chave, params) => {
    let texto = dicionario[chave] ?? dicionarios[IDIOMA_PADRAO][chave] ?? chave
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        texto = texto.replaceAll(`{${k}}`, String(v))
      })
    }
    return texto
  }

  const tDisciplina = (nome) => {
    if (!nome) return nome
    const traducoes = NOMES_DISCIPLINAS[nome]
    return (traducoes && traducoes[idioma]) || nome
  }

  const tArea = (area) => {
    if (!area) return area
    const rotulos = ROTULOS_AREAS[area]
    return (rotulos && rotulos[idioma]) || area
  }

  const definirIdioma = (novo) => {
    if (dicionarios[novo]) setIdiomaState(novo)
  }

  const valor = { idioma, definirIdioma, t, tDisciplina, tArea }

  return <IdiomaContexto.Provider value={valor}>{children}</IdiomaContexto.Provider>
}

export function usarIdioma() {
  const contexto = useContext(IdiomaContexto)
  if (!contexto) throw new Error('usarIdioma deve ser usado dentro de ProvedorIdioma')
  return contexto
}