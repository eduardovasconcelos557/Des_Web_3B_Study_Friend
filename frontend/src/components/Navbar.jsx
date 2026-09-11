import React, { useState } from 'react'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import logo from './logo.png'

export default function Navbar({ aoNavegar }) {
  const { usuario, autenticado, ehAdmin, logout } = usarAutenticacao()
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
      {link('disciplinas', 'Disciplinas')}
      {link('exercicios', 'Exercícios')}
      {link('dashboard', 'Dashboard')}
      {ehAdmin && link('admin', 'Admin')}
    </>
  )

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-700/60 shadow-lg shadow-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-32 flex items-center justify-between">

        <button onClick={() => navegarPara('inicio')} className="flex items-center">
          <img src={logo} alt="Study Friend" className="h-16 sm:h-24 w-auto object-contain" />
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {links()}
        </nav>

        <div className="flex items-center gap-4">
          {autenticado ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden sm:block">{usuario.nome}</span>
              <button
                onClick={() => { logout(); navegarPara('inicio') }}
                className="text-sm text-slate-400 hover:text-rose-400 transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => navegarPara('login')} className="btn-secondary">
                Entrar
              </button>
              <button onClick={() => navegarPara('registrar')} className="btn-primary">
                Cadastrar
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white transition"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuAberto ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="md:hidden border-t border-slate-700/60 bg-slate-950/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-4 animar-deslizar">
          <nav className="flex flex-col gap-3">
            {links()}
          </nav>
        </div>
      )}
    </header>
  )
}