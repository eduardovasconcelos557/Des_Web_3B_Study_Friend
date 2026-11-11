// Cada área do conhecimento tem uma cor (variáveis em index.css, mudam com o tema)
export const COR_AREA = {
  Exatas: { ponto: 'bg-area-exatas', azulejo: 'bg-area-exatas/15 text-area-exatas', texto: 'text-area-exatas' },
  Humanas: { ponto: 'bg-area-humanas', azulejo: 'bg-area-humanas/15 text-area-humanas', texto: 'text-area-humanas' },
  'Biológicas': { ponto: 'bg-area-biologicas', azulejo: 'bg-area-biologicas/15 text-area-biologicas', texto: 'text-area-biologicas' },
  Linguagens: { ponto: 'bg-area-linguagens', azulejo: 'bg-area-linguagens/15 text-area-linguagens', texto: 'text-area-linguagens' },
}

const COR_PADRAO = { ponto: 'bg-suave', azulejo: 'bg-suave/15 text-suave', texto: 'text-suave' }

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