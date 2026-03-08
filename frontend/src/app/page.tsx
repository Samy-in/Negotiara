"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, History, TrendingUp, ShieldCheck, ArrowRight, Bot, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const [mounted, setMounted] = React.useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between py-6 px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Negotiara Logo" width={36} height={36} className="object-contain" />
          <span className="text-xl font-display font-bold tracking-tight">Negotiara.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-semibold text-zinc-500 hover:text-black transition-colors">
            Sign In
          </Link>
          <Link href="/auth/signup">
            <Button className="btn-gradient px-8 h-11 rounded-2xl shadow-xl shadow-primary/20 border-none text-white font-bold">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[130px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[130px] rounded-full -z-10 animate-pulse delay-700" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl space-y-10"
        >
          <Badge variant="secondary" className="bg-white/60 backdrop-blur-xl border border-white/40 py-2.5 px-6 rounded-full shadow-sm">
            <span className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              The Future of Freight
            </span>
          </Badge>

          <h1 className="text-6xl md:text-[5.5rem] font-display font-bold tracking-tight leading-[1] text-zinc-900">
            Negotiate Smarter, <br />
            <span className="text-primary italic relative inline-block">
              Autonomously.
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 20" fill="none">
                <path d="M5 15Q100 5 395 15" stroke="var(--negotiara-yellow)" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Negotiara deploys AI agents to handle tactical LSP negotiations in real-time, delivering 15%+ savings autonomously.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link href="/auth/signup">
              <Button size="lg" className="h-18 px-12 text-xl font-bold btn-gradient rounded-[24px] shadow-2xl shadow-primary/30 group border-none text-white">
                Start Negotiating
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="h-18 px-12 text-xl font-bold rounded-[24px] border-white/40 bg-white/60 backdrop-blur-3xl hover:bg-white/80 transition-all shadow-sm">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-32">
          <FeatureCard
            icon={<Bot className="w-6 h-6 text-primary" />}
            title="AI Duo Simulation"
            desc="Shipper & Carrier agents simulate thousands of scenarios to find the perfect middle ground."
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
            title="Tactical Concessions"
            desc="Our agents use advanced BATNA and Reservation price logic to ensure you never overpay."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-accent" />}
            title="Real-Time Insights"
            desc="Watch negotiations happen live with full transparency on strategy and convergence."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-sm text-muted-foreground">
        © 2024 Negotiara AI. Elite Logistics Intelligence.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bento-card p-8 flex flex-col items-center text-center gap-4 group">
      <div className="p-4 bg-white/50 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-display font-bold text-lg">{title}</h3>
      <p className="text-sm opacity-70 leading-relaxed">{desc}</p>
    </div>
  )
}