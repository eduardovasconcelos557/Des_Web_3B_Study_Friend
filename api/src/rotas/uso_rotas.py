import threading
import time
from collections import defaultdict, deque
from typing import Literal, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from ..config.conexao_banco import obter_conexao

router = APIRouter(prefix="/uso", tags=["Métricas de uso"])

# ── Limite de envios por IP ──────────────────────────────────────────────────
# Evita que alguém infle as métricas disparando eventos em massa.
# Uma pessoa navegando normalmente fica muito abaixo desse limite.
LIMITE_EVENTOS_POR_JANELA = 300
JANELA_SEGUNDOS = 60

_envios_por_ip: dict[str, deque] = defaultdict(deque)
_trava_envios = threading.Lock()


def _dentro_do_limite(ip: str, quantidade: int) -> bool:
    """Registra o envio e devolve False se o IP passou do limite na janela atual."""
    agora = time.monotonic()
    with _trava_envios:
        historico = _envios_por_ip[ip]
        while historico and agora - historico[0][0] > JANELA_SEGUNDOS:
            historico.popleft()
        total_na_janela = sum(qtd for _, qtd in historico)
        if total_na_janela + quantidade > LIMITE_EVENTOS_POR_JANELA:
            return False
        historico.append((agora, quantidade))

        # Limpeza simples para o dicionário não crescer sem parar
        if len(_envios_por_ip) > 5000:
            for chave in [c for c, h in _envios_por_ip.items() if not h]:
                del _envios_por_ip[chave]
        return True


class EventoUso(BaseModel):
    pagina: Literal[
        "inicio",
        "disciplinas",
        "topicos",
        "resumos",
        "flashcards",
        "exercicios",
        "dashboard",
        "login",
        "registrar",
        "admin",
    ]
    tipo_evento: Literal["visualizacao", "clique"]
    # Identificador do botão clicado (atributo data-metrica no frontend)
    acao: Optional[str] = Field(default=None, pattern=r"^[a-z0-9_]{1,40}$")


class LoteEventosUso(BaseModel):
    eventos: list[EventoUso] = Field(min_length=1, max_length=100)


@router.post("/eventos", status_code=202)
def registrar_eventos_uso(payload: LoteEventosUso, request: Request):
    ip = request.client.host if request.client else "desconhecido"
    if not _dentro_do_limite(ip, len(payload.eventos)):
        raise HTTPException(status_code=429, detail="Muitos eventos enviados. Tente novamente em instantes.")

    conexao = obter_conexao()
    try:
        conexao.executemany(
            "INSERT INTO eventos_uso (pagina, tipo_evento, acao) VALUES (?, ?, ?)",
            [
                (
                    evento.pagina,
                    evento.tipo_evento,
                    evento.acao if evento.tipo_evento == "clique" else None,
                )
                for evento in payload.eventos
            ],
        )
        conexao.commit()
        return {"sucesso": True, "eventos_registrados": len(payload.eventos)}
    finally:
        conexao.close()
