from fastapi import APIRouter, Depends, Request

from ..config.dependencias import exigir_admin
from ..controladores.admin_controlador import (
    atualizar_disciplina_controlador,
    atualizar_flashcard_controlador,
    atualizar_questao_controlador,
    atualizar_resumo_controlador,
    atualizar_topico_controlador,
    criar_disciplina_controlador,
    criar_flashcard_controlador,
    criar_questao_controlador,
    criar_resumo_controlador,
    criar_topico_controlador,
    listar_disciplinas_admin_controlador,
    listar_questoes_admin_controlador,
    remover_disciplina_controlador,
    remover_flashcard_controlador,
    remover_questao_controlador,
    remover_resumo_controlador,
    remover_topico_controlador,
)

router = APIRouter(prefix="/admin", tags=["Administração CMS"])


async def _ler_payload(request: Request) -> dict:
    """Lê e valida o payload JSON de uma requisição de admin."""
    try:
        return await request.json()
    except Exception:
        return {}


# ── CRUD Disciplinas ────────────────────────────────────────────────────────

@router.get("/disciplinas")
def listar_disciplinas_admin(_admin: dict = Depends(exigir_admin)):
    return listar_disciplinas_admin_controlador()


@router.post("/disciplinas")
async def criar_disciplina_rota(request: Request, _admin: dict = Depends(exigir_admin)):
    return criar_disciplina_controlador(await _ler_payload(request))


@router.put("/disciplinas/{disciplina_id}")
async def atualizar_disciplina_rota(disciplina_id: int, request: Request, _admin: dict = Depends(exigir_admin)):
    return atualizar_disciplina_controlador(disciplina_id, await _ler_payload(request))


@router.delete("/disciplinas/{disciplina_id}")
def remover_disciplina_rota(disciplina_id: int, _admin: dict = Depends(exigir_admin)):
    return remover_disciplina_controlador(disciplina_id)


# ── CRUD Tópicos ───────────────────────────────────────────────────────────

@router.get("/topicos")
def listar_topicos_admin(_admin: dict = Depends(exigir_admin)):
    from ..controladores.conteudo_controlador import obter_conexao
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            '''SELECT t.id, t.disciplina_id, t.titulo, t.ano_escolar, d.nome AS disciplina
               FROM topicos t JOIN disciplinas d ON d.id = t.disciplina_id
               ORDER BY d.nome, t.titulo'''
        )
        return {"sucesso": True, "dados": cursor.fetchall()}
    finally:
        conexao.close()


@router.post("/topicos")
async def criar_topico_rota(request: Request, _admin: dict = Depends(exigir_admin)):
    return criar_topico_controlador(await _ler_payload(request))


@router.put("/topicos/{topico_id}")
async def atualizar_topico_rota(topico_id: int, request: Request, _admin: dict = Depends(exigir_admin)):
    return atualizar_topico_controlador(topico_id, await _ler_payload(request))


@router.delete("/topicos/{topico_id}")
def remover_topico_rota(topico_id: int, _admin: dict = Depends(exigir_admin)):
    return remover_topico_controlador(topico_id)


# ── CRUD Resumos ───────────────────────────────────────────────────────────

@router.get("/resumos")
def listar_resumos_admin(_admin: dict = Depends(exigir_admin)):
    from ..controladores.conteudo_controlador import obter_conexao
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            '''SELECT r.id, r.topico_id, r.titulo, r.conteudo, r.url_pdf, t.titulo AS topico
               FROM resumos r JOIN topicos t ON t.id = r.topico_id ORDER BY r.id'''
        )
        return {"sucesso": True, "dados": cursor.fetchall()}
    finally:
        conexao.close()


@router.post("/resumos")
async def criar_resumo_rota(request: Request, _admin: dict = Depends(exigir_admin)):
    return criar_resumo_controlador(await _ler_payload(request))


@router.put("/resumos/{resumo_id}")
async def atualizar_resumo_rota(resumo_id: int, request: Request, _admin: dict = Depends(exigir_admin)):
    return atualizar_resumo_controlador(resumo_id, await _ler_payload(request))


@router.delete("/resumos/{resumo_id}")
def remover_resumo_rota(resumo_id: int, _admin: dict = Depends(exigir_admin)):
    return remover_resumo_controlador(resumo_id)


# ── CRUD Flashcards ────────────────────────────────────────────────────────

@router.get("/flashcards")
def listar_flashcards_admin(_admin: dict = Depends(exigir_admin)):
    from ..controladores.conteudo_controlador import obter_conexao
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            '''SELECT f.id, f.topico_id, f.frente, f.verso, t.titulo AS topico
               FROM flashcards f JOIN topicos t ON t.id = f.topico_id ORDER BY f.id'''
        )
        return {"sucesso": True, "dados": cursor.fetchall()}
    finally:
        conexao.close()


@router.post("/flashcards")
async def criar_flashcard_rota(request: Request, _admin: dict = Depends(exigir_admin)):
    return criar_flashcard_controlador(await _ler_payload(request))


@router.put("/flashcards/{flashcard_id}")
async def atualizar_flashcard_rota(flashcard_id: int, request: Request, _admin: dict = Depends(exigir_admin)):
    return atualizar_flashcard_controlador(flashcard_id, await _ler_payload(request))


@router.delete("/flashcards/{flashcard_id}")
def remover_flashcard_rota(flashcard_id: int, _admin: dict = Depends(exigir_admin)):
    return remover_flashcard_controlador(flashcard_id)


# ── CRUD Questões ──────────────────────────────────────────────────────────

@router.get("/questoes")
def listar_questoes_admin(_admin: dict = Depends(exigir_admin)):
    return listar_questoes_admin_controlador()


@router.post("/questoes")
async def criar_questao_rota(request: Request, _admin: dict = Depends(exigir_admin)):
    return criar_questao_controlador(await _ler_payload(request))


@router.put("/questoes/{questao_id}")
async def atualizar_questao_rota(questao_id: int, request: Request, _admin: dict = Depends(exigir_admin)):
    return atualizar_questao_controlador(questao_id, await _ler_payload(request))


@router.delete("/questoes/{questao_id}")
def remover_questao_rota(questao_id: int, _admin: dict = Depends(exigir_admin)):
    return remover_questao_controlador(questao_id)
