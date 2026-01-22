import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleModal } from "@/components/profile/ScheduleModal";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { cn } from "@/lib/utils";
import {
    Calendar as CalendarIcon,
    MoreVertical,
    Search
} from "lucide-react";
import { Link } from "react-router-dom";

const UPCOMING_SESSIONS = [
    {
        id: 101,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        statusText: "10 mins left",
        statusColor: "text-red-500",
        action: "start"
    },
    {
        id: 102,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        statusText: "In 2 hours",
        statusColor: "text-slate-500",
        action: "start",
        canCancel: true
    },
    {
        id: 103,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        statusText: "Tomorrow",
        statusColor: "text-slate-500",
        action: "start",
        canCancel: true
    },
    {
        id: 104,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        date: "26-05-2025",
        statusText: "26-05-2025",
        statusColor: "text-slate-500",
        action: "start",
        canCancel: true
    },
    {
        id: 105,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        statusText: "10 mins left",
        statusColor: "text-red-500",
        action: "start"
    },
    {
        id: 106,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        statusText: "In 2 hours",
        statusColor: "text-slate-500",
        action: "start",
        canCancel: true
    },
    {
        id: 107,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        statusText: "Tomorrow",
        statusColor: "text-slate-500",
        action: "start",
        canCancel: true
    },
    {
        id: 108,
        name: "Hiroshi Tanaka",
        avatar: "https://i.pravatar.cc/150?u=hiroshi",
        role: "Native:Chinese",
        level: "Intermediate",
        time: "11:30 Am",
        date: "26-05-2025",
        statusText: "26-05-2025",
        statusColor: "text-slate-500",
        action: "start",
        canCancel: true
    }
];

export function Calls() {
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const isMentor = true; // Mock user role

    return (
        <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
            <Sidebar className="hidden lg:flex w-64 shrink-0" />
            <div className="flex flex-1 flex-col min-w-0 h-screen">
                <Header />
                <main className="flex-1 overflow-hidden bg-slate-50 relative flex flex-col md:flex-row">

                    {/* Reusing ChatSidebar which has the integrated Calls tab functionality */}
                    <div className="w-full md:w-80 lg:w-96 shrink-0 z-10 h-[40vh] md:h-full border-r border-b md:border-b-0">
                        <ChatSidebar />
                    </div>

                    {/* Right Main Panel: Upcoming Sessions */}
                    <div className="flex-1 bg-slate-50/50 flex flex-col h-[60vh] md:h-full min-w-0 overflow-hidden">
                        {/* Header with Search and Calendar */}
                        <div className="p-4 md:p-8 pb-4 shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border p-1.5 flex items-center gap-2 mb-6">
                                <Search className="h-5 w-5 text-slate-400 ml-2" />
                                <input
                                    type="text"
                                    placeholder="Search student name..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm p-1 placeholder:text-slate-400"
                                />
                            </div>

                            <h2 className="text-xl font-bold tracking-tight mb-4">Upcoming Sessions</h2>
                        </div>

                        {/* Cards List */}
                        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 space-y-4">
                            {UPCOMING_SESSIONS.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                                        <CalendarIcon className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg">
                                            {isMentor ? "No upcoming sessions" : "No booked calls"}
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            {isMentor
                                                ? "You don't have any upcoming sessions scheduled."
                                                : "You haven't booked any calls yet. Find a mentor to get started!"
                                            }
                                        </p>
                                        {!isMentor && (
                                            <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                                                <Link to="/directory">Book Calls</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                UPCOMING_SESSIONS.map((session) => (
                                    <Card key={session.id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">

                                            {/* Avatar & Info */}
                                            <div className="flex items-center gap-4 flex-1">
                                                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                                                    <AvatarImage src={session.avatar} />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{session.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-500">{session.role}</span>
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">
                                                            {session.level}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-1.5 md:hidden">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex flex-col md:items-end gap-2 md:gap-1 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                                                <div className="flex justify-between md:justify-end w-full items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="font-bold text-sm text-slate-900">{session.time}</div>
                                                        <div className={cn("text-xs font-medium", session.statusColor)}>
                                                            {session.statusText}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mt-2 w-full md:w-auto">
                                                    {/* Chat Icon - optional */}
                                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200 text-slate-500 md:mr-2">
                                                        <MoreVertical className="h-4 w-4 rotate-90 md:rotate-0" />
                                                    </Button>

                                                    {session.canCancel && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-xs flex-1 md:flex-none"
                                                            onClick={() => setScheduleModalOpen(true)} // Re-using modal for reschedule/cancel flow visualization
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        className="h-8 text-xs bg-blue-600 hover:bg-blue-700 px-6 flex-1 md:flex-none shadow-sm shadow-blue-200"
                                                    >
                                                        Start
                                                    </Button>
                                                </div>
                                            </div>

                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Floating Action Button for Schedule (Bottom Right) */}
                        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
                            <Button
                                size="icon"
                                className="h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 hover:shadow-xl transition-all"
                                onClick={() => setScheduleModalOpen(true)}
                            >
                                <CalendarIcon className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Schedule Modal */}
            <ScheduleModal open={scheduleModalOpen} onOpenChange={setScheduleModalOpen} />
        </div>
    );
}

export default Calls;
