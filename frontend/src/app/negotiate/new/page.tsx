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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            router.push("/negotiate/1") // Redirect to mock session
        }, 1500)
    }

    return (
        <div className="flex flex-col gap-8 py-12 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="flex flex-col gap-2">
                <h1 className="font-display text-4xl font-bold tracking-tight">New Negotiation</h1>
                <p className="text-lg text-muted-foreground">
                    Define your shipment parameters and let Negotiara handle the rest.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Shipment Context</CardTitle>
                        <CardDescription>Provide a brief description of the cargo and requirements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="e.g., 500 units of High-End Laptops from Shenzhen to Los Angeles"
                            className="text-lg py-6"
                            required
                        />
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
                            <Input type="number" placeholder="0.00" className="pl-8" required />
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
                            <Input type="number" placeholder="0.00" className="pl-8" required />
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
                            <Input type="number" placeholder="0.00" className="pl-8" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Max Rounds</CardTitle>
                        <CardDescription>Maximum negotiation attempts by the AI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input type="number" defaultValue={4} min={1} max={10} />
                    </CardContent>
                </Card>

                <div className="md:col-span-2 flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        By starting this negotiation, our AI agent will reach out to the specified LSPs (simulated for this demo) and use the strategic parameters provided to reach an agreement.
                    </p>
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" size="lg" variant="premium" disabled={loading} className="px-12 gap-2">
                        {loading ? "Initializing..." : "Launch Negotiation"}
                        {!loading && <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </form>
        </div>
    )
}
