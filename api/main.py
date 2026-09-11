import os
import sys
from pathlib import Path

# Adiciona o diretório da API ao path do Python
caminho_api = Path(__file__).resolve().parent
sys.path.insert(0, str(caminho_api))

from dotenv import load_dotenv
load_dotenv(dotenv_path=caminho_api / '.env')

from iniciar_banco import inicializar_banco

if __name__ == "__main__":
    # Garante a inicialização da tabela SQLite
    inicializar_banco()

    import uvicorn
    porta = int(os.getenv("PORT", 3000))
    print(f"Servidor Python (FastAPI + Uvicorn) rodando na porta {porta}")
    uvicorn.run("src.app:app", host="0.0.0.0", port=porta, reload=False)
