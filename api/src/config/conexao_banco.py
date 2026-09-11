import os
import sqlite3

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def obter_conexao():
    caminho_base = os.path.dirname(os.path.abspath(__file__))
    pasta_db = os.path.abspath(os.path.join(caminho_base, '../../db'))
    os.makedirs(pasta_db, exist_ok=True)
    caminho_banco = os.path.join(pasta_db, 'landing.db')

    conexao = sqlite3.connect(caminho_banco)
    conexao.row_factory = dict_factory
    conexao.execute('PRAGMA journal_mode = WAL')
    conexao.execute('PRAGMA foreign_keys = ON')
    return conexao
