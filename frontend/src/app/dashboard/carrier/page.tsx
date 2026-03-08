"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Truck, DollarSign, Clock, Layout, ArrowRight, Bell, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function CarrierDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== "CARRIER") {
            router.push("/auth/login");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold">Carrier Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.name}. View incoming RFQs and manage your fleet.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-white/20 bg-white/10">
                        <Bell className="w-5 h-5" />
                    </Button>
                    <Button className="bg-[var(--negotiara-yellow)] hover:bg-[var(--negotiara-yellow)]/90 text-black border-none gap-2 rounded-2xl h-12 px-6">
                        <Layout className="w-5 h-5" />
                        Fleet Overview
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<DollarSign className="text-emerald-500" />} title="Revenue (MTD)" value="$42,500" trend="+8.4%" />
                <StatCard icon={<Clock className="text-amber-500" />} title="Avg. Response" value="12min" trend="-2min" />
                <StatCard icon={<Truck className="text-primary" />} title="Active Trucks" value="18/24" trend="75%" />
                <StatCard icon={<Layout className="text-accent" />} title="New RFQs" value="06" trend="Priority" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Incoming RFQs */}
                <Card className="lg:col-span-2 bento-card overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/20 flex flex-row items-center justify-between">
                        <CardTitle className="font-display text-xl font-bold">Incoming RFQs</CardTitle>
                        <Badge className="bg-primary/20 text-primary border-primary/20">4 New Requests</Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/10">
                            <RFQRow company="Global Logix" route="London -> Madrid" deadline="2h 15m" amount="$2,400" />
                            <RFQRow company="TransAsia" route="Shanghai -> Dubai" deadline="5h 30m" amount="$12,800" />
                            <RFQRow company="EuroCargo" route="Berlin -> Rome" deadline="1h 45m" amount="$1,950" />
                        </div>
                    </CardContent>
                </Card>

                {/* Counter Offer Panel */}
                <Card className="bento-card p-6 flex flex-col gap-6 bg-zinc-900 text-white">
                    <h3 className="font-display text-lg font-bold">Live Counter-Offer</h3>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                            <span>Active negotiation #N-402</span>
                            <span>Round 3/5</span>
                        </div>
                        <div className="text-2xl font-display font-light">$12,450</div>
                        <Button className="w-full bg-[var(--negotiara-yellow)] text-black hover:bg-[var(--negotiara-yellow)]/90 rounded-xl">
                            Update Counter
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div className="text-xs uppercase font-bold tracking-widest text-zinc-500">History</div>
                        <div className="space-y-3">
                            <HistoryItem user="Shipper Agent" message="Targeting $12,200" time="2m ago" />
                            <HistoryItem user="Carriax (AI)" message="Countered @ $12,600" time="5m ago" />
                        </div>
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

function RFQRow({ company, route, deadline, amount }: { company: string, route: string, deadline: string, amount: string }) {
    return (
        <div className="px-8 py-6 flex items-center justify-between hover:bg-white/20 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent">
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
