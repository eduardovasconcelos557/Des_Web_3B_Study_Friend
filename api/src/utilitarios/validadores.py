import html
import re

def sanitizar(texto: str) -> str:
    if not texto:
        return ""
    texto_limpo = str(texto).strip()
    return html.escape(texto_limpo)

def e_email_valido(email: str) -> bool:
    padrao = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(padrao, email.strip()))

def validar_lead(dados: dict) -> dict:
    erros = []
    nome = sanitizar(dados.get('nome_completo', ''))
    email = sanitizar(dados.get('email', ''))
    telefone = str(dados.get('telefone_whatsapp', ''))
    mensagem = sanitizar(dados.get('mensagem', ''))

    if not nome or len(nome) < 3 or len(nome) > 150:
        erros.append('Nome completo deve ter entre 3 e 150 caracteres.')

    if not e_email_valido(email):
        erros.append('E-mail inválido.')

    apenas_digitos = re.sub(r'\D', '', telefone)
    if len(apenas_digitos) < 10 or len(apenas_digitos) > 15:
        erros.append('Telefone WhatsApp inválido. Informe um número com DDD.')

    if len(mensagem) > 500:
        erros.append('Mensagem deve ter no máximo 500 caracteres.')

    return {
        'valido': len(erros) == 0,
        'erros': erros,
        'dados': {
            'nome_completo': nome,
            'email': email,
            'telefone_whatsapp': apenas_digitos,
            'mensagem': mensagem if mensagem else None
        }
    }
