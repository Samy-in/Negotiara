"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Truck, DollarSign, Clock, Layout, ArrowRight, Bell, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { negotiationApi } from "@/lib/api";

export default function CarrierDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [negotiations, setNegotiations] = useState<any[]>([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
    const [opCost, setOpCost] = useState("");
    const [margin, setMargin] = useState("10");

    useEffect(() => {
        if (!user || user.role !== "CARRIER") {
            router.push("/auth/login");
        } else {
            negotiationApi.getHistory()
                .then((data) => setNegotiations(data))
                .catch((err) => console.error("Failed to fetch negotiations:", err));
        }
    }, [user, router]);

    if (!user) return null;

    const activeCount = negotiations.filter(n => n.status === "IN_PROGRESS").length;
    // Get latest negotiation for the live counter offer widget
    const latestNeg = negotiations.length > 0 ? negotiations[0] : null;

    const handleRfqClick = (id: string) => {
        setSelectedRfqId(id);
        setShowModal(true);
    };

    const handleInitializeAgent = () => {
        if (!selectedRfqId) return;
        // In a real dual-async mode, this would hit POST /api/negotiation/counter
        // For our sync demo, the agent is already spawned, so we route to monitor it.
        router.push(`/negotiate/${selectedRfqId}`);
        setShowModal(false);
    };

    return (
        <div className="py-8 md:py-12 px-4 sm:px-6 md:px-8 xl:px-12 max-w-[1600px] mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Carrier Dashboard</h1>
                    <p className="text-lg text-muted-foreground">Welcome back, {user.name}. View incoming RFQs and manage your fleet.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 text-foreground">
                        <Bell className="w-5 h-5" />
                    </Button>
                    <Link href="/dashboard/carrier">
                        <Button className="bg-[var(--negotiara-yellow)] hover:bg-[var(--negotiara-yellow)]/90 text-black border-none gap-2 rounded-2xl h-12 px-6">
                            <Layout className="w-5 h-5" />
                            Fleet Overview
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<DollarSign className="text-emerald-500" />} title="Revenue (MTD)" value="$42,500" trend="+8.4%" />
                <StatCard icon={<Clock className="text-amber-500" />} title="Avg. Response" value="12min" trend="-2min" />
                <StatCard icon={<Truck className="text-primary" />} title="Active Trucks" value="18/24" trend="75%" />
                <StatCard icon={<Layout className="text-accent" />} title="New RFQs" value={activeCount.toString()} trend="Priority" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                {/* Incoming RFQs */}
                <Card className="lg:col-span-2 flex flex-col overflow-hidden h-full shadow-lg border-zinc-200/60 rounded-3xl">
                    <CardHeader className="p-8 border-b border-zinc-100 flex flex-row items-center justify-between shrink-0 bg-white">
                        <CardTitle className="font-display text-2xl font-bold">Incoming RFQs</CardTitle>
                        <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200">{activeCount} New Requests</Badge>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto bg-white">
                        <div className="divide-y divide-zinc-100 h-full">
                            {negotiations.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                                    <FileText className="w-8 h-8 mb-4 opacity-50" />
                                    No incoming RFQs at the moment.
                                </div>
                            ) : (
                                negotiations.map((neg) => (
                                    <div key={neg.id} onClick={() => handleRfqClick(neg.id)}>
                                        <RFQRow
                                            company={`Shipper UID: ${neg.shipperId.substring(0, 6)}`}
                                            route={`${neg.shipment?.origin} -> ${neg.shipment?.destination}`}
                                            deadline="Live"
                                            amount={`$${neg.targetPrice?.toLocaleString() || "0"}`}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Counter Offer Panel */}
                <Card className="bento-card-dark p-6 flex flex-col gap-6 h-full justify-between">
                    <div>
                        <h3 className="font-display text-lg font-bold mb-6 text-white">Live Counter-Offer</h3>
                        {latestNeg ? (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-xs text-zinc-400">
                                    <span>Active negotiation #{latestNeg.id.substring(0, 6)}</span>
                                    <span>Round {latestNeg.currentRound}/{latestNeg.maxRounds}</span>
                                </div>
                                <div className="text-2xl font-display font-light">${latestNeg.targetPrice?.toLocaleString()}</div>
                                <Link href={`/negotiate/${latestNeg.id}`} className="block">
                                    <Button className="w-full bg-[var(--negotiara-yellow)] text-black hover:bg-[var(--negotiara-yellow)]/90 rounded-xl transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] font-semibold mt-4">
                                        Update Counter
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="p-4 text-center text-zinc-500 text-sm">No active negotiations.</div>
                        )}
                    </div>
                    {latestNeg && latestNeg.offers && latestNeg.offers.length > 0 && (
                        <div className="space-y-4">
                            <div className="text-xs uppercase font-bold tracking-widest text-zinc-500">History</div>
                            <div className="space-y-3">
                                {latestNeg.offers.slice(-2).map((offer: any, idx: number) => (
                                    <HistoryItem
                                        key={idx}
                                        user={offer.senderId === latestNeg.shipperId ? "Shipper" : "You (AI)"}
                                        message={`Offered $${offer.price}`}
                                        time={`Round ${offer.round}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* AI Initialization Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md bg-white border-zinc-200">
                        <CardHeader>
                            <CardTitle className="font-display">Initialize AI Carrier Agent</CardTitle>
                            <CardDescription>
                                Set your bottom-line limits to counter-offer this RFQ autonomously.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Operational Cost Floor ($)</label>
                                <Input type="number" placeholder="12000" value={opCost} onChange={(e) => setOpCost(e.target.value)} />
                                <p className="text-xs text-muted-foreground">The AI will never accept a price below this number.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Desired Profit Margin (%)</label>
                                <Input type="number" placeholder="15" value={margin} onChange={(e) => setMargin(e.target.value)} />
                            </div>
                            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-zinc-100">
                                <Button variant="outline" onClick={() => setShowModal(false)} className="text-zinc-600">Cancel</Button>
                                <Button onClick={handleInitializeAgent} className="bg-[var(--negotiara-yellow)] hover:bg-[var(--negotiara-yellow)]/90 text-black">
                                    Commence AI
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: string, trend: string }) {
    return (
        <div className="bento-card p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-zinc-50 rounded-lg">{icon}</div>
                <Badge variant="secondary" className="bg-zinc-100/80 text-zinc-600 border-zinc-200/50">{trend}</Badge>
            </div>
            <div>
                <div className="text-3xl font-display font-bold tracking-tight">{value}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</div>
            </div>
        </div>
    )
}

function RFQRow({ company, route, deadline, amount }: { company: string, route: string, deadline: string, amount: string }) {
    return (
        <div className="px-8 py-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-bold text-zinc-700">
                    {company.charAt(0)}
                </div>
                <div>
                    <div className="font-medium">{company}</div>
                    <div className="text-xs text-muted-foreground">{route}</div>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="text-right">
                    <div className="font-bold">{amount}</div>
                    <div className="text-[10px] text-amber-600 font-bold uppercase flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {deadline}
                    </div>
                </div>
                <Button size="icon" variant="ghost" className="group-hover:text-primary"><ArrowRight className="w-5 h-5" /></Button>
            </div>
        </div>
    )
}

function HistoryItem({ user, message, time }: { user: string, message: string, time: string }) {
    return (
        <div className="flex justify-between items-start text-sm">
            <div className="flex flex-col">
                <span className="font-bold text-zinc-300 text-[10px] uppercase tracking-tighter">{user}</span>
                <span className="text-zinc-400">{message}</span>
            </div>
            <span className="text-[10px] text-zinc-600">{time}</span>
        </div>
    )
}
