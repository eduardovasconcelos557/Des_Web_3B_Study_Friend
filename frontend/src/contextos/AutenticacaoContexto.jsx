import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../servicos/api'

const AutenticacaoContexto = createContext(null)

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Ao carregar a página, recupera a sessão do localStorage
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token_study_friend')
    const usuarioSalvo = localStorage.getItem('usuario_study_friend')
    if (tokenSalvo && usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo))
      } catch {
        localStorage.removeItem('token_study_friend')
        localStorage.removeItem('usuario_study_friend')
      }
    }
    setCarregando(false)
  }, [])

  const login = async (email, senha) => {
    const { data } = await api.post('/auth/login', { email, senha })
    if (!data.sucesso) throw new Error(data.mensagem || 'Falha no login.')
    localStorage.setItem('token_study_friend', data.token)
    localStorage.setItem('usuario_study_friend', JSON.stringify(data.usuario))
    setUsuario(data.usuario)
    return data
  }

  const registrar = async (nome, email, senha) => {
    const { data } = await api.post('/auth/registrar', { nome, email, senha })
    if (!data.sucesso) throw new Error(data.erros ? data.erros.join(' ') : data.mensagem)
    localStorage.setItem('token_study_friend', data.token)
    localStorage.setItem('usuario_study_friend', JSON.stringify(data.usuario))
    setUsuario(data.usuario)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token_study_friend')
    localStorage.removeItem('usuario_study_friend')
    setUsuario(null)
  }

  const ehAdmin = usuario?.perfil === 'ADMIN'
  const autenticado = !!usuario

  return (
    <AutenticacaoContexto.Provider value={{ usuario, autenticado, ehAdmin, carregando, login, registrar, logout }}>
      {children}
    </AutenticacaoContexto.Provider>
  )
}

export function usarAutenticacao() {
  const contexto = useContext(AutenticacaoContexto)
  if (!contexto) throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao')
  return contexto
}
