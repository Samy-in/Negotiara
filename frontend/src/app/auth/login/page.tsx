"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">N</div>
                <span className="text-2xl font-display font-bold tracking-tight">Negotiara.</span>
            </div>

            <LoginForm />

            <p className="text-muted-foreground text-sm">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                    Sign up now
                </Link>
            </p>
        </div>
    );
}
