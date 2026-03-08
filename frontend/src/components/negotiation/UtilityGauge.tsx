"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function UtilityGauge({ currentPrice, budget, minPrice }: { currentPrice: number, budget: number, minPrice: number }) {
    const [utility, setUtility] = useState(0);

    useEffect(() => {
        // Safe calculation: The closer to minPrice (the floor), the higher the utility.
        // If current Price is at budget, utility is 0%. If it reaches minPrice, utility is 100%.
        const range = budget - minPrice;
        if (range <= 0) return;

        const rawUtil = ((budget - currentPrice) / range) * 100;
        // Clamp to 0-100
        setUtility(Math.min(100, Math.max(0, rawUtil)));
    }, [currentPrice, budget, minPrice]);

    // Color logic
    const getColor = (val: number) => {
        if (val > 70) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (val > 40) return "text-[var(--negotiara-yellow)] bg-[var(--negotiara-yellow)]/10 border-[var(--negotiara-yellow)]/20";
        return "text-red-500 bg-red-500/10 border-red-500/20";
    };

    const colorClass = getColor(utility);

    return (
        <Card className="bento-card-dark p-6 flex flex-col gap-4">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider opacity-80 flex justify-between">
                <span>Shipper Utility</span>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded">Live Score</span>
            </h3>

            <div className="flex items-end justify-between">
                <div>
                    <div className="text-4xl font-display font-light text-white mb-1">
                        {utility.toFixed(1)}%
                    </div>
                    <div className="text-xs text-zinc-400">
                        Spread: <span className="font-mono text-zinc-300">${(budget - currentPrice).toLocaleString()}</span> saved
                    </div>
                </div>

                <div className={`p-4 rounded-full border ${colorClass}`}>
                    {utility > 70 ? (
                        <TrendingUp className="w-8 h-8" />
                    ) : utility > 40 ? (
                        <TrendingUp className="w-8 h-8 opacity-70" />
                    ) : (
                        <TrendingDown className="w-8 h-8" />
                    )}
                </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2 relative">
                <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 select-none ${utility > 70 ? 'bg-emerald-500' : utility > 40 ? 'bg-[var(--negotiara-yellow)]' : 'bg-red-500'}`}
                    style={{ width: `${utility}%` }}
                />
            </div>

            <div className="flex justify-between text-[10px] text-zinc-500 font-medium uppercase mt-1">
                <span>Budget (${budget.toLocaleString()})</span>
                <span>Max Target (${minPrice.toLocaleString()})</span>
            </div>
        </Card>
    );
}
