import json

from fastapi import status
from fastapi.responses import JSONResponse

from ..config.conexao_banco import obter_conexao
from ..utilitarios.validadores import sanitizar


# ── Disciplinas ──────────────────────────────────────────────────────────────

def criar_disciplina_controlador(payload: dict):
    nome = sanitizar(payload.get("nome", ""))
    area = sanitizar(payload.get("area_conhecimento", ""))
    if len(nome) < 2 or len(area) < 2:
        return JSONResponse(content={"sucesso": False, "mensagem": "Nome e área de conhecimento obrigatórios."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        try:
            cursor.execute("INSERT INTO disciplinas (nome, area_conhecimento) VALUES (?, ?)", (nome, area))
            conexao.commit()
            return JSONResponse(content={"sucesso": True, "mensagem": "Disciplina criada com sucesso!"}, status_code=201)
        except Exception:
            return JSONResponse(content={"sucesso": False, "mensagem": "Disciplina já existe."}, status_code=409)
    finally:
        conexao.close()


def listar_disciplinas_admin_controlador():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id, nome, area_conhecimento FROM disciplinas ORDER BY nome")
        return {"sucesso": True, "dados": cursor.fetchall()}
    finally:
        conexao.close()


def atualizar_disciplina_controlador(disciplina_id: int, payload: dict):
    nome = sanitizar(payload.get("nome", ""))
    area = sanitizar(payload.get("area_conhecimento", ""))
    if len(nome) < 2 or len(area) < 2:
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados incompletos."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("UPDATE disciplinas SET nome = ?, area_conhecimento = ? WHERE id = ?", (nome, area, disciplina_id))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Disciplina atualizada."}
    finally:
        conexao.close()


def remover_disciplina_controlador(disciplina_id: int):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM disciplinas WHERE id = ?", (disciplina_id,))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Disciplina removida."}
    finally:
        conexao.close()


# ── Tópicos ─────────────────────────────────────────────────────────────────

def criar_topico_controlador(payload: dict):
    disciplina_id = payload.get("disciplina_id")
    titulo = sanitizar(payload.get("titulo", ""))
    ano = str(payload.get("ano_escolar", ""))
    if not disciplina_id or len(titulo) < 3 or ano not in ("1", "2", "3", "ENEM"):
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados inválidos para o tópico."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("INSERT INTO topicos (disciplina_id, titulo, ano_escolar) VALUES (?, ?, ?)", (disciplina_id, titulo, ano))
        conexao.commit()
        return JSONResponse(content={"sucesso": True, "mensagem": "Tópico criado."}, status_code=201)
    finally:
        conexao.close()


def atualizar_topico_controlador(topico_id: int, payload: dict):
    titulo = sanitizar(payload.get("titulo", ""))
    ano = str(payload.get("ano_escolar", ""))
    if len(titulo) < 3 or ano not in ("1", "2", "3", "ENEM"):
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados inválidos."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("UPDATE topicos SET titulo = ?, ano_escolar = ? WHERE id = ?", (titulo, ano, topico_id))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Tópico atualizado."}
    finally:
        conexao.close()


def remover_topico_controlador(topico_id: int):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM topicos WHERE id = ?", (topico_id,))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Tópico removido."}
    finally:
        conexao.close()


# ── Resumos ─────────────────────────────────────────────────────────────────

def criar_resumo_controlador(payload: dict):
    topico_id = payload.get("topico_id")
    titulo = sanitizar(payload.get("titulo", ""))
    conteudo = str(payload.get("conteudo", ""))
    url_pdf = payload.get("url_pdf")
    if not topico_id or len(titulo) < 3 or len(conteudo) < 10:
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados incompletos para o resumo."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("INSERT INTO resumos (topico_id, titulo, conteudo, url_pdf) VALUES (?, ?, ?, ?)",
                        (topico_id, titulo, conteudo, url_pdf))
        conexao.commit()
        return JSONResponse(content={"sucesso": True, "mensagem": "Resumo criado com sucesso."}, status_code=201)
    finally:
        conexao.close()


def atualizar_resumo_controlador(resumo_id: int, payload: dict):
    titulo = sanitizar(payload.get("titulo", ""))
    conteudo = str(payload.get("conteudo", ""))
    url_pdf = payload.get("url_pdf")
    if len(titulo) < 3 or len(conteudo) < 10:
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados incompletos."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("UPDATE resumos SET titulo = ?, conteudo = ?, url_pdf = ? WHERE id = ?",
                        (titulo, conteudo, url_pdf, resumo_id))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Resumo atualizado."}
    finally:
        conexao.close()


