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
                    <XAxis
                        dataKey="round"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `R${value}`}
                        dy={10}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        domain={['dataMin - 500', 'dataMax + 500']}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                        labelFormatter={(label) => `Round ${label}`}
                    />
                    <ReferenceLine y={targetPrice} stroke="#FFD54F" strokeDasharray="3 3" label={{ value: 'Target Goal', position: 'insideTopLeft', fill: '#D9A000', fontSize: 12, fontWeight: 600 }} />
                    <Line type="monotone" dataKey="shipper_offer" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} name="Shipper" />
                    <Line type="monotone" dataKey="carrier_offer" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} name="Carrier" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
