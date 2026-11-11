import React, { useState } from 'react'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import { usarIdioma } from '../i18n/IdiomaContexto'

export default function Registrar({ aoNavegar }) {
  const { registrar } = usarAutenticacao()
  const { t } = usarIdioma()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const aoSubmeter = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await registrar(nome, email, senha)
      aoNavegar('dashboard')
    } catch (err) {
      setErro(err.response?.status === 409 ? 'registrar.emailExiste' : 'registrar.erro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-tinta">{t('registrar.titulo')}</h1>
          <p className="text-sm text-suave">{t('registrar.subtitulo')}</p>
        </div>

        <form onSubmit={aoSubmeter} className="card p-6 space-y-4" aria-busy={carregando}>
          {erro && (
            <div role="alert" className="p-3 rounded-2xl bg-erro/10 border border-erro/30 text-erro text-xs text-center">
              {t(erro)}
            </div>
          )}

          <div>
            <label htmlFor="registro-nome" className="label">{t('registrar.nome')}</label>
            <input
              id="registro-nome"
              type="text"
              required
              minLength={3}
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input"
              placeholder={t('registrar.placeholderNome')}
            />
          </div>

          <div>
            <label htmlFor="registro-email" className="label">{t('login.email')}</label>
            <input
              id="registro-email"
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
            <label htmlFor="registro-senha" className="label">{t('login.senha')}</label>
            <input
              id="registro-senha"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input"
              placeholder={t('login.placeholderSenha')}
            />
          </div>

          <button type="submit" disabled={carregando} className="btn-primary w-full py-3">
            {carregando ? t('registrar.criando') : t('registrar.criar')}
          </button>

          <p className="text-center text-sm text-suave">
            {t('registrar.jaTemConta')}{' '}
            <button type="button" onClick={() => aoNavegar('login')} className="link">
              {t('login.entrar')}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}