def remover_resumo_controlador(resumo_id: int):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM resumos WHERE id = ?", (resumo_id,))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Resumo removido."}
    finally:
        conexao.close()


# ── Flashcards ──────────────────────────────────────────────────────────────

def criar_flashcard_controlador(payload: dict):
    topico_id = payload.get("topico_id")
    frente = sanitizar(payload.get("frente", ""))
    verso = sanitizar(payload.get("verso", ""))
    if not topico_id or len(frente) < 5 or len(verso) < 5:
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados incompletos para o flashcard."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("INSERT INTO flashcards (topico_id, frente, verso) VALUES (?, ?, ?)", (topico_id, frente, verso))
        conexao.commit()
        return JSONResponse(content={"sucesso": True, "mensagem": "Flashcard criado com sucesso."}, status_code=201)
    finally:
        conexao.close()


def atualizar_flashcard_controlador(flashcard_id: int, payload: dict):
    frente = sanitizar(payload.get("frente", ""))
    verso = sanitizar(payload.get("verso", ""))
    if len(frente) < 5 or len(verso) < 5:
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados incompletos."}, status_code=422)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("UPDATE flashcards SET frente = ?, verso = ? WHERE id = ?", (frente, verso, flashcard_id))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Flashcard atualizado."}
    finally:
        conexao.close()


def remover_flashcard_controlador(flashcard_id: int):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM flashcards WHERE id = ?", (flashcard_id,))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Flashcard removido."}
    finally:
        conexao.close()


# ── Questões ────────────────────────────────────────────────────────────────

def criar_questao_controlador(payload: dict):
    topico_id = payload.get("topico_id")
    enunciado = sanitizar(payload.get("enunciado", ""))
    opcoes = payload.get("opcoes")
    resposta_correta = str(payload.get("resposta_correta", "")).upper()
    gabarito = sanitizar(payload.get("gabarito_comentado", ""))
    nivel = str(payload.get("nivel_dificuldade", "MEDIO")).upper()
    if not topico_id or len(enunciado) < 10 or not opcoes or resposta_correta not in ("A", "B", "C", "D", "E"):
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados inválidos para questão."}, status_code=422)
    if isinstance(opcoes, list):
        opcoes = json.dumps(opcoes, ensure_ascii=False)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            "INSERT INTO questoes (topico_id, enunciado, opcoes, resposta_correta, gabarito_comentado, nivel_dificuldade) VALUES (?, ?, ?, ?, ?, ?)",
            (topico_id, enunciado, opcoes, resposta_correta, gabarito, nivel),
        )
        conexao.commit()
        return JSONResponse(content={"sucesso": True, "mensagem": "Questão criada com sucesso."}, status_code=201)
    finally:
        conexao.close()


def listar_questoes_admin_controlador():
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            '''SELECT q.id, q.topico_id, q.enunciado, q.opcoes, q.resposta_correta,
                      q.gabarito_comentado, q.nivel_dificuldade, t.titulo AS topico,
                      d.nome AS disciplina
               FROM questoes q
               JOIN topicos t  ON t.id = q.topico_id
               JOIN disciplinas d ON d.id = t.disciplina_id
               ORDER BY d.nome, q.id'''
        )
        return {"sucesso": True, "dados": cursor.fetchall()}
    finally:
        conexao.close()


def atualizar_questao_controlador(questao_id: int, payload: dict):
    enunciado = sanitizar(payload.get("enunciado", ""))
    opcoes = payload.get("opcoes")
    resposta = str(payload.get("resposta_correta", "")).upper()
    gabarito = sanitizar(payload.get("gabarito_comentado", ""))
    nivel = str(payload.get("nivel_dificuldade", "MEDIO")).upper()
    if len(enunciado) < 10 or not opcoes or resposta not in ("A", "B", "C", "D", "E"):
        return JSONResponse(content={"sucesso": False, "mensagem": "Dados inválidos."}, status_code=422)
    if isinstance(opcoes, list):
        opcoes = json.dumps(opcoes, ensure_ascii=False)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            "UPDATE questoes SET enunciado = ?, opcoes = ?, resposta_correta = ?, gabarito_comentado = ?, nivel_dificuldade = ? WHERE id = ?",
            (enunciado, opcoes, resposta, gabarito, nivel, questao_id),
        )
        conexao.commit()
        return {"sucesso": True, "mensagem": "Questão atualizada."}
    finally:
        conexao.close()


def remover_questao_controlador(questao_id: int):
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("DELETE FROM questoes WHERE id = ?", (questao_id,))
        conexao.commit()
        return {"sucesso": True, "mensagem": "Questão removida."}
    finally:
        conexao.close()
