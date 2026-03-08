from fastapi import APIRouter
from pydantic import BaseModel
from engine.negotiation_loop import execute_negotiation

router = APIRouter()

class NegotiationRequest(BaseModel):
    shipment_data: dict
    shipper_metrics: dict
    carrier_metrics: dict
    max_rounds: int = 5

@router.post("/negotiate")
async def start_negotiation(request: dict):
    """
    Advanced Negotiation Endpoint:
    Accepts full context object including shipment, metrics, and market signals.
    """
    try:
        # Pass the entire request body as context
        result = execute_negotiation(request, max_rounds=request.get("max_rounds", 5))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
