import React, { useState } from 'react'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'

export default function Login({ aoNavegar }) {
  const { login } = usarAutenticacao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const aoSubmeter = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(email, senha)
      aoNavegar('dashboard')
    } catch (err) {
      setErro(err.response?.data?.mensagem || err.message || 'Falha ao entrar.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-white">Entrar</h1>
          <p className="text-sm text-slate-400">Acesse sua conta para salvar seu progresso.</p>
        </div>

        <form onSubmit={aoSubmeter} className="card p-6 space-y-4">
          {erro && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs text-center">
              {erro}
            </div>
          )}

          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="label">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button type="submit" disabled={carregando} className="btn-primary w-full py-3">
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Não tem conta?{' '}
            <button type="button" onClick={() => aoNavegar('registrar')} className="text-cyan-400 hover:text-cyan-300 transition">
              Cadastre-se
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}