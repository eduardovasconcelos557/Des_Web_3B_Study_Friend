import React, { useState } from 'react'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import { usarIdioma } from '../i18n/IdiomaContexto'

export default function Login({ aoNavegar }) {
  const { login } = usarAutenticacao()
  const { t } = usarIdioma()
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
      setErro(err.response?.status === 401 ? 'login.erroCredenciais' : 'login.erro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-white">{t('login.titulo')}</h1>
          <p className="text-sm text-slate-400">{t('login.subtitulo')}</p>
        </div>

        <form onSubmit={aoSubmeter} className="card p-6 space-y-4" aria-busy={carregando}>
          {erro && (
            <div role="alert" className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs text-center">
              {t(erro)}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="label">{t('login.email')}</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder={t('login.placeholderEmail')}
            />
          </div>

          <div>
            <label htmlFor="login-senha" className="label">{t('login.senha')}</label>
            <input
              id="login-senha"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input"
              placeholder={t('login.placeholderSenha')}
            />
          </div>

          <button type="submit" disabled={carregando} className="btn-primary w-full py-3">
            {carregando ? t('login.entrando') : t('login.entrar')}
          </button>

          <p className="text-center text-sm text-slate-400">
            {t('login.semConta')}{' '}
            <button type="button" onClick={() => aoNavegar('registrar')} className="text-cyan-400 hover:text-cyan-300 transition">
              {t('login.cadastreSe')}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}