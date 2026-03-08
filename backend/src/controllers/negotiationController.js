const prisma = require('../config/db');
const axios = require('axios');

// AI Engine URL
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000/api/negotiate';

const startNegotiation = async (req, res) => {
    try {
        const { shipment, shipper_metrics, carrier_metrics, market_signals } = req.body;
        const shipperId = req.user.id;

        // 1. Create or Find Shipment
        const newShipment = await prisma.shipment.create({
            data: {
                origin: shipment.origin,
                destination: shipment.destination,
                distance: shipment.distance,
                cargoType: shipment.cargo_type,
                weight: shipment.weight,
                deadline: new Date(shipment.deadline || Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        // 2. Initialize Negotiation
        const negotiation = await prisma.negotiation.create({
            data: {
                shipmentId: newShipment.id,
                shipperId: shipperId,
                status: 'IN_PROGRESS',
                basePrice: shipper_metrics.initial_offer,
                targetPrice: shipper_metrics.target_price || (shipper_metrics.budget * 0.9),
                shipperBudget: shipper_metrics.budget,
                deadline: newShipment.deadline,
                maxRounds: req.body.max_rounds || 5
            }
        });

        // 3. Trigger AI Engine Simulation
        const aiResponse = await axios.post(AI_ENGINE_URL, {
            shipment: shipment,
            shipper_metrics: shipper_metrics,
            carrier_metrics: carrier_metrics,
            market_signals: market_signals,
            max_rounds: negotiation.maxRounds
        });

        const simulationResults = aiResponse.data;

        // 4. Persist Simulation Results (Offers)
        const offerPromises = simulationResults.history.map((entry, index) => {
            return prisma.offer.create({
                data: {
                    negotiationId: negotiation.id,
                    round: Math.floor(index / 2) + 1,
                    price: entry.price,
                    senderId: entry.role === 'SHIPPER' ? shipperId : (req.body.carrierId || 'ai-carrier-id'),
                    message: entry.content,
                    strategy: entry.strategy_used || 'Autonomous'
                }
            });
        });

        await Promise.all(offerPromises);

        // 5. Update Negotiation Status
        await prisma.negotiation.update({
            where: { id: negotiation.id },
            data: {
                status: simulationResults.status === 'COMPLETED' ? 'COMPLETED' : 'WALK_AWAY',
                intrinsicValue: simulationResults.market_context?.intrinsic_value,
                marketBenchmark: simulationResults.market_context?.market_benchmark,
                currentRound: simulationResults.rounds.length
            }
        });

        res.status(201).json({
            message: 'Negotiation completed successfully',
            negotiationId: negotiation.id,
            results: simulationResults
        });

    } catch (error) {
        console.error('Negotiation Error:', error.message);
        res.status(500).json({
            message: 'Failed to execute negotiation',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getNegotiationHistory = async (req, res) => {
    try {
        const negotiations = await prisma.negotiation.findMany({
            where: {
                OR: [
                    { shipperId: req.user.id },
                    { carrierId: req.user.id }
                ]
            },
            include: {
                shipment: true,
                offers: {
                    orderBy: { round: 'asc' }
                }
            }
        });
        res.json(negotiations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    startNegotiation,
    getNegotiationHistory
};
