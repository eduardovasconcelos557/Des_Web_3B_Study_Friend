import React from 'react'
import logoClaro from './logo.svg'
import logoEscuro from './logo-escuro.svg'

// Logo em SVG: original no tema claro; no escuro o capelo fica claro para aparecer no fundo
export default function Logo({ className = 'h-14', alt = 'Study Friend' }) {
  return (
    <>
      <img src={logoClaro} alt={alt} className={`${className} w-auto dark:hidden`} />
      <img src={logoEscuro} alt={alt} className={`${className} hidden w-auto dark:block`} />
    </>
  )
}
