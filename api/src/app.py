import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env da pasta api
caminho_env = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=caminho_env)

from .rotas.auth_rotas import router as auth_router
from .rotas.conteudo_rotas import router as conteudo_router
from .rotas.questao_rotas import router as questao_router
from .rotas.admin_rotas import router as admin_router
from .rotas.lead_rotas import router as lead_router

app = FastAPI(title="API Study Friend — Python FastAPI")

# ── Configuração de CORS ─────────────────────────────────────────────────────
origem_permitida = os.getenv("ORIGEM_PERMITIDA", "*")
origens = [origem_permitida] if origem_permitida != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Rotas da API ────────────────────────────────────────────────────────────
app.include_router(auth_router, prefix="/api")
app.include_router(conteudo_router, prefix="/api")
app.include_router(questao_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(lead_router, prefix="/api")


@app.get("/api/health")
def health_check():
    """Health check da API Study Friend."""
    return {"sucesso": True, "mensagem": "API Study Friend funcionando!"}


# ── Servir arquivos estáticos do frontend (dist ou raiz do frontend) ────────
caminho_dist = Path(__file__).resolve().parent.parent.parent / 'frontend' / 'dist'
caminho_frontend = Path(__file__).resolve().parent.parent.parent / 'frontend'
pasta_estatica = caminho_dist if caminho_dist.exists() else caminho_frontend

if pasta_estatica.exists():
    app.mount("/static", StaticFiles(directory=str(pasta_estatica)), name="static")


@app.get("/{full_path:path}")
async def servir_frontend_ou_fallback(request: Request, full_path: str):
    """Fallback SPA: entrega o index.html do React em qualquer rota não-API."""
    if full_path.startswith("api"):
        return FileResponse(status_code=404, path="")

    caminho_arquivo = pasta_estatica / full_path
    if full_path and caminho_arquivo.is_file():
        return FileResponse(caminho_arquivo)

    index_path = pasta_estatica / "index.html"
    if index_path.is_file():
        return FileResponse(index_path)

    return {"erro": "Página não encontrada"}
