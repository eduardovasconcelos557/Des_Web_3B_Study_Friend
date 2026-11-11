import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usarAutenticacao } from '../contextos/AutenticacaoContexto'
import Logo from './Logo'
import IdiomaSeletor, { Bandeira, ListaIdiomas } from './IdiomaSeletor'
import { usarIdioma } from '../i18n/IdiomaContexto'
import usarPopover from './usarPopover'
import { usarTema } from '../contextos/TemaContexto'

const DESENHOS = {
  inicio: <><path d="m3.5 10.5 8.5-7 8.5 7" /><path d="M5.5 9v11h13V9" /><path d="M10 20v-5.5h4V20" /></>,
  disciplinas: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" /><path d="M8.5 7h7M8.5 10.5h5" /></>,
  exercicios: <><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 4.5V3h6v1.5" /><path d="m8.5 11 1.5 1.5 3-3M8.5 17h7" /></>,
  dashboard: <><path d="M4 19.5V4.5M4 19.5h16.5" /><path d="m7.5 15 3.5-4 3 2.5 5-6" /></>,
  admin: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z" /><path d="m9 12 2 2 4-4" /></>,
  conta: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></>,
  sair: <><path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" /><path d="M10 16.5 5.5 12 10 7.5M5.5 12H15" /></>,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>,
  lua: <><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></>,
}

function Icone({ tipo, className = 'h-[22px] w-[22px]' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {DESENHOS[tipo]}
    </svg>
  )
}

// Subpáginas destacam a aba da seção a que pertencem
const SECAO_DA_PAGINA = {
  inicio: 'inicio',
  disciplinas: 'disciplinas',
  topicos: 'disciplinas',
  resumos: 'disciplinas',
  flashcards: 'disciplinas',
  exercicios: 'exercicios',
  dashboard: 'dashboard',
  admin: 'admin',
}

