import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        label: "Earnings This Month",
        value: "$2,480",
        change: "+12.5%",
        trend: "up",
        icon: DollarSign,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        label: "Hours Taught",
        value: "48.5",
        change: "+8.2%",
        trend: "up",
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        label: "Student Rating",
        value: "4.9",
        change: "+0.2",
        trend: "up",
        icon: Star,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        label: "Active Students",
        value: "32",
        change: "+4 new",
        trend: "up",
        icon: Users,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
];

export function StatsGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                                    <p className={cn("text-xs font-medium flex items-center gap-1", stat.color)}>
                                        {stat.change}
                                        <span className="text-muted-foreground font-normal">from last month</span>
                                    </p>
                                </div>
                            </div>
                            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
