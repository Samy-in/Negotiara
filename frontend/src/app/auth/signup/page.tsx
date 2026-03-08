"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-4"
            >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">N</div>
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