function usarRolagem() {
  const [rolada, setRolada] = useState(false)
  useEffect(() => {
    const aoRolar = () => setRolada(window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])
  return rolada
}

// Pílula de abas com a "lente" de vidro que desliza até a aba ativa
function Abas({ abas, pagina, aoNavegar, className = '' }) {
  const { t, idioma } = usarIdioma()
  const navRef = useRef(null)
  const abaRefs = useRef({})
  const [lente, setLente] = useState({ x: 0, largura: 0, visivel: false })
  const secaoAtiva = SECAO_DA_PAGINA[pagina]

  const medir = useCallback(() => {
    const alvo = abaRefs.current[secaoAtiva]
    if (!alvo || !alvo.offsetWidth) {
      setLente((atual) => ({ ...atual, visivel: false }))
      return
    }
    setLente({ x: alvo.offsetLeft, largura: alvo.offsetWidth, visivel: true })
  }, [secaoAtiva])

  useLayoutEffect(() => {
    medir()
  }, [medir, idioma, abas.length])

  useEffect(() => {
    if (!navRef.current || typeof ResizeObserver === 'undefined') return undefined
    const observador = new ResizeObserver(() => medir())
    observador.observe(navRef.current)
    Object.values(abaRefs.current).forEach((el) => el && observador.observe(el))
    return () => observador.disconnect()
  }, [medir, abas.length])

  return (
    <nav ref={navRef} aria-label={t('navbar.navPrincipal')} className={`vidro abas ${className}`}>
      <span
        aria-hidden="true"
        className="lente"
        style={{
          width: lente.largura,
          transform: `translateX(${lente.x}px)`,
          opacity: lente.visivel ? 1 : 0,
        }}
      />
      {abas.map(([destino, chave]) => {
        const ativa = secaoAtiva === destino
        return (
          <button
            key={destino}
            ref={(el) => { abaRefs.current[destino] = el }}
            type="button"
            onClick={() => aoNavegar(destino)}
            aria-current={pagina === destino ? 'page' : ativa ? 'true' : undefined}
            className={`aba ${ativa ? 'aba--ativa' : ''}`}
          >
            <Icone tipo={destino} />
            <span className="aba__rotulo">{t(chave)}</span>
          </button>
        )
      })}
    </nav>
  )
}

function BotaoTema() {
  const { escuro, alternarTema } = usarTema()
  const { t } = usarIdioma()
  return (
    <button type="button" onClick={alternarTema} aria-label={t('tema.escuro')} aria-pressed={escuro} title={t('tema.escuro')} className="vidro botao-circular">
      <Icone tipo={escuro ? 'sol' : 'lua'} className="h-6 w-6" />
    </button>
  )
}

function Avatar({ nome }) {
  const inicial = (nome || '?').trim().charAt(0).toUpperCase()
  return (
    <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-roxo text-sm font-bold text-white dark:text-fundo">
      {inicial}
    </span>
  )
}

// Menu circular do celular/tablet: conta, admin e idioma
function MenuCompacto({ aoNavegar }) {
  const { usuario, autenticado, ehAdmin, logout } = usarAutenticacao()
  const { idioma, t } = usarIdioma()
  const { escuro, alternarTema } = usarTema()
  const { aberto, setAberto, containerRef, botaoRef, painelRef } = usarPopover()

  const ir = (destino) => {
    setAberto(false)
    aoNavegar(destino)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-label={t('navbar.menu')}
        aria-expanded={aberto}
        aria-controls="menu-compacto"
        className="vidro botao-circular"
      >
        {autenticado ? <Avatar nome={usuario.nome} /> : <Icone tipo="conta" className="h-6 w-6" />}
        <span className="absolute -bottom-0.5 -right-0.5">
          <Bandeira codigo={idioma} circular tamanho={18} />
        </span>
      </button>

      {aberto && (
        <div id="menu-compacto" ref={painelRef} className="vidro popover-vidro w-[min(18rem,calc(100vw-24px))] p-2">
          <div className="flex items-center justify-between gap-3 px-2 pb-3 pt-1">
            <Logo className="h-12" />
            {autenticado && <span className="truncate text-sm text-suave">{usuario.nome}</span>}
          </div>

          {autenticado ? (
            <div className="flex flex-col gap-0.5">
              {ehAdmin && (
                <button type="button" className="opcao-menu" onClick={() => ir('admin')}>
                  <Icone tipo="admin" className="h-5 w-5" />
                  {t('navbar.admin')}
                </button>
              )}
              <button type="button" className="opcao-menu hover:!text-erro" onClick={() => { logout(); ir('inicio') }}>
                <Icone tipo="sair" className="h-5 w-5" />
                {t('navbar.sair')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-1">
              <button type="button" className="btn-secondary px-3" onClick={() => ir('login')}>{t('navbar.entrar')}</button>
              <button type="button" className="btn-primary px-3" onClick={() => ir('registrar')}>{t('navbar.cadastrar')}</button>
            </div>
          )}

          <div className="mx-2 my-2 h-px bg-borda" />
          <button type="button" role="switch" aria-checked={escuro} onClick={alternarTema} className="opcao-menu">
            <Icone tipo="lua" className="h-5 w-5" />
            <span className="flex-1">{t('tema.escuro')}</span>
            <span aria-hidden="true" className={`interruptor ${escuro ? 'interruptor--ligado' : ''}`} />
          </button>

          <div className="mx-2 my-2 h-px bg-borda" />
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-suave">{t('idioma.selecionar')}</p>
          <ListaIdiomas aoEscolher={() => setAberto(false)} />
        </div>
      )}
    </div>
  )
}

export default function Navbar({ aoNavegar, pagina }) {
  const { usuario, autenticado, ehAdmin, logout } = usarAutenticacao()
  const { t } = usarIdioma()
  const rolada = usarRolagem()

  const abasBase = [
    ['inicio', 'navbar.inicio'],
    ['disciplinas', 'navbar.disciplinas'],
    ['exercicios', 'navbar.exercicios'],
    ['dashboard', 'navbar.dashboard'],
  ]
  const abasCompletas = ehAdmin ? [...abasBase, ['admin', 'navbar.admin']] : abasBase

  return (
    <>
    {/* Logo sem vidro: fica no topo da página e sai de cena ao rolar */}
    <div className="absolute inset-x-0 top-[calc(10px+env(safe-area-inset-top))] z-40 hidden lg:block">
      <div className="mx-auto flex h-[66px] max-w-6xl items-center px-8">
        <button
          type="button"
          onClick={() => aoNavegar('inicio')}
          aria-label={`Study Friend — ${t('navbar.inicio')}`}
          className="-ml-2 flex items-center rounded-2xl px-2 transition-transform hover:scale-[1.03]"
        >
          <Logo className="h-[72px]" alt="" />
        </button>
      </div>
    </div>

    <header className={`barra-flutuante ${rolada ? 'barra-flutuante--rolada' : ''}`}>
      {/* Celular e tablet: pílula de abas + botão circular */}
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 sm:px-6 lg:hidden">
        <Abas abas={abasBase} pagina={pagina} aoNavegar={aoNavegar} className="min-w-0 flex-1" />
        <MenuCompacto aoNavegar={aoNavegar} />
      </div>

      {/* Desktop: abas no centro; idioma, tema e conta à direita */}
      <div className="mx-auto hidden max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-8 lg:grid">
        <span aria-hidden="true" />
        <Abas abas={abasCompletas} pagina={pagina} aoNavegar={aoNavegar} />

        <div className="flex items-center justify-end gap-2">
          <IdiomaSeletor />
          <BotaoTema />
          {autenticado ? (
            <div className="vidro flex h-[66px] items-center gap-2 rounded-full py-[5px] pl-3 pr-[5px]">
              <Avatar nome={usuario.nome} />
              <span className="max-w-[8rem] truncate text-sm font-semibold text-tinta">{usuario.nome}</span>
              <button
                type="button"
                onClick={() => { logout(); aoNavegar('inicio') }}
                aria-label={t('navbar.sair')}
                title={t('navbar.sair')}
                className="flex h-[54px] w-[54px] items-center justify-center rounded-full text-suave transition hover:bg-erro/10 hover:text-erro"
              >
                <Icone tipo="sair" className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="vidro flex h-[66px] items-center gap-1 rounded-full p-[5px]">
              <button
                type="button"
                onClick={() => aoNavegar('login')}
                aria-current={pagina === 'login' ? 'page' : undefined}
                className={`h-[54px] rounded-full px-5 text-sm font-semibold transition hover:bg-elevada ${pagina === 'login' ? 'bg-marca/10 text-marca-texto' : 'text-tinta'}`}
              >
                {t('navbar.entrar')}
              </button>
              <button type="button" onClick={() => aoNavegar('registrar')} aria-current={pagina === 'registrar' ? 'page' : undefined} className="btn-primary h-[54px] px-6">
                {t('navbar.cadastrar')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  )
}
