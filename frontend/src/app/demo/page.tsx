"use client";

import { ChatInterface } from "@/components/negotiation/ChatInterface";
import { PriceGraph } from "@/components/negotiation/PriceGraph";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, Clock, MapPin, Package, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UtilityGauge } from "@/components/negotiation/UtilityGauge";
import { Button } from "@/components/ui/Button";

const MOCK_MESSAGES = [
    { role: "CARRIER", price: 12500, content: "Initial quote for logistics from Shanghai to Los Angeles. Given current port congestion, we cannot go lower." },
    { role: "SHIPPER", price: 10500, content: "We respect the port congestion constraints, but our historical data shows identical routes clearing for much less. We need to stay closer to $10,500." },
    { role: "CARRIER", price: 11800, content: "We can drop to $11,800 if you guarantee loading times under 2 hours to avoid demurrage." },
    { role: "SHIPPER", price: 11200, content: "Agreed on the 2-hour loading constraint. At that efficiency, we believe $11,200 is a fair reflection of the shared risk." },
    { role: "CARRIER", price: 11500, content: "Deal. We can execute at $11,500 given the strict loading time guarantee." },
    { role: "SHIPPER", price: 11500, content: "Excellent. $11,500 confirmed." }
];

export default function DemoPage() {
    const [displayMessages, setDisplayMessages] = useState<any[]>([]);
    const [graphData, setGraphData] = useState<any[]>([]);

    useEffect(() => {
        // Sequentially load messages to simulate "live" demo
        let timeouts: NodeJS.Timeout[] = [];
        MOCK_MESSAGES.forEach((msg, idx) => {
            const t = setTimeout(() => {
                setDisplayMessages(prev => [...prev, msg]);
            }, idx * 1500 + 500);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        const rounds: Record<number, any> = {};
        displayMessages.forEach((m, idx) => {
            const roundNum = Math.floor(idx / 2) + 1;
            if (!rounds[roundNum]) rounds[roundNum] = { round: roundNum };
            if (m.role === "SHIPPER") rounds[roundNum].shipper_offer = m.price;
            if (m.role === "CARRIER") rounds[roundNum].carrier_offer = m.price;
        });
        setGraphData(Object.values(rounds));
    }, [displayMessages]);

    const isComplete = displayMessages.length === MOCK_MESSAGES.length;

    return (
        <div className="py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-8">
            {/* Session Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Link href="/" className="md:mr-4 shrink-0 mt-1 self-start">
                    <button className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Session ID: DEMO-8829</Badge>
                        <Badge className="bg-[var(--negotiara-yellow)]/10 text-[var(--negotiara-yellow)] font-bold">
                            Simulated
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-display font-bold">Autonomous Demo Sandbox</h1>
                    <p className="text-muted-foreground">Watch our agents deploy strategic constraints dynamically.</p>
                </div>
                <div className="flex gap-4 self-start md:self-auto items-center">
                    {isComplete && (
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-12 px-6 shadow-lg shadow-emerald-900/20">
                            <CheckCircle className="w-5 h-5" />
                            Confirm Booking @ $11,500
                        </Button>
                    )}
                    <Card className="p-4 bg-zinc-900 text-white min-w-[160px]">
                        <div className="text-[10px] uppercase opacity-50 font-bold mb-1">Current Best Offer</div>
                        <div className="text-2xl font-display">
                            ${displayMessages.length > 0 ? displayMessages[displayMessages.length - 1].price.toLocaleString() : "12,500"}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <PriceGraph data={graphData} targetPrice={10000} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bento-card p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4 text-primary" /> Shipment Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <Detail label="Goods" value="High-End Laptops" />
                                <Detail label="Weight" value="5,000kg" />
                                <Detail label="Priority" value="High" />
                            </div>
                        </Card>
                        <Card className="bento-card p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <MapPin className="w-4 h-4 text-accent" /> Route Info
                            </h3>
                            <div className="space-y-3 text-sm">
                                <Detail label="Origin" value="Shenzhen, CN" />
                                <Detail label="Destination" value="Los Angeles, CA" />
                                <Detail label="Est. Distance" value="10,000km" />
                            </div>
                        </Card>
                    </div>

                    <UtilityGauge
                        currentPrice={displayMessages.length > 0 ? displayMessages[displayMessages.length - 1].price : 12500}
                        budget={13000}
                        minPrice={10000}
                    />
                </div>

                <div className="h-[700px] flex flex-col relative">
                    {displayMessages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-2xl bg-zinc-900/50 backdrop-blur-sm">
                            <div className="w-16 h-16 rounded-full border-4 border-t-[var(--negotiara-yellow)] border-r-transparent border-b-transparent border-l-transparent animate-spin mb-6"></div>
                            <h3 className="font-display text-2xl font-bold mb-2">Connecting Simulation...</h3>
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
