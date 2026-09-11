export const COR_AREA = {
  Exatas: { ponto: 'bg-sky-500', azulejo: 'bg-sky-500/15' },
  Humanas: { ponto: 'bg-amber-500', azulejo: 'bg-amber-500/15' },
  'Biológicas': { ponto: 'bg-emerald-500', azulejo: 'bg-emerald-500/15' },
  Linguagens: { ponto: 'bg-violet-500', azulejo: 'bg-violet-500/15' },
}

const COR_PADRAO = { ponto: 'bg-slate-500', azulejo: 'bg-slate-500/15' }

export function corArea(area) {
  return COR_AREA[area] || COR_PADRAO
}

const ORDEM_AREAS = ['Exatas', 'Biológicas', 'Humanas', 'Linguagens']

export function agruparPorArea(disciplinas) {
  const agrupadas = {}
  disciplinas.forEach((d) => {
    const area = d.area_conhecimento || 'Outras'
    if (!agrupadas[area]) agrupadas[area] = []
    agrupadas[area].push(d)
  })

  const conhecidas = ORDEM_AREAS
    .filter((area) => agrupadas[area])
    .map((area) => ({ area, disciplinas: agrupadas[area] }))

  const desconhecidas = Object.keys(agrupadas)
    .filter((area) => !ORDEM_AREAS.includes(area))
    .map((area) => ({ area, disciplinas: agrupadas[area] }))

  return [...conhecidas, ...desconhecidas]
}