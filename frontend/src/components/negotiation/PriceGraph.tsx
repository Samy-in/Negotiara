"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

interface PriceGraphProps {
    data: any[];
    targetPrice: number;
}

export function PriceGraph({ data, targetPrice }: PriceGraphProps) {
    return (
        <div className="w-full h-[300px] bento-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Price Convergence</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="round" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}
                    />
                    <ReferenceLine y={targetPrice} stroke="#FFD54F" strokeDasharray="3 3" label={{ value: 'Target', position: 'right', fill: '#D9A000', fontSize: 10 }} />
                    <Line type="monotone" dataKey="shipper_offer" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} name="Shipper" />
                    <Line type="monotone" dataKey="carrier_offer" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} name="Carrier" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
