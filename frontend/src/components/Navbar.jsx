import React, { useState } from 'react'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import logo from './logo.png'
import IdiomaSeletor from './IdiomaSeletor'
import { usarIdioma } from '../i18n/IdiomaContexto'

function IconeNavegacao({ tipo }) {
  const desenhos = {
    inicio: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    disciplinas: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 5.5v12M8 7h8M8 11h7" /></>,
    exercicios: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M8 10h8M8 14h8M8 18h5" /></>,
    dashboard: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {desenhos[tipo]}
    </svg>
  )
}

export default function Navbar({ aoNavegar, pagina }) {
  const { usuario, autenticado, ehAdmin, logout } = usarAutenticacao()
  const { t } = usarIdioma()
  const [menuAberto, setMenuAberto] = useState(false)

  const navegarPara = (pagina) => {
    aoNavegar(pagina)
    setMenuAberto(false)
  }

  const link = (pagina, texto) => (
    <button
      onClick={() => navegarPara(pagina)}
      className="group relative text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200 py-2"
    >
      <span className="relative">{texto}</span>
      <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-cyan-400 rounded-full transition-all duration-300 group-hover:w-full" />
    </button>
  )

  const links = () => (
    <>
      {link('disciplinas', t('navbar.disciplinas'))}
      {link('exercicios', t('navbar.exercicios'))}
      {link('dashboard', t('navbar.dashboard'))}
      {ehAdmin && link('admin', t('navbar.admin'))}
    </>
  )

  const atalhosMobile = [
    ['inicio', 'navbar.inicio', 'inicio'],
    ['disciplinas', 'navbar.disciplinas', 'disciplinas'],
    ['exercicios', 'navbar.exercicios', 'exercicios'],
    ['dashboard', 'navbar.dashboard', 'dashboard'],
  ]

  return (
    <>
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-700/60 shadow-lg shadow-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-32 flex items-center justify-between">

        <button onClick={() => navegarPara('inicio')} className="flex items-center">
          <img src={logo} alt="Study Friend" className="h-16 sm:h-24 w-auto object-contain" />
        </button>

        <nav aria-label={t('navbar.navPrincipal')} className="hidden md:flex items-center gap-6">
          {links()}
        </nav>

        <div className="hidden md:block">
          <IdiomaSeletor />
        </div>

        <div className="flex items-center gap-4">
          {autenticado ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden sm:block">{usuario.nome}</span>
              <button
                onClick={() => { logout(); navegarPara('inicio') }}
                className="text-sm text-slate-400 hover:text-rose-400 transition"
              >
                {t('navbar.sair')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navegarPara('login')} className="btn-secondary">
                {t('navbar.entrar')}
              </button>
              <button onClick={() => navegarPara('registrar')} className="btn-primary">
                {t('navbar.cadastrar')}
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white transition"
            aria-label={t('navbar.menu')}
            aria-expanded={menuAberto}
            aria-controls="menu-movel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuAberto ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="md:hidden border-t border-slate-700/60 bg-slate-950/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-4 animar-deslizar">
          <nav id="menu-movel" aria-label={t('navbar.navMovel')} className="flex flex-col gap-3">
            {links()}
          </nav>
        </div>
      )}
    </header>
    <nav aria-label={t('navbar.navPrincipal')} className="mobile-dock md:hidden">
      {atalhosMobile.map(([destino, chave, icone]) => (
        <button
          key={destino}
          type="button"
          onClick={() => navegarPara(destino)}
          aria-label={t(chave)}
          aria-current={pagina === destino ? 'page' : undefined}
          title={t(chave)}
          className={`mobile-dock__item ${pagina === destino ? 'mobile-dock__item--active' : ''}`}
        >
          <IconeNavegacao tipo={icone} />
          <span className="sr-only">{t(chave)}</span>
        </button>
      ))}
      <IdiomaSeletor compacto abrirAcima />
    </nav>
    </>
  )
}