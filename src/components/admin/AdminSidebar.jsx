import React from "react";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    FileText,
    Calendar,
    DollarSign,
    Tags,
    LogOut,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const adminSidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: CreditCard, label: "Premium Payments", href: "#" },
    { icon: FileText, label: "Post Management", href: "/admin/posts" },
    { icon: Calendar, label: "Call & Chat Bookings", href: "#" },
    { icon: DollarSign, label: "Withdraw Requests", href: "#" },
    { icon: Tags, label: "Manage Offers & Coupons", href: "#" },
];

export function AdminSidebar({ className }) {
    const location = useLocation();

    return (
        <aside className={cn("w-64 bg-white border-r flex flex-col h-screen sticky top-0", className)}>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-[#6366f1] p-2 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-white fill-current" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl leading-none text-slate-800">SayIt</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Admin Panel</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {adminSidebarItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#6366f1] text-white shadow-md shadow-indigo-200"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <LogOut className="h-5 w-5 text-slate-400" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
