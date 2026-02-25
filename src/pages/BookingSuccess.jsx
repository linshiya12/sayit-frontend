import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookingSuccess() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
                    <p className="text-slate-500">
                        Your session has been successfully booked. An email confirmation has been sent to you.
                    </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-4">
                    <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">Session Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span>June 29, 2025</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>9:00 AM - 10:00 AM (60 min)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Video className="h-4 w-4 text-blue-500" />
                            <span>Video Call</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-6 font-medium text-base shadow-none"
                        onClick={() => navigate("/calls")}
                    >
                        View Scheduled Sessions
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full rounded-full py-6 font-medium text-slate-700 hover:bg-slate-50 border-slate-200 shadow-none text-base"
                        onClick={() => navigate("/directory")}
                    >
                        Back to Directory
                    </Button>
                </div>
            </div>
        </div>
    );
}
