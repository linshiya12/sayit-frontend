import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Share2, History, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TRANSACTIONS = [
    { date: "Jun 28, 2025", desc: "Spanish Session with Maria G.", amount: "-$35.00", status: "Completed", type: "debit" },
    { date: "Jun 25, 2025", desc: "Wallet Top-up", amount: "+$100.00", status: "Completed", type: "credit" },
    { date: "Jun 22, 2025", desc: "Japanese Session Cancellation", amount: "+$40.00", status: "Refunded", type: "credit", statusColor: "bg-amber-100 text-amber-700" },
    { date: "Jun 20, 2025", desc: "Japanese Session with Takeshi K.", amount: "-$40.00", status: "Completed", type: "debit" },
];

export function Wallet() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Balance Card */}
                <Card className="bg-blue-600 text-white border-none overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-1">
                            <p className="text-blue-100 font-medium">Current Balance</p>
                            <h2 className="text-4xl font-bold">$250.00</h2>
                            <p className="text-xs text-blue-200">Last updated: June 30, 2025</p>
                        </div>
                        <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-transparent gap-2">
                            <Plus className="h-4 w-4" /> Add Funds
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-lg text-white bg-blue-600 px-4 py-2 rounded-t-lg w-fit lg:w-full lg:bg-transparent lg:text-foreground lg:p-0">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ActionCard icon={Gift} label="Redeem Gift Card" />
                        <ActionCard icon={Share2} label="Share & Earn" />
                        <ActionCard icon={History} label="Transaction History" />
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="border rounded-xl overflow-hidden bg-card">
                <div className="bg-blue-600 text-white p-4 font-semibold">
                    Transaction History
                </div>
                <div className="p-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-muted-foreground border-b text-left">
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium">Description</th>
                                <th className="pb-3 font-medium text-right">Amount</th>
                                <th className="pb-3 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {TRANSACTIONS.map((tx, i) => (
                                <tr key={i} className="group hover:bg-muted/50 transition-colors">
                                    <td className="py-4">{tx.date}</td>
                                    <td className="py-4 font-medium">{tx.desc}</td>
                                    <td className={cn("py-4 text-right font-medium", tx.type === "credit" ? "text-emerald-600" : "text-red-500")}>
                                        {tx.amount}
                                    </td>
                                    <td className="py-4 text-right">
                                        <Badge variant="secondary" className={cn("font-normal", tx.statusColor || "bg-emerald-100 text-emerald-700 hover:bg-emerald-100")}>
                                            {tx.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6 flex justify-center">
                        <Button variant="outline" size="sm">View All Transactions</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionCard({ icon: Icon, label }) {
    return (
        <button className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl hover:shadow-md transition-all gap-3 h-32">
            <Icon className="h-6 w-6 text-blue-600" />
            <span className="font-medium text-sm">{label}</span>
        </button>
    )
}
