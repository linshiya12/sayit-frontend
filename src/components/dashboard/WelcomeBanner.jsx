import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useSelector } from "react-redux";

export function WelcomeBanner() {
    const user=useSelector((state)=>state.auth.user)
    return (
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-indigo-800 to-slate-900 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
                <div className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Welcome, {user?.first_name}! 👋
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Ready to guide new language learners today? You have 3 pending sessions.
                        </p>
                    </div>
                    <Button variant="secondary" className="gap-2 font-semibold text-blue-900 hover:bg-white">
                        <Calendar className="h-4 w-4" />
                        View Schedule
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>

                {/* Decorative illustration placeholder */}
                <div className="hidden md:block w-64 h-40 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 transform -rotate-6 translate-y-4 shadow-2xl">
                    <div className="h-full w-full flex items-center justify-center text-white/30 font-medium">
                        Dashboard Preview
                    </div>
                </div>
            </div>
        </div>
    );
}
