import React from "react";
import {
    LayoutDashboard,
    MessageSquare,
    Phone,
    Users,
    FileText,
    User,
    Zap,
    Film
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
    { icon: MessageSquare, label: "Chats", href: "#" },
    { icon: Phone, label: "Calls", href: "#" },
    { icon: Users, label: "Communities", href: "#", badge: "Premium" },
    { icon: Film, label: "Reels", href: "/reels" },
    { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar({ className }) {
    return (
        <aside className={cn("w-64 bg-background border-r flex flex-col h-screen sticky top-0", className)}>
            <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="bg-primary text-primary-foreground p-1 rounded">
                        <span className="text-xs">LC</span>
                    </div>
                    SayIt
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {sidebarItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            item.href === window.location.pathname
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5 bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                                {item.badge}
                            </Badge>
                        )}
                    </a>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-primary/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-full">
                            <Zap className="h-3 w-3 text-primary-foreground fill-current" />
                        </div>
                        <p className="text-xs font-semibold">Upgrade to Premium</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        Unlock all features and get unlimited access to mentors.
                    </p>
                    <Button size="sm" className="w-full text-xs shadow-lg shadow-primary/20">
                        Upgrade Plan
                    </Button>
                </div>
            </div>
        </aside>
    );
}
