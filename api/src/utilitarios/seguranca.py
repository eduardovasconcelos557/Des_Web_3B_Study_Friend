import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

# Carrega o segredo do JWT a partir das variáveis de ambiente
SEGREDO_JWT = os.getenv("SEGREDO_JWT", "segredo-study-friend-desenvolvimento")
ALGORITMO_JWT = "HS256"
TEMPO_EXPIRACAO_HORAS = 12


def gerar_hash_senha(senha: str) -> str:
    """Gera o hash seguro da senha utilizando bcrypt."""
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_senha(senha: str, hash_armazenado: str) -> bool:
    """Compara uma senha em texto puro com o hash bcrypt armazenado."""
    try:
        return bcrypt.checkpw(senha.encode("utf-8"), hash_armazenado.encode("utf-8"))
    except ValueError:
        return False


def criar_token_jwt(usuario: dict) -> str:
    """Gera um token JWT assinado com os dados públicos do usuário."""
    expiracao = datetime.now(timezone.utc) + timedelta(hours=TEMPO_EXPIRACAO_HORAS)
    payload = {
        "sub": str(usuario["id"]),
        "email": usuario["email"],
        "perfil": usuario["perfil"],
        "exp": expiracao,
    }
    return jwt.encode(payload, SEGREDO_JWT, algorithm=ALGORITMO_JWT)


def decodificar_token_jwt(token: str) -> dict:
    """Valida a assinatura e a expiração do token JWT, retornando o payload."""
    return jwt.decode(token, SEGREDO_JWT, algorithms=[ALGORITMO_JWT])
