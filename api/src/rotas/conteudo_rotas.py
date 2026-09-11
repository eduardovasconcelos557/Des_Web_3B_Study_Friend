from fastapi import APIRouter, Query

from ..controladores.conteudo_controlador import (
    listar_disciplinas_controlador,
    listar_flashcards_controlador,
    listar_resumos_controlador,
    listar_topicos_controlador,
)

router = APIRouter(tags=["Conteúdo"])


@router.get("/disciplinas")
def listar_disciplinas_rota():
    """Retorna a lista de matérias e tópicos do Ensino Médio."""
    return listar_disciplinas_controlador()


@router.get("/disciplinas/{disciplina_id}/topicos")
def listar_topicos_rota(disciplina_id: int, ano_escolar: str = Query(None, description="1, 2, 3 ou ENEM")):
    """Retorna os tópicos de uma disciplina, com filtro opcional por ano escolar."""
    return listar_topicos_controlador(disciplina_id, ano_escolar)


@router.get("/topicos/{topico_id}/resumos")
def listar_resumos_rota(topico_id: int):
    """Busca resumos e links dos mapas mentais de um tópico."""
    return listar_resumos_controlador(topico_id)


@router.get("/topicos/{topico_id}/flashcards")
def listar_flashcards_rota(topico_id: int):
    """Carrega o baralho de flashcards de revisão de um tópico."""
    return listar_flashcards_controlador(topico_id)
