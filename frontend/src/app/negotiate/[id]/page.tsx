"use client";

import { useParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { ChatInterface } from "@/components/negotiation/ChatInterface";
import { PriceGraph } from "@/components/negotiation/PriceGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, Clock, MapPin, Package, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UtilityGauge } from "@/components/negotiation/UtilityGauge";
import { negotiationApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function NegotiationSessionPage() {
    const { id } = useParams();
    const { messages, connected } = useSocket(id as string);
    const [graphData, setGraphData] = useState<any[]>([]);
    const [session, setSession] = useState<any>(null);
    const [displayMessages, setDisplayMessages] = useState<any[]>([]);

    useEffect(() => {
        negotiationApi.getSession(id as string).then(setSession).catch(console.error);
    }, [id]);

    useEffect(() => {
        if (messages.length > 0) {
            setDisplayMessages(messages);
        } else if (session?.offers) {
            const mappedOffers = session.offers.map((o: any) => ({
                role: o.senderId === session.shipperId ? "SHIPPER" : "CARRIER",
                content: o.message,
                price: o.price
            }));
            setDisplayMessages(mappedOffers);
        }
    }, [messages, session]);

    useEffect(() => {
        // Process messages into graph data
        const rounds: Record<number, any> = {};
        displayMessages.forEach((m, idx) => {
            const roundNum = Math.floor(idx / 2) + 1;
            if (!rounds[roundNum]) rounds[roundNum] = { round: roundNum };
            if (m.role === "SHIPPER") rounds[roundNum].shipper_offer = m.price;
            if (m.role === "CARRIER") rounds[roundNum].carrier_offer = m.price;
        });
        setGraphData(Object.values(rounds));
    }, [displayMessages]);

    return (
        <div className="py-8 md:py-12 px-4 sm:px-6 md:px-8 xl:px-12 max-w-[1600px] mx-auto space-y-8">
            {/* Session Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Link href="/dashboard/shipper" className="md:mr-4 shrink-0 mt-1 self-start">
                    <button className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Session ID: {id}</Badge>
                        <Badge className={connected ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600 px-3 py-1 text-xs"}>
                            {connected ? "Connected" : "Disconnected"}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-display font-bold mb-2">Autonomous Negotiation</h1>
                    <p className="text-lg text-muted-foreground">AI agents are negotiating terms for Shipment #8829</p>
                </div>
                <div className="flex gap-4 self-start md:self-auto items-center">
                    {session?.status === "COMPLETED" && (
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-12 px-6 shadow-lg shadow-emerald-900/20">
                            <CheckCircle className="w-5 h-5" />
                            Confirm Booking @ ${displayMessages.length > 0 ? displayMessages[displayMessages.length - 1].price : session.targetPrice}
                        </Button>
                    )}
                    <Card className="p-6 bg-zinc-900 text-white min-w-[200px] shadow-2xl">
                        <div className="text-xs uppercase opacity-60 font-bold mb-2 tracking-widest">Current Best Offer</div>
                        <div className="text-4xl lg:text-5xl font-display tracking-tight text-[var(--negotiara-yellow)]">
                            ${displayMessages.length > 0 ? displayMessages[displayMessages.length - 1].price.toLocaleString() : (session?.basePrice?.toLocaleString() || "...")}
                        </div>
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

                    {session && (
                        <UtilityGauge
                            currentPrice={displayMessages.length > 0 ? displayMessages[displayMessages.length - 1].price : session.basePrice}
                            budget={session.shipperBudget}
                            minPrice={session.targetPrice}
                        />
                    )}

                    <div className="bento-card-dark p-6 bg-primary/10 border-primary/20 text-primary-foreground mt-4">
                        <div className="flex gap-4">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <div>
                                <h4 className="font-bold mb-1">AI Strategy Insight</h4>
                                <p className="text-sm opacity-80 leading-relaxed">
                                    The Carrier agent is currently analyzing margin constraints.
                                    Our Shipper agent is leveraging your "{session?.strategyProfile || 'Collaborative'}" strategy to maximize utility.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[700px] flex flex-col relative">
                    {displayMessages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-2xl bg-zinc-900/50 backdrop-blur-sm">
                            <div className="w-16 h-16 rounded-full border-4 border-t-[var(--negotiara-yellow)] border-r-transparent border-b-transparent border-l-transparent animate-spin mb-6"></div>
                            <h3 className="font-display text-2xl font-bold mb-2">AI Agents Initializing</h3>
                            <p className="text-muted-foreground w-3/4 mx-auto max-w-sm">
                                Negotiator Pro and Llama 3 are currently analyzing route parameters, market benchmarks, and defining concession boundaries.
                            </p>
                        </div>
                    ) : (
                        <ChatInterface messages={displayMessages} />
                    )}
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
