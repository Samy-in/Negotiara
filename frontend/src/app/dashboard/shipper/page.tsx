"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus, TrendingUp, History, ShieldCheck, ArrowRight, Package, Ship, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";

export default function ShipperDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== "SHIPPER") {
            router.push("/auth/login");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold">Shipper Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.name}. Manage your freight negotiations.</p>
                </div>
                <Button className="bg-[var(--negotiara-yellow)] hover:bg-[var(--negotiara-yellow)]/90 text-black border-none gap-2 rounded-2xl h-12 px-6">
                    <Plus className="w-5 h-5" />
                    Create Shipment
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<TrendingUp className="text-emerald-500" />} title="Avg. Savings" value="14.2%" trend="+2.1%" />
                <StatCard icon={<History className="text-primary" />} title="Active RFQs" value="12" trend="3 pending" />
                <StatCard icon={<ShieldCheck className="text-accent" />} title="Win Rate" value="92%" trend="Stable" />
                <StatCard icon={<Package className="text-amber-500" />} title="Total Goods" value="420t" trend="+12t" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Negotiations */}
                <Card className="lg:col-span-2 bento-card overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/20 flex flex-row items-center justify-between">
                        <CardTitle className="font-display text-xl font-bold">Active Negotiations</CardTitle>
                        <Button variant="ghost" className="text-primary gap-1">View All <ArrowRight className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/10">
                            <NegotiationRow title="Electronics - Berlin to Paris" status="In Progress" price="$1,200" />
                            <NegotiationRow title="Textiles - Mumbai to NY" status="Awaiting Counter" price="$5,400" />
                            <NegotiationRow title="Machine Parts - Tokyo to SF" status="In Progress" price="$8,900" />
                        </div>
                    </CardContent>
                </Card>

                {/* AI Agent Status */}
                <Card className="bento-card p-6 flex flex-col gap-6">
                    <h3 className="font-display text-lg font-bold">AI Agent Status</h3>
                    <div className="space-y-4">
                        <AgentStatus name="Negotiator Pro" status="Active" tasks={3} />
                        <AgentStatus name="LSP Analyst" status="Idle" tasks={0} />
                        <AgentStatus name="Strategy Engine" status="Optimizing" tasks={1} />
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
                <div className="p-2 bg-white/50 rounded-lg">{icon}</div>
                <Badge variant="secondary" className="bg-white/40">{trend}</Badge>
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
        <div className="px-8 py-6 flex items-center justify-between hover:bg-white/20 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ship className="w-5 h-5 text-primary" />
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
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/30 border border-white/20">
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
