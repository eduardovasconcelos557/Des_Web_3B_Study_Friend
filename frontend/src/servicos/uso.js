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

const FORMATO_ACAO = /^[a-z0-9_]{1,40}$/

// acao: identificador do botão clicado (atributo data-metrica), opcional
export function registrarUso(pagina, tipo_evento, acao = null) {
  if (!PAGINAS.has(pagina) || !['visualizacao', 'clique'].includes(tipo_evento)) return
  const evento = { pagina, tipo_evento }
  if (tipo_evento === 'clique' && acao && FORMATO_ACAO.test(acao)) evento.acao = acao
  filaEventos.push(evento)
  if (filaEventos.length >= 100) {
    window.clearTimeout(temporizador)
    void enviarEventos()
  } else {
    agendarEnvio()
  }
}
