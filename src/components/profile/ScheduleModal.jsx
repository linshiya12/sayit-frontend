import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, Globe, Trash2, X, Sun, Sunset, Moon, Sunrise } from "lucide-react";
import { format, isBefore, startOfDay, addDays, parse, isAfter } from "date-fns";

// Time slots grouped by period
const TIME_GROUPS = {
    Morning: {
        icon: Sunrise,
        slots: ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"]
    },
    Afternoon: {
        icon: Sun,
        slots: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
    },
    Evening: {
        icon: Sunset,
        slots: ["05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"]
    },
    Night: {
        icon: Moon,
        slots: ["09:00 PM", "10:00 PM", "11:00 PM"]
    }
};

export function ScheduleModal({ open, onOpenChange }) {
    // Key: "YYYY-MM-DD" (Local), Value: Array of time strings "09:00 AM"
    const [availability, setAvailability] = useState({});
    const [currentDate, setCurrentDate] = useState(addDays(new Date(), 1)); // Default to tomorrow
    const [activeTab, setActiveTab] = useState("Morning");

    // Helper to format date key
    const getDateKey = (date) => format(date, "yyyy-MM-dd");

    const currentDateKey = currentDate ? getDateKey(currentDate) : null;
    const currentSlots = currentDateKey ? (availability[currentDateKey] || []) : [];

    // Date Limits
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const maxDate = addDays(tomorrow, 9); // 10 days starting from tomorrow

    const toggleSlot = (time) => {
        if (!currentDateKey) return;

        setAvailability(prev => {
            const slots = prev[currentDateKey] || [];
            const newSlots = slots.includes(time)
                ? slots.filter(t => t !== time)
                : [...slots, time]; // We'll sort them in the summary view

            const newAvailability = { ...prev, [currentDateKey]: newSlots };
            if (newSlots.length === 0) delete newAvailability[currentDateKey];
            return newAvailability;
        });
    };

    const removeSlot = (dateKey, time) => {
        setAvailability(prev => {
            const slots = prev[dateKey] || [];
            const newSlots = slots.filter(t => t !== time);
            const newAvailability = { ...prev, [dateKey]: newSlots };
            if (newSlots.length === 0) delete newAvailability[dateKey];
            return newAvailability;
        });
    };

    const handleSave = () => {
        // Convert to UTC for saving
        const utcAvailability = Object.entries(availability).map(([dateStr, times]) => {
            return times.map(timeStr => {
                // Combine date and time
                const dateTime = parse(`${dateStr} ${timeStr}`, "yyyy-MM-dd hh:mm a", new Date());
                return dateTime.toISOString(); // This is the UTC string
            });
        }).flat();

        console.log("Saving UTC Availability:", utcAvailability);
        onOpenChange(false);
    };

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const getTimeZoneAbbr = () => {
        try {
            return new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
                .formatToParts(new Date())
                .find(part => part.type === 'timeZoneName')?.value || "Local";
        } catch (e) {
            return "Local";
        }
    }
    const tzAbbr = getTimeZoneAbbr();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[800px]">
                <DialogHeader className="p-4 md:p-6 border-b shrink-0 bg-white z-10">
                    <DialogTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Set Your Availability
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {/* Left: Calendar (Top on mobile) */}
                    <div className="p-4 md:p-6 border-b lg:border-b-0 lg:border-r flex flex-col items-center bg-white overflow-y-auto shrink-0 lg:w-80">
                        <Calendar
                            mode="single"
                            selected={currentDate}
                            onSelect={(d) => d && setCurrentDate(d)}
                            disabled={(date) => isBefore(date, tomorrow) || isAfter(date, maxDate)} // Strict 10 days future limit
                            fromDate={tomorrow}
                            toDate={maxDate}
                            className="rounded-md border shadow-sm p-3 w-full md:w-auto flex justify-center"
                            initialFocus
                            defaultMonth={tomorrow}
                        />
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg w-full justify-center">
                            <Globe className="h-3 w-3 shrink-0" />
                            <span className="text-center truncate">Time displayed in <strong>{userTimezone} ({tzAbbr})</strong></span>
                        </div>
                    </div>

                    {/* Right: Time Selection & Summary */}
                    <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden min-w-0">

                        {/* Time Tab Selection */}
                        <div className="px-4 pt-4 md:px-6 md:pt-6 pb-2 shrink-0">
                            <h3 className="font-semibold text-slate-900 mb-3 md:mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <span className="truncate">Select availability for <span className="text-blue-600 block md:inline">{currentDate ? format(currentDate, "MMMM d") : "Date"}</span></span>
                                <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded border self-start md:self-auto">Multi-select enabled</span>
                            </h3>

                            <div className="flex p-1 bg-white border rounded-xl shadow-sm overflow-x-auto">
                                {Object.entries(TIME_GROUPS).map(([key, group]) => {
                                    const Icon = group.icon;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setActiveTab(key)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg transition-all min-w-20",
                                                activeTab === key
                                                    ? "bg-slate-900 text-white shadow-sm"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {key}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots Grid (Scrollable) */}
                        <div className="px-4 py-3 md:px-6 md:py-4 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                                {TIME_GROUPS[activeTab].slots.map((time) => {
                                    const isSelected = currentSlots.includes(time);
                                    return (
                                        <button
                                            key={time}
                                            onClick={() => toggleSlot(time)}
                                            className={cn(
                                                "px-2 py-2 md:px-3 md:py-2 text-xs md:text-sm rounded-lg border transition-all duration-200 flex items-center justify-center gap-2",
                                                isSelected
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-md ring-1 ring-blue-600"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                            )}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary Section (Sticky at bottom, scrollable with hidden scrollbar) */}
                        <div className="bg-white border-t shrink-0 flex flex-col max-h-48 md:max-h-56">
                            <div className="px-4 py-2 md:py-3 border-b flex items-center justify-between bg-slate-50/50">
                                <h4 className="text-xs md:text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    Summary <span className="text-[10px] md:text-xs font-normal text-slate-500">Review selected slots</span>
                                </h4>
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider hidden sm:block">Scroll to view all</span>
                            </div>

                            <div
                                className="p-3 md:p-4 space-y-2 overflow-y-auto"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <style>{`
                            .overflow-y-auto::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>

                                {Object.keys(availability).length === 0 ? (
                                    <div className="text-xs md:text-sm  italic text-center py-4 bg-slate-50 rounded-lg border border-dashed text-slate-300">
                                        No slots selected.
                                    </div>
                                ) : (
                                    Object.entries(availability).sort().map(([dateKey, slots]) => (
                                        <div key={dateKey} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 text-sm bg-slate-50 p-2 md:p-3 rounded-lg border border-slate-100 group transition-colors hover:border-blue-100 hover:bg-blue-50/30">
                                            <div className="w-full sm:w-24 shrink-0 flex sm:block justify-between items-center">
                                                <span className="block font-semibold text-slate-700">
                                                    {format(parse(dateKey, "yyyy-MM-dd", new Date()), "MMM d")}
                                                </span>
                                                <span className="text-xs text-slate-400 sm:text-slate-400">{format(parse(dateKey, "yyyy-MM-dd", new Date()), "EEEE")}</span>
                                                <button
                                                    onClick={() => setAvailability(prev => { const n = { ...prev }; delete n[dateKey]; return n; })}
                                                    className="text-slate-400 hover:text-red-500 sm:hidden"
                                                    title="Clear day"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 flex-1">
                                                {slots.sort((a, b) => {
                                                    // Sort AM/PM
                                                    const parseTime = t => {
                                                        const [time, period] = t.split(' ');
                                                        let [h, m] = time.split(':').map(Number);
                                                        if (period === 'PM' && h !== 12) h += 12;
                                                        if (period === 'AM' && h === 12) h = 0;
                                                        return h * 60 + m;
                                                    };
                                                    return parseTime(a) - parseTime(b);
                                                }).map(time => (
                                                    <span key={time} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md text-xs shadow-sm">
                                                        <span>{time} <span className="text-slate-400 text-[10px]">{tzAbbr}</span></span>
                                                        <button onClick={() => removeSlot(dateKey, time)} className="text-slate-400 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setAvailability(prev => { const n = { ...prev }; delete n[dateKey]; return n; })}
                                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded hidden sm:block"
                                                title="Clear day"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-slate-50 border-t flex flex-col gap-3 shrink-0">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
                                onClick={handleSave}
                                disabled={Object.keys(availability).length === 0}
                            >
                                Save availability
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
