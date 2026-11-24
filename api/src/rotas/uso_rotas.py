from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from ..config.conexao_banco import obter_conexao

router = APIRouter(prefix="/uso", tags=["Métricas de uso"])


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


class LoteEventosUso(BaseModel):
    eventos: list[EventoUso] = Field(min_length=1, max_length=100)


@router.post("/eventos", status_code=202)
def registrar_eventos_uso(payload: LoteEventosUso):
    conexao = obter_conexao()
    try:
        conexao.executemany(
            "INSERT INTO eventos_uso (pagina, tipo_evento) VALUES (?, ?)",
            [(evento.pagina, evento.tipo_evento) for evento in payload.eventos],
        )
        conexao.commit()
        return {"sucesso": True, "eventos_registrados": len(payload.eventos)}
    finally:
        conexao.close()
