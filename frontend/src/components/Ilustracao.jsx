import React from 'react'

// Ilustrações simples em SVG nas cores da marca (mudam junto com o tema).
// São decorativas: ficam escondidas dos leitores de tela.

// Estrelinha de quatro pontas, como as do logo (amarelo #F1F60F com contorno cinza)
function Estrela({ x, y, r = 8 }) {
  const d = `M${x} ${y - r} C${x + r * 0.18} ${y - r * 0.18} ${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} C${x + r * 0.18} ${y + r * 0.18} ${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} C${x - r * 0.18} ${y + r * 0.18} ${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} C${x - r * 0.18} ${y - r * 0.18} ${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z`
  return <path d={d} strokeWidth="1" className="brilho fill-estrela-viva stroke-estrela-contorno" />
}

function Estudos() {
  return (
    <svg viewBox="0 0 360 300" className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* fundo */}
      <circle cx="190" cy="158" r="128" className="fill-marca/10" />
      <circle cx="292" cy="70" r="34" className="fill-roxo/15" />

      {/* cartão de flashcard inclinado */}
      <g transform="rotate(10 270 128)">
        <rect x="222" y="86" width="104" height="76" rx="14" className="fill-superficie stroke-borda" strokeWidth="2" />
        <rect x="238" y="104" width="52" height="8" rx="4" className="fill-roxo/60" />
        <rect x="238" y="120" width="72" height="6" rx="3" className="fill-borda" />
        <rect x="238" y="132" width="60" height="6" rx="3" className="fill-borda" />
        <circle cx="306" cy="106" r="11" className="fill-sucesso" />
        <path d="m300.5 106 4 4 7-7.5" className="stroke-superficie" strokeWidth="3" />
      </g>

      {/* pilha de livros */}
      <rect x="66" y="232" width="178" height="32" rx="7" className="fill-roxo" />
      <rect x="66" y="232" width="18" height="32" rx="5" className="fill-tinta/20" />
      <path d="M96 248h132" className="stroke-superficie/60" strokeWidth="3" />

      <rect x="84" y="200" width="158" height="32" rx="7" className="fill-marca" />
      <rect x="224" y="200" width="18" height="32" rx="5" className="fill-tinta/20" />
      <path d="M98 216h112" className="stroke-superficie/60" strokeWidth="3" />

      <rect x="74" y="170" width="164" height="30" rx="7" className="fill-estrela" />
      <rect x="74" y="170" width="18" height="30" rx="5" className="fill-tinta/15" />
      <path d="M104 185h118" className="stroke-tinta/25" strokeWidth="3" />

      {/* capelo de formatura (como no logo) */}
      <path d="M158 118 214 140 158 162 102 140Z" className="fill-tinta" />
      <path d="M128 151v14c0 6 13 11 30 11s30-5 30-11v-14l-30 11z" className="fill-tinta" />
      <path d="M214 140v24" className="stroke-tinta" strokeWidth="3" />
      <circle cx="214" cy="168" r="5" className="fill-estrela" />

      {/* lápis */}
      <g transform="rotate(-28 300 220)">
        <rect x="262" y="210" width="84" height="18" rx="4" className="fill-estrela" />
        <rect x="262" y="210" width="14" height="18" rx="3" className="fill-roxo" />
        <path d="M346 210l18 9-18 9z" className="fill-superficie stroke-borda" strokeWidth="1.5" />
        <path d="M358 216.5l6 2.5-6 2.5z" className="fill-tinta" />
      </g>

      {/* estrelinhas */}
      <Estrela x={70} y={96} r={11} />
      <Estrela x={104} y={62} r={7} />
      <Estrela x={236} y={42} r={9} />
      <Estrela x={330} y={186} r={7} />
      <Estrela x={44} y={180} r={6} />
    </svg>
  )
}

function Vazio() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="100" cy="122" rx="70" ry="8" className="fill-tinta/5" />
      {/* livro aberto */}
      <path d="M100 42c-14-10-38-12-58-8v78c20-4 44-2 58 8z" className="fill-superficie stroke-borda" strokeWidth="2.5" />
      <path d="M100 42c14-10 38-12 58-8v78c-20-4-44-2-58 8z" className="fill-superficie stroke-borda" strokeWidth="2.5" />
      <path d="M100 42v78" className="stroke-borda" strokeWidth="2.5" />
      <path d="M56 54c10-2 22-1 32 3M56 68c10-2 22-1 32 3M56 82c10-2 22-1 32 3" className="stroke-marca/40" strokeWidth="3" />
      <path d="M112 57c10-4 22-5 32-3M112 71c10-4 22-5 32-3" className="stroke-roxo/40" strokeWidth="3" />
      <Estrela x={150} y={22} r={8} />
      <Estrela x={42} y={20} r={6} />
      <Estrela x={172} y={74} r={5} />
    </svg>
  )
}

function Progresso() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="100" cy="126" rx="76" ry="7" className="fill-tinta/5" />
      <rect x="40" y="84" width="26" height="40" rx="7" className="fill-roxo/70" />
      <rect x="76" y="62" width="26" height="62" rx="7" className="fill-marca/80" />
      <rect x="112" y="40" width="26" height="84" rx="7" className="fill-marca" />
      <path d="M36 72 78 48l30 10 46-34" className="stroke-tinta/70" strokeWidth="3" />
      <path d="m142 22 13 1-2 13" className="stroke-tinta/70" strokeWidth="3" />
      <Estrela x={170} y={60} r={10} />
      <Estrela x={30} y={36} r={6} />
    </svg>
  )
}

const TIPOS = { estudos: Estudos, vazio: Vazio, progresso: Progresso }

export default function Ilustracao({ tipo = 'vazio', className = '' }) {
  const Desenho = TIPOS[tipo] || Vazio
  return (
    <div aria-hidden="true" className={className}>
      <Desenho />
    </div>
  )
}

// Estado vazio reutilizável: desenho + texto + ação opcional
export function EstadoVazio({ tipo = 'vazio', children, className = '' }) {
  return (
    <div className={`card flex flex-col items-center gap-4 px-6 py-10 text-center text-suave ${className}`}>
      <Ilustracao tipo={tipo} className="h-28 w-40" />
      {children}
    </div>
  )
}
