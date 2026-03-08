"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import axios from "axios";

export function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"SHIPPER" | "CARRIER">("SHIPPER");
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (user) {
            router.push(`/dashboard/${user.role.toLowerCase()}`);
        }
    }, [user, router]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const response = await axios.post("http://localhost:4000/api/auth/register", { name, email, password, role });
            setUser(response.data);
            router.push(`/dashboard/${role.toLowerCase()}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bento-card w-full max-w-md p-4">
            <CardHeader>
                <CardTitle className="text-3xl font-display font-bold text-center">Create Account</CardTitle>
                <CardDescription className="text-center">Join the autonomous logistics network</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">User Role</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className={`py-3 rounded-xl border transition-all font-semibold ${role === "SHIPPER" ? "bg-[var(--negotiara-yellow)] text-black border-yellow-400 shadow-md" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                                onClick={() => setRole("SHIPPER")}
                            >
                                Shipper
                            </button>
                            <button
                                type="button"
                                className={`py-3 rounded-xl border transition-all font-semibold ${role === "CARRIER" ? "bg-zinc-900 text-white border-zinc-900 shadow-md" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                                onClick={() => setRole("CARRIER")}
                            >
                                Carrier
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-gradient text-white rounded-2xl py-7 text-lg font-bold shadow-lg shadow-primary/20"
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
