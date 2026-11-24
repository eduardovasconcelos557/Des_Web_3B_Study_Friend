const PAGINAS = new Set([
  'inicio',
  'disciplinas',
  'topicos',
  'resumos',
  'flashcards',
  'exercicios',
  'dashboard',
  'login',
  'registrar',
  'admin',
])

let filaEventos = []
let temporizador = null
let enviando = false

async function enviarEventos() {
  temporizador = null
  if (enviando || filaEventos.length === 0) return

  const eventos = filaEventos.splice(0, 100)
  enviando = true
  try {
    const resposta = await fetch('/api/uso/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventos }),
      keepalive: true,
    })
    if (!resposta.ok) {
      throw new Error(`Falha ao registrar uso da plataforma (HTTP ${resposta.status}).`)
    }
  } catch (erro) {
    console.error('Não foi possível registrar os eventos de uso.', erro)
  } finally {
    enviando = false
    if (filaEventos.length > 0) agendarEnvio()
  }
}

function agendarEnvio() {
  if (temporizador === null) {
    temporizador = window.setTimeout(enviarEventos, 750)
  }
}

export function registrarUso(pagina, tipo_evento) {
  if (!PAGINAS.has(pagina) || !['visualizacao', 'clique'].includes(tipo_evento)) return
  filaEventos.push({ pagina, tipo_evento })
  if (filaEventos.length >= 100) {
    window.clearTimeout(temporizador)
    void enviarEventos()
  } else {
    agendarEnvio()
  }
}
