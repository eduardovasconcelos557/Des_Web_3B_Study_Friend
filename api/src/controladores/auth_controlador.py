from fastapi import status
from fastapi.responses import JSONResponse

from ..config.conexao_banco import obter_conexao
from ..utilitarios.seguranca import criar_token_jwt, gerar_hash_senha, verificar_senha
from ..utilitarios.validadores import e_email_valido, sanitizar

CAMPOS_PUBLICOS = ("id", "nome", "email", "perfil", "data_cadastro")


def _usuario_publico(usuario: dict) -> dict:
    """Remove a senha hash dos dados do usuário antes de devolvê-lo à API."""
    return {campo: usuario[campo] for campo in CAMPOS_PUBLICOS}


def registrar_controlador(payload: dict):
    """Cria um novo usuário ESTUDANTE e retorna o token JWT de acesso."""
    nome = sanitizar(payload.get("nome", ""))
    email = sanitizar(payload.get("email", ""))
    senha = str(payload.get("senha", ""))

    erros = []
    if len(nome) < 3:
        erros.append("O nome deve ter pelo menos 3 caracteres.")
    if not e_email_valido(email):
        erros.append("E-mail inválido.")
    if len(senha) < 6:
        erros.append("A senha deve ter pelo menos 6 caracteres.")

    if erros:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"sucesso": False, "erros": erros},
        )

    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id FROM usuarios WHERE email = ?", (email,))
        if cursor.fetchone():
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"sucesso": False, "mensagem": "E-mail já cadastrado."},
            )

        senha_hash = gerar_hash_senha(senha)
        cursor.execute(
            "INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, 'ESTUDANTE')",
            (nome, email, senha_hash),
        )
        conexao.commit()
        usuario_id = cursor.lastrowid
        cursor.execute(
            "SELECT id, nome, email, perfil, data_cadastro FROM usuarios WHERE id = ?",
            (usuario_id,),
        )
        usuario = cursor.fetchone()
    finally:
        conexao.close()

    token = criar_token_jwt(usuario)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "sucesso": True,
            "mensagem": "Cadastro realizado com sucesso!",
            "token": token,
            "usuario": usuario,
        },
    )


def login_controlador(payload: dict):
    """Autentica o usuário por e-mail e senha, devolvendo o token JWT."""
    email = sanitizar(payload.get("email", ""))
    senha = str(payload.get("senha", ""))

    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            "SELECT id, nome, email, senha_hash, perfil, data_cadastro FROM usuarios WHERE email = ?",
            (email,),
        )
        usuario = cursor.fetchone()
    finally:
        conexao.close()

    if not usuario or not verificar_senha(senha, usuario["senha_hash"]):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"sucesso": False, "mensagem": "E-mail ou senha incorretos."},
        )

    usuario_publico = _usuario_publico(usuario)
    token = criar_token_jwt(usuario_publico)
    return {
        "sucesso": True,
        "mensagem": "Login realizado com sucesso!",
        "token": token,
        "usuario": usuario_publico,
    }
