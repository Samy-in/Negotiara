"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />

            <Link href="/" className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Button>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-4"
            >
                <Image src="/logo.jpg" alt="Negotiara Logo" width={40} height={40} className="object-contain" />
                <span className="text-2xl font-display font-bold tracking-tight">Negotiara.</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <SignupForm />
            </motion.div>

            <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                    Sign in here
                </Link>
            </p>
        </div>
    );
}
