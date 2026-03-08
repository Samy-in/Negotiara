"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const handleBack = () => {
        router.push("/");
    };

    if (!user) return <>{children}</>;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="container px-4 md:px-8 xl:px-12 flex h-20 items-center justify-between mx-auto max-w-[1600px]">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="icon" onClick={handleBack} title="Go Back">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="hidden md:flex items-center gap-2">
                            <Image src="/logo.jpg" alt="Negotiara Logo" width={40} height={40} className="object-contain" />
                            <span className="font-display font-bold text-2xl tracking-tight">
                                Negotiara<span className="text-primary">.</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground uppercase">{user.role}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-zinc-200 hover:bg-red-50 text-foreground transition-colors">
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Log Out</span>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
