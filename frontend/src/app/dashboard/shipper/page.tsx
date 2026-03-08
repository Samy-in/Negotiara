"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrendingUp, History, ShieldCheck, Package, Plus, ArrowRight, Activity, ArrowUpRight, BarChart, Clock, Shield, Ship, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { negotiationApi } from "@/lib/api";

export default function ShipperDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [negotiations, setNegotiations] = useState<any[]>([]);

    useEffect(() => {
        if (!user || user.role !== "SHIPPER") {
            router.push("/auth/login");
        } else {
            negotiationApi.getHistory()
                .then((data) => setNegotiations(data))
                .catch((err) => console.error("Failed to fetch negotiations:", err));
        }
    }, [user, router]);

    if (!user) return null;

    const activeCount = negotiations.filter(n => n.status === "IN_PROGRESS").length;

    return (
        <div className="py-8 md:py-12 px-4 sm:px-6 md:px-8 xl:px-12 max-w-[1600px] mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">Shipper Dashboard</h1>
                    <p className="text-lg text-muted-foreground">Welcome back, {user.name}. Manage your freight negotiations.</p>
                </div>
                <Link href="/negotiate/new">
                    <Button className="bg-[var(--negotiara-yellow)] hover:bg-[var(--negotiara-yellow)]/90 text-black border-none gap-2 rounded-2xl h-12 px-6 shadow-sm">
                        <Plus className="w-5 h-5" />
                        Create Shipment
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <StatCard icon={<TrendingUp className="text-emerald-500 w-6 h-6" />} title="Avg. Savings" value="14.2%" trend="+2.1%" />
                <StatCard icon={<Clock className="text-zinc-600 w-6 h-6" />} title="Active RFQs" value={activeCount.toString()} trend={`${activeCount} pending`} />
                <StatCard icon={<Shield className="text-primary w-6 h-6" />} title="Win Rate" value="92%" trend="Stable" />
                <StatCard icon={<Package className="text-[var(--negotiara-yellow)] w-6 h-6" />} title="Total Goods" value="420t" trend="+12t" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                {/* Active Negotiations */}
                <Card className="lg:col-span-2 flex flex-col overflow-hidden h-full shadow-lg border-zinc-200/60 rounded-3xl">
                    <CardHeader className="p-8 border-b border-zinc-100 flex flex-row items-center justify-between shrink-0 bg-white">
                        <CardTitle className="font-display text-2xl font-bold">Active Negotiations</CardTitle>
                        <Link href="/dashboard/shipper">
                            <Button variant="ghost" className="text-sm font-semibold hover:bg-zinc-100">View All <ArrowRight className="ml-2 w-4 h-4" /></Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto bg-white">
                        <div className="divide-y divide-zinc-100 h-full">
                            {negotiations.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                                    <Ship className="w-8 h-8 mb-4 opacity-50" />
                                    No active negotiations found. Create a new shipment to get started!
                                </div>
                            ) : (
                                negotiations.map((neg) => (
                                    <Link key={neg.id} href={`/negotiate/${neg.id}`}>
                                        <NegotiationRow
                                            title={`${neg.shipment?.cargoType || "Freight"} - ${neg.shipment?.origin} to ${neg.shipment?.destination}`}
                                            status={neg.status}
                                            price={`$${neg.targetPrice?.toLocaleString() || "0"}`}
                                        />
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Agent Status */}
                <Card className="bento-card p-6 flex flex-col gap-6 h-full justify-between">
                    <div>
                        <h3 className="font-display text-lg font-bold mb-6">AI Agent Status</h3>
                        <div className="space-y-4">
                            <AgentStatus name="Negotiator Pro" status="Active" tasks={3} />
                            <AgentStatus name="LSP Analyst" status="Idle" tasks={0} />
                            <AgentStatus name="Strategy Engine" status="Optimizing" tasks={1} />
                        </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-zinc-100">
                        <Button variant="outline" className="w-full bg-zinc-50 border-zinc-200 hover:bg-zinc-100 transition-colors text-zinc-700">
                            Manage AI Agents
                        </Button>
                    </div>
                </Card>
            </div>
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

function NegotiationRow({ title, status, price }: { title: string, status: string, price: string }) {
    return (
        <div className="px-8 py-6 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                    <Ship className="w-5 h-5 text-zinc-700" />
                </div>
                <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> EU Logistics Route
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="text-right">
                    <div className="font-bold underline decoration-primary/30">{price}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{status}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    )
}

function AgentStatus({ name, status, tasks }: { name: string, status: string, tasks: number }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-emerald-500 animate-pulse' : status === 'Optimizing' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <div>
                    <div className="text-sm font-bold">{name}</div>
                    <div className="text-[10px] text-muted-foreground">{tasks} active negotiations</div>
                </div>
            </div>
            <Badge className="text-[10px]">{status}</Badge>
        </div>
    )
}
