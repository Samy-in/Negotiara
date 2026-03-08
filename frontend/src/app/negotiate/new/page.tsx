"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Send, Info } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

export default function NewNegotiationPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    // Form States
    const [context, setContext] = React.useState("")
    const [targetPrice, setTargetPrice] = React.useState("")
    const [reservationPrice, setReservationPrice] = React.useState("")
    const [benchmark, setBenchmark] = React.useState("")
    const [rounds, setRounds] = React.useState("4")
    const [strategy, setStrategy] = React.useState("Collaborative")

    // New Dynamic Fields
    const [origin, setOrigin] = React.useState("")
    const [destination, setDestination] = React.useState("")
    const [weight, setWeight] = React.useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const { negotiationApi } = await import("@/lib/api")
            const response = await negotiationApi.create({
                shipment: {
                    origin: origin,
                    destination: destination,
                    distance: 1000, // Distance can be calculated via API later, mocking static for now
                    cargo_type: context,
                    weight: parseFloat(weight) || 1000,
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                shipper_metrics: {
                    initial_offer: parseFloat(targetPrice) * 0.9,
                    target_price: parseFloat(targetPrice),
                    budget: parseFloat(reservationPrice)
                },
                carrier_metrics: {
                    initial_offer: parseFloat(reservationPrice) * 1.5,
                    min_price: parseFloat(targetPrice) * 0.8
                },
                market_signals: {
                    trend: "stable",
                    capacity: "medium",
                    fuel_price: 3.5
                },
                strategyProfile: strategy,
                max_rounds: parseInt(rounds)
            });

            // Redirect to the newly generated AI session
            router.push(`/negotiate/${response.negotiationId}`)
        } catch (err: any) {
            setError(err.message || "Failed to start negotiation.")
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 max-w-4xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="flex flex-col gap-2">
                <h1 className="font-display text-4xl font-bold tracking-tight">New Negotiation</h1>
                <p className="text-lg text-muted-foreground">
                    Define your shipment parameters and let Negotiara handle the rest.
                </p>
                {error && <p className="text-red-500 bg-red-500/10 p-3 rounded">{error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle>Origin</CardTitle>
                        <CardDescription>Pickup location.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="e.g., Shenzhen, CN" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Destination</CardTitle>
                        <CardDescription>Delivery location.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="e.g., Los Angeles, CA" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Shipment Context</CardTitle>
                        <CardDescription>Provide a brief description of the cargo and requirements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="e.g., High-End Laptops"
                            className="text-lg py-6"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            required
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Weight (kg)</CardTitle>
                        <CardDescription>Estimated cargo weight.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input type="number" placeholder="5000" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Target Price</CardTitle>
                        <CardDescription>The ideal price you'd like to reach.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input type="number" placeholder="0.00" className="pl-8" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} required />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Reservation Price</CardTitle>
                        <CardDescription>The maximum price you are willing to pay.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input type="number" placeholder="0.00" className="pl-8" value={reservationPrice} onChange={(e) => setReservationPrice(e.target.value)} required />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Market Benchmark</CardTitle>
                        <CardDescription>Average market rate for this route.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input type="number" placeholder="0.00" className="pl-8" value={benchmark} onChange={(e) => setBenchmark(e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Max Rounds</CardTitle>
                        <CardDescription>Maximum negotiation attempts by the AI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input type="number" min={1} max={10} value={rounds} onChange={(e) => setRounds(e.target.value)} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Strategy Profile</CardTitle>
                        <CardDescription>Direct the personality and aggression level of your AI agent.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <select
                            value={strategy}
                            onChange={(e) => setStrategy(e.target.value)}
                            className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Collaborative">Collaborative (Empathetic & Win-Win)</option>
                            <option value="Aggressive">Aggressive (Price-Focused & Firm)</option>
                            <option value="Analytical">Analytical (Data-Driven & Logical)</option>
                        </select>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        By starting this negotiation, our AI agent will reach out to the specified LSPs and use the strategic parameters provided to reach an agreement.
                    </p>
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" size="lg" variant="premium" disabled={loading} className="px-12 gap-2 transition-all">
                        {loading ? "Generating Negotiation (eta 15s)..." : "Launch Negotiation"}
                        {!loading && <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </form>
        </div>
    )
}
