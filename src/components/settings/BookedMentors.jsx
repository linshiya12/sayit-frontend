import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export function BookedMentors() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
                <div className="space-y-4">
                    <SessionCard
                        name="Hiroshi Tanaka"
                        lang="Japanese"
                        native="Native"
                        time="11.30 Am"
                        status="10 mins left"
                        statusColor="text-red-500"
                        action="start"
                        date={null}
                    />
                    <SessionCard
                        name="Hiroshi Tanaka"
                        lang="Spanish"
                        native="Native"
                        time="11.30 Am"
                        status="In 2 hours"
                        statusColor="text-muted-foreground"
                        action="start"
                        date={null}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Past Sessions</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                        <SessionCard
                            key={i}
                            name="Hiroshi Tanaka"
                            lang="English"
                            native="Native"
                            time="11.00 Am - 11.30 Am"
                            status="Completed"
                            statusColor="text-muted-foreground"
                            action="none"
                            date="20-05-2025"
                            isPast={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function SessionCard({ name, lang, native, time, status, statusColor, action, date, isPast }) {
    return (
        <div className="border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="https://i.pravatar.cc/150?u=hiroshi" />
                    <AvatarFallback>HT</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                        Native: {native}
                        <Badge variant="secondary" className="h-5 text-[10px] px-1.5">{lang}</Badge>
                    </p>
                    {!isPast && (
                        <div className="mt-2 md:hidden">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare className="h-4 w-4" /></Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 w-full md:w-auto">
                <div className="text-right">
                    <p className="font-semibold text-sm">{time}</p>
                    {date && <p className="text-xs text-muted-foreground">{date}</p>}
                    {!date && <p className={`text-xs font-medium ${statusColor}`}>{status}</p>}
                </div>

                <div className="flex items-center gap-2 mt-2">
                    {!isPast && (
                        <>
                            <Button variant="ghost" className="h-8 text-xs">Reschedule</Button>
                            <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 capitalize w-20">
                                {action}
                            </Button>
                        </>
                    )}
                    {isPast && (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                            Completed
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}
