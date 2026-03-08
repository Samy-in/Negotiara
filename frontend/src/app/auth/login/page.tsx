"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8 relative">
            <Link href="/" className="absolute top-4 left-4 sm:top-8 sm:left-8">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Button>
            </Link>

            <div className="flex items-center gap-2">
                <Image src="/logo.jpg" alt="Negotiara Logo" width={40} height={40} className="object-contain" />
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
