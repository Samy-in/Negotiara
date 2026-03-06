from fastapi import APIRouter
from pydantic import BaseModel
from engine.negotiation_loop import execute_negotiation

router = APIRouter()

class NegotiationRequest(BaseModel):
    shipment_context: str
    market_benchmark: float
    target_price: float
    reservation_price: float
    competitor_prices: list[float]
    initial_lsp_offer: float = None
    max_rounds: int = 4

@router.post("/negotiate")
async def start_negotiation(request: NegotiationRequest):
    """
    Endpoint to trigger an end-to-end simulated negotiation.
    """
    result = execute_negotiation(
        shipment_context=request.shipment_context,
        market_benchmark=request.market_benchmark,
        target_price=request.target_price,
        reservation_price=request.reservation_price,
        competitor_prices=request.competitor_prices,
        initial_lsp_offer=request.initial_lsp_offer,
        max_rounds=request.max_rounds
    )
    
    return {"status": "completed", "negotiation_insights": result}
