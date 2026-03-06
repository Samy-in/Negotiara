from agents.master_negotiator import MasterNegotiator
from agents.lsp_agent import LspAgent
from intelligence.negotiation_memory import NegotiationMemory
from strategy.anchoring import calculate_anchor
from .decision_engine import evaluate_round_outcome
import json
import re

def execute_negotiation(shipment_context: str, 
                        market_benchmark: float, 
                        target_price: float, 
                        reservation_price: float, 
                        competitor_prices: list[float], 
                        initial_lsp_offer: float = None,
                        max_rounds: int = 4) -> dict:
                            
    master = MasterNegotiator()
    lsp = LspAgent()
    memory = NegotiationMemory()
    
    # Store initial LSP offer if available
    if initial_lsp_offer:
        memory.add_lsp_message(f"Our initial quote for this shipment is ₹{initial_lsp_offer}/km.", initial_lsp_offer)
        
    anchor = calculate_anchor(target_price, market_benchmark)
    
    rounds_data = []
    final_status = ""
    agreed_price = None
    
    for current_round in range(1, max_rounds + 1):
        print(f"--- Round {current_round} ---")
        
        # 1. AI Generates response Strategy based on state
        ai_response_data = master.generate_response(
            shipment_context=shipment_context,
            market_benchmark=market_benchmark,
            target_price=target_price,
            reservation_price=reservation_price,
            competitor_prices=competitor_prices,
            current_round=current_round,
            max_rounds=max_rounds,
            memory=memory
        )
        
        if "error" in ai_response_data:
            return {"status": "error", "message": ai_response_data["error"]}
            
        ai_message = ai_response_data.get("message_to_lsp", "")
        # convert to float defensively
        try:
            target_counter = float(ai_response_data.get("target_counter_price", anchor))
        except:
            target_counter = anchor
            
        memory.add_ai_message(ai_message, target_counter)
        
        round_info = {
            "round": current_round,
            "strategy": ai_response_data.get("strategy_used"),
            "reasoning": ai_response_data.get("reasoning"),
            "ai_message": ai_message,
            "target_counter": target_counter,
            "confidence": ai_response_data.get("confidence_score")
        }
        
        print(f"AI Strategy: {round_info['strategy']}")
        print(f"AI Message: {ai_message}")
        
        # 2. LSP Generates counter offer
        lsp_message = lsp.get_counter_offer(ai_message, current_round)
        print(f"LSP Response: {lsp_message}")
        
        # Try to extract a price from LSP message (very simple regex for demo purposes)
        # Assuming LSP responds with something like "46" or "₹46" or "46/km"
        price_match = re.search(r'(?:₹\s*|^|)(\d+(?:\.\d+)?)(?:\s*/km|\s*$)', lsp_message)
        lsp_price = float(price_match.group(1)) if price_match else initial_lsp_offer
        
        memory.add_lsp_message(lsp_message, lsp_price)
        round_info["lsp_message"] = lsp_message
        round_info["lsp_price"] = lsp_price
        
        rounds_data.append(round_info)
        
        # 3. Decision Engine evaluates
        decision = evaluate_round_outcome(target_counter, lsp_price, reservation_price, current_round, max_rounds)
        print(f"Decision: {decision['status']} - {decision['reason']}\n")
        
        if decision["status"] == "deal_closed":
            final_status = "Success"
            agreed_price = lsp_price
            break
        elif decision["status"] == "walk_away":
            final_status = "Walk Away"
            agreed_price = None
            break
            
    if not final_status:
        final_status = "Max Rounds Reached - No Deal"
        
    # Return aggregated data for insight panel
    return {
        "final_status": final_status,
        "agreed_price": agreed_price,
        "savings_percentage": ((initial_lsp_offer - agreed_price) / initial_lsp_offer * 100) if agreed_price and initial_lsp_offer else 0,
        "total_rounds": len(rounds_data),
        "rounds_data": rounds_data
    }
