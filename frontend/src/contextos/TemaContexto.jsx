import React, { createContext, useContext, useEffect, useState } from 'react'

const CHAVE_TEMA = 'tema_study_friend'
const TemaContexto = createContext(null)

function lerTemaSalvo() {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA)
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch {
    // localStorage indisponível — usa o padrão
  }
  return 'claro'
}

export function ProvedorTema({ children }) {
  const [tema, setTema] = useState(lerTemaSalvo)

  useEffect(() => {
    const escuro = tema === 'escuro'
    document.documentElement.classList.toggle('dark', escuro)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', escuro ? '#0B0F1C' : '#F7F8FB')
    try {
      localStorage.setItem(CHAVE_TEMA, tema)
    } catch {
      // ignora
    }
  }, [tema])

  const alternarTema = () => setTema((atual) => (atual === 'escuro' ? 'claro' : 'escuro'))

  return (
    <TemaContexto.Provider value={{ tema, escuro: tema === 'escuro', alternarTema }}>
      {children}
    </TemaContexto.Provider>
  )
}

export function usarTema() {
  return useContext(TemaContexto)
}
