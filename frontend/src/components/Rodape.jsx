import React from 'react'
import { usarIdioma } from '../i18n/IdiomaContexto'

export default function Rodape({ aoNavegar }) {
  const { t } = usarIdioma()
  const ano = new Date().getFullYear()

  return (
    <footer className="border-t border-borda bg-superficie/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-display text-sm font-bold text-tinta">Study Friend</p>
          <p className="mt-1 text-xs text-suave">{t('rodape.descricao')}</p>
        </div>
        <nav aria-label={t('rodape.navegacao')} className="flex flex-wrap gap-x-5 gap-y-2">
          {[
            ['inicio', 'navbar.inicio'],
            ['disciplinas', 'navbar.disciplinas'],
            ['exercicios', 'navbar.exercicios'],
          ].map(([pagina, chave]) => (
            <button
              key={pagina}
              type="button"
              onClick={() => aoNavegar(pagina)}
              className="text-xs font-semibold text-suave transition hover:text-marca-texto"
            >
              {t(chave)}
            </button>
          ))}
        </nav>
        <p className="text-xs text-suave">© {ano} Study Friend. {t('rodape.direitos')}</p>
      </div>
    </footer>
  )
}
