from fastapi import APIRouter, Depends, Query, Request

from ..config.dependencias import obter_usuario_atual
from ..controladores.questao_controlador import (
    estatisticas_controlador,
    listar_questoes_controlador,
    responder_questao_controlador,
)

router = APIRouter(tags=["Questões e Progresso"])


@router.get("/questoes")
def listar_questoes_rota(
    disciplina_id: int = Query(None),
    topico_id: int = Query(None),
    ano_escolar: str = Query(None),
    nivel_dificuldade: str = Query(None),
):
    """Filtra exercícios por matéria, ano, tópico e dificuldade."""
    return listar_questoes_controlador(
        disciplina_id=disciplina_id,
        topico_id=topico_id,
        ano_escolar=ano_escolar,
        nivel_dificuldade=nivel_dificuldade,
    )


@router.post("/questoes/responder")
async def responder_questao_rota(
    request: Request,
    usuario: dict = Depends(obter_usuario_atual),
):
    """Processa a resposta e contabiliza o progresso do aluno autenticado."""
    try:
        payload = await request.json()
    except Exception:
        payload = {}
    return responder_questao_controlador(payload, usuario)


@router.get("/aluno/estatisticas")
def estatisticas_rota(usuario: dict = Depends(obter_usuario_atual)):
    """Retorna o desempenho acumulado do aluno autenticado."""
    return estatisticas_controlador(usuario)
