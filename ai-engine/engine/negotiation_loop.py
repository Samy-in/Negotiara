from agents.dual_agent import NegotiationAgent
from strategy.concession import calculate_concession, is_deal_acceptable
import json
import re

from agents.dual_agent import NegotiationAgent
from strategy.concession import calculate_concession
from intelligence.pricing import IntrinsicValueModel
from intelligence.utility import UtilityEvaluator
from intelligence.market import MarketSignalMonitor
from intelligence.retrieval import SimpleRAGService
import json

def execute_negotiation(context: dict, max_rounds: int = 5) -> dict:
    """
    Advanced Negotiation Loop:
    1. Load Context
    2. Retrieve Similar Deals (RAG)
    3. Estimate Intrinsic Value (Buffett)
    4. Apply Market Signals (Soros)
    5. Generate Concession Strategy (Brodow)
    6. Generate LLM Dialogue (Voss)
    7. Evaluate Utility (Kwame)
    """
    
    # Initialize Modules
    pricing_model = IntrinsicValueModel()
    utility_evaluator = UtilityEvaluator()
    market_monitor = MarketSignalMonitor()
    rag_service = SimpleRAGService()
    
    shipper = NegotiationAgent(role="SHIPPER")
    carrier = NegotiationAgent(role="CARRIER")

    # Step 1 & 2: Load Context & RAG
    shipment = context.get("shipment", {})
    route = f"{shipment.get('origin')}-{shipment.get('destination')}"
    distance = shipment.get('distance', 1000)
    
    benchmarks = rag_service.retrieve_market_benchmark(route, distance)
    market_avg = benchmarks["expected_market_price"]
    
    # Step 3: Intrinsic Value (Fair Price)
    intrinsic_value = pricing_model.estimate(distance)
    
    # Step 4: Market Signals
    market_monitor.update_signals(context.get("market_signals", {}))
    adjusted_intrinsic = market_monitor.apply_to_price(intrinsic_value)
    
    history = []
    rounds_data = []
    final_status = "IN_PROGRESS"
    agreed_price = None
    
    # Initial State
    current_carrier_price = context.get("carrier_metrics", {}).get("initial_offer", market_avg * 1.2)
    current_shipper_price = context.get("shipper_metrics", {}).get("initial_offer", market_avg * 0.8)
    
    history.append({
        "role": "CARRIER", 
        "content": f"Initial quote for freight transport: ${current_carrier_price}",
        "price": current_carrier_price
    })

    for current_round in range(1, max_rounds + 1):
        # --- Shipper Turn ---
        # Evaluate Utility before offering
        shipper_budget = context.get("shipper_metrics", {}).get("budget", market_avg * 1.1)
        
        shipper_context = {
            "shipment": shipment,
            "market_benchmark": market_avg,
            "intrinsic_value": adjusted_intrinsic,
            "target_price": current_shipper_price,
            "reservation_price": shipper_budget,
            "round": current_round,
            "max_rounds": max_rounds
        }
        
        shipper_response = shipper.generate_response(shipper_context, history)
        shipper_price = shipper_response.get("target_counter_price", current_shipper_price)
        shipper_msg = shipper_response.get("message_to_lsp", "We are reviewing your quote.")
        
        history.append({"role": "SHIPPER", "content": shipper_msg, "price": shipper_price})
        
        # Check Agreement (Kwame Logic)
        util = utility_evaluator.evaluate(shipper_price, shipper_budget, current_carrier_price)
        if shipper_price >= current_carrier_price:
            final_status = "COMPLETED"
            agreed_price = shipper_price
            break
            
        # --- Carrier Turn ---
        carrier_min = context.get("carrier_metrics", {}).get("min_price", adjusted_intrinsic * 0.95)
        
        carrier_context = {
            "shipment": shipment,
            "market_benchmark": market_avg,
            "intrinsic_value": adjusted_intrinsic,
            "target_price": current_carrier_price,
            "reservation_price": carrier_min,
            "round": current_round,
            "max_rounds": max_rounds
        }
        
        carrier_response = carrier.generate_response(carrier_context, history)
        current_carrier_price = carrier_response.get("target_counter_price", current_carrier_price)
        carrier_msg = carrier_response.get("message_to_lsp", "Evaluating logistics constraints.")
        
        history.append({"role": "CARRIER", "content": carrier_msg, "price": current_carrier_price})
        
        # Check Agreement
        if current_carrier_price <= shipper_price:
            final_status = "COMPLETED"
            agreed_price = current_carrier_price
            break
            
        rounds_data.append({
            "round": current_round,
            "shipper_offer": shipper_price,
            "carrier_offer": current_carrier_price,
            "shipper_message": shipper_msg,
            "carrier_message": carrier_msg,
            "utilities": utility_evaluator.evaluate(current_carrier_price, shipper_budget, carrier_min)
        })

    return {
        "status": final_status,
        "agreed_price": agreed_price,
        "market_context": {
            "intrinsic_value": adjusted_intrinsic,
            "market_benchmark": market_avg
        },
        "rounds": rounds_data,
        "history": history
    }
