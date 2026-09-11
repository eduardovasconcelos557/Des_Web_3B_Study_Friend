import jwt
from fastapi import Depends, Header, HTTPException

from ..utilitarios.seguranca import decodificar_token_jwt
from .conexao_banco import obter_conexao

CAMPO_TOKEN = "authorization"


def obter_usuario_atual(authorization: str = Header(default=None)):
    """Dependência FastAPI que valida o token JWT e retorna o usuário autenticado."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Token de acesso não informado.")

    token = authorization.split(" ", 1)[1].strip()
    try:
        payload = decodificar_token_jwt(token)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")

    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            "SELECT id, nome, email, perfil, data_cadastro FROM usuarios WHERE id = ?",
            (int(payload["sub"]),),
        )
        usuario = cursor.fetchone()
    finally:
        conexao.close()

    if not usuario:
        raise HTTPException(status_code=401, detail="Usuário não encontrado.")

    return usuario


def exigir_admin(usuario: dict = Depends(obter_usuario_atual)):
    """Dependência FastAPI que protege rotas administrativas (perfil ADMIN)."""
    if usuario["perfil"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Acesso restrito ao perfil administrador.")
    return usuario
