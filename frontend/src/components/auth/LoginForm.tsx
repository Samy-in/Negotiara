"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import axios from "axios";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            const response = await axios.post("http://localhost:4000/api/auth/login", { email, password });
            setUser(response.data);

            const role = response.data.role.toLowerCase();
            router.push(`/dashboard/${role}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bento-card w-full max-w-md p-4">
            <CardHeader>
                <CardTitle className="text-3xl font-display font-bold text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-xl text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-gradient text-white rounded-2xl py-7 text-lg font-bold shadow-lg shadow-primary/20"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
