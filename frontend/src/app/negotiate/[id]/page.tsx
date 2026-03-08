"use client";

import { useParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { ChatInterface } from "@/components/negotiation/ChatInterface";
import { PriceGraph } from "@/components/negotiation/PriceGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, Clock, MapPin, Package, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function NegotiationSessionPage() {
    const { id } = useParams();
    const { messages, connected } = useSocket(id as string);
    const [graphData, setGraphData] = useState<any[]>([]);

    useEffect(() => {
        // Process messages into graph data
        const rounds: Record<number, any> = {};
        messages.forEach((m, idx) => {
            const roundNum = Math.floor(idx / 2) + 1;
            if (!rounds[roundNum]) rounds[roundNum] = { round: roundNum };
            if (m.role === "SHIPPER") rounds[roundNum].shipper_offer = m.price;
            if (m.role === "CARRIER") rounds[roundNum].carrier_offer = m.price;
        });
        setGraphData(Object.values(rounds));
    }, [messages]);

    return (
        <div className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto space-y-8">
            {/* Session Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Session ID: {id}</Badge>
                        <Badge className={connected ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}>
                            {connected ? "Connected" : "Disconnected"}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-display font-bold">Autonomous Negotiation</h1>
                    <p className="text-muted-foreground">AI agents are negotiating terms for Shipment #8829</p>
                </div>
                <div className="flex gap-4">
                    <Card className="p-4 bg-zinc-900 text-white min-w-[200px]">
                        <div className="text-[10px] uppercase opacity-50 font-bold mb-1">Current Best Offer</div>
                        <div className="text-2xl font-display">$12,450</div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <PriceGraph data={graphData} targetPrice={11500} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bento-card p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4 text-primary" /> Shipment Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <Detail label="Goods" value="Pharmaceuticals" />
                                <Detail label="Weight" value="1,200kg" />
                                <Detail label="Priority" value="High" />
                            </div>
                        </Card>
                        <Card className="bento-card p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <MapPin className="w-4 h-4 text-accent" /> Route Info
                            </h3>
                            <div className="space-y-3 text-sm">
                                <Detail label="Origin" value="Berlin, GER" />
                                <Detail label="Destination" value="Paris, FRA" />
                                <Detail label="Est. Distance" value="1,050km" />
                            </div>
                        </Card>
                    </div>

                    <div className="bento-card-dark p-6 bg-primary/10 border-primary/20 text-primary-foreground">
                        <div className="flex gap-4">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <div>
                                <h4 className="font-bold mb-1">AI Strategy Insight</h4>
                                <p className="text-sm opacity-80 leading-relaxed">
                                    The Carrier agent is currently using a "Boulder" concession strategy, making smaller concessions early.
                                    Our Shipper agent is countered with "Tactical Empathy" to maintain the anchor point at $11,500.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[700px]">
                    <ChatInterface messages={messages} />
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between border-b border-white/10 pb-2 last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}
