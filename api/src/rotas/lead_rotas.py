from fastapi import APIRouter, Request, Query
from ..controladores.lead_controlador import cadastrar_lead_controlador, listar_leads_controlador

router = APIRouter()

@router.post("/leads")
async def cadastrar_lead_rota(request: Request):
    try:
        payload = await request.json()
    except Exception:
        payload = {}
    return cadastrar_lead_controlador(payload)

@router.get("/leads")
def listar_leads_rota(pagina: int = Query(1, ge=1), limite: int = Query(20, ge=1)):
    return listar_leads_controlador(pagina=pagina, limite=limite)
