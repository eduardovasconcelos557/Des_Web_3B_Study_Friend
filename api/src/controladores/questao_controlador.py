from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

from ..config.conexao_banco import obter_conexao

OPCOES_VALIDAS = ("A", "B", "C", "D", "E")


def listar_questoes_controlador(
    disciplina_id: int = None,
    topico_id: int = None,
    ano_escolar: str = None,
    nivel_dificuldade: str = None,
):
    """Filtra exercícios por matéria, tópico, ano e nível de dificuldade."""
    consulta = '''
        SELECT q.id, q.topico_id, q.enunciado, q.opcoes, q.gabarito_comentado,
               q.nivel_dificuldade, t.titulo AS topico, t.ano_escolar,
               d.id AS disciplina_id, d.nome AS disciplina
        FROM questoes q
        JOIN topicos t  ON t.id = q.topico_id
        JOIN disciplinas d ON d.id = t.disciplina_id
        WHERE 1 = 1
    '''
    parametros = []
    condicoes = []

    if disciplina_id:
        condicoes.append("d.id = ?")
        parametros.append(disciplina_id)
    if topico_id:
        condicoes.append("q.topico_id = ?")
        parametros.append(topico_id)
    if ano_escolar:
        condicoes.append("t.ano_escolar = ?")
        parametros.append(ano_escolar)
    if nivel_dificuldade:
        condicoes.append("q.nivel_dificuldade = ?")
        parametros.append(nivel_dificuldade)

    if condicoes:
        consulta += " AND " + " AND ".join(condicoes)

    consulta += " ORDER BY d.nome, t.ano_escolar, q.id"

    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(consulta, parametros)
        questoes = cursor.fetchall()
    finally:
        conexao.close()

    return {"sucesso": True, "dados": questoes}


def responder_questao_controlador(payload: dict, usuario: dict):
    """Processa a resposta do aluno e registra o progresso no banco."""
    questao_id = payload.get("questao_id")
    alternativa = str(payload.get("alternativa", "")).upper()

    if not questao_id:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"sucesso": False, "mensagem": "Questão não informada."},
        )
    if alternativa not in OPCOES_VALIDAS:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"sucesso": False, "mensagem": "Alternativa inválida. Use A, B, C, D ou E."},
        )

    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()
        cursor.execute(
            "SELECT id, resposta_correta, gabarito_comentado FROM questoes WHERE id = ?",
            (questao_id,),
        )
        questao = cursor.fetchone()

        if not questao:
            raise HTTPException(status_code=404, detail="Questão não encontrada.")

        correta = questao["resposta_correta"] == alternativa
        status_acerto = "ACERTOU" if correta else "ERROU"

        cursor.execute(
            '''INSERT INTO progresso_aluno (usuario_id, questao_id, status_acerto)
               VALUES (?, ?, ?)
               ON CONFLICT(usuario_id, questao_id)
               DO UPDATE SET status_acerto = excluded.status_acerto,
                             data_resolucao = datetime('now','localtime')''',
            (usuario["id"], questao_id, status_acerto),
        )
        conexao.commit()
    finally:
        conexao.close()

    return {
        "sucesso": True,
        "correta": correta,
        "alternativa_correta": questao["resposta_correta"],
        "gabarito_comentado": questao["gabarito_comentado"],
    }


def estatisticas_controlador(usuario: dict):
    """Retorna relatórios de desempenho do aluno autenticado."""
    conexao = obter_conexao()
    try:
        cursor = conexao.cursor()

        cursor.execute(
            '''SELECT
                 COUNT(*) AS total_resolvidas,
                 SUM(CASE WHEN status_acerto = 'ACERTOU' THEN 1 ELSE 0 END) AS total_acertos,
                 SUM(CASE WHEN status_acerto = 'ERROU' THEN 1 ELSE 0 END) AS total_erros
               FROM progresso_aluno
               WHERE usuario_id = ?''',
            (usuario["id"],),
        )
        resumo = cursor.fetchone()

        cursor.execute(
            '''SELECT d.nome AS disciplina, COUNT(p.id) AS resolvidas,
                      SUM(CASE WHEN p.status_acerto = 'ACERTOU' THEN 1 ELSE 0 END) AS acertos
               FROM progresso_aluno p
               JOIN questoes q  ON q.id = p.questao_id
               JOIN topicos t   ON t.id = q.topico_id
               JOIN disciplinas d ON d.id = t.disciplina_id
               WHERE p.usuario_id = ?
               GROUP BY d.id
               ORDER BY resolvidas DESC''',
            (usuario["id"],),
        )
        por_disciplina = cursor.fetchall()
    finally:
        conexao.close()

    total_resolvidas = resumo["total_resolvidas"] or 0
    total_acertos = resumo["total_acertos"] or 0
    taxa_acerto = round((total_acertos / total_resolvidas) * 100, 1) if total_resolvidas else 0.0

    return {
        "sucesso": True,
        "dados": {
            "total_resolvidas": total_resolvidas,
            "total_acertos": total_acertos,
            "total_erros": resumo["total_erros"] or 0,
            "taxa_acerto": taxa_acerto,
            "por_disciplina": por_disciplina,
        },
    }
