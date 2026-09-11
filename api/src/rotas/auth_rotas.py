from fastapi import APIRouter, Request

from ..controladores.auth_controlador import login_controlador, registrar_controlador

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/registrar")
async def registrar_rota(request: Request):
    """Rota pública para criação de conta de aluno."""
    try:
        payload = await request.json()
    except Exception:
        payload = {}
    return registrar_controlador(payload)


@router.post("/login")
async def login_rota(request: Request):
    """Rota pública para autenticação de usuários."""
    try:
        payload = await request.json()
    except Exception:
        payload = {}
    return login_controlador(payload)
