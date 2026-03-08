"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Message {
    role: "SHIPPER" | "CARRIER";
    content: string;
    price?: number;
}

interface ChatInterfaceProps {
    messages: Message[];
}

export function ChatInterface({ messages }: ChatInterfaceProps) {
    return (
        <div className="flex flex-col h-full bg-white/30 backdrop-blur-md rounded-[32px] border border-white/20 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 bg-white/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <span className="font-bold">AI Agent Coordination</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Live</Badge>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-4 ${msg.role === "SHIPPER" ? "" : "flex-row-reverse"}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === "SHIPPER" ? "bg-primary text-white" : "bg-accent text-white"}`}>
                                {msg.role === "SHIPPER" ? "S" : "C"}
                            </div>
                            <div className={`max-w-[80%] space-y-2 ${msg.role === "SHIPPER" ? "" : "text-right"}`}>
                                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === "SHIPPER" ? "bg-white/80 rounded-tl-none text-zinc-900 shadow-sm" : "bg-zinc-900 rounded-tr-none text-white shadow-xl"}`}>
                                    {msg.content}
                                </div>
                                {msg.price && (
                                    <Badge variant="outline" className="font-mono text-[10px] bg-white/50">
                                        Proposed: ${msg.price}
                                    </Badge>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-white/20 border-t border-white/10 flex gap-2">
                <input
                    disabled
                    placeholder="AI Agents are negotiating..."
                    className="flex-1 bg-white/50 border border-white/20 rounded-2xl px-4 py-2 text-sm focus:outline-none opacity-50"
                />
                <button disabled className="w-10 h-10 bg-primary/50 text-white rounded-2xl flex items-center justify-center">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
