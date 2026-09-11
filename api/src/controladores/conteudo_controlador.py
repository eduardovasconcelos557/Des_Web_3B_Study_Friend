from fastapi import HTTPException

from ..config.conexao_banco import obter_conexao


def _obter_topico_ou_404(topico_id: int) -> dict:
    """Busca um tópico pelo ID ou levanta erro 404."""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id, disciplina_id, titulo, ano_escolar FROM topicos WHERE id = ?", (topico_id,))
        topico = cursor.fetchone()
    finally:
        conexao.close()

    if not topico:
        raise HTTPException(status_code=404, detail="Tópico não encontrado.")
    return topico


def listar_disciplinas_controlador():
    """Retorna as 9 disciplinas do Ensino Médio com contagem de tópicos."""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            '''SELECT d.id, d.nome, d.area_conhecimento, d.icone, COUNT(t.id) AS total_topicos
               FROM disciplinas d
               LEFT JOIN topicos t ON t.disciplina_id = d.id
               GROUP BY d.id
               ORDER BY d.nome'''
        )
        disciplinas = cursor.fetchall()
    finally:
        conexao.close()
    return {"sucesso": True, "dados": disciplinas}


def listar_topicos_controlador(disciplina_id: int, ano_escolar: str = None):
    """Retorna os tópicos de uma disciplina, opcionalmente filtrados por ano escolar."""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            '''SELECT t.id, t.disciplina_id, t.titulo, t.ano_escolar,
                      (SELECT COUNT(*) FROM resumos r WHERE r.topico_id = t.id) AS total_resumos,
                      (SELECT COUNT(*) FROM flashcards f WHERE f.topico_id = t.id) AS total_flashcards,
                      (SELECT COUNT(*) FROM questoes q WHERE q.topico_id = t.id) AS total_questoes
               FROM topicos t
               WHERE t.disciplina_id = ?
               ORDER BY t.ano_escolar, t.titulo''',
            (disciplina_id,),
        )
        topicos = cursor.fetchall()
    finally:
        conexao.close()

    if ano_escolar:
        topicos = [t for t in topicos if t["ano_escolar"] == ano_escolar]

    return {"sucesso": True, "dados": topicos}


def listar_resumos_controlador(topico_id: int):
    """Retorna os resumos e links de mapas mentais de um tópico."""
    _obter_topico_ou_404(topico_id)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id, topico_id, titulo, conteudo, url_pdf FROM resumos WHERE topico_id = ? ORDER BY id", (topico_id,))
        resumos = cursor.fetchall()
    finally:
        conexao.close()
    return {"sucesso": True, "dados": resumos}


def listar_flashcards_controlador(topico_id: int):
    """Retorna o baralho de flashcards de revisão de um tópico."""
    _obter_topico_ou_404(topico_id)
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute("SELECT id, topico_id, frente, verso FROM flashcards WHERE topico_id = ? ORDER BY id", (topico_id,))
        flashcards = cursor.fetchall()
    finally:
        conexao.close()
    return {"sucesso": True, "dados": flashcards}
